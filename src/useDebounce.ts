import { useMemo } from 'react';
import { debounce } from 'lodash';

export const useDebounce = (
  f: (...args: any[]) => any,
  ms: number = 500,
  leading: boolean = true,
  trailing: boolean = true,
) =>
  useMemo(
    () =>
      debounce(f, ms, {
        leading,
        trailing,
      }),
    [f, leading, ms, trailing],
  );

export default useDebounce;
