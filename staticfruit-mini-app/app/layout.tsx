import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';

export const metadata: Metadata = { title: 'StaticFruit', description: 'Hip Hop Horoscope • Bars • Markets' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://unpkg.com/@base-org/account/dist/base-account.min.js"
          defer
        />
      </head>
      <body className="bg-space text-white min-h-screen font-['Inter',system-ui,sans-serif]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}