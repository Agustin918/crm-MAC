'use client';

import { useState, useCallback } from 'react';

interface UseFetcherOptions<T, E = Error> {
  onSuccess?: (data: T) => void;
  onError?: (error: E) => void;
  onFinally?: () => void;
}

interface UseFetcherReturn<T, E = Error> {
  data: T | null;
  error: E | null;
  isLoading: boolean;
  execute: () => Promise<T | null>;
  reset: () => void;
}

export function useFetcher<T, E = Error>(
  fetcher: () => Promise<T>,
  options?: UseFetcherOptions<T, E>
): UseFetcherReturn<T, E> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetcher();
      setData(result);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err as E;
      setError(error);
      options?.onError?.(error);
      return null;
    } finally {
      setIsLoading(false);
      options?.onFinally?.();
    }
  }, [fetcher, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { data, error, isLoading, execute, reset };
}

interface UseMutationOptions<T, Variables, E = Error> {
  onSuccess?: (data: T, variables: Variables) => void;
  onError?: (error: E, variables: Variables) => void;
  onFinally?: (variables: Variables) => void;
}

interface UseMutationReturn<T, Variables, E = Error> {
  data: T | null;
  error: E | null;
  isLoading: boolean;
  mutate: (variables: Variables) => Promise<T | null>;
  reset: () => void;
}

export function useMutation<T, Variables, E = Error>(
  mutationFn: (variables: Variables) => Promise<T>,
  options?: UseMutationOptions<T, Variables, E>
): UseMutationReturn<T, Variables, E> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(async (variables: Variables) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await mutationFn(variables);
      setData(result);
      options?.onSuccess?.(result, variables);
      return result;
    } catch (err) {
      const error = err as E;
      setError(error);
      options?.onError?.(error, variables);
      return null;
    } finally {
      setIsLoading(false);
      options?.onFinally?.(variables);
    }
  }, [mutationFn, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { data, error, isLoading, mutate, reset };
}

interface UseQueryOptions<T, E = Error> {
  enabled?: boolean;
  refetchInterval?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: E) => void;
}

interface UseQueryReturn<T, E = Error> {
  data: T | null;
  error: E | null;
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => Promise<void>;
}

export function useQuery<T, E = Error>(
  key: string[],
  fetcher: () => Promise<T>,
  options?: UseQueryOptions<T, E>
): UseQueryReturn<T, E> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const refetch = useCallback(async () => {
    if (options?.enabled === false) return;
    
    setIsLoading(true);
    setIsFetching(true);
    setError(null);
    
    try {
      const result = await fetcher();
      setData(result);
      options?.onSuccess?.(result);
    } catch (err) {
      const error = err as E;
      setError(error);
      options?.onError?.(error);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [fetcher, options]);

  return { data, error, isLoading, isFetching, refetch };
}
