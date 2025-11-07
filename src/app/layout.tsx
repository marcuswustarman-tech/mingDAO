import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '明DAO',
  description: '明DAO · 专业外汇交易员培训平台',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
