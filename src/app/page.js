'use client';

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import Timeline from "@/components/sections/Timeline";
import StartupShowcase from "@/components/sections/StartupShowcase";
import Mentors from "@/components/sections/Mentors";
import Hosts from "@/components/sections/Hosts";
import Panelist from "@/components/sections/Panelist";
import CountDown from "@/components/sections/CountDown";
import Footer from "@/components/Footer";
import { RegistrationProvider } from "@/contexts/RegistrationContext";
import RegistrationDialog from "@/components/RegistrationDialog";

export default function Home() {
  return (
    <RegistrationProvider>
      <div className="min-h-screen bg-black">
        <RegistrationDialog />
        <Navbar />
        <HeroSection />
        <AboutSection />
        <Timeline />
        <StartupShowcase />
        <Mentors />
        <Hosts />
        <Panelist />
        <CountDown />
        <Footer />
      </div>
    </RegistrationProvider>
  );
}
