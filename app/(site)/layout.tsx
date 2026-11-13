import { IndicacaoProvider } from '@/components/indicacao/indicacaoProvider';
import Footer from '@/components/layout/footer';
import NavbarDesktop from '@/components/layout/navbarDesktop';
import NavbarMobile from '@/components/layout/navbarMobile';
import { montarVitrinesDoMenu } from '@/lib/data/maquinas/menu';

export default function SiteLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <IndicacaoProvider>
      <NavbarDesktop vitrines={montarVitrinesDoMenu()} />
      <NavbarMobile />
      <main id='main-content' className='relative h-full w-full'>
        {children}
      </main>
      <Footer />
    </IndicacaoProvider>
  );
}
