import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type StorageArea = 'local' | 'session';

function getStorage(area: StorageArea) {
  return area === 'local' ? globalThis.localStorage : globalThis.sessionStorage;
}

export function useStorage<T>(
  key: string,
  initialValue: T,
  area: StorageArea = 'local'
): [T, Dispatch<SetStateAction<T>>, () => void] {
  const storage = getStorage(area);

  // 1. Lee inicial (SSR-safe)
  const read = (): T => {
    if (globalThis.window === undefined) return initialValue;
    try {
      const item = storage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(read);

  // 2. Guarda
  const setValue: Dispatch<SetStateAction<T>> = (value) => {
    try {
      const valueToStore =
        typeof value === 'function'
          ? (value as (prev: T) => T)(storedValue)
          : value;
      setStoredValue(valueToStore);
      storage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`useStorage(${key})`, error);
    }
  };

  // 3. Reset
  const remove = () => {
    storage.removeItem(key);
    setStoredValue(initialValue);
  };

  // 4. Sincroniza entre tabs (solo localStorage)
  useEffect(() => {
    if (area !== 'local') return;
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== key || e.newValue === null) return;
      setStoredValue(JSON.parse(e.newValue));
    };
    globalThis.window.addEventListener('storage', handleStorage);
    return () =>
      globalThis.window.removeEventListener('storage', handleStorage);
  }, [key, area]);

  return [storedValue, setValue, remove];
}
