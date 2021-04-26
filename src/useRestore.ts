/**
 * save the current application state to top.history.state
 * restore the status of the application when refreshing or rebounding
 * Known problem: This solution causes the history stack to grow, but there is no better solution at the moment
 */
import { useEffect } from 'react';
import { History, Location } from 'history';
import HistoryHelper from 'history-helper';
import { findIndex, isEqual } from 'lodash';

const STATE_KEY = 'RESTORE_INNER_APP';

let topHistoryHelper: HistoryHelper;

try {
  topHistoryHelper = new HistoryHelper(STATE_KEY, top.history);
} catch (e) {
  // nothing
}

type Action = 'push' | 'replace';
interface RestoreDataI {
  location: Location<any>;
  selfStateStack: Array<{
    url?: string;
    state: any;
  }>;
}

const getUrl = () => `${location.pathname}${location.search}${location.hash}`;

/**
 * why save the entire history stack?
 * iframe pushed into the history stack
 * the browser can not correctly back after refresh, will not trigger popstate event
 * resulting in the route can not be correctly switched
 */
const saveSelfState = (action: Action, state: any, url?: string) => {
  if (self !== top && topHistoryHelper) {
    const selfStateStack = topHistoryHelper.getValue('selfStateStack', []);

    if (action === 'push') {
      selfStateStack.push({
        url: url || getUrl(),
        state,
      });
    } else {
      selfStateStack[Math.max(selfStateStack.length - 1, 0)] = {
        url: url || getUrl(),
        state,
      };
    }

    topHistoryHelper.shallowMergeState({ selfStateStack });
  }
};

export const useRestore = (history: History<any>) => {
  /**
   * restore the status of the application
   */
  useEffect(() => {
    if (self === top || !topHistoryHelper) return;

    const state = topHistoryHelper.getState();
    if (state) {
      const { location, selfStateStack } = state as RestoreDataI;

      // restore router
      if (location) history.replace(location);

      /**
       * restore history stack
       * Known problem: This solution causes the history stack to grow, but there is no better solution at the moment
       */
      if (selfStateStack && selfStateStack.length > 0) {
        const first = selfStateStack[0];
        self.history.replaceState(first.state, '', first.url);

        for (let i = 1; i < selfStateStack.length; i++) {
          const item = selfStateStack[i];
          self.history.pushState(item.state, '', item.url);
        }
      }
    }
  }, [history]);

  /**
   *  save location in top.history.state
   */
  useEffect(() => {
    if (self === top || !topHistoryHelper) return;

    // Listen for changes to the current location.
    return history.listen(location =>
      topHistoryHelper.mergeState({
        location,
      }),
    );
  }, [history]);

  /**
   * hacking by monkey patch
   * save history.state in top.history.state
   */
  useEffect(() => {
    if (self === top || !topHistoryHelper) return;

    // save current route
    saveSelfState('replace', self.history.state, getUrl());

    const originalReplaceState = self.history.replaceState;

    self.history.replaceState = (state: any, title: string, url?: string) => {
      saveSelfState('replace', state, url);
      originalReplaceState.call(self.history, state, title, url);
    };

    const originalPushState = self.history.pushState;

    self.history.pushState = (state: any, title: string, url?: string) => {
      saveSelfState('push', state, url);
      originalPushState.call(self.history, state, title, url);
    };

    return () => {
      self.history.replaceState = originalReplaceState;
      self.history.pushState = originalPushState;
    };
  }, []);

  // handle history back
  useEffect(() => {
    if (self === top || !topHistoryHelper) return;

    window.addEventListener('popstate', event => {
      const selfStateStack = topHistoryHelper.getValue('selfStateStack', []);
      const url = getUrl();
      const index = findIndex(selfStateStack, item =>
        isEqual(item, {
          state: event.state,
          url: url,
        }),
      );

      if (index > -1) {
        topHistoryHelper.shallowMergeState({
          selfStateStack: selfStateStack.slice(0, index + 1),
        });
      }
    });
  }, []);
};

export default useRestore;
