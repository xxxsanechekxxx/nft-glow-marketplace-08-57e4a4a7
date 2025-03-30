
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Filter, ArrowDownAZ, ArrowUpAZ, Clock, DollarSign, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { NFTCard } from "@/components/NFTCard";
import { EmptyNFTState } from "@/components/EmptyNFTState";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import type { NFT } from "@/types/nft";

type SortOption = "newest" | "oldest" | "price-asc" | "price-desc" | "name-asc" | "name-desc";
type FilterOption = "all" | "for-sale" | "not-for-sale";

export const UserNFTCollection = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [filterOption, setFilterOption] = useState<FilterOption>("all");
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
        setFilteredNfts(data || []);
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

  // Apply sorting and filtering
  useEffect(() => {
    let result = [...nfts];
    
    // Apply filters
    if (filterOption === "for-sale") {
      result = result.filter(nft => nft.for_sale === true);
    } else if (filterOption === "not-for-sale") {
      result = result.filter(nft => nft.for_sale === false);
    }
    
    // Apply sorting
    switch (sortOption) {
      case "newest":
        result.sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.created_at || "").getTime() - new Date(b.created_at || "").getTime());
        break;
      case "price-asc":
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-desc":
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
    
    setFilteredNfts(result);
  }, [nfts, sortOption, filterOption]);

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
        title: "Success",
        description: "NFT has been removed from sale",
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
        title: "Success",
        description: "NFT price has been updated",
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
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <ShoppingBag className="w-6 h-6 text-primary" />
          </div>
          Your NFT Collection
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground animate-pulse">Loading your collection...</p>
          </div>
        ) : nfts.length > 0 ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
              <div className="space-y-2 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row items-start sm:items-center">
                <span className="text-sm text-muted-foreground">Filter:</span>
                <Tabs defaultValue="all" className="w-full" value={filterOption} onValueChange={(value) => setFilterOption(value as FilterOption)}>
                  <TabsList className="bg-background/40 border border-primary/10">
                    <TabsTrigger value="all" className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="for-sale" className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      For Sale
                    </TabsTrigger>
                    <TabsTrigger value="not-for-sale" className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      Not For Sale
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
                <select 
                  className="bg-background/40 border border-primary/10 rounded-md text-xs px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A-Z</option>
                  <option value="name-desc">Name: Z-A</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredNfts.length > 0 ? (
                filteredNfts.map((nft, index) => (
                  <motion.div
                    key={nft.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <NFTCard
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
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center">
                  <p className="text-muted-foreground">No NFTs match your current filters.</p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setFilterOption("all");
                      setSortOption("newest");
                    }}
                    className="mt-2 text-primary"
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
            
            <div className="pt-4 text-center text-sm text-muted-foreground">
              {filteredNfts.length} {filteredNfts.length === 1 ? 'NFT' : 'NFTs'} in your collection
              {filterOption !== "all" && ` (filtered from ${nfts.length})`}
            </div>
          </div>
        ) : (
          <EmptyNFTState />
        )}
      </CardContent>
    </Card>
  );
};
