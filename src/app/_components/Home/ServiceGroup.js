import Appliances from './Appliances';
import BeautyCare from './BeautyCare';
import HomecareServcies from './HomecareServcies';
import HandymanServices from './HandymanServices';

export default function ServiceGroup() {
  return (
    <>
      <Appliances />
      <BeautyCare />
      <HomecareServcies />
      <HandymanServices />
    </>
  );
}