import Link from 'next/link';

export function AccessRecoveryPanel() {
  return (
    <div className="rounded-md border border-[var(--qoobix-border)] bg-white/65 p-5">
      <h2 className="text-lg font-semibold">Forgot your access code?</h2>

      <p className="mt-3 leading-7 text-[var(--qoobix-muted)]">
        If you created a recovery phrase, you can reset the access code yourself. No traditional
        login, no email/password ritual, no Sunday panic.
      </p>

      <div className="mt-5">
        <Link
          href="/access/recover"
          className="qoobix-focus-ring inline-flex items-center justify-center rounded-md border border-[var(--qoobix-orange)] bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--qoobix-orange)] transition hover:bg-[var(--qoobix-orange)] hover:text-white"
        >
          Reset with recovery phrase
        </Link>
      </div>

      <p className="mt-4 text-sm leading-6 text-[var(--qoobix-muted)]">
        If you have also lost the recovery phrase, contact QOOBIX support. We will verify the
        request manually and issue a temporary reset code.
      </p>
    </div>
  );
}
