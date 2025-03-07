
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check, X, Clock, AlertCircle, HelpCircle } from "lucide-react";
import { NFT, NFTBid } from "@/types/nft";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const NFTBids = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState<NFTBid | null>(null);
  const [actionType, setActionType] = useState<'accept' | 'decline' | null>(null);

  // Fetch NFT details
  const { data: nft, isLoading: isLoadingNFT, refetch: refetchNFT } = useQuery({
    queryKey: ['nft', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nfts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as NFT;
    },
  });

  // Fetch bids for this NFT
  const { data: bids, isLoading: isLoadingBids, refetch: refetchBids } = useQuery({
    queryKey: ['nft-bids', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nft_bids')
        .select('*')
        .eq('nft_id', id)
        .eq('status', 'active')
        .order('bid_amount', { ascending: false });

      if (error) throw error;
      return data as NFTBid[];
    },
  });

  // Check if user owns this NFT
  const isOwner = user?.id === nft?.owner_id;

  useEffect(() => {
    if (nft && !isOwner) {
      navigate(`/nft/${id}`);
    }
  }, [nft, isOwner, id, navigate]);

  const handleAcceptBid = (bid: NFTBid) => {
    setSelectedBid(bid);
    setActionType('accept');
    setIsConfirmDialogOpen(true);
  };

  const handleDeclineBid = (bid: NFTBid) => {
    setSelectedBid(bid);
    setActionType('decline');
    setIsConfirmDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedBid || !actionType) return;

    try {
      if (actionType === 'accept') {
        // Update bid status to accepted
        const { error: bidError } = await supabase
          .from('nft_bids')
          .update({ status: 'accepted' })
          .eq('id', selectedBid.id);

        if (bidError) throw bidError;

        // Update NFT status to sold
        const { error: nftError } = await supabase
          .from('nfts')
          .update({ 
            marketplace_status: 'sold',
            for_sale: false
          })
          .eq('id', selectedBid.nft_id);

        if (nftError) throw nftError;

        // Decline all other bids
        const { error: otherBidsError } = await supabase
          .from('nft_bids')
          .update({ status: 'declined' })
          .eq('nft_id', selectedBid.nft_id)
          .neq('id', selectedBid.id)
          .eq('status', 'active');

        if (otherBidsError) throw otherBidsError;

        toast({
          title: "Bid accepted",
          description: `You have accepted the bid for ${selectedBid.bid_amount} ETH`,
        });

        // Go back to profile page
        navigate("/profile");
      } else {
        // Update bid status to declined
        const { error } = await supabase
          .from('nft_bids')
          .update({ status: 'declined' })
          .eq('id', selectedBid.id);

        if (error) throw error;

        // Check if there are still active bids
        const { data, error: countError } = await supabase
          .from('nft_bids')
          .select('id', { count: 'exact' })
          .eq('nft_id', selectedBid.nft_id)
          .eq('status', 'active');

        if (countError) throw countError;

        // If no more active bids, update NFT status
        if (data.length === 0) {
          const { error: updateError } = await supabase
            .from('nfts')
            .update({ marketplace_status: 'waiting_for_bids' })
            .eq('id', selectedBid.nft_id);

          if (updateError) throw updateError;
        }

        toast({
          title: "Bid declined",
          description: "You have declined the bid",
        });

        // Refresh data
        refetchBids();
        refetchNFT();
      }
    } catch (error) {
      console.error("Error processing bid:", error);
      toast({
        title: "Error",
        description: "Failed to process the bid. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConfirmDialogOpen(false);
      setSelectedBid(null);
      setActionType(null);
    }
  };

  if (isLoadingNFT) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-4">NFT not found</h2>
          <Link to="/profile" className="text-primary hover:underline">
            Go back to your profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#09081A] via-[#0E0D26] to-[#13123A] relative overflow-hidden py-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full filter blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse opacity-20"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full filter blur-3xl animate-pulse opacity-20"></div>
      </div>
      
      <div className="container max-w-4xl mx-auto px-6 relative z-10">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2 text-purple-200 hover:text-white"
          onClick={() => navigate('/profile')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to profile
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400">
            Active Bids
          </h1>
          <p className="text-lg text-purple-200/80 max-w-2xl mx-auto">
            Manage bids for your NFT
          </p>
        </div>

        <div className="mb-8 flex gap-6 items-center">
          <div className="w-24 h-24 rounded-lg overflow-hidden border border-purple-500/20 shadow-lg">
            <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">{nft.name}</h2>
            <p className="text-purple-200/70">Listed on {nft.marketplace || 'Unknown'}</p>
            <div className="flex items-center gap-2 mt-2">
              <img 
                src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                alt="ETH"
                className="h-5 w-5"
              />
              <span className="text-lg font-medium">{nft.price}</span>
            </div>
          </div>
        </div>

        <Card className="border-0 bg-gradient-to-b from-purple-900/40 to-purple-800/20 backdrop-blur-md shadow-xl relative overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 opacity-50"></div>
          <div className="absolute inset-0 border border-purple-500/20 rounded-lg"></div>
          
          <CardHeader>
            <CardTitle className="text-xl text-center text-purple-100">
              Active users, who placed bids for your NFT
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {isLoadingBids ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
              </div>
            ) : bids && bids.length > 0 ? (
              <div className="space-y-4">
                {bids.map((bid) => (
                  <div 
                    key={bid.id} 
                    className="p-4 rounded-lg bg-purple-900/30 border border-purple-500/20 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-purple-100">Active Bid —</span>
                          <span className="text-yellow-400 font-mono">
                            {bid.bidder_address.substring(0, 6)}...
                            {bid.bidder_address.substring(bid.bidder_address.length - 4)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <img 
                            src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                            alt="ETH"
                            className="h-4 w-4"
                          />
                          <span className="text-sm font-medium text-white">{bid.bid_amount} ETH</span>
                          <span className="text-xs text-purple-300/70 ml-2">
                            {new Date(bid.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        onClick={() => handleAcceptBid(bid)}
                        className="bg-green-500/20 hover:bg-green-500/30 text-green-500 border border-green-500/20"
                      >
                        Accept
                      </Button>
                      <Button 
                        onClick={() => handleDeclineBid(bid)}
                        variant="outline" 
                        className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-purple-200/70">
                No active bids for this NFT
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-purple-200/50 mt-6">
          <p>Please note: After clicking Accept, a confirmation dialog will appear.</p>
          <p>All transactions are secured by the PureNFT internal system.</p>
        </div>
      </div>

      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent className="bg-[#1A1F2C] border border-purple-500/20">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'accept' ? 'Confirm The Action' : 'Are you sure?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'accept' 
                ? `You are about to accept a bid for ${selectedBid?.bid_amount} ETH for your NFT ${nft.name}`
                : 'This will decline the current bid. The bidder will be notified.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-purple-500/20 text-purple-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmAction}
              className={actionType === 'accept' 
                ? "bg-green-500/90 hover:bg-green-500 text-white" 
                : "bg-red-500/90 hover:bg-red-500 text-white"}
            >
              {actionType === 'accept' ? 'Confirm' : 'Decline'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NFTBids;
