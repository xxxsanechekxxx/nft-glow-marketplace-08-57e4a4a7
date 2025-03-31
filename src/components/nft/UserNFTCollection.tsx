
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShoppingBag, ImageIcon, Info, Wallet, Grid3X3, GridIcon, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { NFTCard } from "@/components/NFTCard";
import { EmptyNFTState } from "@/components/EmptyNFTState";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import type { NFT } from "@/types/nft";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const UserNFTCollection = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserNFTs = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('nfts')
          .select('*')
          .eq('owner_id', user.id);
        
        if (error) {
          throw error;
        }
        
        setNfts(data || []);
      } catch (error) {
        console.error("Error fetching user NFTs:", error);
        toast({
          title: "Error",
          description: "Failed to load your NFT collection",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserNFTs();
  }, [user, toast]);

  const handleCancelSale = async (id: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('nfts')
        .update({ 
          for_sale: false,
          marketplace: null,
          marketplace_status: 'not_listed'
        })
        .eq('id', id)
        .eq('owner_id', user.id);
      
      if (error) throw error;
      
      setNfts(prevNfts => 
        prevNfts.map(nft => 
          nft.id === id 
            ? { ...nft, for_sale: false, marketplace: null, marketplace_status: 'not_listed' } 
            : nft
        )
      );
      
      toast({
        title: "Sale cancelled",
        description: "Your NFT is no longer for sale.",
      });
    } catch (error) {
      console.error("Error cancelling sale:", error);
      toast({
        title: "Error",
        description: "Failed to cancel the sale",
        variant: "destructive"
      });
    }
  };

  const handleUpdatePrice = async (id: string, price: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('nfts')
        .update({ price })
        .eq('id', id)
        .eq('owner_id', user.id);
      
      if (error) throw error;
      
      setNfts(prevNfts => 
        prevNfts.map(nft => 
          nft.id === id ? { ...nft, price } : nft
        )
      );
      
      toast({
        title: "Price updated",
        description: "Your NFT's price has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating price:", error);
      toast({
        title: "Error",
        description: "Failed to update the price",
        variant: "destructive"
      });
    }
  };

  // Filter NFTs by listing status
  const listedNFTs = nfts.filter(nft => nft.for_sale);
  const unlistedNFTs = nfts.filter(nft => !nft.for_sale);
  const hasListedNFTs = listedNFTs.length > 0;
  const hasUnlistedNFTs = unlistedNFTs.length > 0;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#65539E]/20 border border-[#65539E]/30">
            <ShoppingBag className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              My NFT Collection
            </h2>
            <p className="text-sm text-purple-300/80 mt-0.5">
              {nfts.length} {nfts.length === 1 ? 'item' : 'items'} in your collection
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          {/* View mode toggle */}
          <div className="flex items-center p-1 bg-[#2E2243]/80 rounded-lg border border-[#65539E]/30">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-md ${viewMode === 'grid' ? 'bg-[#65539E]/50 text-white' : 'text-purple-300/70'}`}
              onClick={() => setViewMode('grid')}
            >
              <GridIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-md ${viewMode === 'list' ? 'bg-[#65539E]/50 text-white' : 'text-purple-300/70'}`}
              onClick={() => setViewMode('list')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Help tooltip */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-[#65539E]/30 bg-[#65539E]/20 hover:bg-[#65539E]/30">
                  <Info className="h-4 w-4 text-purple-300" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-[280px] p-4 bg-[#2E2243] border border-[#65539E]/30">
                <div className="space-y-2">
                  <p className="font-medium text-white">Managing Your NFTs:</p>
                  <ul className="list-disc pl-4 text-sm space-y-1 text-purple-300/80">
                    <li>Click <span className="text-purple-300 font-semibold">Edit</span> to edit the price of a listed NFT</li>
                    <li>Click <span className="text-purple-300 font-semibold">Cancel</span> to cancel a listing</li>
                    <li>Click on any NFT to view its details</li>
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="relative">
        {isLoading ? (
          <div className="bg-[#23193A] min-h-[300px] flex flex-col items-center justify-center py-12 rounded-xl border border-[#65539E]/20">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-t-2 border-purple-400 animate-spin"></div>
              <div className="absolute inset-0 rounded-full border-t-2 border-purple-400/30 animate-pulse"></div>
              <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-purple-400/80" />
            </div>
            <p className="mt-4 text-purple-300/70">Loading your collection...</p>
          </div>
        ) : nfts.length > 0 ? (
          <div className="space-y-8">
            {/* Listed NFTs section */}
            {hasListedNFTs && (
              <Card className="border-[#65539E]/20 bg-[#23193A] overflow-hidden relative rounded-xl">
                <CardHeader className="space-y-1 border-b border-[#65539E]/20 pb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-green-500/20 border border-green-500/30">
                      <Wallet className="w-4 h-4 text-green-400" />
                    </div>
                    <CardTitle className="text-xl font-medium text-white">Currently Listed on Rarible</CardTitle>
                  </div>
                  <CardDescription className="text-purple-300/70">NFTs you've put up for sale in the marketplace</CardDescription>
                </CardHeader>
                
                <CardContent className="p-6 relative z-10">
                  <div className={viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5"
                    : "flex flex-col gap-4 md:gap-5"
                  }>
                    {listedNFTs.map(nft => (
                      <NFTCard
                        key={nft.id}
                        id={nft.id}
                        name={nft.name}
                        image={nft.image}
                        price={nft.price}
                        creator={nft.creator}
                        owner_id={nft.owner_id}
                        for_sale={nft.for_sale}
                        marketplace={nft.marketplace}
                        isProfileView={true}
                        onCancelSale={handleCancelSale}
                        onUpdatePrice={handleUpdatePrice}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Unlisted NFTs section */}
            {hasUnlistedNFTs && (
              <Card className="border-[#65539E]/20 bg-[#23193A] overflow-hidden relative rounded-xl">
                <CardHeader className="space-y-1 border-b border-[#65539E]/20 pb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#65539E]/20 border border-[#65539E]/30">
                      <ImageIcon className="w-4 h-4 text-purple-400" />
                    </div>
                    <CardTitle className="text-xl font-medium text-white">Your Collection</CardTitle>
                  </div>
                  <CardDescription className="text-purple-300/70">NFTs you own that aren't currently listed for sale</CardDescription>
                </CardHeader>
                
                <CardContent className="p-6 relative z-10">
                  <div className={viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5"
                    : "flex flex-col gap-4 md:gap-5"
                  }>
                    {unlistedNFTs.map(nft => (
                      <NFTCard
                        key={nft.id}
                        id={nft.id}
                        name={nft.name}
                        image={nft.image}
                        price={nft.price}
                        creator={nft.creator}
                        owner_id={nft.owner_id}
                        for_sale={nft.for_sale}
                        marketplace={nft.marketplace}
                        isProfileView={true}
                        onCancelSale={handleCancelSale}
                        onUpdatePrice={handleUpdatePrice}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className="border-[#65539E]/20 bg-[#23193A] overflow-hidden relative p-6 rounded-xl">
            <EmptyNFTState />
          </Card>
        )}
      </div>
    </div>
  );
};
