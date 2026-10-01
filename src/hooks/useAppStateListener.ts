import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { analytics } from '../services/analytics';

export function useAppStateListener() {
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        const wasActive = appState.current === 'active';
        const isNowBackgrounded =
          nextAppState === 'background' || nextAppState === 'inactive';

        if (wasActive && isNowBackgrounded) {
          analytics.logAppBackgrounded({
            previousState: appState.current,
            currentState: nextAppState,
          });
        }

        appState.current = nextAppState;
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);
}
