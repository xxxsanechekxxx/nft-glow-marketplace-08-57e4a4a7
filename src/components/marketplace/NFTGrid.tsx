
import { NFTCard } from "@/components/NFTCard";
import { Loader2, Search, Store } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NFT {
  id: string;
  name: string;
  image: string;
  price: string;
  creator: string;
  created_at: string;
  owner_id?: string | null;
  for_sale?: boolean;
}

interface NFTGridProps {
  nfts: NFT[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  lastElementRef: (node?: Element | null) => void;
}

export const NFTGrid = ({
  nfts,
  isLoading,
  isFetchingNextPage,
  lastElementRef,
}: NFTGridProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
        <div className="relative">
          <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-xl animate-pulse" />
          <Loader2 className="h-12 w-12 animate-[spin_2s_linear_infinite] text-primary relative" />
        </div>
        <p className="text-xl text-muted-foreground/70 animate-pulse">Loading NFTs...</p>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="text-center py-20 space-y-6 animate-fade-in">
        <div className="relative inline-block mx-auto">
          <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-xl" />
          <Store className="w-20 h-20 text-muted-foreground/50" />
        </div>
        <div>
          <p className="text-3xl font-semibold text-white mb-3">No NFTs Found</p>
          <p className="text-xl text-muted-foreground/70 max-w-md mx-auto">Try adjusting your search criteria or check back later for new listings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-purple-500/5 to-pink-500/5 rounded-xl blur-2xl" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>
      
      <ScrollArea className="h-[calc(100vh-400px)] min-h-[500px] rounded-xl backdrop-blur-sm border border-primary/20 shadow-[0_0_25px_rgba(0,0,0,0.2)] relative">
        <div className="p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 marketplace-nft-grid">
            {nfts.map((nft, index) => (
              <div
                key={nft.id}
                className="opacity-0 animate-[fadeIn_1s_ease-out_forwards] group"
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                <div className="relative transition-transform duration-700 group-hover:translate-y-[-8px] group-hover:scale-[1.03]">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <NFTCard {...nft} for_sale={nft.for_sale} />
                </div>
              </div>
            ))}
          </div>

          {isFetchingNextPage && (
            <div className="flex justify-center py-12">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-md animate-pulse" />
                <Loader2 className="h-8 w-8 animate-[spin_2s_linear_infinite] text-primary relative" />
              </div>
            </div>
          )}

          <div ref={lastElementRef} className="w-full h-20" />
        </div>
      </ScrollArea>
    </div>
  );
};
