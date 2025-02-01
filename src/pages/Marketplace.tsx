import { useEffect, useState } from "react";
import { NFTCard } from "@/components/NFTCard";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

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
  const { data: nfts, isLoading, error } = useQuery({
    queryKey: ['nfts'],
    queryFn: fetchNFTs,
  });

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
    <div className="container mx-auto px-4 pt-24">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold mb-4">NFT Marketplace</h1>
        <p className="text-muted-foreground">
          Discover and collect extraordinary NFTs
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {nfts?.map((nft, index) => (
            <div
              key={nft.id}
              className="opacity-0 animate-[fadeIn_1.2s_ease-out_forwards]"
              style={{
                animationDelay: `${index * 0.25}s`,
              }}
            >
              <NFTCard {...nft} />
            </div>
          ))}
        </div>
      )}

      <div ref={ref} className="w-full flex justify-center py-8" />
    </div>
  );
};

export default Marketplace;