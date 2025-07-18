import FranchiseHeader from '@/components/franchise/Header';
import FranchiseFooter from '@/components/franchise/Footer';

export default function FranchiseLayout({ children }) {
  return (
    <>
      <FranchiseHeader />
      <main>{children}</main>
      <FranchiseFooter />
    </>
  );
}