
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Rocket, Star, Shield, CheckCircle2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const HeroSection = () => {
  const isMobile = useIsMobile();

  return (
    <div className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81')] bg-cover bg-center bg-no-repeat opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 animate-gradient"></div>
      
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[150px] animate-[pulse_6s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-[150px] animate-[pulse_8s_ease-in-out_infinite] delay-1000"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-[150px] animate-[pulse_7s_ease-in-out_infinite] delay-500"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-4 md:space-y-8 pt-16 md:pt-0">
          <div className="inline-block animate-[bounce_3s_ease-in-out_infinite] bg-primary/20 backdrop-blur-sm rounded-full px-3 py-1.5 md:px-6 md:py-2 text-xs md:text-sm mb-4 md:mb-8 flex items-center gap-2 border border-primary/20 shadow-lg hover:bg-primary/30 transition-colors duration-500">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-primary animate-pulse" /> 
            <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-500 bg-clip-text text-transparent font-semibold">
              Welcome to the Future of Digital Art
            </span>
          </div>

          <div className="min-h-[80px] md:min-h-[100px] flex items-center justify-center">
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500 animate-fade-in drop-shadow-2xl py-2 md:py-6">
              Discover, collect, and sell extraordinary NFTs
            </h1>
          </div>

          <p className="text-base md:text-xl lg:text-2xl text-muted-foreground/90 animate-fade-in backdrop-blur-sm max-w-2xl mx-auto leading-relaxed px-4">
            PureNFT is the world's first and largest NFT marketplace with unique digital assets waiting to be discovered
          </p>
          
          {/* New trust indicators above CTA */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 pt-3 md:pt-6 animate-fade-in">
            <div className="flex items-center gap-1 md:gap-2">
              <Shield className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              <span className="text-xs md:text-sm text-muted-foreground/90">100% Secure Payments</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              <span className="text-xs md:text-sm text-muted-foreground/90">Verified Artists</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <Star className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              <span className="text-xs md:text-sm text-muted-foreground/90">5-Star Support</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 animate-fade-in pt-4 md:pt-8">
            <Link 
              to="/marketplace" 
              className="group relative overflow-hidden"
            >
              <Button 
                size={isMobile ? "default" : "lg"} 
                className="bg-primary/90 hover:bg-primary backdrop-blur-sm md:h-14 px-5 md:px-8 text-sm md:text-lg shadow-lg hover:shadow-primary/20 transition-all duration-700"
              >
                <Rocket className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:rotate-12 transition-transform duration-700" />
                <span className="relative z-10 transition-all duration-700 group-hover:scale-105 group-hover:font-semibold group-active:scale-95">Explore NFTs</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              </Button>
            </Link>
          </div>

          <div className="pt-8 md:pt-20 flex justify-center gap-6 md:gap-10 animate-fade-in">
            <div className="text-center space-y-0.5 md:space-y-1">
              <p className="text-xl md:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">50K+</p>
              <p className="text-xs md:text-sm text-muted-foreground">Active Users</p>
            </div>
            <div className="h-8 md:h-10 w-px bg-gradient-to-b from-primary/5 to-primary/30"></div>
            <div className="text-center space-y-0.5 md:space-y-1">
              <p className="text-xl md:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">$100M+</p>
              <p className="text-xs md:text-sm text-muted-foreground">Trading Volume</p>
            </div>
            <div className="h-8 md:h-10 w-px bg-gradient-to-b from-primary/5 to-primary/30"></div>
            <div className="text-center space-y-0.5 md:space-y-1">
              <p className="text-xl md:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">1M+</p>
              <p className="text-xs md:text-sm text-muted-foreground">NFTs Created</p>
            </div>
          </div>

          {/* New trust badges */}
          <div className="pt-6 md:pt-8 flex flex-wrap justify-center gap-2 md:gap-6 animate-fade-in">
            <div className="bg-background/30 backdrop-blur-sm border border-primary/10 rounded-full px-3 py-1 md:px-4 md:py-1 flex items-center gap-1 md:gap-2">
              <Shield className="w-3 h-3 md:w-4 md:h-4 text-primary" />
              <span className="text-[10px] md:text-xs font-medium">Escrow Protection</span>
            </div>
            <div className="bg-background/30 backdrop-blur-sm border border-primary/10 rounded-full px-3 py-1 md:px-4 md:py-1 flex items-center gap-1 md:gap-2">
              <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-primary" />
              <span className="text-[10px] md:text-xs font-medium">Verified Smart Contracts</span>
            </div>
            <div className="bg-background/30 backdrop-blur-sm border border-primary/10 rounded-full px-3 py-1 md:px-4 md:py-1 flex items-center gap-1 md:gap-2">
              <Star className="w-3 h-3 md:w-4 md:h-4 text-primary" />
              <span className="text-[10px] md:text-xs font-medium">Trusted by 50,000+ Users</span>
            </div>
          </div>

          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-t from-primary/10 to-transparent blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};
