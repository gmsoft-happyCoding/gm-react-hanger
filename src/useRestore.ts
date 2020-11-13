/* eslint-disable consistent-return */
/* eslint-disable no-restricted-globals */
/**
 * save the current application state to top.history.state
 * restore the status of the application when refreshing or rebounding
 */
import { useEffect } from 'react';
import { History, Location } from 'history';
import { debounce } from 'lodash';
import HistoryHelper from 'history-helper';

const STATE_KEY = 'RESTORE_INNER_APP';
let topHistoryHelper: HistoryHelper;
try {
  topHistoryHelper = new HistoryHelper(STATE_KEY, top.history);
} catch (e) {
  // nothing
}

interface State {
  location: Location<any>;
  selfState: any;
}

const saveSelfState = debounce(
  (selfState: any) => {
    if (self !== top && topHistoryHelper) topHistoryHelper.mergeState({ selfState });
  },
  1000,
  {
    leading: true,
    trailing: true,
  },
);

export const useRestore = (history: History<any>) => {
  /**
   *  save location to top
   */
  useEffect(() => {
    // in top window
    if (self === top || !topHistoryHelper) return;

    // Listen for changes to the current location.
    return history.listen(location => topHistoryHelper.mergeState({ location }));
  }, [history]);

  /**
   * hacking by monkey patch
   * save history.state to top
   */
  useEffect(() => {
    // in top window
    if (self === top || !topHistoryHelper) return;

    const originalReplaceState = self.history.replaceState;

    self.history.replaceState = (state: any, title: string, url?: string) => {
      saveSelfState(state);
      originalReplaceState.call(self.history, state, title, url);
    };

    const originalPushState = self.history.pushState;

    self.history.pushState = (state: any, title: string, url?: string) => {
      saveSelfState(state);
      originalPushState.call(self.history, state, title, url);
    };

    return () => {
      self.history.replaceState = originalReplaceState;
      self.history.pushState = originalPushState;
    };
  }, []);

  /**
   * restore the status of the application
   */
  useEffect(() => {
    // in top window
    if (self === top || !topHistoryHelper) return;

    const state = topHistoryHelper.getState();
    if (state) {
      const { location, selfState } = state as State;
      history.replace(location);
      self.history.replaceState(selfState, '');
    }
  }, [history]);
};

export default useRestore;
