
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Rocket } from "lucide-react";

export const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
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
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block animate-[bounce_3s_ease-in-out_infinite] bg-primary/20 backdrop-blur-sm rounded-full px-6 py-2 text-sm mb-8 flex items-center gap-2 border border-primary/20 shadow-lg hover:bg-primary/30 transition-colors duration-500">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" /> 
            <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-500 bg-clip-text text-transparent font-semibold">
              Welcome to the Future of Digital Art
            </span>
          </div>

          <div className="min-h-[100px] flex items-center justify-center">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500 animate-fade-in drop-shadow-2xl py-6">
              Discover, collect, and sell extraordinary NFTs
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-muted-foreground/90 animate-fade-in backdrop-blur-sm max-w-2xl mx-auto leading-relaxed">
            PureNFT is the world's first and largest NFT marketplace with unique digital assets waiting to be discovered
          </p>

          <div className="flex justify-center animate-fade-in pt-8">
            <Link 
              to="/marketplace" 
              className="group relative overflow-hidden"
            >
              <Button 
                size="lg" 
                className="bg-primary/90 hover:bg-primary backdrop-blur-sm h-14 px-8 text-lg shadow-lg hover:shadow-primary/20 transition-all duration-700"
              >
                <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform duration-700" />
                <span className="relative z-10 transition-all duration-700 group-hover:scale-105 group-hover:font-semibold group-active:scale-95">Explore NFTs</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              </Button>
            </Link>
          </div>

          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-t from-primary/10 to-transparent blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};
