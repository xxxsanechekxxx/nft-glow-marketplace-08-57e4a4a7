
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNftBids } from "@/hooks/useNftBids";
import { BidCard } from "./bids/BidCard";
import { TransactionProcessing } from "./bids/TransactionProcessing";

interface ActiveBidsProps {
  nftId?: string;
  ownerId?: string | null;
  currentUserId?: string | undefined;
  bids?: any[];
  onBidAccepted?: () => void;
}

const ActiveBids = ({
  nftId,
  ownerId,
  currentUserId,
  bids: initialBids,
  onBidAccepted,
}: ActiveBidsProps = {}) => {
  const { user } = useAuth();
  const { 
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
  } = useNftBids({
    nftId,
    ownerId,
    currentUserId: currentUserId || user?.id,
    initialBids,
    onBidAccepted
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
          <TransactionProcessing 
            processingDetails={processingDetails}
            loadingProgress={loadingProgress}
            loadingStageText={getLoadingStageText()}
            feePercent={PLATFORM_FEE_PERCENT}
          />
        ) : (
          bids.map((bid) => (
            <BidCard
              key={bid.id}
              bid={bid}
              isOwner={isOwner}
              processingBidId={processingBidId}
              onAcceptBid={handleAcceptBid}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveBids;
