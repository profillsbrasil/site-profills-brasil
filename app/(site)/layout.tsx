import Footer from '@/components/layout/footer';
import NavbarDesktop from '@/components/layout/navbarDesktop';
import NavbarMobile from '@/components/layout/navbarMobile';

export default function SiteLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavbarDesktop />
      <NavbarMobile />
      <main id='main-content' className='relative h-full w-full'>
        {children}
      </main>
      <Footer />
    </>
  );
}
