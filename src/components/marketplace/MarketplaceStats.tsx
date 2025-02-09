
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
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          <div className="relative p-6 rounded-xl bg-background/60 backdrop-blur-sm border border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-700">
            <div className="flex items-center justify-center space-x-4">
              <stat.icon className="w-8 h-8 text-primary transition-all duration-700 group-hover:scale-110 group-hover:rotate-6" />
              <div className="text-left">
                <p className="text-sm font-medium text-muted-foreground transition-colors duration-700 group-hover:text-primary/80">{stat.label}</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">{stat.value}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
