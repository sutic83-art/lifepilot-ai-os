import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LifePilot AI',
  description: 'AI life manager for tasks, goals, habits, journaling, and coaching.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr">
      <body>{children}</body>
    </html>
  );
}
