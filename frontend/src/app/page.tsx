import HeroSection from '@/components/home/HeroSection';
import NewsVerifier from '@/components/home/NewsVerifier';
import FeaturesSection from '@/components/home/FeaturesSection';
import RecentNews from '@/components/home/RecentNews';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <NewsVerifier />
      <RecentNews />
    </div>
  );
}