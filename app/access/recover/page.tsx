import Link from 'next/link';
import { AccessRecoveryForm } from '@/components/AccessRecoveryForm';
import { Panel } from '@/components/Panel';

export const metadata = {
  title: 'Recover Access'
};

export default function RecoverAccessPage() {
  return (
    <section className="qoobix-narrow py-16 md:py-24">
      <Panel className="p-8 md:p-10">
        <p className="mb-4 inline-flex rounded-md border border-[var(--qoobix-orange)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--qoobix-orange)]">
          Access recovery
        </p>

        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Let Proteus generate a new access code.
        </h1>

        <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">
          Enter the client access name and recovery phrase. If they match, Proteus will generate a
          new access code and disable the old one.
        </p>

        <div className="mt-8">
          <AccessRecoveryForm />
        </div>

        <div className="mt-8 border-t border-[var(--qoobix-border)] pt-6">
          <Link href="/access" className="font-semibold text-[var(--qoobix-orange)]">
            Back to private access →
          </Link>
        </div>
      </Panel>
    </section>
  );
}
