import FranchiseHeader from '@/components/franchise/Header';
import FranchiseFooter from '@/components/franchise/Footer';
import FacebookPixel from '@/components/FacebookPixel';
export default function FranchiseLayout({ children }) {
  return (
    <>
      <FranchiseHeader />
        <FacebookPixel />
      <main>{children}</main>
      <FranchiseFooter />
    </>
  );
}