import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type BaseFieldProps = {
  label: string;
  name: string;
  hint?: string;
};

type InputFieldProps = BaseFieldProps &
  InputHTMLAttributes<HTMLInputElement> & {
    type?: string;
  };

type TextAreaFieldProps = BaseFieldProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    rows?: number;
  };

export function InputField({ label, name, hint, className = '', ...props }: InputFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      {hint ? <span className="mt-1 block text-xs text-[var(--qoobix-muted)]">{hint}</span> : null}
      <input
        {...props}
        name={name}
        className={`qoobix-focus-ring mt-2 w-full rounded-2xl border border-[var(--qoobix-border)] bg-white/75 px-4 py-3 text-sm outline-none ${className}`}
      />
    </label>
  );
}

export function TextAreaField({
  label,
  name,
  hint,
  rows = 5,
  className = '',
  ...props
}: TextAreaFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      {hint ? <span className="mt-1 block text-xs text-[var(--qoobix-muted)]">{hint}</span> : null}
      <textarea
        {...props}
        name={name}
        rows={rows}
        className={`qoobix-focus-ring mt-2 w-full resize-y rounded-2xl border border-[var(--qoobix-border)] bg-white/75 px-4 py-3 text-sm leading-6 outline-none ${className}`}
      />
    </label>
  );
}
