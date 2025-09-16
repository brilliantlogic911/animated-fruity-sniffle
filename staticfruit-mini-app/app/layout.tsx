import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { minikitConfig } from '../minikit.config';

export const metadata: Metadata = {
  title: 'StaticFruit',
  description: 'Hip Hop Horoscope • Bars • Markets',
  other: {
    'fc:miniapp': 'vNext',
    'fc:miniapp:image': minikitConfig.frame.heroImageUrl || minikitConfig.frame.iconUrl,
    'fc:miniapp:button:1': 'Launch App',
    'fc:miniapp:button:1:action': 'launch_frame',
    'fc:miniapp:button:1:target': minikitConfig.frame.homeUrl,
  }
};

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