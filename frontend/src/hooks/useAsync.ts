import { useCallback, useEffect, useRef, useState } from 'react';
import type { DependencyList } from 'react';
import { getErrorCode, getErrorMessage, isAbortError } from '../services/errors';
import type { ApiErrorCode } from '../services/errors';

export interface AsyncError {
  message: string;
  code: ApiErrorCode;
}

/** Tải dữ liệu bất đồng bộ với trạng thái loading / error, tự hủy request khi unmount. */
export function useAsync<T>(fn: (signal: AbortSignal) => Promise<T>, deps: DependencyList) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AsyncError | null>(null);
  const [nonce, setNonce] = useState(0);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fnRef.
    current(controller.signal).
    then((result) => {
      if (controller.signal.aborted) return;
      setData(result);
      setLoading(false);
    }).
    catch((err: unknown) => {
      if (controller.signal.aborted || isAbortError(err)) return;
      setError({ message: getErrorMessage(err), code: getErrorCode(err) });
      setLoading(false);
    });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  return { data, loading, error, reload, setData };
}