import { act, renderHook } from '@testing-library/react';
import { useLocalStorage } from './use-local-storage';

type MockStorage = {
  getItem: jest.Mock;
  setItem: jest.Mock;
  removeItem: jest.Mock;
  clear: jest.Mock;
};

const createMockStorage = (): MockStorage => {
  const store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((key) => {
        delete store[key];
      });
    }),
  };
};

let mockStorage: MockStorage;

beforeEach(() => {
  mockStorage = createMockStorage();
  Object.defineProperty(window, 'localStorage', {
    value: mockStorage,
    writable: true,
  });
});

describe('useLocalStorage', () => {
  it('Returns initial value when storage is empty', () => {
    const { result } = renderHook(() => useLocalStorage<string>('key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('Reads existing value from storage', () => {
    mockStorage.getItem.mockReturnValueOnce(JSON.stringify('stored-value'));
    const { result } = renderHook(() => useLocalStorage<string>('key', 'default'));
    expect(result.current[0]).toBe('stored-value');
  });

  it('Persists value to storage when setter is called', () => {
    const { result } = renderHook(() => useLocalStorage<number>('counter', 0));
    act(() => {
      result.current[1](5);
    });
    expect(result.current[0]).toBe(5);
    expect(mockStorage.setItem).toHaveBeenCalledWith('counter', '5');
  });

  it('Supports functional update pattern', () => {
    const { result } = renderHook(() => useLocalStorage<number>('counter', 10));
    act(() => {
      result.current[1]((prev) => prev + 5);
    });
    expect(result.current[0]).toBe(15);
  });

  it('Returns initial value when JSON parse fails', () => {
    mockStorage.getItem.mockReturnValueOnce('invalid-json{');
    const { result } = renderHook(() => useLocalStorage<string>('key', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });

  it('Returns initial value when window is undefined (SSR)', () => {
    const originalWindow = global.window;
    // @ts-expect-error testing SSR scenario
    delete global.window;
    const { result } = renderHook(() => useLocalStorage<string>('key', 'ssr-default'));
    expect(result.current[0]).toBe('ssr-default');
    global.window = originalWindow;
  });

  it('Does not mutate the initial value reference', () => {
    const initialValue = Object.freeze({ nested: 'value' });
    const { result } = renderHook(() => useLocalStorage('key', initialValue));
    expect(result.current[0]).toEqual(initialValue);
  });
});
