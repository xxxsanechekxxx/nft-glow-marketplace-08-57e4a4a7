
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { NFTCard } from "@/components/NFTCard";
import { EmptyNFTState } from "@/components/EmptyNFTState";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Filter, Search } from "lucide-react";
import type { NFT } from "@/types/nft";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ActiveBids } from "./ActiveBids";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const UserNFTCollection = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("my-nfts");
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredNFTs = nfts.filter(nft => {
    if (!searchQuery) return true;
    return nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           nft.creator.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-purple-500 opacity-75 blur"></div>
          <Loader2 className="h-10 w-10 animate-spin text-primary relative" />
        </div>
      </div>
    );
  }

  const renderMyNFTs = () => {
    if (nfts.length === 0) {
      return <EmptyNFTState />;
    }

    if (filteredNFTs.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4">
          <div className="p-4 rounded-full bg-primary/10">
            <Search className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">No NFTs match your search</h3>
          <p className="text-muted-foreground max-w-md">
            Try changing your search criteria
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-in fade-in duration-300">
        {filteredNFTs.map((nft) => (
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

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger 
            value="my-nfts"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            My NFTs
          </TabsTrigger>
          <TabsTrigger 
            value="active-bids"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            Active Bids
          </TabsTrigger>
        </TabsList>

        {activeTab === "my-nfts" && nfts.length > 0 && (
          <div className="relative group w-full md:w-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <div className="relative flex items-center">
              <Input
                type="text"
                placeholder="Search by name or creator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 backdrop-blur-sm border-white/10 focus:border-primary shadow-lg transition-all duration-700 hover:shadow-primary/5 text-white placeholder:text-muted-foreground w-full"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-700 group-hover:text-primary" />
            </div>
          </div>
        )}
      </div>
      
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-xl blur-xl opacity-50"></div>
        <div className="relative bg-card/30 backdrop-blur-sm border border-primary/10 rounded-xl p-4 sm:p-6 shadow-lg">
          <TabsContent value="my-nfts" className="mt-0">
            {renderMyNFTs()}
          </TabsContent>
          
          <TabsContent value="active-bids" className="mt-0">
            <ActiveBids />
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
};
