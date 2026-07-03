import { SmoothScrollProvider } from '@/lib/smooth-scroll';
import Navigation from '@/components/Navigation';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <Navigation />
      {children}
    </SmoothScrollProvider>
  );
}
