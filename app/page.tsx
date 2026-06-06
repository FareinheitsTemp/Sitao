import SplashScreen from "@/components/home/SplashScreen";
import HeroSection from "@/components/home/HeroSection";
import FeatureScroll from "@/components/home/FeatureScroll";
import RatingsChart from "@/components/home/RatingsChart";
import InfoBlocks from "@/components/home/InfoBlocks";

export default function Home() {
  return (
    <>
      <SplashScreen />
      <HeroSection />
      <FeatureScroll />
      <RatingsChart />
      <InfoBlocks />
    </>
  );
}
