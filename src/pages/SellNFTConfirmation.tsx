
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, HelpCircle, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { NFT } from "@/types/nft";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const SellNFTConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [marketplace, setMarketplace] = useState<string | null>(null);
  const [marketplaceName, setMarketplaceName] = useState<string>("selected marketplace");

  const { data: nft, isLoading } = useQuery({
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

  useEffect(() => {
    // Get marketplace selection from session storage
    const savedMarketplace = sessionStorage.getItem('sellNFT_marketplace');
    setMarketplace(savedMarketplace);

    // Set marketplace name based on ID
    if (savedMarketplace === 'purenft') setMarketplaceName('PureNFT.com');
    if (savedMarketplace === 'rarible') setMarketplaceName('Rarible.com');
    if (savedMarketplace === 'opensea') setMarketplaceName('OpenSea.io');
    if (savedMarketplace === 'looksrare') setMarketplaceName('LooksRare.org');
    if (savedMarketplace === 'dappradar') setMarketplaceName('DappRadar.com');
    if (savedMarketplace === 'debank') setMarketplaceName('DeBank.com');
  }, []);

  const handleNo = () => {
    setIsDialogOpen(false);
    navigate(`/sell-nft/${id}`);
  };

  const handleYes = () => {
    setIsDialogOpen(false);
    setIsVerifying(true);
    
    // Simulate verification for 10 seconds
    setTimeout(() => {
      setIsVerifying(false);
      navigate(`/sell-nft/${id}/price`);
    }, 10000);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-secondary/50 rounded w-1/4 mx-auto"></div>
            <div className="h-96 bg-secondary/50 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="text-center">NFT not found</div>
      </div>
    );
  }

  // Check if the user is the owner
  if (nft.owner_id !== user?.id) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">You don't own this NFT</h2>
          <Link to="/profile" className="text-primary hover:underline">
            Go back to your profile
          </Link>
        </div>
      </div>
    );
  }

  if (!marketplace) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">No marketplace selected</h2>
          <Link to={`/sell-nft/${id}`} className="text-primary hover:underline">
            Go back to select a marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] relative overflow-hidden bg-gradient-to-b from-background via-background/80 to-background/60">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-500/10 via-pink-500/5 to-primary/10 blur-3xl -z-10" />
      
      <div className="container mx-auto px-4 pt-24 pb-16 relative">
        <Link
          to={`/sell-nft/${id}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 mb-8 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          <div className="relative z-10 flex items-center gap-2 px-6 py-2.5 bg-white/5 rounded-full backdrop-blur-xl border border-white/10 group-hover:border-primary/20 shadow-lg group-hover:shadow-primary/20">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Marketplace Selection
          </div>
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-primary">Sell Your NFT</h1>
            <p className="text-lg text-muted-foreground">You've selected {marketplaceName}</p>
          </div>

          {isVerifying ? (
            <Card className="border border-primary/20 bg-background/60 backdrop-blur-sm shadow-lg transition-all duration-700 p-8">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-16 w-16 text-primary animate-spin mb-8" />
                <h3 className="text-xl font-semibold mb-2">Verification in progress</h3>
                <p className="text-muted-foreground text-center mb-6">
                  We are verifying you are human
                </p>
                <div className="w-full max-w-md bg-white/5 rounded-full h-2 mb-2">
                  <div className="h-2 rounded-full bg-gradient-to-r from-primary to-purple-500 animate-[progress_10s_ease-in-out_forwards]"></div>
                </div>
                <style>
                  {`
                    @keyframes progress {
                      0% { width: 0%; }
                      100% { width: 100%; }
                    }
                  `}
                </style>
                <p className="text-xs text-muted-foreground">Please wait, this may take a moment...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="flex gap-6 mb-8 items-center justify-center">
              <div className="w-48 h-48 rounded-lg overflow-hidden border border-primary/20 shadow-lg shadow-primary/10">
                <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md border border-primary/20 bg-background/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Confirmation
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to sell this NFT on {marketplaceName}?
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-4">
            <img src={nft.image} alt={nft.name} className="w-32 h-32 object-cover rounded-lg border border-primary/20" />
          </div>
          <DialogFooter className="flex flex-row justify-center gap-4 sm:gap-6">
            <Button variant="outline" onClick={handleNo} className="flex-1">
              No
            </Button>
            <Button onClick={handleYes} className="flex-1">
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellNFTConfirmation;
