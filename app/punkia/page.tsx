import type { Metadata } from 'next';
import TerritoryPage from '@/components/TerritoryPage';

export const metadata: Metadata = {
  title: 'Punkia — QOOBIX',
  description:
    'Satirical field reports from civilisation’s nonsense engine.'
};

export default function PunkiaPage() {
  return (
    <TerritoryPage
      eyebrow="Territory"
      title="Punkia"
      body="Satirical field reports from civilisation’s nonsense engine. Punkia mocks corporate fog, AI theatre, LinkedIn rituals, fake innovation, meritocracy myths, management language, productivity cults, and institutional absurdity."
    />
  );
}
