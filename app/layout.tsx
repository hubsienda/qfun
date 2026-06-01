import type { Metadata } from 'next';
import './globals.css';
import { BrandHeader } from '@/components/BrandHeader';
import { CookiePrivacyBanner } from '@/components/CookiePrivacyBanner';
import { Footer } from '@/components/Footer';
import { GoToTop } from '@/components/GoToTop';

export const metadata: Metadata = {
  title: {
    default: 'QOOBIX',
    template: '%s · QOOBIX'
  },
  description: 'Private AI-powered market intelligence, provisioned for your business.',
  icons: {
    icon: '/favicon.png'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="qoobix-shell">
          <BrandHeader />
          <main className="qoobix-main">{children}</main>
          <Footer />
          <CookiePrivacyBanner />
          <GoToTop />
        </div>
      </body>
    </html>
  );
}
