'use client';

import { useEffect, useState } from 'react';

export function GoToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > 520);
    }

    handleScroll();

    window.addEventListener('scroll', handleScroll, {
      passive: true
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function goToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={goToTop}
      className="qoobix-focus-ring fixed bottom-6 right-6 z-40 hidden rounded-full border border-[var(--qoobix-border)] bg-white/90 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--qoobix-text)] shadow-xl backdrop-blur-md transition hover:border-[var(--qoobix-orange)] hover:text-[var(--qoobix-orange)] md:inline-flex"
      aria-label="Go to top"
    >
      ↑ Top
    </button>
  );
}
