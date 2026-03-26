import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QR Voting System',
  description: 'Scan QR codes to vote for projects in real-time',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
