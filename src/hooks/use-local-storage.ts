import { useCallback, useState } from 'react';

type SetValue<T> = (value: T | ((previous: T) => T)) => void;

type UseLocalStorageReturn<T> = [T, SetValue<T>];

export const useLocalStorage = <T>(key: string, initialValue: T): UseLocalStorageReturn<T> => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue: SetValue<T> = useCallback(
    (value) => {
      setStoredValue((previous) => {
        const valueToStore = value instanceof Function ? value(previous) : value;

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }

        return valueToStore;
      });
    },
    [key],
  );

  return [storedValue, setValue];
};
