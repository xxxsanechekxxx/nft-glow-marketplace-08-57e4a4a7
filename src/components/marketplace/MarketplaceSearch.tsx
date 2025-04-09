
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MarketplaceSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export const MarketplaceSearch = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
}: MarketplaceSearchProps) => {
  const isMobile = useIsMobile();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div 
      className="flex flex-col md:flex-row gap-3 md:gap-4 max-w-4xl mx-auto px-3 mb-4 md:mb-0"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <motion.div 
        className={cn(
          "flex-1 relative group",
          isFocused ? "z-10" : ""
        )}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className={cn(
          "absolute -inset-0.5 rounded-lg blur transition duration-300",
          isFocused 
            ? "bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-70" 
            : "bg-gradient-to-r from-primary/20 to-purple-500/20 opacity-60 group-hover:opacity-100"
        )} />
        
        <div className="relative">
          <Input
            type="text"
            placeholder={isMobile ? "Search NFTs..." : "Search by name or creator..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "pl-10 bg-black/30 backdrop-blur-sm border-white/10 text-white placeholder:text-muted-foreground h-12 transition-all duration-300",
              isFocused
                ? "border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20"
                : "hover:border-white/20 shadow-lg"
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <Search className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300",
            isFocused ? "text-primary" : "text-muted-foreground group-hover:text-primary/80"
          )} />
        </div>
      </motion.div>
      
      <motion.div 
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
      >
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger 
            className="w-full md:w-[200px] bg-black/30 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 shadow-lg h-12"
          >
            <div className="flex items-center">
              <SlidersHorizontal className="w-4 h-4 opacity-70 mr-2" />
              <SelectValue placeholder="Sort by" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-black/90 backdrop-blur-md border-primary/20 min-w-[200px]">
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>
    </motion.div>
  );
};
