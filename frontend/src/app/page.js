import Hero from "@/components/Hero";
import Feature from "@/components/Feature";
import Faqs from "@/components/Faqs";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0E1013] text-[#F5F3EE]">
      <Hero />
      <Feature />
      <Faqs />
    </div>
  );
}

