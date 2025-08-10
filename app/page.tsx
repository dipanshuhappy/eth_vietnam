'use client'
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Features from "@/components/home/features";
import HowItWorks from "@/components/home/how-it-works";
import UseCases from "@/components/home/use-cases";
import Footer from "@/components/layout/footer";
import { ArrowRight, Rocket, Info } from "lucide-react";
import { useState, useEffect } from "react";
import Header from "@/components/layout/header";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useFarcasterMiniApp } from "@/hooks/use-farcaster-miniapp"

export default function Home() {
  const { isInitialized, isMiniApp, error } = useFarcasterMiniApp();
  const [isHovered, setIsHovered] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  useEffect(() => {
    // Add Farcaster Mini App embed metadata
    const addFarcasterMetadata = () => {
      const miniappData = {
        version: "1",
        imageUrl: `${window.location.origin}/trust_hero.svg`,
        button: {
          title: "Launch Trust Protocol",
          action: {
            type: "launch_miniapp",
            name: "Trust Protocol",
            url: window.location.origin,
            splashImageUrl: `${window.location.origin}/trust_hero.svg`,
            splashBackgroundColor: "#cdffd8"
          }
        }
      };

      // Remove existing meta tag if it exists
      const existingMeta = document.querySelector('meta[property="fc:miniapp"]');
      if (existingMeta) {
        existingMeta.remove();
      }

      // Add new meta tag
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'fc:miniapp');
      meta.setAttribute('content', JSON.stringify(miniappData));
      document.head.appendChild(meta);
    };

    addFarcasterMetadata();
  }, []);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-r from-[#cdffd8] to-[#94b9ff] z-10 relative overflow-hidden">
        <motion.div
          style={{ opacity }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:block"
        >
          <div className="animate-bounce flex flex-col items-center">
            <span className="text-sm text-muted-foreground">Scroll to explore</span>
            <div className="w-6 h-6 border-2 border-primary rounded-full animate-spin" />
          </div>
        </motion.div>

        <Header />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center py-12 md:py-20 lg:py-12 space-y-6 md:space-y-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full flex items-center justify-center"
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-full max-w-[700px] md:max-w-[700px] lg:max-w-[800px]"
              >
                <Image
                  src="/trust_hero.svg"
                  width={600}
                  height={600}
                  alt="Trust Protocol"
                  className="width-[60%] mx-auto drop-shadow-2xl"
                  priority
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="px-2 sm:px-0"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3 md:mb-4 flex flex-wrap justify-center items-center gap-2">
                <span className="text-primary">
                  Programmable Onchain Trust Primitive
                </span>
                <Tooltip>
                  <TooltipTrigger className="shrink-0">
                    <Info className="w-5 h-5 md:w-6 md:h-6 text-primary/80 hover:text-primary cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-background/90 backdrop-blur-sm max-w-[260px] text-center">
                    <p className="text-sm">Trust primitive enabling decentralized reputation management</p>
                  </TooltipContent>
                </Tooltip>
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
                Trust protocol is an open-source layer zero for decentralized trust infrastructure
              </p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center"
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              <Button
                asChild
                className="group transform transition-all text-lg md:text-base px-6 py-5 md:px-8 md:py-6"
              >
                <Link
                  href="/dashboard"
                  className="text-white flex items-center gap-2"
                >
                  <Rocket className={cn(
                    "w-5 h-5 transition-transform",
                    isHovered ? "rotate-45" : ""
                  )} />
                  <span>Launch App</span>
                  <ArrowRight className={cn(
                    "w-5 h-5 transition-all",
                    isHovered ? "translate-x-1" : ""
                  )} />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Sections with Scroll Animations */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="px-4 sm:px-0"
          >
            <Features />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="px-4 sm:px-0"
          >
            <HowItWorks />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="px-4 sm:px-0"
          >
            <UseCases />
          </motion.div>
        </div>

        <Footer />
      </div>
    </TooltipProvider>
  );
}
