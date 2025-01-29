import { useEffect, useState } from "react";
import { NFTCard } from "@/components/NFTCard";
import { fetchNFTs } from "@/data/nfts";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";

const Marketplace = () => {
  const [nfts, setNfts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView();

  const loadMoreNFTs = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    const result = fetchNFTs(page);
    setNfts(prev => [...prev, ...result.nfts]);
    setHasMore(result.hasMore);
    setPage(prev => prev + 1);
    setLoading(false);
  };

  useEffect(() => {
    if (inView) {
      loadMoreNFTs();
    }
  }, [inView]);

  return (
    <div className="container mx-auto px-4 pt-24">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold mb-4">NFT Marketplace</h1>
        <p className="text-muted-foreground">
          Discover, collect, and sell extraordinary NFTs
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {nfts.map((nft, index) => (
          <div
            key={nft.id}
            className="opacity-0 animate-[fadeIn_0.8s_ease-out_forwards]"
            style={{
              animationDelay: `${index * 0.15}s`,
            }}
          >
            <NFTCard {...nft} />
          </div>
        ))}
      </div>

      <div
        ref={ref}
        className="w-full flex justify-center py-8"
      >
        {loading && (
          <div className="flex items-center gap-2 animate-fade-in">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading more NFTs...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;