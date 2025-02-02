import { Wallet, Star, Shield } from "lucide-react";

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

export const HowItWorksSection = () => {
  return (
    <div className="py-24 bg-background/50 relative overflow-hidden">
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
  );
};