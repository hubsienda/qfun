import type { Metadata } from 'next';
import TerritoryPage from '@/components/TerritoryPage';
import { getTerritoryContent } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Goalverse — QOOBIX',
  description:
    'The anti-coaching chamber of QOOBIX. Not sport. Not motivation. Not another shrine to goals.'
};

export default function GoalversePage() {
  const page = getTerritoryContent('goalverse');

  return (
    <TerritoryPage
      eyebrow={page.eyebrow}
      title={page.title}
      description={page.description}
      content={page.content}
      button="Return to Da QOOBIX"
      showStoreLink={page.showStoreLink === 'true'}
    />
  );
}
