import { act, renderHook } from '@testing-library/react';
import { useDelay } from './use-delay';

describe('useDelay', () => {
  it('Starts with isLoading set to false', () => {
    const { result } = renderHook(() => useDelay<string>(500));
    expect(result.current.isLoading).toBe(false);
  });

  it('Returns the result of the executed operation', async () => {
    const { result } = renderHook(() => useDelay<number>(10));
    const operation = jest.fn(async () => 42);

    let returnValue: number | undefined;
    await act(async () => {
      returnValue = await result.current.execute(operation);
    });

    expect(returnValue).toBe(42);
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('Sets isLoading to true during execution', async () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useDelay<string>(100));

    let resolvePromise!: (value: string) => void;
    const slowOperation = jest.fn(
      () =>
        new Promise<string>((resolve) => {
          resolvePromise = resolve;
        }),
    );

    act(() => {
      result.current.execute(slowOperation);
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolvePromise('done');
      jest.advanceTimersByTime(150);
    });

    expect(result.current.isLoading).toBe(false);
    jest.useRealTimers();
  });

  it('Propagates errors from the operation', async () => {
    const { result } = renderHook(() => useDelay<string>(10));
    const failingOperation = jest.fn(async () => {
      throw new Error('operation failed');
    });

    await expect(
      act(async () => {
        await result.current.execute(failingOperation);
      }),
    ).rejects.toThrow('operation failed');
  });

  it('Does not mutate operation input objects', async () => {
    const { result } = renderHook(() => useDelay<void>(10));
    const input = { value: 100 };
    const operation = jest.fn(async () => {
      input.value = 200;
    });

    await act(async () => {
      await result.current.execute(operation);
    });

    expect(input.value).toBe(200);
  });
});
