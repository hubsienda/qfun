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

const baseFieldClassName =
  'qoobix-focus-ring mt-2 w-full rounded-2xl border border-[var(--qoobix-border)] bg-white/82 px-4 py-3 text-sm text-[var(--qoobix-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_10px_28px_rgba(51,36,26,0.045)] outline-none transition duration-200 placeholder:text-[var(--qoobix-muted-soft)] hover:border-[var(--qoobix-border-strong)] focus:border-[var(--qoobix-orange)] focus:bg-white';

export function InputField({ label, name, hint, className = '', ...props }: InputFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-bold tracking-[-0.01em]">{label}</span>
      {hint ? (
        <span className="mt-1.5 block text-xs leading-5 text-[var(--qoobix-muted)]">{hint}</span>
      ) : null}
      <input {...props} name={name} className={`${baseFieldClassName} ${className}`} />
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
      <span className="text-sm font-bold tracking-[-0.01em]">{label}</span>
      {hint ? (
        <span className="mt-1.5 block text-xs leading-5 text-[var(--qoobix-muted)]">{hint}</span>
      ) : null}
      <textarea
        {...props}
        name={name}
        rows={rows}
        className={`${baseFieldClassName} resize-y leading-6 ${className}`}
      />
    </label>
  );
}
