import Link from 'next/link';
import type { LinkProps } from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

type ButtonLinkVariant = 'primary' | 'secondary';

type ButtonLinkProps = LinkProps & {
  children: ReactNode;
  variant?: ButtonLinkVariant;
  className?: string;
  style?: CSSProperties;
};

const variantClassNames: Record<ButtonLinkVariant, string> = {
  primary:
    'border-[var(--qoobix-orange)] bg-[var(--qoobix-orange)] shadow-[0_14px_34px_rgba(232,90,42,0.22)] hover:bg-[var(--qoobix-orange-dark)] hover:shadow-[0_18px_44px_rgba(232,90,42,0.26)]',
  secondary:
    'border-[var(--qoobix-border)] bg-white/72 text-[var(--qoobix-text)] shadow-[0_10px_28px_rgba(51,36,26,0.06)] hover:border-[var(--qoobix-border-strong)] hover:bg-white hover:shadow-[0_14px_34px_rgba(51,36,26,0.09)]'
};

export function ButtonLink({
  children,
  variant = 'primary',
  className = '',
  style,
  ...props
}: ButtonLinkProps) {
  const forcedStyle =
    variant === 'primary'
      ? {
          ...style,
          color: '#ffffff'
        }
      : style;

  return (
    <Link
      {...props}
      style={forcedStyle}
      className={`qoobix-focus-ring inline-flex min-h-11 items-center justify-center rounded-lg border px-5 py-3 text-sm font-bold tracking-[-0.01em] transition duration-200 ${variantClassNames[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
