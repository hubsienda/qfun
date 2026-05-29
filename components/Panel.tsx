import type { ReactNode } from 'react';

type PanelProps = {
  children: ReactNode;
  className?: string;
};

export function Panel({ children, className = '' }: PanelProps) {
  return <div className={`qoobix-card rounded-[1.75rem] p-6 ${className}`}>{children}</div>;
}
