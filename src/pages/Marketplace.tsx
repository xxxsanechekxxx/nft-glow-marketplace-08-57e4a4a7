import { useEffect, useState } from "react";
import { NFTCard } from "@/components/NFTCard";
import { useInView } from "react-intersection-observer";
import { Loader2, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";

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
  const { ref, inView } = useInView();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: nfts, isLoading, error } = useQuery({
    queryKey: ['nfts'],
    queryFn: fetchNFTs,
  });

  const filteredNFTs = nfts?.filter(nft => 
    nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nft.creator.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="container mx-auto px-4 pt-24 min-h-screen">
      <div className="text-center mb-12 animate-fade-in space-y-6">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-transparent bg-clip-text">
          NFT Marketplace
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Discover and collect extraordinary NFTs from talented creators around the world
        </p>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <Input
            type="text"
            placeholder="Search by name or creator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNFTs?.map((nft, index) => (
            <div
              key={nft.id}
              className="opacity-0 animate-[fadeIn_1.2s_ease-out_forwards]"
              style={{
                animationDelay: `${index * 0.15}s`,
              }}
            >
              <NFTCard {...nft} />
            </div>
          ))}
        </div>
      )}

      {filteredNFTs?.length === 0 && !isLoading && (
        <div className="text-center text-muted-foreground py-12">
          No NFTs found matching your search criteria.
        </div>
      )}

      <div ref={ref} className="w-full flex justify-center py-8" />
    </div>
  );
};

export default Marketplace;