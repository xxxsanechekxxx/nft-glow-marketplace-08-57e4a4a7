
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { NFTCard } from "@/components/NFTCard";
import { EmptyNFTState } from "@/components/EmptyNFTState";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Grid, List, Filter, SlidersHorizontal } from "lucide-react";
import type { NFT } from "@/types/nft";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ActiveBids } from "./ActiveBids";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const UserNFTCollection = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("my-nfts");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterBy, setFilterBy] = useState<"all" | "for-sale" | "not-for-sale">("all");
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
    if (filterBy === "all") return true;
    if (filterBy === "for-sale") return nft.for_sale;
    if (filterBy === "not-for-sale") return !nft.for_sale;
    return true;
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
            <Filter className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">No NFTs match your filter</h3>
          <p className="text-muted-foreground max-w-md">
            Try changing your filter settings to see more NFTs
          </p>
          <Button 
            variant="outline" 
            onClick={() => setFilterBy("all")}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      );
    }

    return (
      <div className={
        viewMode === "grid" 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-in fade-in duration-300" 
          : "flex flex-col gap-4 animate-in fade-in duration-300"
      }>
        {filteredNFTs.map((nft) => (
          viewMode === "grid" ? (
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
          ) : (
            <div key={nft.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-primary/10 rounded-lg bg-card/50 hover:bg-card/80 transition-all duration-300">
              <div className="w-full sm:w-48 h-48 rounded-lg overflow-hidden">
                <img 
                  src={nft.image} 
                  alt={nft.name} 
                  className="w-full h-full object-cover transition-all hover:scale-110 duration-500"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between py-2">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold">{nft.name}</h3>
                    {nft.for_sale && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        For Sale
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">by {nft.creator}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img 
                      src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                      alt="ETH"
                      className="h-5 w-5"
                    />
                    <span className="text-lg font-medium">{nft.price}</span>
                  </div>
                  <div className="flex gap-2">
                    {nft.for_sale ? (
                      <>
                        <Button 
                          onClick={() => handleUpdateNFTPrice(nft.id, nft.price)}
                          size="sm"
                          variant="outline"
                          className="text-primary border-primary/20 hover:bg-primary/10"
                        >
                          Edit Price
                        </Button>
                        <Button 
                          onClick={() => handleCancelSale(nft.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-500 border-red-500/20 hover:bg-red-500/10"
                        >
                          Cancel Sale
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={() => null}
                        size="sm"
                        className="bg-primary/20 hover:bg-primary/30 text-primary"
                      >
                        Sell
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
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
          <div className="flex gap-2 self-end md:self-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className={filterBy === "all" ? "bg-primary/10 text-primary" : ""}
                  onClick={() => setFilterBy("all")}
                >
                  All NFTs
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={filterBy === "for-sale" ? "bg-primary/10 text-primary" : ""}
                  onClick={() => setFilterBy("for-sale")}
                >
                  For Sale
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={filterBy === "not-for-sale" ? "bg-primary/10 text-primary" : ""}
                  onClick={() => setFilterBy("not-for-sale")}
                >
                  Not For Sale
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="bg-background/50 border border-input rounded-md p-1 flex">
              <Button
                variant="ghost" 
                size="icon"
                className={`h-8 w-8 ${viewMode === "grid" ? "bg-primary/20 text-primary" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost" 
                size="icon"
                className={`h-8 w-8 ${viewMode === "list" ? "bg-primary/20 text-primary" : ""}`} 
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
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
