import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    'border-[var(--qoobix-orange)] bg-[var(--qoobix-orange)] shadow-sm hover:bg-[var(--qoobix-orange-dark)]',
  secondary:
    'bg-white/68 text-[var(--qoobix-text)] border-[var(--qoobix-border)] hover:bg-white',
  danger: 'bg-[var(--qoobix-danger)] border-[var(--qoobix-danger)] hover:brightness-95'
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
      className={`qoobix-focus-ring inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variantClassNames[variant]} ${className}`}
    />
  );
}
