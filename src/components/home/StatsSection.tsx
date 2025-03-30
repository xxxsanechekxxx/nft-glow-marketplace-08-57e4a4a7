
import { Users, TrendingUp, Star, Clock, Shield, Globe } from "lucide-react";

const stats = [
  { 
    label: "Active Users", 
    value: "50K+", 
    icon: Users,
    description: "Join our growing community of NFT enthusiasts from around the world."
  },
  { 
    label: "Total Volume", 
    value: "$100M+", 
    icon: TrendingUp,
    description: "Traders have exchanged millions in value across our secure platform."
  },
  { 
    label: "NFTs Created", 
    value: "1M+", 
    icon: Star,
    description: "Artists and creators have minted over a million unique digital collectibles."
  },
  { 
    label: "Platform Uptime", 
    value: "99.9%", 
    icon: Clock,
    description: "Our reliable infrastructure ensures your assets are always accessible."
  },
  { 
    label: "Secure Transactions", 
    value: "100%", 
    icon: Shield,
    description: "Every transaction is protected by advanced blockchain security."
  },
  { 
    label: "Global Reach", 
    value: "190+", 
    icon: Globe,
    description: "Connect with buyers and sellers from countries around the world."
  }
];

export const StatsSection = () => {
  return (
    <div className="py-24 bg-secondary/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-purple-500/5 to-pink-500/5"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[150px] animate-[pulse_10s_ease-in-out_infinite] delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500">
            Platform Statistics
          </h2>
          <p className="text-muted-foreground text-lg">
            PureNFT continues to grow as the leading marketplace for digital art and collectibles
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center p-10 rounded-2xl bg-background/30 backdrop-blur-xl border border-primary/10 hover:border-primary/30 transition-all duration-700 hover:scale-[1.03] group relative overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10">
                <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-700 group-hover:bg-primary/20">
                  <stat.icon className="w-10 h-10 text-primary group-hover:rotate-6 transition-all duration-700" />
                </div>
                <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500 mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-lg text-foreground font-medium mb-3 transition-colors duration-700">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-500">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
