import { fetchWithRetry } from '../src/api/dummyJsonApi';

describe('API Exponential Backoff Retry', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('retries on 500 error with exponential delays and succeeds when server recovers', async () => {
    let callCount = 0;
    const retryDelays: number[] = [];

    global.fetch = jest.fn().mockImplementation(() => {
      callCount++;
      if (callCount < 3) {
        return Promise.resolve({
          ok: false,
          status: 503,
          statusText: 'Service Unavailable',
          text: () => Promise.resolve('Service temporarily unavailable'),
        });
      }

      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ products: [{ id: 1, title: 'Test Product' }] }),
      });
    });

    const result = await fetchWithRetry<{ products: any[] }>('https://dummyjson.com/products', {
      maxRetries: 3,
      initialDelayMs: 20,
      backoffFactor: 2,
      onRetry: (_attempt, _err, nextDelayMs) => {
        retryDelays.push(nextDelayMs);
      },
    });

    expect(callCount).toBe(3);
    expect(result.products).toHaveLength(1);
    expect(result.products[0].title).toBe('Test Product');

    expect(retryDelays).toHaveLength(2);
    expect(retryDelays[1]).toBeGreaterThan(retryDelays[0]);
  });

  it('does not retry when request is aborted via AbortSignal', async () => {
    const controller = new AbortController();
    controller.abort();

    let callCount = 0;
    global.fetch = jest.fn().mockImplementation(() => {
      callCount++;
      return Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () => Promise.resolve(''),
      });
    });

    await expect(
      fetchWithRetry('https://dummyjson.com/products', {
        signal: controller.signal,
        maxRetries: 3,
        initialDelayMs: 10,
      })
    ).rejects.toThrow();

    expect(callCount).toBe(0);
  });
});
