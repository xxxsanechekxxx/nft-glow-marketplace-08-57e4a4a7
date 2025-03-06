
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { NFTCard } from "@/components/NFTCard";
import { EmptyNFTState } from "@/components/EmptyNFTState";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import type { NFT } from "@/types/nft";

export const UserNFTCollection = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

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
        .update({ for_sale: false })
        .eq('id', id)
        .eq('owner_id', user?.id);
      
      if (error) throw error;
      
      // Update local state
      setNfts(nfts.map(nft => 
        nft.id === id ? { ...nft, for_sale: false } : nft
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {nfts.map((nft) => (
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
