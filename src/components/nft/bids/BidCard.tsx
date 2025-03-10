
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Loader2, XCircle } from "lucide-react";
import type { Bid } from "@/hooks/useNftBids";

interface BidCardProps {
  bid: Bid;
  isOwner: boolean;
  processingBidId: string | null;
  onAcceptBid: (bidId: string, bidAmount: number) => Promise<void>;
}

export const BidCard = ({ 
  bid, 
  isOwner, 
  processingBidId, 
  onAcceptBid 
}: BidCardProps) => {
  return (
    <div className="bid-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative">
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
            onClick={() => onAcceptBid(bid.id, bid.bid_amount)}
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
          >
            <XCircle className="h-4 w-4 mr-2" />
            Decline
          </Button>
        </div>
      )}
    </div>
  );
};
