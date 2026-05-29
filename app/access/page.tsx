import { AccessForm } from '@/components/AccessForm';
import { Panel } from '@/components/Panel';

export const metadata = {
  title: 'Private Access'
};

export default function AccessPage() {
  return (
    <section className="qoobix-narrow py-16 md:py-24">
      <Panel className="p-8 md:p-10">
        <p className="mb-4 inline-flex rounded-md border border-[var(--qoobix-orange)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--qoobix-orange)]">
          Private access
        </p>

        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Enter your QOOBIX access code.
        </h1>

        <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">
          This is a provisioned intelligence system. No account carnival. No password theatre.
          Insert the private code supplied for your configured environment.
        </p>

        <div className="mt-8">
          <AccessForm />
        </div>
      </Panel>
    </section>
  );
}
