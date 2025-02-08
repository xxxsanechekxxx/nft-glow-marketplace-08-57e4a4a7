
import { Users, TrendingUp, Star } from "lucide-react";

const stats = [
  { label: "Active Users", value: "50K+", icon: Users },
  { label: "Total Volume", value: "$100M+", icon: TrendingUp },
  { label: "NFTs Created", value: "1M+", icon: Star },
];

export const StatsSection = () => {
  return (
    <div className="py-24 bg-secondary/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-purple-500/5 to-pink-500/5"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] animate-[pulse_6s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[150px] animate-[pulse_8s_ease-in-out_infinite] delay-700"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center p-10 rounded-2xl bg-background/30 backdrop-blur-xl border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:scale-105 group relative overflow-hidden animate-fade-in hover:shadow-xl hover:shadow-primary/5"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:bg-primary/20">
                  <stat.icon className="w-10 h-10 text-primary group-hover:rotate-12 transition-all duration-500" />
                </div>
                <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500 mb-4 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-lg text-muted-foreground group-hover:text-primary/80 transition-colors duration-500 font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
