import { sleep } from '../src/utils/sleep';

interface MockProduct {
  id: number;
  title: string;
}

class SearchRaceConditionManager {
  private currentRequestId = 0;
  private activeAbortController: AbortController | null = null;
  public latestCommittedResults: MockProduct[] = [];
  public discardedResponsesCount = 0;

  public async executeSearch(
    query: string,
    mockApiCall: (query: string, signal: AbortSignal) => Promise<MockProduct[]>
  ): Promise<{ committed: boolean; query: string }> {
    if (this.activeAbortController) {
      this.activeAbortController.abort();
    }

    const controller = new AbortController();
    this.activeAbortController = controller;

    const requestId = ++this.currentRequestId;

    try {
      const results = await mockApiCall(query, controller.signal);

      if (requestId !== this.currentRequestId) {
        this.discardedResponsesCount++;
        return { committed: false, query };
      }

      this.latestCommittedResults = results;
      return { committed: true, query };
    } catch (err: any) {
      if (err.name === 'AbortError' || controller.signal.aborted) {
        this.discardedResponsesCount++;
        return { committed: false, query };
      }
      throw err;
    }
  }
}

async function mockFetch(
  query: string,
  signal: AbortSignal,
  delayMs: number,
  results: MockProduct[]
): Promise<MockProduct[]> {
  await sleep(delayMs);
  if (signal.aborted) {
    const error = new Error('Request aborted');
    error.name = 'AbortError';
    throw error;
  }
  return results;
}

async function mockUncooperativeFetch(
  delayMs: number,
  results: MockProduct[]
): Promise<MockProduct[]> {
  await sleep(delayMs);
  return results;
}

describe('Search Race Condition Prevention', () => {
  let searchManager: SearchRaceConditionManager;

  beforeEach(() => {
    searchManager = new SearchRaceConditionManager();
  });

  it('correctly keeps newer search results when an older query resolves later', async () => {
    const query1Promise = searchManager.executeSearch('la', (q, signal) =>
      mockFetch(q, signal, 120, [
        { id: 1, title: 'Laptop Pro' },
        { id: 2, title: 'Lamp' },
      ])
    );

    const query2Promise = searchManager.executeSearch('phone', (q, signal) =>
      mockFetch(q, signal, 25, [
        { id: 10, title: 'iPhone 15' },
        { id: 11, title: 'Smartphone Stand' },
      ])
    );

    const [res1, res2] = await Promise.all([query1Promise, query2Promise]);

    expect(res1.committed).toBe(false);
    expect(res2.committed).toBe(true);
    expect(searchManager.latestCommittedResults).toEqual([
      { id: 10, title: 'iPhone 15' },
      { id: 11, title: 'Smartphone Stand' },
    ]);
  });

  it('discards stale response even if fetch does not honor AbortSignal', async () => {
    const q1 = searchManager.executeSearch('apple', () =>
      mockUncooperativeFetch(100, [{ id: 1, title: 'Apple Watch' }])
    );

    const q2 = searchManager.executeSearch('samsung', () =>
      mockUncooperativeFetch(20, [{ id: 2, title: 'Samsung Galaxy' }])
    );

    await Promise.all([q1, q2]);

    expect(searchManager.latestCommittedResults).toEqual([
      { id: 2, title: 'Samsung Galaxy' },
    ]);
    expect(searchManager.discardedResponsesCount).toBe(1);
  });
});
