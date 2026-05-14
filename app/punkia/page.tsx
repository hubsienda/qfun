import type { Metadata } from 'next';
import TerritoryPage from '@/components/TerritoryPage';
import { getTerritoryContent } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Punkia — QOOBIX',
  description:
    'Satirical field reports from civilisation’s nonsense engine.'
};

export default function PunkiaPage() {
  const page = getTerritoryContent('punkia');

  return (
    <TerritoryPage
      eyebrow={page.eyebrow}
      title={page.title}
      description={page.description}
      content={page.content}
      button={page.button}
      showStoreLink={page.showStoreLink === 'true'}
    />
  );
}
