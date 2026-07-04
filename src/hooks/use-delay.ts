'use client';

import { useCallback, useState } from 'react';

type DelayReturn<T> = {
  isLoading: boolean;
  execute: (operation: () => Promise<T>) => Promise<T>;
};

export const useDelay = <T>(delayMs: number): DelayReturn<T> => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const execute = useCallback(
    async (operation: () => Promise<T>): Promise<T> => {
      setIsLoading(true);

      const [result] = await Promise.all([
        operation(),
        new Promise<void>((resolve) => setTimeout(resolve, delayMs)),
      ]);

      setIsLoading(false);
      return result;
    },
    [delayMs],
  );

  return { isLoading, execute } as const;
};
