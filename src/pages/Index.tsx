import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Zap, Trophy, Wallet, TrendingUp, Users, Star, ArrowRight, Sparkles, MessageSquare, Heart, Award, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

const steps = [
  {
    title: "Connect Your Wallet",
    description: "Link your crypto wallet to start buying and selling NFTs securely on our platform.",
    icon: Wallet
  },
  {
    title: "Choose Your NFTs",
    description: "Browse through our curated collection of unique digital assets and select your favorites.",
    icon: Star
  },
  {
    title: "Make Transactions",
    description: "Buy, sell, or trade NFTs with confidence using our secure blockchain technology.",
    icon: Shield
  }
];

const Index = () => {
  const heroRef = useRef(null);
  const benefitsRef = useRef(null);
  const statsRef = useRef(null);
  const featuredRef = useRef(null);
  const howItWorksRef = useRef(null);
  const testimonialsRef = useRef(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);

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

    gsap.fromTo(howItWorksRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: howItWorksRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(testimonialsRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: testimonialsRef.current,
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

  const testimonials = [
    {
      name: "Alex Thompson",
      role: "Digital Artist",
      content: "NFTverse transformed how I share my art with the world. The platform's ease of use and community engagement is unmatched.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      isFormatted: true
    },
    {
      name: "Sarah Chen",
      role: "Collector",
      content: "The security and transparency of NFTverse give me confidence in my digital investments. Best NFT marketplace out there!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      isFormatted: true
    },
    {
      name: "Michael Roberts",
      role: "Crypto Enthusiast",
      content: "The community here is incredible. I've discovered amazing artists and made valuable connections through NFTverse.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      isFormatted: true
    },
    {
      name: "crypto_lover88",
      content: "very nice thank you nftverse",
      isFormatted: false
    },
    {
      name: "NFTHunter",
      content: "bitoingNFT coming soon to this site ?",
      isFormatted: false
    },
    {
      name: "new_collector",
      content: "found this on ad from my mail bought one waiting to raise up i will change it if something went wrong",
      isFormatted: false
    },
    {
      name: "digital_dreamer",
      content: "best platform for nft trading no cap",
      isFormatted: false
    },
    {
      name: "art_enthusiast",
      content: "just got my first nft here super excited",
      isFormatted: false
    },
    {
      name: "nft_wizard",
      content: "prices are good comparing to other marketplaces",
      isFormatted: false
    },
    {
      name: "crypto_newbie",
      content: "how do i transfer my nft to wallet help pls",
      isFormatted: false
    },
    {
      name: "future_collector",
      content: "saving money to buy my first nft here",
      isFormatted: false
    },
    {
      name: "meta_trader",
      content: "nice collection but need more categories",
      isFormatted: false
    },
    {
      name: "pixel_master",
      content: "when new drops coming",
      isFormatted: false
    }
  ];

  const visibleTestimonials = showAllTestimonials ? testimonials : testimonials.slice(0, 3);

  return (
    <div className="min-h-screen">
      <div className="relative min-h-screen flex items-center overflow-hidden" ref={heroRef}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=1920')] bg-cover bg-center bg-no-repeat opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 animate-gradient"></div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-block animate-bounce bg-primary/20 backdrop-blur-sm rounded-full px-4 py-1 text-sm mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Welcome to the Future of Digital Art
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-400 animate-fade-in">
              Discover, collect, and sell extraordinary NFTs
            </h1>
            <p className="text-xl text-muted-foreground animate-fade-in backdrop-blur-sm">
              NFTverse is the world's first and largest NFT marketplace
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button asChild size="lg" className="bg-primary/90 hover:bg-primary/100 backdrop-blur-sm group relative overflow-hidden">
                <Link to="/marketplace" className="flex items-center gap-2">
                  <span className="relative z-10">Explore</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="backdrop-blur-sm border-primary/20 hover:bg-primary/10 group">
                Create
                <Star className="w-4 h-4 ml-2 group-hover:rotate-45 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-24 bg-background/50 relative overflow-hidden" ref={howItWorksRef}>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="container mx-auto px-4 relative">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} 
                className="p-8 rounded-xl bg-background/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:transform hover:scale-105 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <step.icon className="w-12 h-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-center mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-center">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-16 bg-secondary/5 relative overflow-hidden" ref={statsRef}>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} 
                className="text-center p-8 rounded-xl bg-background/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:transform hover:scale-105 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <stat.icon className="w-10 h-10 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 mb-2">{stat.value}</div>
                <div className="text-muted-foreground group-hover:text-primary/80 transition-colors">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-24 bg-background relative overflow-hidden" ref={featuredRef}>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="container mx-auto px-4 relative">
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
            <CarouselPrevious className="bg-background/80 backdrop-blur-sm border-primary/20" />
            <CarouselNext className="bg-background/80 backdrop-blur-sm border-primary/20" />
          </Carousel>
        </div>
      </div>

      <div className="py-24 bg-secondary/5 relative overflow-hidden" ref={testimonialsRef}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920')] bg-cover bg-fixed opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            What Our Users Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleTestimonials.map((testimonial, index) => (
              <div key={index} 
                className={`p-8 rounded-xl bg-background/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden ${
                  testimonial.isFormatted ? "hover:transform hover:-translate-y-2" : ""
                }`}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {testimonial.isFormatted ? (
                  <>
                    <div className="flex items-center mb-6">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                      <div>
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <MessageSquare className="w-8 h-8 text-primary/20 mb-4" />
                  </>
                ) : (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">@{testimonial.name}</p>
                  </div>
                )}
                <p className={`${testimonial.isFormatted ? "text-muted-foreground italic" : "text-sm"}`}>
                  {testimonial.content}
                </p>
              </div>
            ))}
          </div>

          {testimonials.length > 3 && (
            <div className="mt-12 text-center">
              <Button
                variant="outline"
                onClick={() => setShowAllTestimonials(!showAllTestimonials)}
                className="group"
              >
                {showAllTestimonials ? (
                  <>Show Less <ChevronUp className="ml-2 w-4 h-4 group-hover:-translate-y-1 transition-transform" /></>
                ) : (
                  <>Show More <ChevronDown className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform" /></>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
