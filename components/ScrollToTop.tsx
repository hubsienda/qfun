'use client';

import { useEffect, useState } from 'react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      const isDesktop = window.matchMedia('(min-width: 768px)').matches;
      setIsVisible(isDesktop && window.scrollY > 700);
    }

    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="qoobix-focus fixed bottom-7 right-7 z-40 hidden h-12 w-12 items-center justify-center rounded-2xl border text-xl shadow-2xl transition hover:-translate-y-0.5 md:flex"
      style={{
        borderColor: 'rgba(232, 90, 42, 0.45)',
        color: '#E85A2A',
        background: 'var(--panel-strong)',
        boxShadow: '0 18px 60px var(--shadow)'
      }}
      aria-label="Go to top"
    >
      ↑
    </button>
  );
}
