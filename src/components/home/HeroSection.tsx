
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Sparkles, Rocket } from "lucide-react";

export const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81')] bg-cover bg-center bg-no-repeat opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 animate-gradient"></div>
      
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-56 h-56 bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-pink-500/20 rounded-full blur-[100px] animate-pulse delay-500"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Enhanced badge with glass effect */}
          <div className="inline-block animate-bounce bg-primary/20 backdrop-blur-sm rounded-full px-6 py-2 text-sm mb-8 flex items-center gap-2 border border-primary/20 shadow-lg">
            <Sparkles className="w-4 h-4 text-primary" /> 
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Welcome to the Future of Digital Art
            </span>
          </div>

          {/* Enhanced heading with gradient and animation */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-400 animate-fade-in drop-shadow-2xl">
            Discover, collect, and sell extraordinary NFTs
          </h1>

          {/* Enhanced subheading with glass effect */}
          <p className="text-xl md:text-2xl text-muted-foreground animate-fade-in backdrop-blur-sm max-w-2xl mx-auto leading-relaxed">
            PureNFT is the world's first and largest NFT marketplace
          </p>

          {/* Enhanced buttons with glass effect and animations */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in pt-8">
            <Button 
              asChild 
              size="lg" 
              className="bg-primary hover:bg-primary/90 backdrop-blur-sm group relative overflow-hidden h-14 px-8 text-lg"
            >
              <Link to="/marketplace" className="flex items-center gap-3">
                <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="relative z-10">Explore NFTs</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            </Button>

            <Button 
              variant="outline" 
              size="lg" 
              className="backdrop-blur-sm border-primary/20 hover:bg-primary/10 group h-14 px-8 text-lg"
            >
              Create Collection
              <Star className="w-5 h-5 ml-2 group-hover:rotate-45 transition-transform text-primary" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
