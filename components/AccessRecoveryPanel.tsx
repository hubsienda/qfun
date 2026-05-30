const recoveryHref =
  'mailto:hub@siendaweblines.com,bob@siendaweblines.com?subject=QOOBIX%20access%20code%20reset%20request&body=Hello%2C%0A%0AI%20need%20to%20request%20a%20QOOBIX%20access%20code%20reset.%0A%0AClient%20name%3A%20%0AClient%20slug%20or%20company%20reference%3A%20%0AReason%3A%20I%20cannot%20access%20my%20private%20QOOBIX%20area.%0A%0APlease%20verify%20my%20request%20and%20issue%20a%20temporary%20reset%20code.%0A%0AThank%20you.';

export function AccessRecoveryPanel() {
  return (
    <div className="rounded-md border border-[var(--qoobix-border)] bg-white/65 p-5">
      <h2 className="text-lg font-semibold">Forgot your access code?</h2>

      <p className="mt-3 leading-7 text-[var(--qoobix-muted)]">
        QOOBIX does not use traditional email/password accounts. For security, access codes are not
        recoverable in readable form. If you forget your code, request a reset. After verification,
        we will issue a temporary code which you can replace inside your private area.
      </p>

      <div className="mt-5">
        <a
          href={recoveryHref}
          className="qoobix-focus-ring inline-flex items-center justify-center rounded-md border border-[var(--qoobix-orange)] bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--qoobix-orange)] transition hover:bg-[var(--qoobix-orange)] hover:text-white"
        >
          Request access reset
        </a>
      </div>
    </div>
  );
}
