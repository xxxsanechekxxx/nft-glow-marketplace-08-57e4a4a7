import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Sparkles } from "lucide-react";

export const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
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
            PureNFT is the world's first and largest NFT marketplace
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
  );
};