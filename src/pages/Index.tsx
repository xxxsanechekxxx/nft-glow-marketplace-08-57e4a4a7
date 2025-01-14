import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Zap, Trophy, Wallet } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const heroRef = useRef(null);
  const benefitsRef = useRef(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Clear any existing ScrollTrigger instances
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    // Hero section animation
    gsap.fromTo(heroRef.current,
      { 
        opacity: 0, 
        y: 100 
      },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1,
        ease: "power3.out"
      }
    );

    // Benefits heading animation
    gsap.fromTo(benefitsRef.current,
      { 
        opacity: 0, 
        y: 50 
      },
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

    // Cards stagger animation
    gsap.fromTo(cardsRef.current,
      { 
        opacity: 0, 
        y: 50 
      },
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

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center" ref={heroRef}>
        <div className="absolute inset-0 hero-gradient opacity-10"></div>
        <div className="container mx-auto px-4 pt-16">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Discover, collect, and sell extraordinary NFTs
            </h1>
            <p className="text-xl text-muted-foreground">
              NFTverse is the world's first and largest NFT marketplace
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/marketplace">Explore</Link>
              </Button>
              <Button variant="outline" size="lg">
                Create
              </Button>
            </div>
          </div>
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
            {/* Security */}
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

            {/* Speed */}
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

            {/* Exclusive */}
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

            {/* Low Fees */}
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