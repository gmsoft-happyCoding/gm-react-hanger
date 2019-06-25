import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import bindActions from './_internal/bindActions';

export function useActions<AS>(actions: AS, deps: Array<any> = []): AS {
  const dispatch = useDispatch();
  return useMemo(
    () => bindActions(actions, dispatch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, ...deps]
  );
}

export default useActions;
