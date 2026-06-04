import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    'border-[var(--qoobix-orange)] bg-[var(--qoobix-orange)] shadow-[0_14px_34px_rgba(232,90,42,0.22)] hover:bg-[var(--qoobix-orange-dark)] hover:shadow-[0_18px_44px_rgba(232,90,42,0.26)]',
  secondary:
    'border-[var(--qoobix-border)] bg-white/72 text-[var(--qoobix-text)] shadow-[0_10px_28px_rgba(51,36,26,0.06)] hover:border-[var(--qoobix-border-strong)] hover:bg-white hover:shadow-[0_14px_34px_rgba(51,36,26,0.09)]',
  danger:
    'border-[var(--qoobix-danger)] bg-[var(--qoobix-danger)] shadow-[0_14px_34px_rgba(159,45,32,0.18)] hover:brightness-95'
};

export function Button({ variant = 'primary', className = '', style, ...props }: ButtonProps) {
  const forcedStyle =
    variant === 'primary' || variant === 'danger'
      ? {
          ...style,
          color: '#ffffff'
        }
      : style;

  return (
    <button
      {...props}
      style={forcedStyle}
      className={`qoobix-focus-ring inline-flex min-h-11 items-center justify-center rounded-full border px-5 py-3 text-sm font-bold tracking-[-0.01em] transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variantClassNames[variant]} ${className}`}
    />
  );
}
