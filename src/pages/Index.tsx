
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { NFTCard } from "@/components/NFTCard";

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  useEffect(() => {
    document.title = "PureNFT - Home";
    return () => {
      document.title = "PureNFT";
    };
  }, []);

  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuredRef = useRef(null);
  const howItWorksRef = useRef(null);

  const { data: featuredNFTs } = useQuery({
    queryKey: ['featured-nfts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nfts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    gsap.fromTo(heroRef.current,
      { opacity: 0, y: 100 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1.5, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top center",
          end: "bottom center",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(statsRef.current,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
          end: "bottom center",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(featuredRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: featuredRef.current,
          start: "top 75%",
          end: "bottom center",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(howItWorksRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: howItWorksRef.current,
          start: "top 75%",
          end: "bottom center",
          toggleActions: "play none none reverse"
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen">
      <div ref={heroRef} className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background/80 pointer-events-none"></div>
        <HeroSection />
      </div>

      <div ref={howItWorksRef} className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>
        <HowItWorksSection />
      </div>

      <div ref={statsRef} className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-primary/5 to-pink-500/5 pointer-events-none"></div>
        <StatsSection />
      </div>

      <div ref={featuredRef} className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] animate-pulse delay-700"></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500 animate-fade-in">
            Featured Collections
          </h2>
          
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {featuredNFTs?.map((nft) => (
                <CarouselItem key={nft.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <NFTCard {...nft} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary/20 transition-colors duration-300" />
            <CarouselNext className="bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary/20 transition-colors duration-300" />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Index;
