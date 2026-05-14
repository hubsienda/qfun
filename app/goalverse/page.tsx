import type { Metadata } from 'next';
import TerritoryPage from '@/components/TerritoryPage';

export const metadata: Metadata = {
  title: 'GOALVERSE — QOOBIX',
  description:
    'The anti-coaching chamber of QOOBIX. Not sport. Not motivation. Not another shrine to goals.'
};

export default function GoalversePage() {
  return (
    <TerritoryPage
      eyebrow="Territory"
      title="GOALVERSE"
      body="The anti-coaching chamber of QOOBIX. GOALVERSE mocks goal worship, motivation clichés, productivity theatre, hard-work myths, hustle culture, and the industry that keeps telling people to optimise their lives before asking whether the goal was worth having in the first place."
    />
  );
}
