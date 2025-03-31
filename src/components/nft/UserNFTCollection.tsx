
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, ImageIcon, Info } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { NFTCard } from "@/components/NFTCard";
import { EmptyNFTState } from "@/components/EmptyNFTState";
import { useToast } from "@/hooks/use-toast";
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

  return (
    <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-[#1A1F2C]/95 to-[#1A1F2C]/80 overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px] opacity-30"></div>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600/50 via-primary/40 to-purple-600/50"></div>
      
      <CardHeader className="space-y-2 border-b border-primary/10 pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>
            Your NFT Collection
          </CardTitle>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
                  <Info className="w-4 h-4 text-primary/80" />
                </button>
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
      </CardHeader>
      
      <CardContent className="p-6 relative z-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : nfts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {nfts.map(nft => (
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
              />
            ))}
          </div>
        ) : (
          <EmptyNFTState />
        )}
      </CardContent>
    </Card>
  );
};
