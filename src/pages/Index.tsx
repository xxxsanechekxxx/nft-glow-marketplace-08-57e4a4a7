import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Zap, Trophy, Wallet, TrendingUp, Users, Star } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NFT_DATA } from "@/data/nfts";
import { NFTCard } from "@/components/NFTCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const heroRef = useRef(null);
  const benefitsRef = useRef(null);
  const statsRef = useRef(null);
  const featuredRef = useRef(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const backgroundNFTs = NFT_DATA.slice(0, 6);

  useEffect(() => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    gsap.fromTo(heroRef.current,
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    gsap.fromTo(benefitsRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: benefitsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(cardsRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.8,
        scrollTrigger: {
          trigger: cardsRef.current[0],
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(statsRef.current,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(featuredRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: featuredRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const stats = [
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Total Volume", value: "$100M+", icon: TrendingUp },
    { label: "NFTs Created", value: "1M+", icon: Star },
  ];

  const featuredNFTs = NFT_DATA.slice(0, 5);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center overflow-hidden" ref={heroRef}>
        {/* Background NFT Carousel */}
        <div className="absolute inset-0 w-full h-full">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
              containScroll: false,
            }}
            className="w-full h-full"
          >
            <CarouselContent className="h-full">
              {backgroundNFTs.map((nft) => (
                <CarouselItem key={nft.id} className="basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4 h-full">
                  <div className="w-full h-full">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        
        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 animate-gradient"></div>
        
        <div className="container mx-auto px-4 pt-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 animate-fade-in">
              Discover, collect, and sell extraordinary NFTs
            </h1>
            <p className="text-xl text-muted-foreground animate-fade-in">
              NFTverse is the world's first and largest NFT marketplace
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button asChild size="lg" className="bg-primary/90 hover:bg-primary/100 backdrop-blur-sm">
                <Link to="/marketplace">Explore</Link>
              </Button>
              <Button variant="outline" size="lg" className="backdrop-blur-sm border-primary/20 hover:bg-primary/10">
                Create
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-secondary/5" ref={statsRef}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-300">
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-primary" />
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured NFTs Section */}
      <div className="py-24 bg-background" ref={featuredRef}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            Featured Collections
          </h2>
          
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {featuredNFTs.map((nft) => (
                <CarouselItem key={nft.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <NFTCard {...nft} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>

      {/* Platform Benefits Section */}
      <div className="py-24 bg-secondary/5">
        <div className="container mx-auto px-4">
          <h2 
            ref={benefitsRef}
            className="text-3xl md:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400"
          >
            Why Choose NFTverse?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div 
              ref={el => cardsRef.current[0] = el}
              className="p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-muted-foreground">
                Advanced security measures to protect your digital assets and transactions
              </p>
            </div>

            <div 
              ref={el => cardsRef.current[1] = el}
              className="p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Quick transactions and seamless trading experience on the Ethereum network
              </p>
            </div>

            <div 
              ref={el => cardsRef.current[2] = el}
              className="p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Trophy className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Exclusive NFTs</h3>
              <p className="text-muted-foreground">
                Access to unique and rare digital collectibles from top creators
              </p>
            </div>

            <div 
              ref={el => cardsRef.current[3] = el}
              className="p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Wallet className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Low Fees</h3>
              <p className="text-muted-foreground">
                Competitive transaction fees to maximize your trading profits
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;