import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Clock, Loader2, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

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
}

const ActiveBids = ({
  nftId,
  ownerId,
  currentUserId,
  bids: initialBids,
  onBidAccepted,
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
        } else if (data?.success) {
          toast({
            title: "Success",
            description: `The bid has been accepted. ${receivedAmount.toFixed(2)} ETH will be available in your wallet after a 15-day security period.`,
          });
          
          if (onBidAccepted) onBidAccepted();
          
          setBids(bids.filter(bid => bid.id !== bidId));
        } else {
          toast({
            title: "Error",
            description: data?.message || "Failed to accept bid",
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
      
      const { error } = await supabase
        .from('nft_bids')
        .delete()
        .eq('id', bidId);
      
      if (error) {
        throw error;
      }
      
      setBids(bids.filter(bid => bid.id !== bidId));
      
      toast({
        title: "Success",
        description: "Bid declined successfully",
      });
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

  if (!hasBids) {
    return (
      <Card className="bg-[#131B31] border-[#2A3047]">
        <CardHeader>
          <CardTitle className="text-xl">Active Bids</CardTitle>
          <CardDescription>No active bids for your NFTs</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-[#131B31] border-[#2A3047]">
      <CardHeader>
        <CardTitle className="text-xl">Active Bids</CardTitle>
        <CardDescription>
          {isOwner
            ? "Review and accept bids for your NFTs"
            : "Current bids for this NFT"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isTransactionLoading && processingDetails ? (
          <div className="bg-[#1A1F2C] border border-yellow-500/20 rounded-lg p-6 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-yellow-500">Processing Transaction</h3>
              <p className="text-muted-foreground">{getLoadingStageText()}</p>
            </div>
            
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-600 to-yellow-500 transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            
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
              className="bid-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative"
            >
              <div className="bid-details flex-1 space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="bidder-address font-mono text-sm truncate max-w-[180px]">
                    {bid.bidder_address}
                  </span>
                  <span
                    className={
                      bid.verified ? "badge-verified bid-badge" : "badge-not-verified bid-badge"
                    }
                  >
                    {bid.verified ? "Verified" : "Not Verified"}
                  </span>
                </div>
                <div className="bid-amount text-lg">
                  <img
                    src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png"
                    alt="ETH"
                    className="h-4 w-4 mr-1"
                  />
                  {bid.bid_amount.toFixed(2)} ETH
                </div>
                <div className="bid-time text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(bid.created_at).toLocaleDateString()}
                </div>
              </div>

              {isOwner && (
                <div className="action-buttons flex gap-2">
                  <Button
                    onClick={() => handleAcceptBid(bid.id, bid.bid_amount)}
                    className="accept-button px-4 py-2"
                    disabled={!!processingBidId}
                  >
                    {processingBidId === bid.id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Confirm Sale
                  </Button>
                  <Button
                    className="decline-button px-4 py-2"
                    disabled={!!processingBidId}
                    onClick={() => handleDeclineBid(bid.id)}
                  >
                    {processingBidId === bid.id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    Decline
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveBids;
