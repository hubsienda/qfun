import type { Metadata } from 'next';
import TerritoryPage from '@/components/TerritoryPage';

export const metadata: Metadata = {
  title: 'Proteus — QOOBIX',
  description:
    'Proteus is the ever-changing intelligence inside Da QOOBIX.'
};

export default function ProteusPage() {
  return (
    <TerritoryPage
      eyebrow="Inside Da QOOBIX"
      title="Proteus"
      body="Proteus is the ever-changing intelligence inside Da QOOBIX. It asks counterintuitive questions, crushes comfortable myths, and occasionally recommends useful antidotes before returning to its natural state of elegant disapproval."
    />
  );
}
