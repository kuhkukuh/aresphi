import { getTestimonials } from '@/lib/data';
import QuoteSectionClient from './QuoteSectionClient';

export default async function QuoteSection() {
  const testimonials = await getTestimonials();
  return <QuoteSectionClient testimonials={testimonials} />;
}
