import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'StaticFruit', description: 'Hip Hop Horoscope • Bars • Markets' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className="bg-space text-mist min-h-screen">{children}</body></html>);
}