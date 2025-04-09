
import { Sparkles, TrendingUp, Clock, Users } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

const stats = [
  { label: "Total NFTs", value: "1,116,891", icon: Sparkles, color: "from-primary/20 to-purple-500/20" },
  { label: "Trending", value: "331,951 Sales", icon: TrendingUp, color: "from-purple-500/20 to-pink-500/20" },
  { label: "Latest Drop", value: "~2m ago", icon: Clock, color: "from-pink-500/20 to-primary/20" },
  { label: "Active Users", value: "24,583", icon: Users, color: "from-purple-500/20 to-primary/20" },
];

export const MarketplaceStats = () => {
  const isMobile = useIsMobile();
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 18
      }
    }
  };
  
  return (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto px-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="relative group"
          variants={item}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-700`} />
          <div className="relative p-2.5 md:p-4 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 group-hover:border-primary/20 shadow-lg group-hover:shadow-primary/5 transition-all duration-500 h-full">
            <div className="flex items-center justify-between mb-1.5 md:mb-2">
              <p className="text-xs md:text-sm font-medium text-muted-foreground/80 transition-colors duration-500 group-hover:text-primary/80">{stat.label}</p>
              <stat.icon className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-primary/70 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:text-primary`} />
            </div>
            <p className="text-base md:text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent group-hover:from-white group-hover:to-primary/90 transition-all duration-700">{stat.value}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
