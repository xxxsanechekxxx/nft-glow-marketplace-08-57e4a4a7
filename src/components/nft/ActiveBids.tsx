
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Clock, Award, CheckCircle2, ChevronDown, Check, Verified } from "lucide-react";
import { NFTBid, NFT } from "@/types/nft";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const ActiveBids = () => {
  const [selectedBid, setSelectedBid] = useState<(NFTBid & { nft?: NFT })| null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Format relative time from timestamp
  const formatRelativeTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Unknown time";
    }
  };

  // Fetch NFTs owned by the user
  const { data: userNFTs, isLoading: isLoadingNFTs } = useQuery({
    queryKey: ['user-nfts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('nfts')
        .select('*')
        .eq('owner_id', user.id)
        .eq('for_sale', true);
      
      if (error) throw error;
      return data as unknown as NFT[];
    },
    enabled: !!user?.id
  });

  // Fetch bids for user's NFTs
  const { data: bids = [], isLoading: isLoadingBids } = useQuery({
    queryKey: ['nft-bids', userNFTs?.map(nft => nft.id)],
    queryFn: async () => {
      if (!userNFTs?.length) return [];
      
      const { data, error } = await supabase
        .from('nft_bids')
        .select(`
          *,
          nft:nfts(*)
        `)
        .in('nft_id', userNFTs.map(nft => nft.id))
        .order('bid_amount', { ascending: false });
      
      if (error) throw error;
      return data as unknown as (NFTBid & { nft: NFT })[];
    },
    enabled: !!userNFTs?.length
  });

  const getMarketplaceDisplay = (marketplaceKey: string | null) => {
    if (!marketplaceKey) return null;
    
    const marketplaceMap: Record<string, string> = {
      'purenft': 'PureNFT',
      'rarible': 'Rarible',
      'opensea': 'OpenSea',
      'looksrare': 'LooksRare',
      'dappradar': 'DappRadar',
      'debank': 'DeBank'
    };
    
    return marketplaceMap[marketplaceKey] || marketplaceKey;
  };

  const handleAcceptBid = (bid: NFTBid & { nft?: NFT }) => {
    setSelectedBid(bid);
    setConfirmDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedBid) return;
    
    try {
      setIsProcessing(true);
      
      // Call the Supabase function to accept the bid
      const { data, error } = await supabase
        .rpc('accept_bid', { bid_id: selectedBid.id });
      
      if (error) throw error;
      
      // Fix TypeScript error by adding proper type checking and handling
      const responseData = data as unknown as { 
        success: boolean;
        message: string;
        fee_percent: number;
      };
      
      if (!responseData.success) {
        throw new Error(responseData.message);
      }
      
      toast({
        title: "Bid Accepted",
        description: `You sold your NFT for ${selectedBid.bid_amount} ETH (${responseData.fee_percent}% fee applied)`,
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['nft-bids'] });
      queryClient.invalidateQueries({ queryKey: ['user-nfts'] });
      queryClient.invalidateQueries({ queryKey: ['user-balance'] });
      queryClient.invalidateQueries({ queryKey: ['user-transactions'] });
      
    } catch (error) {
      console.error("Error accepting bid:", error);
      toast({
        title: "Error",
        description: `Failed to accept the bid: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setConfirmDialogOpen(false);
      setSelectedBid(null);
    }
  };

  const isLoading = isLoadingNFTs || isLoadingBids;

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!bids.length) {
    return (
      <div className="text-center py-12 space-y-4">
        <Award className="h-16 w-16 mx-auto text-primary/40" />
        <h3 className="text-xl font-medium">No active bids</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          When someone places a bid on your NFTs, they will appear here.
        </p>
      </div>
    );
  }

  // Group bids by NFT
  const bidsByNFT: Record<string, (NFTBid & { nft?: NFT })[]> = {};
  bids.forEach(bid => {
    if (!bidsByNFT[bid.nft_id]) {
      bidsByNFT[bid.nft_id] = [];
    }
    bidsByNFT[bid.nft_id].push(bid);
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Accordion type="single" collapsible className="w-full">
        {Object.entries(bidsByNFT).map(([nftId, nftBids]) => {
          const nft = nftBids[0]?.nft;
          const highestBidAmount = Math.max(...nftBids.map(bid => parseFloat(bid.bid_amount)));
          
          return (
            <AccordionItem 
              key={nftId} 
              value={nftId}
              className="mb-4 border-0"
            >
              <div className="bg-[#0D1425] border border-[#2A3047] rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* NFT Image */}
                      {nft?.image && (
                        <div className="h-14 w-14 rounded-md overflow-hidden">
                          <img src={nft.image} alt={nft.name} className="h-full w-full object-cover" />
                        </div>
                      )}
                      
                      {/* NFT Info */}
                      <div className="text-left">
                        <h3 className="font-semibold text-md">{nft?.name || 'Unknown NFT'}</h3>
                        <p className="text-xs text-muted-foreground">#{nftId.substring(0, 8)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-[#1A1F2C] rounded-full px-3 py-1 text-primary">
                        <img 
                          src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                          alt="ETH" 
                          className="h-4 w-4 mr-1" 
                        />
                        <span className="text-sm font-semibold">Top: {highestBidAmount.toFixed(2)} ETH</span>
                      </div>
                      
                      <div className="flex items-center bg-[#1A1F2C] rounded-full px-3 py-1">
                        <Award className="h-4 w-4 mr-1 text-primary" />
                        <span className="text-sm">{nftBids.length} Bids</span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="px-4 pt-0 pb-4">
                  <div className="space-y-4 mt-2">
                    {nftBids.map((bid) => {
                      const isHighestBid = parseFloat(bid.bid_amount) === highestBidAmount;
                      return (
                        <div 
                          key={bid.id}
                          className="bg-[#131B31] rounded-lg overflow-hidden border border-[#2A3047]"
                        >
                          <div className="p-4">
                            {/* Bidder Info, Badges, and Amount */}
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex flex-col">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-sm font-mono text-white/80 truncate max-w-[120px] sm:max-w-[150px]">
                                    {bid.bidder_address}
                                  </span>
                                  
                                  <div className="flex gap-1">
                                    {isHighestBid && (
                                      <Badge className="bg-yellow-900/40 text-yellow-500 border border-yellow-500/30 text-xs">
                                        Highest Bid
                                      </Badge>
                                    )}
                                    
                                    {bid.verified ? (
                                      <Badge className="bg-green-900/40 text-green-500 border border-green-500/30 text-xs flex items-center">
                                        <span className="bg-green-500 h-1.5 w-1.5 rounded-full mr-1"></span>
                                        Verified
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-red-900/40 text-red-500 border border-red-500/30 text-xs">
                                        Not Verified
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex items-center text-white font-bold">
                                  <img 
                                    src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                                    alt="ETH" 
                                    className="h-5 w-5 mr-1" 
                                  />
                                  <span className="text-lg">{bid.bid_amount} ETH</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center text-gray-400 text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{formatRelativeTime(bid.created_at)}</span>
                              </div>
                            </div>
                            
                            {/* Accept Button */}
                            <Button 
                              onClick={() => handleAcceptBid(bid)}
                              className="w-full bg-green-600 hover:bg-green-700 transition-colors"
                              disabled={isProcessing}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" /> Accept
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md border-purple-500/30 bg-gradient-to-br from-background to-background/95">
          <DialogHeader>
            <DialogTitle className="text-center text-lg sm:text-xl">
              Accept Bid
            </DialogTitle>
            <DialogDescription className="text-center pt-2 text-sm sm:text-base">
              Are you sure you want to accept this bid and sell your NFT? A 2.5% platform fee will be applied.
            </DialogDescription>
          </DialogHeader>
          
          {selectedBid && selectedBid.nft && (
            <div className="py-3 sm:py-4">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-purple-500/30 relative">
                  <img 
                    src={selectedBid.nft.image} 
                    alt={selectedBid.nft.name} 
                    className="w-full h-full object-cover" 
                  />
                  
                  {selectedBid.nft.marketplace && (
                    <div className="absolute top-1 left-1">
                      <Badge variant="outline" className="bg-black/70 text-white border-white/20 backdrop-blur-md text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5">
                        {getMarketplaceDisplay(selectedBid.nft.marketplace)}
                      </Badge>
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-sm sm:text-lg">{selectedBid.nft.name}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {selectedBid.marketplace && `On ${getMarketplaceDisplay(selectedBid.marketplace)}`} • Token ID: #{selectedBid.nft_id.substring(0, 8)}
                  </div>
                </div>
              </div>
              
              <div className="text-center p-4 sm:p-6 rounded-lg bg-green-900/20 border border-green-500/30">
                <div className="flex flex-col items-center">
                  <span className="text-xs sm:text-sm text-green-300">You are selling for</span>
                  <div className="flex items-center justify-center mt-1">
                    <img 
                      src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                      alt="ETH" 
                      className="h-5 w-5 sm:h-6 sm:w-6 mr-1 sm:mr-2" 
                    />
                    <span className="text-xl sm:text-2xl font-bold text-green-400">{selectedBid.bid_amount}</span>
                  </div>
                  <span className="text-xs sm:text-sm text-green-300 mt-1 bidder-address">{selectedBid.bidder_address}</span>
                  
                  {/* Fee Information */}
                  <Badge className="bg-green-500/10 text-green-300 border-green-500/20 flex text-xs mt-2 items-center gap-1">
                    2.5% platform fee
                  </Badge>
                  
                  {/* Verification Status in Confirmation Dialog */}
                  {selectedBid.verified ? (
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 flex text-xs mt-2 items-center gap-1">
                      <span className="bg-green-500 rounded-full h-2 w-2 mr-1"></span>
                      Verified Bidder
                    </Badge>
                  ) : null}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setConfirmDialogOpen(false)}
              className="border-muted-foreground/20 hover:bg-background text-xs sm:text-sm"
              size="sm"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              variant="default"
              onClick={confirmAction}
              className="text-xs sm:text-sm bg-green-600 hover:bg-green-700"
              size="sm"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Sale"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
