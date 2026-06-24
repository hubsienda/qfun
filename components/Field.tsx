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

const fieldShellClassName = 'block';

const fieldLabelClassName =
  'text-sm font-semibold tracking-[-0.015em] text-[var(--qoobix-text)]';

const fieldHintClassName = 'mt-1.5 block text-xs leading-5 text-[var(--qoobix-muted)]';

const baseFieldClassName =
  'qoobix-focus-ring mt-2 w-full rounded-md border border-[var(--qoobix-border)] bg-white/74 px-4 py-3 text-sm text-[var(--qoobix-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_8px_22px_rgba(51,36,26,0.035)] outline-none transition duration-200 placeholder:text-[var(--qoobix-muted-soft)] hover:border-[var(--qoobix-border-strong)] hover:bg-white/86 focus:border-[var(--qoobix-orange)] focus:bg-white focus:shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_10px_26px_rgba(232,90,42,0.08)]';

export const selectFieldClassName =
  'qoobix-focus-ring mt-2 w-full rounded-md border border-[var(--qoobix-border)] bg-white/74 px-4 py-3 text-sm text-[var(--qoobix-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_8px_22px_rgba(51,36,26,0.035)] outline-none transition duration-200 hover:border-[var(--qoobix-border-strong)] hover:bg-white/86 focus:border-[var(--qoobix-orange)] focus:bg-white focus:shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_10px_26px_rgba(232,90,42,0.08)]';

export function InputField({ label, name, hint, className = '', ...props }: InputFieldProps) {
  return (
    <label className={fieldShellClassName}>
      <span className={fieldLabelClassName}>{label}</span>
      {hint ? <span className={fieldHintClassName}>{hint}</span> : null}
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
    <label className={fieldShellClassName}>
      <span className={fieldLabelClassName}>{label}</span>
      {hint ? <span className={fieldHintClassName}>{hint}</span> : null}
      <textarea
        {...props}
        name={name}
        rows={rows}
        className={`${baseFieldClassName} resize-y leading-6 ${className}`}
      />
    </label>
  );
}
