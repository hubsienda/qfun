import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Da QOOBIX',
  description:
    'A satirical intelligence platform for crushing myths, detecting nonsense, and finding the occasional antidote.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png'
  }
};

const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('qoobix-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.dataset.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.dataset.theme = 'light';
    }
  } catch (error) {
    document.documentElement.classList.remove('dark');
    document.documentElement.dataset.theme = 'light';
  }
})();
`;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
