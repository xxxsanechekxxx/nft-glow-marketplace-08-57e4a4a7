import { Users, TrendingUp, Star } from "lucide-react";

const stats = [
  { label: "Active Users", value: "50K+", icon: Users },
  { label: "Total Volume", value: "$100M+", icon: TrendingUp },
  { label: "NFTs Created", value: "1M+", icon: Star },
];

export const StatsSection = () => {
  return (
    <div className="py-16 bg-secondary/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} 
              className="text-center p-8 rounded-xl bg-background/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:transform hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <stat.icon className="w-10 h-10 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 mb-2">{stat.value}</div>
              <div className="text-muted-foreground group-hover:text-primary/80 transition-colors">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};