import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--qoobix-orange)] text-white border-[var(--qoobix-orange)] hover:brightness-95',
  secondary:
    'bg-white/65 text-[var(--qoobix-text)] border-[var(--qoobix-border)] hover:bg-white',
  danger: 'bg-[var(--qoobix-danger)] text-white border-[var(--qoobix-danger)] hover:brightness-95'
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`qoobix-focus-ring inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variantClassNames[variant]} ${className}`}
    />
  );
}
