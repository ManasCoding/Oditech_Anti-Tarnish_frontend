import Hero from '../components/home/Hero';
import ShopByCategory from '../components/home/ShopByCategory';
import BestSellers from '../components/home/BestSellers';
import WhyChoose from '../components/home/WhyChoose';
import NewArrivalsBanner from '../components/home/NewArrivalsBanner';
import Reviews from '../components/home/Reviews';
import InstagramSection from '../components/home/InstagramSection';

const Home = () => {
  return (
    <div>
      <Hero />
      <ShopByCategory />
      <BestSellers />
      <WhyChoose />
      <NewArrivalsBanner />
      <Reviews />
      <InstagramSection />
    </div>
  );
};

export default Home;
