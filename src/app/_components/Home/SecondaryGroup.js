import AppDownloadCard from './AppDownloadCard';
import PopularCities from './PopularCities';
import AboutMannuBhai from '@/components/about';
import ClientReviews from './ClientReviews';
import BrandsWeRepair from '@/components/BrandsWeRepair';
import Services from './Services';
import FooterLinks from './FooterLinks';

export default function SecondaryGroup() {
  return (
    <>
      <AppDownloadCard />
      <PopularCities />
      <AboutMannuBhai />
      <ClientReviews />
      <BrandsWeRepair />
      <Services />
      <FooterLinks />
    </>
  );
}