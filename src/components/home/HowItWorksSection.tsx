
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
    <div className="py-32 bg-background/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 animate-fade-in">
          How It Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="p-8 rounded-2xl bg-background/30 backdrop-blur-xl border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:transform hover:scale-105 group relative overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>
                
                <h3 className="text-2xl font-semibold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground text-center text-lg leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
