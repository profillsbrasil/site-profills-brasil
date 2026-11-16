import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Admin do blog', template: '%s | Admin do blog' },
  robots: { index: false, follow: false }
};

export default function AdminBlogLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <div className='tema-admin contents'>{children}</div>;
}
