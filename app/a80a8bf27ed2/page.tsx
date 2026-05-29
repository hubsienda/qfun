import { AdminPanel } from '@/components/AdminPanel';

export const metadata = {
  title: 'Provisioning'
};

export default function HiddenProvisioningPage() {
  return (
    <section className="qoobix-container py-12 md:py-18">
      <div className="max-w-4xl">
        <p className="mb-4 inline-flex rounded-md border border-[var(--qoobix-orange)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--qoobix-orange)]">
          QOOBIX provisioning
        </p>

        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
          Create client access. Let the client complete the business profile.
        </h1>

        <p className="mt-5 max-w-2xl leading-8 text-[var(--qoobix-muted)]">
          This hidden area creates the private client environment and access code. The client then
          completes sector, products, target countries, channels, competitors, and other business
          context inside their own private area.
        </p>
      </div>

      <div className="mt-10">
        <AdminPanel />
      </div>
    </section>
  );
}
