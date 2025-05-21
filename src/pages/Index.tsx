
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { TrustIndicators } from "@/components/home/TrustIndicators";
import { Testimonials } from "@/components/home/Testimonials";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { NFTCard } from "@/components/NFTCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

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
  const trustRef = useRef(null);
  const testimonialsRef = useRef(null);

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
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 2, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top 80%",
          end: "bottom center",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(statsRef.current,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 85%",
          end: "bottom center",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(featuredRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: featuredRef.current,
          start: "top 80%",
          end: "bottom center",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(howItWorksRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: howItWorksRef.current,
          start: "top 80%",
          end: "bottom center",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(trustRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: trustRef.current,
          start: "top 80%",
          end: "bottom center",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(testimonialsRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: "top 80%",
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced animated background with multiple layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-purple-500/10 to-pink-500/10 -z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background/60 -z-10"></div>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[15%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[180px] animate-[pulse_10s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[30%] left-[10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] animate-[pulse_15s_ease-in-out_infinite] delay-1000"></div>
        <div className="absolute top-[40%] left-[30%] w-[800px] h-[800px] bg-pink-500/5 rounded-full blur-[200px] animate-[pulse_20s_ease-in-out_infinite] delay-500"></div>
      </div>

      <div ref={heroRef}>
        <HeroSection />
      </div>

      <div ref={howItWorksRef}>
        <HowItWorksSection />
      </div>
      
      <div ref={trustRef} className="relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/80 to-background/0 -z-10"></div>
        <TrustIndicators />
      </div>

      <div ref={statsRef} className="relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background/0 -z-10"></div>
        <StatsSection />
      </div>
      
      <div ref={testimonialsRef} className="relative z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-background/0 via-background/80 to-background/0 -z-10"></div>
        <Testimonials />
      </div>

      <div ref={featuredRef} className="py-24 bg-background/30 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-purple-500/10 to-pink-500/5"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-purple-400 animate-gradient bg-300% py-2">
                Featured Collections
              </h2>
              <p className="text-muted-foreground mt-2 max-w-md">
                Discover unique digital art from top creators around the world
              </p>
            </div>
            
            <Link to="/marketplace">
              <Button 
                variant="outline" 
                className="border-primary/20 hover:border-primary/50 backdrop-blur-sm hover:bg-primary/10 transition-all duration-500 group"
              >
                View All Collections 
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-xl blur opacity-75"></div>
            <div className="relative bg-background/20 backdrop-blur-xl rounded-xl border border-primary/20 p-8 shadow-lg shadow-primary/5">
              <Carousel className="w-full max-w-5xl mx-auto">
                <CarouselContent>
                  {featuredNFTs?.map((nft) => (
                    <CarouselItem key={nft.id} className="md:basis-1/2 lg:basis-1/3 p-1">
                      <div className="p-1 h-full">
                        <NFTCard {...nft} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary/20 transition-colors duration-300 -left-6 lg:-left-12" />
                <CarouselNext className="bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary/20 transition-colors duration-300 -right-6 lg:-right-12" />
              </Carousel>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link to="/marketplace" className="inline-block">
              <Button 
                size="lg" 
                className="relative overflow-hidden bg-primary/90 hover:bg-primary backdrop-blur-sm px-8 text-lg shadow-xl hover:shadow-primary/30 transition-all duration-700 group"
              >
                <span className="relative z-10">Explore Marketplace</span>
                <ArrowRight className="ml-2 w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
