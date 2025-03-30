
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  return (
    <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto opacity-0 animate-[fadeIn_1s_ease-out_forwards] animation-delay-500">
      <div className="flex-1 relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-700 group-hover:duration-200" />
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder="Search by name or creator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 backdrop-blur-sm border-white/10 focus:border-primary/50 shadow-lg transition-all duration-500 hover:border-white/20 hover:shadow-primary/10 text-white placeholder:text-muted-foreground/70 h-12"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/70 transition-colors duration-700 group-hover:text-primary" />
        </div>
      </div>
      
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-primary/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-700 group-hover:duration-200" />
        <div className="relative z-10">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-500 h-12 w-[220px] shadow-lg">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground/70 group-hover:text-primary transition-colors duration-500" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-[#0F0E24]/95 backdrop-blur-md border-primary/20 shadow-xl text-white">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
