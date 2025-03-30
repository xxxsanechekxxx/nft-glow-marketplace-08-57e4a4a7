
import { Wallet, Star, Shield, ArrowRight, Landmark, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    title: "Create Your Account",
    description: "Sign up and set up your profile to begin your NFT journey with PureNFT.",
    icon: User,
    color: "from-blue-500 to-cyan-400"
  },
  {
    title: "Connect Wallet",
    description: "Connect your crypto wallet to securely buy, sell and manage your digital assets.",
    icon: Wallet,
    color: "from-purple-500 to-indigo-500"
  },
  {
    title: "Discover NFTs",
    description: "Browse through our curated collection of unique digital assets from top creators.",
    icon: Star,
    color: "from-amber-500 to-orange-400"
  },
  {
    title: "Make Transactions",
    description: "Buy, sell, or trade NFTs with confidence using our secure blockchain technology.",
    icon: Shield,
    color: "from-emerald-500 to-green-400"
  },
  {
    title: "Manage Portfolio",
    description: "Track your digital asset performance and manage your growing NFT collection.",
    icon: Landmark,
    color: "from-rose-500 to-pink-500"
  },
  {
    title: "Connect & Earn",
    description: "Join our community, connect with other collectors, and earn rewards.",
    icon: ArrowRight,
    color: "from-fuchsia-500 to-purple-400"
  }
];

export const HowItWorksSection = () => {
  return (
    <div className="py-32 bg-background/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-purple-500/5 to-pink-500/5"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] animate-[pulse_10s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px] animate-[pulse_12s_ease-in-out_infinite] delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500 drop-shadow-lg">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Follow these simple steps to start your journey in the world of digital collectibles
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="p-8 rounded-2xl bg-background/30 backdrop-blur-xl border border-primary/10 hover:border-primary/30 transition-all duration-700 hover:scale-[1.03] group relative overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative z-10">
                <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${step.color} p-0.5 mb-8 group-hover:scale-105 transition-transform duration-700 shadow-lg`}>
                  <div className="w-full h-full rounded-xl bg-background/90 backdrop-blur-xl flex items-center justify-center">
                    <step.icon className="w-10 h-10 text-white group-hover:rotate-6 transition-all duration-700" />
                  </div>
                </div>
                
                <div className="min-h-[60px] flex items-center justify-center">
                  <h3 className="text-2xl font-semibold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500">
                    {step.title}
                  </h3>
                </div>
                
                <p className="text-muted-foreground text-center text-base leading-relaxed mt-4 group-hover:text-muted-foreground/90 transition-colors duration-700">
                  {step.description}
                </p>
                
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/register">
            <Button 
              size="lg" 
              className="bg-primary/90 hover:bg-primary backdrop-blur-sm px-8 py-6 text-lg shadow-lg hover:shadow-primary/20 transition-all duration-700 group"
            >
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
