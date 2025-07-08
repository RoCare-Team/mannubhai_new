import FooterLinks from '@/app/_components/Home/FooterLinks';
import CityAccordion from './CityAccordion';
const { default: CategoryDetails } = require("./CategoryDetails");
const { default: CityDetails } = require("./CityDetails");
              
{pageType === "city-category" && city && category && (
  <>

  
    <CityDetails
      city={city} 
      showServices={city.status === 1}
    />
    <CategoryDetails
      category={category}
      city={city}
      cartItems={cartItems}
      addToCart={addToCart}
      increaseQuantity={increaseQuantity}
      decreaseQuantity={decreaseQuantity}
      cities={cities}
      pageContent={pageContent}
    />
        <h1>data load for city</h1>

    <CityAccordion cities={cities} currentCity={city} />
     <FooterLinks/>
      </>
)}
