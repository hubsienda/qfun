import { AdminPanel } from '@/components/AdminPanel';

export const metadata = {
  title: 'Admin'
};

export default function AdminPage() {
  return (
    <section className="qoobix-container py-12 md:py-18">
      <div className="max-w-4xl">
        <p className="mb-4 inline-flex rounded-md border border-[var(--qoobix-orange)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--qoobix-orange)]">
          QOOBIX admin
        </p>

        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
          Provision clients. Create access. Keep the swamp outside.
        </h1>

        <p className="mt-5 max-w-2xl leading-8 text-[var(--qoobix-muted)]">
          Create configured client environments, private access codes, and report settings.
          The intelligence itself stays in downloadable outputs, not in a permanent lead museum.
        </p>
      </div>

      <div className="mt-10">
        <AdminPanel />
      </div>
    </section>
  );
}
