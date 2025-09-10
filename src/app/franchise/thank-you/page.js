
import { Metadata } from 'next';
import FranchiseThankYouPage from '../franchise-opportunities/components/FranchiseThankYouPage';

export const metadata = {
  title: 'Thank You - Franchise Application | MannuBhai',
  description: 'Thank you for your franchise application. Our team will contact you soon.',
  robots: 'noindex, nofollow'
};

export default function ThankYouPage() {
  return <FranchiseThankYouPage />;
}