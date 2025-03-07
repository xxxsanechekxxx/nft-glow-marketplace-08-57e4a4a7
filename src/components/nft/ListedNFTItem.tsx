
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NFT } from "@/types/nft";
import { Clock, Check, AlertCircle, ChevronRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ListedNFTItemProps {
  nft: NFT;
  onCancelSale: (id: string) => Promise<void>;
}

export const ListedNFTItem = ({ nft, onCancelSale }: ListedNFTItemProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Determine the marketplace status and display properties
  const getStatusDisplay = () => {
    switch (nft.marketplace_status) {
      case 'sold':
        return {
          label: "Sold",
          color: "text-green-500",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/30",
          icon: <Check className="h-4 w-4" />
        };
      case 'waiting_for_bids':
        return {
          label: "Waiting for bids",
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/30",
          icon: <Clock className="h-4 w-4" />
        };
      case 'available_bids':
        return {
          label: "Available bids",
          color: "text-red-500",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/30",
          icon: <AlertCircle className="h-4 w-4" />,
          clickable: true
        };
      default:
        return {
          label: "Listed",
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/30",
          icon: <Clock className="h-4 w-4" />
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  const handleViewBids = () => {
    if (nft.marketplace_status === 'available_bids') {
      navigate(`/nft/${nft.id}/bids`);
    }
  };

  const handleCancelClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    try {
      setIsLoading(true);
      await onCancelSale(nft.id);
    } catch (error) {
      console.error("Error canceling sale:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`p-4 rounded-lg border ${statusDisplay.borderColor} ${statusDisplay.bgColor} transition-all duration-300 hover:shadow-md`}
      onClick={statusDisplay.clickable ? handleViewBids : undefined}
      style={{ cursor: statusDisplay.clickable ? 'pointer' : 'default' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-md overflow-hidden">
            <img 
              src={nft.image} 
              alt={nft.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{nft.name}</h3>
              <span className="text-sm text-muted-foreground">
                #{nft.id.substring(0, 6)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Listed on {nft.marketplace || 'Unknown'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusDisplay.color} ${statusDisplay.bgColor}`}>
            {statusDisplay.icon}
            <span className="text-sm font-medium">{statusDisplay.label}</span>
          </div>

          {statusDisplay.clickable && (
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          )}

          {!['sold'].includes(nft.marketplace_status || '') && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleCancelClick}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <div className="text-red-500 hover:text-red-600">✕</div>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cancel listing</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {(nft.marketplace_status === 'waiting_for_bids' || !nft.marketplace_status) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="h-5 w-5 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
                    <HelpCircle className="h-3 w-3 text-yellow-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>We are waiting when someone will place a bid to purchase your NFT. We will inform you about that.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {nft.marketplace_status === 'available_bids' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="h-5 w-5 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                    <HelpCircle className="h-3 w-3 text-red-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Someone placed a bid and waiting for your answer. Please note: bids are valid for 24 hours UTC.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
};
