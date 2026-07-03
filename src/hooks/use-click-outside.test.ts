import { renderHook } from '@testing-library/react';
import { useClickOutside } from './use-click-outside';

describe('useClickOutside', () => {
  it('does not call onClose when isOpen is false', () => {
    const onClose = jest.fn();
    const ref = { current: document.createElement('div') };
    renderHook(() => useClickOutside(ref, false, onClose));
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when clicking outside the ref', () => {
    const onClose = jest.fn();
    const element = document.createElement('div');
    const ref = { current: element };
    renderHook(() => useClickOutside(ref, true, onClose));
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking inside the ref', () => {
    const onClose = jest.fn();
    const element = document.createElement('div');
    document.body.appendChild(element);
    const ref = { current: element };
    renderHook(() => useClickOutside(ref, true, onClose));
    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(onClose).not.toHaveBeenCalled();
    document.body.removeChild(element);
  });

  it('cleans up event listener on unmount', () => {
    const onClose = jest.fn();
    const element = document.createElement('div');
    const ref = { current: element };
    const { unmount } = renderHook(() => useClickOutside(ref, true, onClose));
    unmount();
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not call onClose when ref is null', () => {
    const onClose = jest.fn();
    const ref = { current: null };
    renderHook(() => useClickOutside(ref, true, onClose));
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(onClose).not.toHaveBeenCalled();
  });
});
