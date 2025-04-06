
import { NFTCard } from "@/components/NFTCard";
import { Loader2, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

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
    hidden: { 
      opacity: 0,
      y: 20
    },
    show: { 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20
      }
    }
  };
  
  if (isLoading) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center min-h-[300px] space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <div className="absolute -inset-8 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-full blur-xl opacity-70 animate-pulse" />
          <Loader2 className="h-12 w-12 animate-[spin_2s_linear_infinite] text-primary relative" />
        </div>
        <p className="text-lg text-muted-foreground animate-pulse mt-4">Loading NFTs...</p>
      </motion.div>
    );
  }

  if (nfts.length === 0) {
    return (
      <motion.div 
        className="text-center py-20 space-y-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative inline-block">
          <div className="absolute -inset-10 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-xl" />
          <Search className="w-16 h-16 text-muted-foreground" />
        </div>
        <div>
          <p className="text-3xl font-semibold text-white">No NFTs found</p>
          <p className="text-muted-foreground/60 mt-2 text-lg">Try adjusting your search criteria</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative px-2 md:px-0">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-purple-500/5 to-pink-500/5 rounded-xl blur-2xl" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>
      
      <ScrollArea className={`${isMobile ? 'h-[calc(100vh-350px)]' : 'h-[calc(100vh-400px)]'} rounded-xl backdrop-blur-sm border border-primary/20 shadow-[0_0_15px_rgba(0,0,0,0.1)] relative`}>
        <motion.div 
          className="p-4 md:p-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 marketplace-nft-grid"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence>
              {nfts.map((nft) => (
                <motion.div
                  key={nft.id}
                  variants={item}
                  layout
                  className="group"
                >
                  <motion.div 
                    className="relative transition-all duration-700 group-hover:translate-y-[-8px]"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <NFTCard {...nft} for_sale={nft.for_sale} />
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Featured Collections Section */}
          <div className="mt-12 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Featured Collections</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((index) => (
                <motion.div 
                  key={`collection-${index}`}
                  className="bg-black/30 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 shadow-lg rounded-xl overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index }}
                >
                  <div className="h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-1">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-12 h-12 bg-white/10 rounded-md"></div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-white">Collection {index}</h4>
                    <p className="text-xs text-purple-300/80">24 items</p>
                    <Badge className="mt-2 bg-primary/20 text-primary border-0">Featured</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Trending Artists Section */}
          <div className="mt-8 mb-10">
            <h3 className="text-xl font-semibold text-white mb-4">Trending Artists</h3>
            <div className="flex flex-wrap gap-4">
              {[1, 2, 3, 4, 5].map((index) => (
                <motion.div 
                  key={`artist-${index}`}
                  className="flex items-center space-x-3 bg-black/30 backdrop-blur-sm border border-white/10 p-3 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">#{index}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">Artist {index}</h4>
                    <p className="text-xs text-purple-300/80">Floor: 0.{index*2} ETH</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {isFetchingNextPage && (
            <motion.div 
              className="flex justify-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-md animate-pulse" />
                <Loader2 className="h-8 w-8 animate-[spin_2s_linear_infinite] text-primary relative" />
              </div>
            </motion.div>
          )}

          <div ref={lastElementRef} className="w-full h-20" />
        </motion.div>
      </ScrollArea>
    </div>
  );
};
