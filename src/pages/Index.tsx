import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 hero-gradient opacity-10"></div>
        <div className="container mx-auto px-4 pt-16">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
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
    </div>
  );
};

export default Index;