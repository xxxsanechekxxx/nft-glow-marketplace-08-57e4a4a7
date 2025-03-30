
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, Clock, Loader2, ArrowUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Bid {
  id: string;
  bidder_address: string;
  bid_amount: number;
  created_at: string;
  verified: boolean;
}

interface ActiveBidsProps {
  nftId?: string;
  ownerId?: string | null;
  currentUserId?: string | undefined;
  bids?: Bid[];
  onBidAccepted?: () => void;
  onBidDeclined?: () => void;
}

const ActiveBids = ({
  nftId,
  ownerId,
  currentUserId,
  bids: initialBids,
  onBidAccepted,
  onBidDeclined,
}: ActiveBidsProps = {}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [bids, setBids] = useState<Bid[]>(initialBids || []);
  const [isLoading, setIsLoading] = useState(true);
  const [processingBidId, setProcessingBidId] = useState<string | null>(null);
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);
  const [processingDetails, setProcessingDetails] = useState<{
    amount: number;
    platformFee: number;
    receivedAmount: number;
    freezeDuration: number;
    currencyType: string;
  } | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState(0);

  useEffect(() => {
    const fetchUserBids = async () => {
      if (initialBids) {
        setBids(initialBids);
        setIsLoading(false);
        return;
      }
      
      if (!user?.id) return;

      try {
        setIsLoading(true);
        
        const { data: userNfts, error: nftError } = await supabase
          .from('nfts')
          .select('id')
          .eq('owner_id', user.id);
        
        if (nftError) throw nftError;
        
        if (!userNfts || userNfts.length === 0) {
          setBids([]);
          setIsLoading(false);
          return;
        }
        
        const nftIds = userNfts.map(nft => nft.id);
        
        const { data: bidData, error: bidError } = await supabase
          .from('nft_bids')
          .select('*')
          .in('nft_id', nftIds);
        
        if (bidError) throw bidError;
        
        setBids(bidData || []);
      } catch (error) {
        console.error("Error fetching user bids:", error);
        toast({
          title: "Error",
          description: "Failed to load your bids",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserBids();
  }, [initialBids, user?.id, toast]);
  
  const isOwner = currentUserId === ownerId || (user?.id && !ownerId);
  const hasBids = bids.length > 0;
  
  const PLATFORM_FEE_PERCENT = 2.5;

  const handleAcceptBid = async (bidId: string, bidAmount: number) => {
    try {
      setProcessingBidId(bidId);
      setIsTransactionLoading(true);
      
      const platformFee = bidAmount * (PLATFORM_FEE_PERCENT / 100);
      const receivedAmount = bidAmount - platformFee;
      
      const currencyType = "eth";
      
      setProcessingDetails({
        amount: bidAmount,
        platformFee: platformFee,
        receivedAmount: receivedAmount,
        freezeDuration: 15,
        currencyType: currencyType
      });
      
      setLoadingProgress(0);
      setLoadingStage(1);
      
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          
          if (prev >= 75 && loadingStage < 3) {
            setLoadingStage(3);
          } else if (prev >= 40 && loadingStage < 2) {
            setLoadingStage(2);
          }
          
          return prev + 1;
        });
      }, 200);
      
      const { data, error } = await supabase.rpc("accept_bid", {
        bid_id: bidId,
      });

      setTimeout(() => {
        clearInterval(progressInterval);
        setLoadingProgress(100);
        
        if (error) {
          console.error("Error accepting bid:", error);
          toast({
            title: "Error",
            description: error.message || "Failed to accept bid",
            variant: "destructive",
          });
        } else if (data && typeof data === 'object' && 'success' in data) {
          toast({
            title: "Success",
            description: `The bid has been accepted. ${receivedAmount.toFixed(2)} ETH will be available in your wallet after a 15-day security period.`,
          });
          
          if (onBidAccepted) onBidAccepted();
          
          setBids(bids.filter(bid => bid.id !== bidId));
        } else {
          toast({
            title: "Error",
            description: (data && typeof data === 'object' && 'message' in data) 
              ? String(data.message) 
              : "Failed to accept bid",
            variant: "destructive",
          });
        }
        
        setTimeout(() => {
          setProcessingBidId(null);
          setIsTransactionLoading(false);
          setProcessingDetails(null);
          setLoadingStage(0);
        }, 1000);
      }, 5000);
      
    } catch (error: any) {
      console.error("Error accepting bid:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to accept bid",
        variant: "destructive",
      });
      setProcessingBidId(null);
      setIsTransactionLoading(false);
      setProcessingDetails(null);
    }
  };

  const handleDeclineBid = async (bidId: string) => {
    try {
      setProcessingBidId(bidId);
      
      console.log("Declining bid:", bidId);
      
      const { error } = await supabase
        .from('nft_bids')
        .delete()
        .eq('id', bidId);
      
      if (error) {
        console.error("Delete error:", error);
        throw error;
      }
      
      setBids(prevBids => prevBids.filter(bid => bid.id !== bidId));
      
      toast({
        title: "Success",
        description: "Bid declined successfully",
      });
      
      if (onBidDeclined) onBidDeclined();
    } catch (error: any) {
      console.error("Error declining bid:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to decline bid",
        variant: "destructive",
      });
    } finally {
      setProcessingBidId(null);
    }
  };

  const getLoadingStageText = () => {
    switch (loadingStage) {
      case 1:
        return "Initiating transaction...";
      case 2:
        return "Processing bid acceptance...";
      case 3:
        return "Finalizing and securing funds...";
      default:
        return "Processing...";
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-[#131B31] border-[#2A3047] overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl">Active Bids</CardTitle>
          <CardDescription>Loading your bids...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-[#2A3047] rounded-lg bg-[#1A1F2C]">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-[#2A3047]" />
                <Skeleton className="h-6 w-32 bg-[#2A3047]" />
                <Skeleton className="h-3 w-20 bg-[#2A3047]" />
              </div>
              <Skeleton className="h-10 w-28 bg-[#2A3047]" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!hasBids) {
    return (
      <Card className="bg-[#131B31] border-[#2A3047] overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl bg-gradient-to-r from-white to-[#9b87f5] bg-clip-text text-transparent">Active Bids</CardTitle>
          <CardDescription>No active bids for your NFTs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
            <div className="p-4 rounded-full bg-[#1A1F2C] border border-[#2A3047]">
              <Clock className="h-10 w-10 text-[#9b87f5]" />
            </div>
            <p className="text-muted-foreground max-w-xs">
              When someone places a bid on your NFTs, it will appear here for you to review and accept.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#131B31] border-[#2A3047] overflow-hidden shadow-lg relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <CardHeader>
        <CardTitle className="text-xl bg-gradient-to-r from-white to-[#9b87f5] bg-clip-text text-transparent">Active Bids</CardTitle>
        <CardDescription>
          {isOwner
            ? "Review and accept bids for your NFTs"
            : "Current bids for this NFT"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {isTransactionLoading && processingDetails ? (
          <div className="bg-[#1A1F2C] border border-yellow-500/20 rounded-lg p-6 space-y-6 shadow-xl">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-yellow-500">Processing Transaction</h3>
              <p className="text-muted-foreground">{getLoadingStageText()}</p>
            </div>
            
            <Progress 
              value={loadingProgress} 
              className="h-2 bg-gray-700" 
            />
            
            <div className="border border-yellow-500/20 bg-yellow-500/5 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Bid Amount:</span>
                <span className="font-medium text-right">{processingDetails.amount.toFixed(2)} ETH</span>
                
                <span className="text-muted-foreground">Platform Fee ({PLATFORM_FEE_PERCENT}%):</span>
                <span className="font-medium text-right text-red-400">-{processingDetails.platformFee.toFixed(2)} ETH</span>
                
                <span className="text-muted-foreground font-medium">You Receive:</span>
                <span className="font-bold text-right text-yellow-500">{processingDetails.receivedAmount.toFixed(2)} {processingDetails.currencyType.toUpperCase()}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-yellow-500 bg-yellow-500/10 p-3 rounded-lg">
              <Clock className="h-5 w-5" />
              <p className="text-sm">
                Funds will be available in {processingDetails.freezeDuration} days after security verification
              </p>
            </div>
            
            <p className="text-xs text-center text-muted-foreground">
              Please do not close this window during processing
            </p>
          </div>
        ) : (
          bids.map((bid) => (
            <div
              key={bid.id}
              className="relative group overflow-hidden bg-gradient-to-r from-[#1A1F2C] to-[#1D2334] border border-[#2A3047] rounded-lg transition-all duration-300 hover:border-[#9b87f5]/30 p-5"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 relative">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm px-3 py-1 bg-[#0F1525] rounded-md border border-[#2A3047]">
                        {formatAddress(bid.bidder_address)}
                      </span>
                      {bid.verified ? (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/20 hover:bg-green-500/30">
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20">
                          Pending
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(bid.created_at)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="relative group/eth">
                      <div className="absolute -inset-1 bg-[#627EEA]/30 rounded-full blur-sm opacity-0 group-hover/eth:opacity-100 transition-opacity" />
                      <div className="relative h-8 w-8 flex items-center justify-center bg-[#627EEA]/10 rounded-full border border-[#627EEA]/30">
                        <img
                          src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png"
                          alt="ETH"
                          className="h-4 w-4"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-2xl font-bold bg-gradient-to-r from-white to-[#9b87f5] bg-clip-text text-transparent">
                        {bid.bid_amount.toFixed(2)} ETH
                      </p>
                      <p className="text-xs text-muted-foreground">
                        After fees: {(bid.bid_amount * (1 - PLATFORM_FEE_PERCENT/100)).toFixed(2)} ETH
                      </p>
                    </div>
                  </div>
                </div>

                {isOwner && (
                  <div className="relative group/button ml-auto">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-md blur opacity-0 group-hover/button:opacity-70 transition-opacity" />
                    <Button
                      onClick={() => handleAcceptBid(bid.id, bid.bid_amount)}
                      className="relative px-6 py-2 bg-[#1A1F2C] hover:bg-[#1A1F2C]/80 text-white border border-[#9b87f5]/30 hover:border-[#9b87f5]/50 shadow-lg transition-all duration-300"
                      disabled={!!processingBidId}
                    >
                      {processingBidId === bid.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <ArrowUp className="h-4 w-4 mr-2" />
                      )}
                      Accept Bid
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveBids;
