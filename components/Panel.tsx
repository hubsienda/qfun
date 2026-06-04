import type { ReactNode } from 'react';

type PanelProps = {
  children: ReactNode;
  className?: string;
  strong?: boolean;
};

export function Panel({ children, className = '', strong = false }: PanelProps) {
  return (
    <div
      className={`${
        strong ? 'qoobix-card-strong' : 'qoobix-card'
      } rounded-[var(--qoobix-radius-large)] p-6 md:p-7 ${className}`}
    >
      {children}
    </div>
  );
}
