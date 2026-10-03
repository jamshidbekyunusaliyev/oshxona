import { IntroTeaser } from "@/components/sections/intro-teaser";
import { IntroLoader } from "@/components/ui/intro-loader";

export default function Home() {
  return (
    <>
      <IntroLoader />
      <IntroTeaser />
    </>
  );
}