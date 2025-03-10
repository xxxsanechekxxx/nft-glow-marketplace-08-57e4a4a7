
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export interface Bid {
  id: string;
  bidder_address: string;
  bid_amount: number;
  created_at: string;
  verified: boolean;
}

interface UseNftBidsProps {
  nftId?: string;
  ownerId?: string | null;
  currentUserId?: string | undefined;
  initialBids?: Bid[];
  onBidAccepted?: () => void;
}

export const useNftBids = ({
  nftId,
  ownerId,
  currentUserId,
  initialBids,
  onBidAccepted,
}: UseNftBidsProps) => {
  const { toast } = useToast();
  const [bids, setBids] = useState<Bid[]>(initialBids || []);
  const [isLoading, setIsLoading] = useState(true);
  const [processingBidId, setProcessingBidId] = useState<string | null>(null);
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);
  const [processingDetails, setProcessingDetails] = useState<{
    amount: number;
    platformFee: number;
    receivedAmount: number;
    freezeDuration: number;
  } | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState(0);
  
  const PLATFORM_FEE_PERCENT = 2.5;

  // Fetch bids if not provided as props
  useEffect(() => {
    const fetchUserBids = async () => {
      if (initialBids) {
        setBids(initialBids);
        setIsLoading(false);
        return;
      }
      
      if (!currentUserId) return;

      try {
        setIsLoading(true);
        
        // Get all NFTs owned by the user
        const { data: userNfts, error: nftError } = await supabase
          .from('nfts')
          .select('id')
          .eq('owner_id', currentUserId);
        
        if (nftError) throw nftError;
        
        if (!userNfts || userNfts.length === 0) {
          setBids([]);
          setIsLoading(false);
          return;
        }
        
        // Get all bids for the user's NFTs
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
  }, [initialBids, currentUserId, toast]);

  const handleAcceptBid = async (bidId: string, bidAmount: number) => {
    try {
      setProcessingBidId(bidId);
      setIsTransactionLoading(true);
      
      // Calculate amounts for display in the loading state
      const platformFee = bidAmount * (PLATFORM_FEE_PERCENT / 100);
      const receivedAmount = bidAmount - platformFee;
      
      setProcessingDetails({
        amount: bidAmount,
        platformFee: platformFee,
        receivedAmount: receivedAmount,
        freezeDuration: 15
      });
      
      // Start the progress animation
      setLoadingProgress(0);
      setLoadingStage(1);
      
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          
          // Update loading stage based on progress
          if (prev >= 75 && loadingStage < 3) {
            setLoadingStage(3);
          } else if (prev >= 40 && loadingStage < 2) {
            setLoadingStage(2);
          }
          
          return prev + 1;
        });
      }, 200);
      
      // Make the actual API call to accept the bid
      const { data, error } = await supabase.rpc("accept_bid", {
        bid_id: bidId,
      });

      // Ensure loading UI shows for at least 5 seconds
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
          
          // Notify parent component to refresh
          if (onBidAccepted) onBidAccepted();
          
          // Remove the accepted bid from the local state
          setBids(bids.filter(bid => bid.id !== bidId));
        } else {
          toast({
            title: "Error",
            description: data?.message || "Failed to accept bid",
            variant: "destructive",
          });
        }
        
        // Reset states after a delay to show 100% completion
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

  const isOwner = currentUserId === ownerId || (currentUserId && !ownerId);
  const hasBids = bids.length > 0;

  return {
    bids,
    isLoading,
    isOwner,
    hasBids,
    processingBidId,
    isTransactionLoading,
    processingDetails,
    loadingProgress,
    handleAcceptBid,
    getLoadingStageText,
    PLATFORM_FEE_PERCENT
  };
};
