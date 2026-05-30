type DataNoticeProps = {
  variant?: 'compact' | 'full';
};

export function DataNotice({ variant = 'compact' }: DataNoticeProps) {
  if (variant === 'full') {
    return (
      <div className="rounded-md border border-[var(--qoobix-border)] bg-white/75 p-5 text-sm leading-7 text-[var(--qoobix-muted)]">
        <h2 className="mb-2 text-base font-semibold text-[var(--qoobix-text)]">
          AI-assisted analysis and verification notice
        </h2>
        <p>
          QOOBIX generates AI-assisted market intelligence from the business profile and the
          specific request submitted by the client. Outputs may contain errors, omissions,
          incomplete information, outdated assumptions, or unverified market signals.
        </p>
        <p className="mt-3">
          Reports and workbooks must be reviewed and verified before they are used for commercial,
          legal, regulatory, technical, financial, procurement, or strategic decisions. QOOBIX does
          not replace professional judgement, source verification, commercial due diligence, or
          sector-specific expertise.
        </p>
        <p className="mt-3">
          Generated files are retained temporarily according to the configured retention period.
          The client is responsible for downloading and keeping any output they need to preserve.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-[var(--qoobix-border)] bg-white/70 p-4 text-sm leading-7 text-[var(--qoobix-muted)]">
      AI-assisted outputs may contain errors, omissions, or incomplete information. Verify all
      intelligence before commercial use. Generated files are retained temporarily; download
      anything you need to keep.
    </div>
  );
}
