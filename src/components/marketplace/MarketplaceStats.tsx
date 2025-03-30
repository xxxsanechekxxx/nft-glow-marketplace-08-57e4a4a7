
import { Sparkles, TrendingUp, Clock } from "lucide-react";

const stats = [
  { label: "Total NFTs", value: "1,116,891", icon: Sparkles },
  { label: "Trending", value: "331,951 Sales", icon: TrendingUp },
  { label: "Latest Drop", value: "~2m ago", icon: Clock },
];

export const MarketplaceStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="relative group"
          style={{
            animationDelay: `${index * 200}ms`,
            opacity: 0,
            animation: "fadeIn 1s ease-out forwards",
          }}
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-700 group-hover:duration-200" />
          <div className="relative p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 group-hover:border-primary/20 shadow-lg group-hover:shadow-primary/10 transition-all duration-700 group-hover:translate-y-[-5px]">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20 shadow-inner">
                <stat.icon className="w-6 h-6 text-primary transition-all duration-700 group-hover:scale-110 group-hover:rotate-6" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-muted-foreground transition-colors duration-700 group-hover:text-primary/80">{stat.label}</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">{stat.value}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
