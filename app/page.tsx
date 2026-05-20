import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HomePage from '@/components/HomePage';
import type { DiagnosticPath } from '@/lib/diagnostics';

import goalverse from '@/content/proteus/goalverse.json';
import punkia from '@/content/proteus/punkia.json';
import aiTheatre from '@/content/proteus/ai-theatre.json';

const diagnosticPaths = [
  goalverse,
  punkia,
  aiTheatre
] as unknown as DiagnosticPath[];

export default function Page() {
  return (
    <div className="qoobix-shell">
      <div className="qoobix-grid pointer-events-none fixed inset-0 opacity-30" />

      <Header />
      <HomePage diagnosticPaths={diagnosticPaths} />
      <Footer />
    </div>
  );
}
