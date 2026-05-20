import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HomePage from '@/components/HomePage';
import { getHomeContent } from '@/lib/content';

export default function Page() {
  const content = getHomeContent();

  return (
    <div className="qoobix-shell">
      <div className="qoobix-grid pointer-events-none fixed inset-0 opacity-30" />

      <Header />
      <HomePage content={content} />
      <Footer />
    </div>
  );
}
