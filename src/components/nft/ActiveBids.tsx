
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Loader2, Clock, DollarSign, Award, CheckCircle2, XCircle, User, Calendar, Shield } from "lucide-react";
import { NFTBid, NFT } from "@/types/nft";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
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

export const ActiveBids = () => {
  const [bids, setBids] = useState<(NFTBid & { nft?: NFT })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBid, setSelectedBid] = useState<NFTBid | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"accept" | "decline" | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserBids = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        
        // Fetch NFTs owned by the user
        const { data: userNFTs, error: nftError } = await supabase
          .from('nfts')
          .select('*')
          .eq('owner_id', user.id);
          
        if (nftError) throw nftError;
        
        // Fetch bids for these NFTs (this would be connected to the real backend)
        // This is a placeholder implementation
        const mockBids: (NFTBid & { nft?: NFT })[] = [];
        
        // For each NFT that is for sale, create mock bids
        userNFTs?.forEach(nft => {
          if (nft.for_sale) {
            // Mock bid data based on the image
            const mockBidders = [
              { address: "0fx32....734e", amount: "13.34", time: "1 min ago", rating: "98%", verified: true, joinedDate: "Mar 2024" },
              { address: "0xc81...3xyq", amount: "13.11", time: "5 min ago", rating: "95%", verified: true, joinedDate: "Jan 2024" },
              { address: "0xc199...34x", amount: "13.10", time: "7 min ago", rating: "92%", verified: false, joinedDate: "Feb 2024" },
              { address: "0xc88...882x", amount: "13.09", time: "14 min ago", rating: "89%", verified: false, joinedDate: "Apr 2024" }
            ];
            
            mockBidders.forEach((bidder, index) => {
              mockBids.push({
                id: `bid-${nft.id}-${index}`,
                nft_id: nft.id,
                bidder_address: bidder.address,
                bid_amount: bidder.amount,
                created_at: bidder.time,
                marketplace: "Rarible",
                nft: nft,
                bidder_rating: bidder.rating,
                bidder_verified: bidder.verified,
                bidder_joined: bidder.joinedDate
              });
            });
          }
        });
        
        setBids(mockBids);
      } catch (error) {
        console.error("Error fetching user bids:", error);
        toast({
          title: "Error",
          description: "Failed to load active bids",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserBids();
  }, [user?.id, toast]);

  const handleAcceptBid = (bid: NFTBid) => {
    setSelectedBid(bid);
    setActionType("accept");
    setConfirmDialogOpen(true);
  };

  const handleDeclineBid = (bid: NFTBid) => {
    setSelectedBid(bid);
    setActionType("decline");
    setConfirmDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedBid || !actionType) return;
    
    try {
      // In a real implementation, you would call an API endpoint
      // to accept or decline the bid
      
      if (actionType === "accept") {
        toast({
          title: "Bid Accepted",
          description: `You sold your NFT for ${selectedBid.bid_amount} ETH`,
        });
        
        // Remove all bids for this NFT
        setBids(bids.filter(bid => bid.nft_id !== selectedBid.nft_id));
      } else {
        toast({
          title: "Bid Declined",
          description: "The bid has been declined",
        });
        
        // Remove just this bid
        setBids(bids.filter(bid => bid.id !== selectedBid.id));
      }
    } catch (error) {
      console.error(`Error ${actionType}ing bid:`, error);
      toast({
        title: "Error",
        description: `Failed to ${actionType} the bid`,
        variant: "destructive"
      });
    } finally {
      setConfirmDialogOpen(false);
      setSelectedBid(null);
      setActionType(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (bids.length === 0) {
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
    <div className="space-y-8">
      <Accordion type="single" collapsible className="w-full">
        {Object.entries(bidsByNFT).map(([nftId, nftBids]) => {
          const nft = nftBids[0]?.nft;
          // Sort bids by amount (highest first)
          const sortedBids = [...nftBids].sort((a, b) => 
            parseFloat(b.bid_amount) - parseFloat(a.bid_amount)
          );
          const highestBid = sortedBids[0];
          
          return (
            <AccordionItem 
              key={nftId} 
              value={nftId}
              className="overflow-hidden border-purple-500/20 bg-gradient-to-br from-card to-card/80 animate-glow mb-6 rounded-lg"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-4">
                  {nft?.image && (
                    <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border border-purple-600/20">
                      <img src={nft.image} alt={nft.name} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="flex-grow space-y-1 text-left">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      {nft?.name || 'Unknown NFT'}
                      <Badge variant="secondary" className="bg-purple-600/20 text-purple-200 border-purple-800/30">
                        {nft?.marketplace || 'Marketplace'}
                      </Badge>
                    </h3>
                    <div className="flex flex-wrap gap-2 items-center">
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-200 border-purple-500/20">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Listed: {nft?.price} ETH
                      </Badge>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-200 border-blue-500/20">
                        <Award className="w-3 h-3 mr-1" />
                        Bids: {nftBids.length}
                      </Badge>
                      {highestBid && (
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-200 border-amber-500/20">
                          <DollarSign className="w-3 h-3 mr-1" />
                          Highest: {highestBid.bid_amount} ETH
                        </Badge>
                      )}
                      <Badge variant="outline" className="bg-green-500/10 text-green-200 border-green-500/20">
                        <Clock className="w-3 h-3 mr-1" />
                        Latest: {sortedBids[0]?.created_at}
                      </Badge>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center">
                    <div className="flex -space-x-2 overflow-hidden">
                      {sortedBids.slice(0, 3).map((bid, idx) => (
                        <div 
                          key={idx}
                          className="inline-block h-8 w-8 rounded-full ring-2 ring-background"
                          style={{
                            background: `linear-gradient(135deg, hsl(${(idx * 40) % 360}, 70%, 60%), hsl(${(idx * 40 + 40) % 360}, 70%, 40%))`,
                          }}
                        >
                          <span className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                            {bid.bidder_address.slice(0, 2)}
                          </span>
                        </div>
                      ))}
                      {sortedBids.length > 3 && (
                        <div className="inline-block h-8 w-8 rounded-full bg-gray-700 ring-2 ring-background">
                          <span className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                            +{sortedBids.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-6 pt-2 pb-6">
                <div className="space-y-4">
                  <div className="bg-purple-500/5 rounded-lg p-4 border border-purple-500/10 overflow-hidden">
                    <h4 className="text-lg font-medium mb-4 text-purple-100">Bids ({sortedBids.length})</h4>
                    <div className="grid gap-3">
                      {sortedBids.map((bid, index) => (
                        <div 
                          key={bid.id} 
                          className={`rounded-lg border ${index === 0 ? 'border-amber-500/30 bg-amber-500/5' : 'border-purple-500/20 bg-purple-500/5'} 
                          hover:bg-purple-500/10 transition-colors overflow-hidden`}
                        >
                          <div className="p-4 flex flex-col sm:flex-row justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div 
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                                ${index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600' : ''}`}
                                style={index !== 0 ? {
                                  background: `linear-gradient(135deg, hsl(${bid.id.charCodeAt(0) % 360}, 70%, 60%), hsl(${(bid.id.charCodeAt(0) + 40) % 360}, 70%, 40%))`,
                                } : {}}
                              >
                                {bid.bidder_address.slice(0, 2)}
                              </div>
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  {bid.bidder_address}
                                  {bid.bidder_verified && (
                                    <Badge className="bg-blue-500/20 text-blue-200 border-blue-500/30">
                                      <Shield className="h-3 w-3 mr-1" /> Verified
                                    </Badge>
                                  )}
                                  {index === 0 && (
                                    <Badge className="bg-amber-500/20 text-amber-200 border-amber-500/30">
                                      Top Bid
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                  <span className="text-yellow-300 font-medium flex items-center">
                                    <DollarSign className="h-3 w-3 mr-1" />
                                    {bid.bid_amount} ETH
                                  </span>
                                  <span className="text-muted-foreground">•</span>
                                  <span className="flex items-center text-blue-300">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {bid.created_at}
                                  </span>
                                  <span className="text-muted-foreground">•</span>
                                  <span className="flex items-center text-green-300">
                                    <User className="h-3 w-3 mr-1" />
                                    {bid.bidder_rating}
                                  </span>
                                  <span className="text-muted-foreground">•</span>
                                  <span className="flex items-center text-purple-300">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {bid.bidder_joined}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2 self-end sm:self-center ml-auto">
                              <Button 
                                variant="default" 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleAcceptBid(bid)}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-1" /> Accept
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-red-500/50 text-red-300 hover:bg-red-950/30 hover:text-red-200"
                                onClick={() => handleDeclineBid(bid)}
                              >
                                <XCircle className="w-4 h-4 mr-1" /> Decline
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md border-purple-500/30 bg-gradient-to-br from-background to-background/95">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              {actionType === "accept" ? "Accept Bid" : "Decline Bid"}
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              {actionType === "accept" 
                ? "Are you sure you want to accept this bid and sell your NFT?" 
                : "Are you sure you want to decline this bid?"}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBid && selectedBid.nft && (
            <div className="py-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-purple-500/30">
                  <img 
                    src={selectedBid.nft.image} 
                    alt={selectedBid.nft.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <div className="font-semibold text-lg">{selectedBid.nft.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedBid.nft.marketplace || 'Marketplace'} • Token ID: #{selectedBid.nft_id.substring(0, 8)}
                  </div>
                </div>
              </div>
              
              <div className={`text-center p-6 rounded-lg ${
                actionType === "accept" 
                  ? "bg-green-900/20 border border-green-500/30" 
                  : "bg-red-900/20 border border-red-500/30"
              }`}>
                {actionType === "accept" ? (
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-green-300">You are selling for</span>
                    <span className="text-2xl font-bold text-green-400">{selectedBid.bid_amount} ETH</span>
                    <span className="text-sm text-green-300">to {selectedBid.bidder_address}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-red-300">You are declining</span>
                    <span className="text-2xl font-bold text-red-400">{selectedBid.bid_amount} ETH</span>
                    <span className="text-sm text-red-300">from {selectedBid.bidder_address}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setConfirmDialogOpen(false)}
              className="border-muted-foreground/20 hover:bg-background"
            >
              Cancel
            </Button>
            <Button 
              variant={actionType === "accept" ? "default" : "destructive"}
              onClick={confirmAction}
              className={actionType === "accept" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {actionType === "accept" ? "Confirm Sale" : "Confirm Decline"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
