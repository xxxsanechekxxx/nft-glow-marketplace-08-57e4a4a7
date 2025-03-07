
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { NFTCard } from "@/components/NFTCard";
import { EmptyNFTState } from "@/components/EmptyNFTState";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, HelpCircle } from "lucide-react";
import type { NFT } from "@/types/nft";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListedNFTItem } from "@/components/nft/ListedNFTItem";

export const UserNFTCollection = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Filter NFTs by status
  const unlistedNFTs = nfts.filter(nft => !nft.for_sale);
  const listedNFTs = nfts.filter(nft => nft.for_sale);

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
        
        // Ensure price is a string to match NFT type
        const formattedData = data?.map(nft => ({
          ...nft,
          price: nft.price.toString()
        })) || [];
        
        setNfts(formattedData);
      } catch (error) {
        console.error("Error fetching user NFTs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserNFTs();
  }, [user?.id]);

  const handleUpdateNFTPrice = async (id: string, newPrice: string) => {
    try {
      const { error } = await supabase
        .from('nfts')
        .update({ price: newPrice })
        .eq('id', id)
        .eq('owner_id', user?.id);
      
      if (error) throw error;
      
      // Update local state with string price
      setNfts(nfts.map(nft => 
        nft.id === id ? { ...nft, price: newPrice } : nft
      ));
    } catch (error) {
      console.error("Error updating NFT price:", error);
    }
  };

  const handleCancelSale = async (id: string) => {
    try {
      const { error } = await supabase
        .from('nfts')
        .update({ 
          for_sale: false,
          marketplace: null,
          marketplace_status: 'unlisted'
        })
        .eq('id', id)
        .eq('owner_id', user?.id);
      
      if (error) throw error;
      
      // Update local state
      setNfts(nfts.map(nft => 
        nft.id === id ? { 
          ...nft, 
          for_sale: false,
          marketplace: null,
          marketplace_status: 'unlisted'
        } : nft
      ));
    } catch (error) {
      console.error("Error canceling NFT sale:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (nfts.length === 0) {
    return <EmptyNFTState />;
  }

  return (
    <Tabs defaultValue="my-nfts" className="w-full">
      <TabsList className="mb-6 w-full grid grid-cols-3 h-auto p-1 bg-background/10 backdrop-blur-sm">
        <TabsTrigger value="my-nfts" className="py-3 text-base">My NFTs</TabsTrigger>
        <TabsTrigger value="my-history" className="py-3 text-base">My History</TabsTrigger>
        <TabsTrigger value="active-bids" className="py-3 text-base">Active Bids</TabsTrigger>
      </TabsList>

      <TabsContent value="my-nfts" className="mt-6">
        {unlistedNFTs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            You don't have any unlisted NFTs
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {unlistedNFTs.map((nft) => (
              <NFTCard
                key={nft.id}
                id={nft.id}
                name={nft.name}
                image={nft.image}
                price={nft.price}
                creator={nft.creator}
                owner_id={nft.owner_id}
                for_sale={nft.for_sale}
                isProfileView={true}
                onCancelSale={handleCancelSale}
                onUpdatePrice={handleUpdateNFTPrice}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="my-history" className="mt-6">
        <div className="text-center py-12 text-muted-foreground">
          Transaction history will appear here
        </div>
      </TabsContent>

      <TabsContent value="active-bids" className="mt-6">
        {listedNFTs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            You don't have any NFTs listed for sale
          </div>
        ) : (
          <div className="space-y-4">
            {listedNFTs.map((nft) => (
              <ListedNFTItem 
                key={nft.id} 
                nft={nft} 
                onCancelSale={handleCancelSale} 
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
