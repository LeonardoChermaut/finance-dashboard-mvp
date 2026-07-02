import type { RefObject } from 'react';
import { useEffect } from 'react';

export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  isOpen: boolean,
  onClose: () => void,
): void => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, ref, onClose]);
};
