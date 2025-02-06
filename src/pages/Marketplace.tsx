import { useEffect, useState } from "react";
import { NFTCard } from "@/components/NFTCard";
import { useInView } from "react-intersection-observer";
import { Loader2, Search, Sparkles, TrendingUp, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NFT {
  id: string;
  name: string;
  image: string;
  price: string;
  creator: string;
}

const fetchNFTs = async () => {
  const { data, error } = await supabase
    .from('nfts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as NFT[];
};

const Marketplace = () => {
  useEffect(() => {
    document.title = "PureNFT - Marketplace";
    return () => {
      document.title = "PureNFT";
    };
  }, []);

  const { ref, inView } = useInView();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [displayLimit, setDisplayLimit] = useState(8);

  const { data: nfts, isLoading, error } = useQuery({
    queryKey: ['nfts'],
    queryFn: fetchNFTs,
    staleTime: 60000,
    retry: 1,
    refetchOnWindowFocus: false,
    gcTime: 300000, // Changed from cacheTime to gcTime
  });

  const filteredNFTs = nfts?.filter(nft => 
    nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nft.creator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedNFTs = filteredNFTs?.slice(0, displayLimit);

  useEffect(() => {
    if (inView && filteredNFTs && displayLimit < filteredNFTs.length) {
      setDisplayLimit(prev => prev + 8);
    }
  }, [inView, filteredNFTs, displayLimit]);

  const stats = [
    { label: "Total NFTs", value: "1116891", icon: Sparkles },
    { label: "Trending", value: "331951 Sales", icon: TrendingUp },
    { label: "Latest Drop", value: "~2m ago", icon: Clock },
  ];

  if (error) {
    console.error('Error fetching NFTs:', error);
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="text-center text-red-500">
          Error loading NFTs. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-16 animate-fade-in space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-transparent bg-clip-text animate-gradient bg-[length:200%_200%]">
              NFT Marketplace
            </h1>
            <p className="text-xl text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Discover and collect extraordinary NFTs from talented creators around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="p-6 rounded-xl bg-background/60 backdrop-blur-sm border border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="flex items-center justify-center space-x-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="flex-1 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <Input
                type="text"
                placeholder="Search by name or creator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="relative pl-10 bg-background/80 backdrop-blur-sm border-primary/20 focus:border-primary shadow-lg transition-all duration-300 hover:shadow-primary/5"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-background/80 backdrop-blur-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading NFTs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayedNFTs?.map((nft, index) => (
              <div
                key={nft.id}
                className="opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <NFTCard {...nft} />
              </div>
            ))}
          </div>
        )}

        {filteredNFTs?.length === 0 && !isLoading && (
          <div className="text-center py-16 space-y-4">
            <p className="text-2xl font-semibold text-muted-foreground">No NFTs found</p>
            <p className="text-muted-foreground/60">Try adjusting your search criteria</p>
          </div>
        )}

        <div ref={ref} className="w-full flex justify-center py-8" />
      </div>
    </div>
  );
};

export default Marketplace;
