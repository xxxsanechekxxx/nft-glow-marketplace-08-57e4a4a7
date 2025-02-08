
import { useEffect, useState } from "react";
import { NFTCard } from "@/components/NFTCard";
import { useInView } from "react-intersection-observer";
import { Loader2, Search, Sparkles, TrendingUp, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useInfiniteQuery } from "@tanstack/react-query";
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
  created_at: string;
}

const ITEMS_PER_PAGE = 8;

const fetchNFTs = async ({ pageParam = 0 }) => {
  const from = pageParam * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const { data, error, count } = await supabase
    .from('nfts')
    .select('*', { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return { data, count, nextPage: to < (count || 0) ? pageParam + 1 : undefined };
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

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['nfts'],
    queryFn: fetchNFTs,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 300000,
    gcTime: 3600000,
  });

  const sortNFTs = (nftsToSort: NFT[]) => {
    switch (sortBy) {
      case "newest":
        return [...nftsToSort].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "oldest":
        return [...nftsToSort].sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case "price-asc":
        return [...nftsToSort].sort((a, b) => 
          parseFloat(a.price) - parseFloat(b.price)
        );
      case "price-desc":
        return [...nftsToSort].sort((a, b) => 
          parseFloat(b.price) - parseFloat(a.price)
        );
      default:
        return nftsToSort;
    }
  };

  const allNFTs = data?.pages.flatMap(page => page.data) || [];
  const filteredNFTs = allNFTs.filter(nft => 
    nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nft.creator.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sortedAndFilteredNFTs = filteredNFTs ? sortNFTs(filteredNFTs) : [];

  useEffect(() => {
    if (inView && !isLoading && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  const stats = [
    { label: "Total NFTs", value: "1,116,891", icon: Sparkles },
    { label: "Trending", value: "331,951 Sales", icon: TrendingUp },
    { label: "Latest Drop", value: "~2m ago", icon: Clock },
  ];

  if (error) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="text-center text-red-500">
          Error loading NFTs. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,hsl(var(--background))_0%,hsl(var(--background))_50%,rgba(123,97,255,0.05)_100%)]">
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-16 space-y-8">
          <div className="space-y-4 opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
            <h1 className="text-7xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-transparent bg-clip-text animate-[gradient_8s_linear_infinite] bg-[length:200%_200%] drop-shadow-sm">
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
          
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto opacity-0 animate-[fadeIn_1s_ease-out_forwards] animation-delay-500">
            <div className="flex-1 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by name or creator..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/80 backdrop-blur-sm border-primary/20 focus:border-primary shadow-lg transition-all duration-700 hover:shadow-primary/5"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-700 group-hover:text-primary" />
              </div>
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-background/80 backdrop-blur-sm border-primary/20 transition-all duration-700 hover:border-primary shadow-lg">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-md border-primary/20">
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
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-md animate-pulse" />
              <Loader2 className="h-8 w-8 animate-[spin_2s_linear_infinite] text-primary relative" />
            </div>
            <p className="text-muted-foreground animate-pulse">Loading NFTs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedAndFilteredNFTs?.map((nft, index) => (
              <div
                key={nft.id}
                className="opacity-0 animate-[fadeIn_1s_ease-out_forwards] hover:translate-y-[-4px] transition-transform duration-700"
                style={{
                  animationDelay: `${index * 200}ms`,
                }}
              >
                <NFTCard {...nft} />
              </div>
            ))}
          </div>
        )}

        {sortedAndFilteredNFTs.length === 0 && !isLoading && (
          <div className="text-center py-16 space-y-4 animate-fade-in">
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-md" />
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <p className="text-2xl font-semibold text-muted-foreground">No NFTs found</p>
            <p className="text-muted-foreground/60">Try adjusting your search criteria</p>
          </div>
        )}

        {isFetchingNextPage && (
          <div className="flex justify-center py-8">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-md animate-pulse" />
              <Loader2 className="h-8 w-8 animate-[spin_2s_linear_infinite] text-primary relative" />
            </div>
          </div>
        )}

        <div ref={ref} className="w-full h-20" />
      </div>
    </div>
  );
};

export default Marketplace;
