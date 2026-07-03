import { renderHook } from '@testing-library/react';
import { useModalScroll } from './use-modal-scroll';

describe('useModalScroll', () => {
  it('Sets body position to fixed when modal opens', () => {
    renderHook(() => useModalScroll(true));
    expect(document.body.style.position).toBe('fixed');
  });

  it('Resets body styles when modal closes', () => {
    const { rerender } = renderHook(({ isOpen }) => useModalScroll(isOpen), {
      initialProps: { isOpen: true },
    });
    rerender({ isOpen: false });
    expect(document.body.style.position).toBe('');
    expect(document.body.style.top).toBe('');
    expect(document.body.style.width).toBe('');
  });

  it('Does not scroll to top on initial mount when modal is closed', () => {
    const scrollToSpy = jest.spyOn(window, 'scrollTo');
    renderHook(() => useModalScroll(false));
    expect(scrollToSpy).not.toHaveBeenCalled();
    scrollToSpy.mockRestore();
  });

  it('Restores scroll position when modal closes after being open', () => {
    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true });
    const { rerender } = renderHook(({ isOpen }) => useModalScroll(isOpen), {
      initialProps: { isOpen: false },
    });
    rerender({ isOpen: true });
    rerender({ isOpen: false });
    expect(scrollToSpy).toHaveBeenCalledWith(0, 500);
    scrollToSpy.mockRestore();
  });

  it('Sets body top to negative scroll position', () => {
    Object.defineProperty(window, 'scrollY', { value: 200, writable: true });
    renderHook(() => useModalScroll(true));
    expect(document.body.style.top).toBe('-200px');
  });
});
