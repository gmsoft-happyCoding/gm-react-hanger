import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import useDebounce from './useDebounce';
import bindActions from './_internal/bindActions';

export function useDebounceActions<AS>(actions: AS, deps: Array<any> = []): AS {
  const debounceDispatch = useDebounce(useDispatch());
  return useMemo(
    () => bindActions(actions, debounceDispatch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debounceDispatch, ...deps],
  );
}

export default useDebounceActions;
