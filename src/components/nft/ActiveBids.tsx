
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, CheckCircle, Clock, Tag, Wallet, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistance } from "date-fns";

type Bid = {
  id: string;
  nft_id: string;
  bidder_id: string;
  bid_amount: number;
  created_at: string;
  nft_name: string;
  bidder_address: string;
  is_verified: boolean;
};

export const ActiveBids = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [processingBids, setProcessingBids] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchBids = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .rpc('get_bids_for_user_nfts', { user_id: user.id });
        
        if (error) {
          throw error;
        }
        
        setBids(data as Bid[] || []);
      } catch (error) {
        console.error("Error fetching bids:", error);
        toast({
          title: "Error",
          description: "Failed to load bids",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBids();
  }, [user?.id, toast]);

  const handleAcceptBid = async (bid: Bid) => {
    if (!user?.id) return;
    
    try {
      setProcessingBids(prev => new Set(prev).add(bid.id));
      
      const { data, error } = await supabase
        .rpc('accept_bid', {
          p_bid_id: bid.id,
          p_owner_id: user.id,
        });

      if (error) throw error;
      
      if (data) {
        toast({
          title: "Success",
          description: `You accepted the bid for ${bid.nft_name}`,
        });
        
        // Remove the accepted bid from state
        setBids(bids.filter(b => b.id !== bid.id));
        
        // Invalidate queries that might be affected
        queryClient.invalidateQueries({queryKey: ['user-nfts']});
      }
    } catch (error) {
      console.error("Error accepting bid:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to accept bid",
        variant: "destructive"
      });
    } finally {
      setProcessingBids(prev => {
        const updated = new Set(prev);
        updated.delete(bid.id);
        return updated;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (bids.length === 0) {
    return (
      <div className="dark-bid-card p-8 rounded-lg text-center">
        <div className="flex flex-col items-center gap-4">
          <Info className="h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold text-foreground/90">No Active Bids</h3>
          <p className="text-muted-foreground max-w-md">
            When someone places a bid on your NFTs, they will appear here.
          </p>
        </div>
      </div>
    );
  }

  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
    } catch (e) {
      return "Unknown time";
    }
  };

  return (
    <div className="space-y-6">
      {bids.map((bid) => (
        <div 
          key={bid.id} 
          className="dark-bid-card bg-[#0D101A] border border-[#2A3047] rounded-lg overflow-hidden"
        >
          <div className="p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground/90">{bid.nft_name}</h3>
              {bid.is_verified ? (
                <div className="flex items-center gap-1 bg-green-900/40 text-green-400 border border-green-500/30 px-2.5 py-1 rounded-full text-xs">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Verified</span>
                </div>
              ) : (
                <div className="bg-orange-900/40 text-orange-400 border border-orange-500/30 px-2.5 py-1 rounded-full text-xs">
                  Unverified
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center text-muted-foreground text-sm">
                  <Tag className="h-4 w-4 mr-2 opacity-70" />
                  <span>Bid Amount</span>
                </div>
                <div className="flex items-center text-xl font-bold text-purple-300">
                  {bid.bid_amount} ETH
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <div className="flex items-center text-muted-foreground text-sm">
                  <Wallet className="h-4 w-4 mr-2 opacity-70" />
                  <span>Bidder Address</span>
                </div>
                <div className="text-foreground truncate">
                  {bid.bidder_address}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2 opacity-70" />
                <span>{getTimeAgo(bid.created_at)}</span>
              </div>
              
              <Button
                onClick={() => handleAcceptBid(bid)}
                disabled={processingBids.has(bid.id)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium min-w-[120px]"
              >
                {processingBids.has(bid.id) ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  "Accept Bid"
                )}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
