import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import NewsVerifier from '@/components/home/NewsVerifier';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <NewsVerifier />
      <FeaturesSection />
    </div>
  );
}