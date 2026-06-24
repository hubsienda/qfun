import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    'border-[var(--qoobix-orange)] bg-[var(--qoobix-orange)] shadow-[0_12px_28px_rgba(232,90,42,0.18)] hover:bg-[var(--qoobix-orange-dark)] hover:shadow-[0_16px_34px_rgba(232,90,42,0.22)]',
  secondary:
    'border-[var(--qoobix-border)] bg-white/68 text-[var(--qoobix-text)] shadow-[0_8px_22px_rgba(51,36,26,0.045)] hover:border-[var(--qoobix-border-strong)] hover:bg-white hover:shadow-[0_12px_28px_rgba(51,36,26,0.065)]',
  danger:
    'border-[var(--qoobix-danger)] bg-[var(--qoobix-danger)] shadow-[0_12px_28px_rgba(159,45,32,0.16)] hover:brightness-95'
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
      className={`qoobix-focus-ring inline-flex min-h-10 items-center justify-center rounded-md border px-4 py-2.5 text-sm font-semibold tracking-[-0.01em] transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variantClassNames[variant]} ${className}`}
    />
  );
}
