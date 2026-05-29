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
    'bg-[var(--qoobix-orange)] text-[#ffffff] border-[var(--qoobix-orange)] hover:brightness-95',
  secondary:
    'bg-white/65 text-[var(--qoobix-text)] border-[var(--qoobix-border)] hover:bg-white'
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
      className={`qoobix-focus-ring inline-flex items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold transition ${variantClassNames[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
