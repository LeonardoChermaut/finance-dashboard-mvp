import { act, renderHook } from '@testing-library/react';
import { Eye, EyeOff } from 'lucide-react';
import { usePasswordVisibility } from './use-password-visibility';

describe('usePasswordVisibility', () => {
  it('Initializes with password hidden', () => {
    const { result } = renderHook(() => usePasswordVisibility());
    expect(result.current.showPassword).toBe(false);
  });

  it('Shows Eye icon when password is hidden', () => {
    const { result } = renderHook(() => usePasswordVisibility());
    expect(result.current.InputIcon).toBe(Eye);
  });

  it('Shows EyeOff icon when password is visible', () => {
    const { result } = renderHook(() => usePasswordVisibility());
    act(() => {
      result.current.togglePassword();
    });
    expect(result.current.InputIcon).toBe(EyeOff);
  });

  it('Toggles showPassword state', () => {
    const { result } = renderHook(() => usePasswordVisibility());
    expect(result.current.showPassword).toBe(false);
    act(() => {
      result.current.togglePassword();
    });
    expect(result.current.showPassword).toBe(true);
    act(() => {
      result.current.togglePassword();
    });
    expect(result.current.showPassword).toBe(false);
  });

  it('Provides togglePassword function', () => {
    const { result } = renderHook(() => usePasswordVisibility());
    expect(typeof result.current.togglePassword).toBe('function');
  });
});
