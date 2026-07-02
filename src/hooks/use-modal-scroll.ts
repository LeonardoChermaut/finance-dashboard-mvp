'use client';

import { useEffect, useRef } from 'react';

export const useModalScroll = (isOpen: boolean): void => {
  const scrollPositionRef = useRef<number>(0);

  useEffect(() => {
    if (isOpen) {
      scrollPositionRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      window.scrollTo(0, scrollPositionRef.current);
    }
  }, [isOpen]);
};
