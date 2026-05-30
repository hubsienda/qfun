import Link from 'next/link';
import type { LinkProps } from 'next/link';
import type { ReactNode } from 'react';

type ButtonLinkVariant = 'primary' | 'secondary';

type ButtonLinkProps = LinkProps & {
  children: ReactNode;
  variant?: ButtonLinkVariant;
  className?: string;
};

const variantClassNames: Record<ButtonLinkVariant, string> = {
  primary:
    'border-[var(--qoobix-orange)] bg-[var(--qoobix-orange)] text-white shadow-sm hover:bg-[var(--qoobix-orange-dark)]',
  secondary:
    'bg-white/68 text-[var(--qoobix-text)] border-[var(--qoobix-border)] hover:bg-white'
};

export function ButtonLink({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={`qoobix-focus-ring inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold transition ${variantClassNames[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
