import type { Metadata } from 'next';
import TerritoryPage from '@/components/TerritoryPage';
import { getTerritoryContent } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Proteus — QOOBIX',
  description:
    'Proteus is the ever-changing intelligence inside Da QOOBIX.'
};

export default function ProteusPage() {
  const page = getTerritoryContent('proteus');

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
