'use client';

import { useEffect, useRef, useState } from 'react';

export function BackToTop() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const scrollContainer = buttonRef.current?.closest<HTMLElement>('.docs-content-layout');

    if (!scrollContainer) {
      return;
    }

    const updateVisibility = () => setIsVisible(scrollContainer.scrollTop > 400);

    scrollContainer.addEventListener('scroll', updateVisibility, { passive: true });
    updateVisibility();

    return () => scrollContainer.removeEventListener('scroll', updateVisibility);
  }, []);

  const scrollToTop = () => {
    buttonRef.current?.closest<HTMLElement>('.docs-content-layout')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`back-to-top${isVisible ? ' visible' : ''}`}
      aria-label="Back to top"
      title="Back to top"
      onClick={scrollToTop}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m6 15 6-6 6 6" />
      </svg>
    </button>
  );
}
