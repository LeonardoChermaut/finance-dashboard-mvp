'use client';

import { useEffect, useRef } from 'react';

export const useModalScroll = (isOpen: boolean): void => {
  const scrollPositionRef = useRef<number>(0);
  const wasOpenRef = useRef<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      scrollPositionRef.current = window.scrollY;
      wasOpenRef.current = true;
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
    if (!isOpen && wasOpenRef.current) {
      window.scrollTo(0, scrollPositionRef.current);
      wasOpenRef.current = false;
    }
  }, [isOpen]);
};
