import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Clock, Award, CheckCircle2, User, Tag, CheckCircle } from "lucide-react";
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

interface AcceptBidResponse {
  success: boolean;
  message: string;
  fee_percent: number;
}

export const ActiveBids = () => {
  const [selectedBid, setSelectedBid] = useState<(NFTBid & { nft?: NFT })| null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionCompleted, setTransactionCompleted] = useState(false);
  const [sellerReceives, setSellerReceives] = useState<string>("0");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const formatRelativeTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Unknown time";
    }
  };

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
    if (bid) {
      const fee = 2.5;
      const amount = parseFloat(bid.bid_amount);
      const receives = amount * (1 - fee / 100);
      setSellerReceives(receives.toFixed(4));
    }
    setConfirmDialogOpen(true);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isSubmitting && !transactionCompleted) {
      timer = setTimeout(() => {
        setIsSubmitting(false);
        setTransactionCompleted(true);
        
        toast({
          title: "Transaction Complete",
          description: `Your NFT has been sold and ${sellerReceives} ETH has been added to your wallet.`,
        });
        
        queryClient.invalidateQueries({ queryKey: ['nft-bids'] });
        queryClient.invalidateQueries({ queryKey: ['user-nfts'] });
        queryClient.invalidateQueries({ queryKey: ['user-balance'] });
        queryClient.invalidateQueries({ queryKey: ['user-transactions'] });
      }, 20000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isSubmitting, transactionCompleted, sellerReceives, toast, queryClient]);

  const confirmAction = async () => {
    if (!selectedBid) return;
    
    try {
      setIsProcessing(true);
      setIsSubmitting(true);
      setConfirmDialogOpen(false);
      
      const { data, error } = await supabase
        .rpc('accept_bid', { bid_id: selectedBid.id });
      
      if (error) throw error;
      
      const response = data as unknown as AcceptBidResponse;
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
    } catch (error) {
      console.error("Error accepting bid:", error);
      
      toast({
        title: "Error",
        description: `Failed to accept the bid: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
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

  const bidsByNFT: Record<string, (NFTBid & { nft?: NFT })[]> = {};
  bids.forEach(bid => {
    if (!bidsByNFT[bid.nft_id]) {
      bidsByNFT[bid.nft_id] = [];
    }
    bidsByNFT[bid.nft_id].push(bid);
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-background/80 p-8 rounded-xl shadow-xl border border-primary/20 flex flex-col items-center max-w-md w-full">
            <div className="relative mb-8">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary/30 to-purple-500/30 opacity-75 blur-lg animate-pulse"></div>
              <Loader2 className="h-16 w-16 animate-spin text-primary relative" />
            </div>
            
            <h3 className="text-2xl font-semibold mb-4 text-center text-primary">Processing Sale</h3>
            <p className="text-center text-muted-foreground mb-6">
              Your transaction is being processed. Please wait while we confirm the sale of your NFT.
            </p>
            
            <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden mb-8">
              <div className="h-full bg-gradient-to-r from-primary to-purple-500 animate-[progress_20s_ease-in-out_forwards]"></div>
            </div>
            
            <div className="bg-black/20 p-4 rounded-lg w-full border border-primary/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Bid amount:</span>
                <span className="font-medium text-white flex items-center">
                  <img 
                    src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                    alt="ETH" 
                    className="h-4 w-4 mr-1" 
                  />
                  {selectedBid?.bid_amount || "0.00"}
                </span>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Platform fee (2.5%):</span>
                <span className="font-medium text-white flex items-center">
                  <img 
                    src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                    alt="ETH" 
                    className="h-4 w-4 mr-1" 
                  />
                  {selectedBid ? (parseFloat(selectedBid.bid_amount) * 0.025).toFixed(4) : "0.00"}
                </span>
              </div>
              
              <div className="h-px bg-white/10 my-2"></div>
              
              <div className="flex items-center justify-between font-semibold">
                <span className="text-green-400">You will receive:</span>
                <span className="font-bold text-green-400 flex items-center">
                  <img 
                    src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                    alt="ETH" 
                    className="h-4 w-4 mr-1" 
                  />
                  {sellerReceives}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Accordion type="single" collapsible className="w-full">
        {Object.entries(bidsByNFT).map(([nftId, nftBids]) => {
          const nft = nftBids[0]?.nft;
          const highestBidAmount = Math.max(...nftBids.map(bid => parseFloat(bid.bid_amount)));
          
          return (
            <AccordionItem 
              key={nftId} 
              value={nftId}
              className="mb-6 border-0"
            >
              <div className="dark-bid-card shadow-md">
                <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 hover:no-underline">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-4">
                      {nft?.image && (
                        <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg overflow-hidden border border-[#3A3F50]">
                          <img src={nft.image} alt={nft.name} className="h-full w-full object-cover" />
                        </div>
                      )}
                      
                      <div className="text-left">
                        <h3 className="font-semibold text-sm sm:text-lg text-white truncate max-w-[140px] sm:max-w-full">{nft?.name || 'Unknown NFT'}</h3>
                        <div className="flex items-center mt-1 text-xs sm:text-sm text-gray-400">
                          <Tag className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                          <span>#{nftId.substring(0, 6)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4">
                      <div className="flex items-center bg-[#1D2235] rounded-lg px-2 sm:px-4 py-1 sm:py-2 border border-[#2A2E3D]">
                        <img 
                          src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                          alt="ETH" 
                          className="h-4 w-4 mr-1 sm:mr-2" 
                        />
                        <span className="text-xs sm:text-sm font-semibold text-purple-300">{highestBidAmount.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex items-center bg-[#1D2235] rounded-lg px-2 sm:px-4 py-1 sm:py-2 border border-[#2A2E3D]">
                        <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-yellow-400" />
                        <span className="text-xs sm:text-sm">{nftBids.length}</span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="px-4 sm:px-6 pt-0 pb-4 sm:pb-6">
                  <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                    {nftBids.map((bid, index) => {
                      const isHighestBid = parseFloat(bid.bid_amount) === highestBidAmount;
                      return (
                        <div 
                          key={bid.id}
                          className="bid-item bg-[#1D2235] hover:bg-[#252A40] transition-colors p-3 sm:p-5 my-2 sm:my-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#252A40] border border-[#3A3F50]">
                                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs sm:text-sm font-mono truncate bidder-address text-white">
                                      {bid.bidder_address}
                                    </span>
                                    
                                    <div className="flex gap-1">
                                      {isHighestBid && (
                                        <Badge className="bg-yellow-900/40 text-yellow-500 border border-yellow-500/30 text-[10px] sm:text-xs px-1 sm:px-2">
                                          Highest
                                        </Badge>
                                      )}
                                      
                                      {bid.verified ? (
                                        <Badge className="verified-badge border px-1 sm:px-2 flex items-center text-[10px] sm:text-xs">
                                          <div className="verified-dot"></div>
                                          Verified
                                        </Badge>
                                      ) : (
                                        <Badge className="bg-red-900/40 text-red-400 border border-red-500/30 text-[10px] sm:text-xs px-1 sm:px-2">
                                          Unverified
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center text-[10px] sm:text-xs text-gray-400 mt-1">
                                    <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                                    <span>{formatRelativeTime(bid.created_at)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                              <div className="flex items-center">
                                <div className="flex flex-col">
                                  <span className="text-[10px] sm:text-xs text-gray-400">Bid Amount</span>
                                  <div className="flex items-center">
                                    <img 
                                      src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                                      alt="ETH" 
                                      className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" 
                                    />
                                    <span className="text-base sm:text-lg font-bold text-primary">{bid.bid_amount}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <Button 
                                onClick={() => handleAcceptBid(bid)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-6 h-8 sm:h-10 text-xs sm:text-sm"
                                disabled={isProcessing}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Accept
                              </Button>
                            </div>
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
        <DialogContent className="sm:max-w-md border-purple-500/30 bg-gradient-to-br from-background to-background/95 w-[calc(100%-2rem)] max-w-md mx-auto">
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
                    {selectedBid.marketplace && `On ${getMarketplaceDisplay(selectedBid.marketplace)}`} • Token ID: #{selectedBid.nft_id.substring(0, 6)}
                  </div>
                </div>
              </div>
              
              <div className="text-center p-3 sm:p-4 rounded-lg bg-green-900/20 border border-green-500/30">
                <div className="flex flex-col items-center">
                  <span className="text-xs sm:text-sm text-green-300">You are selling for</span>
                  <div className="flex items-center justify-center mt-1">
                    <img 
                      src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                      alt="ETH" 
                      className="h-5 w-5 sm:h-6 sm:w-6 mr-1" 
                    />
                    <span className="text-xl sm:text-2xl font-bold text-green-400">{selectedBid.bid_amount}</span>
                  </div>
                  <span className="text-xs sm:text-sm text-green-300 mt-1 bidder-address">{selectedBid.bidder_address}</span>
                  
                  <Badge className="bg-green-500/10 text-green-300 border-green-500/20 flex text-xs mt-2 items-center gap-1">
                    2.5% platform fee
                  </Badge>
                  
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
