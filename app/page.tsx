import HomePage from '@/components/HomePage';
import { getHomeContent, getTerritoryCards } from '@/lib/content';

export default function Page() {
  const content = getHomeContent();
  const territories = getTerritoryCards();

  return <HomePage content={content} territories={territories} />;
}
