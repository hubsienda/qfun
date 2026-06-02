import Link from 'next/link';

type AccessRecoveryPanelLabels = {
  title: string;
  text: string;
  button: string;
  fallback: string;
};

type AccessRecoveryPanelProps = {
  labels?: AccessRecoveryPanelLabels;
  lang?: string;
};

const defaultLabels: AccessRecoveryPanelLabels = {
  title: 'Forgot your access code?',
  text:
    'If you created a recovery phrase, you can reset the access code yourself. No traditional login, no email/password ritual, no Sunday panic.',
  button: 'Reset with recovery phrase',
  fallback:
    'If you have also lost the recovery phrase, contact QOOBIX support. We will verify the request manually and issue a temporary reset code.'
};

export function AccessRecoveryPanel({
  labels = defaultLabels,
  lang = 'en'
}: AccessRecoveryPanelProps) {
  return (
    <div className="rounded-md border border-[var(--qoobix-border)] bg-white/65 p-5">
      <h2 className="text-lg font-semibold">{labels.title}</h2>

      <p className="mt-3 leading-7 text-[var(--qoobix-muted)]">{labels.text}</p>

      <div className="mt-5">
        <Link
          href={`/access/recover?lang=${lang}`}
          className="qoobix-focus-ring inline-flex items-center justify-center rounded-md border border-[var(--qoobix-orange)] bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--qoobix-orange)] transition hover:bg-[var(--qoobix-orange)] hover:text-white"
        >
          {labels.button}
        </Link>
      </div>

      <p className="mt-4 text-sm leading-6 text-[var(--qoobix-muted)]">{labels.fallback}</p>
    </div>
  );
}
