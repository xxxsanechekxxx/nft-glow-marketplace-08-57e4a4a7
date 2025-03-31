
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShoppingBag, ImageIcon, Info, Plus, Wallet, Grid3X3, GridIcon, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { NFTCard } from "@/components/NFTCard";
import { EmptyNFTState } from "@/components/EmptyNFTState";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/30 to-purple-500/30 border border-primary/20">
            <ShoppingBag className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              My NFT Collection
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {nfts.length} {nfts.length === 1 ? 'item' : 'items'} in your collection
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          {/* View mode toggle */}
          <div className="flex items-center p-1 bg-background/40 backdrop-blur-sm rounded-lg border border-primary/10">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-md ${viewMode === 'grid' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
              onClick={() => setViewMode('grid')}
            >
              <GridIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-md ${viewMode === 'list' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
              onClick={() => setViewMode('list')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Create NFT button */}
          <Button 
            onClick={() => navigate('/create-nft')} 
            variant="gradient"
            className="relative overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-primary/20"
            size="sm"
          >
            <Plus className="mr-1 h-4 w-4" />
            <span>Create NFT</span>
          </Button>
          
          {/* Help tooltip */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-primary/20 bg-primary/5 hover:bg-primary/10">
                  <Info className="h-4 w-4 text-primary/80" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-[280px] p-4">
                <div className="space-y-2">
                  <p className="font-medium">Managing Your NFTs:</p>
                  <ul className="list-disc pl-4 text-sm space-y-1">
                    <li>Click <span className="text-primary/90 font-semibold">Sell</span> to list an NFT for sale</li>
                    <li>Click <span className="text-primary/90 font-semibold">✏️</span> to edit the price of a listed NFT</li>
                    <li>Click <span className="text-primary/90 font-semibold">✕</span> to cancel a listing</li>
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
          <div className="glass-panel min-h-[300px] flex flex-col items-center justify-center py-12">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
              <div className="absolute inset-0 rounded-full border-t-2 border-primary/30 animate-pulse"></div>
              <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-primary/80" />
            </div>
            <p className="mt-4 text-muted-foreground">Loading your collection...</p>
          </div>
        ) : nfts.length > 0 ? (
          <div className="space-y-8">
            {/* Listed NFTs section */}
            {hasListedNFTs && (
              <Card className="border-primary/10 shadow-lg backdrop-blur-sm bg-gradient-to-br from-[#1A1F2C]/95 to-[#1A1F2C]/80 overflow-hidden relative">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px] opacity-30"></div>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600/50 via-emerald-400/40 to-green-600/50"></div>
                
                <CardHeader className="space-y-1 border-b border-primary/10 pb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-green-500/20 border border-green-500/30">
                      <Wallet className="w-4 h-4 text-green-400" />
                    </div>
                    <CardTitle className="text-xl font-medium">Currently Listed</CardTitle>
                  </div>
                  <CardDescription>NFTs you've put up for sale in the marketplace</CardDescription>
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
              <Card className="border-primary/10 shadow-lg backdrop-blur-sm bg-gradient-to-br from-[#1A1F2C]/95 to-[#1A1F2C]/80 overflow-hidden relative">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px] opacity-30"></div>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600/50 via-primary/40 to-purple-600/50"></div>
                
                <CardHeader className="space-y-1 border-b border-primary/10 pb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/20 border border-primary/30">
                      <ImageIcon className="w-4 h-4 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-medium">Your Collection</CardTitle>
                  </div>
                  <CardDescription>NFTs you own that aren't currently listed for sale</CardDescription>
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
          <Card className="border-primary/10 shadow-lg backdrop-blur-sm bg-gradient-to-br from-[#1A1F2C]/95 to-[#1A1F2C]/80 overflow-hidden relative p-6">
            <EmptyNFTState />
          </Card>
        )}
      </div>
    </div>
  );
};
