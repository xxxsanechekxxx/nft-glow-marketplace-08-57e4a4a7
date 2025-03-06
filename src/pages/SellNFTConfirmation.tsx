
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, HelpCircle, Loader2, Sparkles, Shield } from "lucide-react";
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
    const savedMarketplace = sessionStorage.getItem('sellNFT_marketplace');
    setMarketplace(savedMarketplace);

    if (savedMarketplace === 'purenft') setMarketplaceName('PureNFT.io');
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
    <div className="min-h-[90vh] relative overflow-hidden bg-gradient-to-b from-background/95 via-background/80 to-background/60">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-500/20 via-pink-500/10 to-primary/20 blur-3xl -z-10" />
      <div className="absolute w-96 h-96 bg-primary/5 rounded-full blur-3xl -top-20 -right-20 animate-pulse duration-10000 -z-10" />
      <div className="absolute w-80 h-80 bg-purple-500/5 rounded-full blur-3xl bottom-20 -left-20 animate-pulse duration-7000 -z-10" />
      
      <div className="container mx-auto px-4 pt-24 pb-16 relative">
        {/* Enhanced back button */}
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
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center mb-3">
              <Sparkles className="text-primary h-6 w-6 mr-2 animate-pulse" />
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-purple-500">
                Sell Your NFT
              </h1>
              <Sparkles className="text-primary h-6 w-6 ml-2 animate-pulse" />
            </div>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              You've selected <span className="text-primary font-medium">{marketplaceName}</span> as your marketplace
            </p>
          </div>

          {isVerifying ? (
            <Card className="border border-primary/30 bg-background/60 backdrop-blur-sm shadow-lg shadow-primary/5 transition-all duration-700 p-8 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-purple-500/5 to-transparent"></div>
              <CardContent className="flex flex-col items-center justify-center py-12 relative z-10">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-8">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white">Verification in progress</h3>
                <p className="text-muted-foreground text-center mb-8 max-w-md">
                  We are verifying you are human and processing your request to list on {marketplaceName}
                </p>
                
                <div className="w-full max-w-md relative mb-4 h-2">
                  <div className="absolute inset-0 rounded-full bg-white/5"></div>
                  <div className="h-2 rounded-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-[progress_10s_ease-in-out_forwards] relative z-10"></div>
                </div>

                <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4 text-green-500" />
                  <p>Secure verification process</p>
                </div>
                
                <style>
                  {`
                    @keyframes progress {
                      0% { width: 0%; }
                      100% { width: 100%; }
                    }
                  `}
                </style>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-64 h-64 rounded-xl overflow-hidden border-2 border-primary/20 shadow-xl shadow-primary/10 mb-8 transition-all duration-300 hover:scale-105 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-purple-500/5 mix-blend-overlay z-10"></div>
                <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
              </div>
              
              <Card className="border border-primary/20 bg-background/60 backdrop-blur-sm shadow-lg transition-all duration-300 mb-6 w-full max-w-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4 mt-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium text-white">{nft.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Collection:</span>
                      <span className="font-medium text-white">{nft.collection || 'Personal Collection'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Marketplace:</span>
                      <span className="font-medium text-primary">{marketplaceName}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
            <div className="w-32 h-32 rounded-lg overflow-hidden border border-primary/20 shadow-lg relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
              <img src={nft.image} alt={nft.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
          </div>
          <DialogFooter className="flex flex-row justify-center gap-4 sm:gap-6">
            <Button variant="outline" onClick={handleNo} className="flex-1 border-primary/20 hover:bg-primary/5">
              No
            </Button>
            <Button onClick={handleYes} className="flex-1 bg-gradient-to-r from-primary to-purple-500 hover:opacity-90">
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellNFTConfirmation;
