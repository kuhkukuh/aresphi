import { SmoothScrollProvider } from '@/lib/smooth-scroll';
import Navigation from '@/components/Navigation';
import BackgroundDecor from '@/components/BackgroundDecor';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <BackgroundDecor />
      <Navigation />
      {children}
    </SmoothScrollProvider>
  );
}
