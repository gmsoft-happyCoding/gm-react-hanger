import { useState, useCallback } from 'react';
import useInterval from './useInterval';

export const useCountdown = (second: number) => {
  /**
   * 剩余时间
   */
  const [rt, setRt] = useState(0);
  /**
   * delay = null -> 暂定定时器
   */
  const [delay, setDelay] = useState<number | null>(null);

  const countdown = useCallback(() => {
    if (rt > 0) {
      setRt(rt - 1);
    } else {
      setDelay(null);
    }
  }, [rt]);

  const start = useCallback(() => {
    setRt(second);
    setDelay(1000);
  }, [second]);

  const stop = useCallback(() => {
    setDelay(null);
    setRt(0);
  }, []);

  const pause = useCallback(() => {
    setDelay(null);
  }, []);

  const goOn = useCallback(() => {
    setDelay(1000);
  }, []);

  useInterval(countdown, delay);

  return { rt, start, stop, pause, goOn };
};

export default useCountdown;
