
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { NFTCard } from "@/components/NFTCard";
import { EmptyNFTState } from "@/components/EmptyNFTState";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import type { NFT } from "@/types/nft";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ActiveBids } from "./ActiveBids";

export const UserNFTCollection = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("my-nfts");
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
        
        // Ensure price is a string to match NFT type
        const formattedData = data?.map(nft => ({
          ...nft,
          price: nft.price.toString()
        })) || [];
        
        setNfts(formattedData);
      } catch (error) {
        console.error("Error fetching user NFTs:", error);
        toast({
          title: "Error",
          description: "Failed to load your NFTs",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserNFTs();
  }, [user?.id, toast]);

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

      toast({
        title: "Success",
        description: "NFT price updated successfully",
      });
    } catch (error) {
      console.error("Error updating NFT price:", error);
      toast({
        title: "Error",
        description: "Failed to update NFT price",
        variant: "destructive"
      });
    }
  };

  const handleCancelSale = async (id: string) => {
    try {
      const { error } = await supabase
        .from('nfts')
        .update({ for_sale: false })
        .eq('id', id)
        .eq('owner_id', user?.id);
      
      if (error) throw error;
      
      // Update local state
      setNfts(nfts.map(nft => 
        nft.id === id ? { ...nft, for_sale: false } : nft
      ));

      toast({
        title: "Success",
        description: "NFT removed from sale",
      });
    } catch (error) {
      console.error("Error canceling NFT sale:", error);
      toast({
        title: "Error",
        description: "Failed to cancel NFT sale",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const renderMyNFTs = () => {
    const myNFTs = nfts.filter(nft => !nft.for_sale);
    
    if (myNFTs.length === 0) {
      return <EmptyNFTState />;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {myNFTs.map((nft) => (
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
    );
  };

  const renderListedNFTs = () => {
    const listedNFTs = nfts.filter(nft => nft.for_sale);
    
    if (listedNFTs.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No NFTs listed for sale</h3>
          <p className="text-muted-foreground mt-2">
            When you list your NFTs for sale, they will appear here.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {listedNFTs.map((nft) => (
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
            marketplace={nft.marketplace || "Rarible"}
          />
        ))}
      </div>
    );
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="my-nfts">My NFTs</TabsTrigger>
        <TabsTrigger value="listed-nfts">Listed NFTs</TabsTrigger>
        <TabsTrigger value="active-bids">Active Bids</TabsTrigger>
      </TabsList>
      
      <TabsContent value="my-nfts">
        {renderMyNFTs()}
      </TabsContent>
      
      <TabsContent value="listed-nfts">
        {renderListedNFTs()}
      </TabsContent>
      
      <TabsContent value="active-bids">
        <ActiveBids />
      </TabsContent>
    </Tabs>
  );
};
