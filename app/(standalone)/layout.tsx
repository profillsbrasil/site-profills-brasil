export default function StandaloneLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main id='main-content' className='relative h-full w-full'>
      {children}
    </main>
  );
}
