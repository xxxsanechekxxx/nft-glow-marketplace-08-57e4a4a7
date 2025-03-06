
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Sparkles, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { NFT } from "@/types/nft";
import { Card, CardContent } from "@/components/ui/card";

const SellNFTConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
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
    navigate(`/sell-nft/${id}`);
  };

  const handleYes = () => {
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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background/95 -z-10" />
      <div className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl top-20 right-1/4 animate-pulse duration-10000 -z-10" />
      <div className="absolute w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -bottom-20 left-1/4 animate-pulse duration-8000 -z-10" />
      
      {/* Back button */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10">
        <Link
          to={`/sell-nft/${id}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 group"
        >
          <div className="relative z-10 flex items-center gap-2 px-4 py-2 bg-black/40 rounded-full backdrop-blur-xl border border-white/10 group-hover:border-primary/30">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Back
          </div>
        </Link>
      </div>

      <div className="max-w-md w-full mx-auto">
        {/* Title with decorative stars */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-2">
            <span className="text-purple-400">✧</span>
            <span className="text-white">Sell</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">Your NFT</span>
            <span className="text-purple-400">✧</span>
          </h1>
          <p className="text-lg text-gray-400 mt-2">
            You've selected <span className="text-purple-400">{marketplaceName}</span> as your marketplace
          </p>
        </div>

        {isVerifying ? (
          <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-lg shadow-xl shadow-purple-500/5 transition-all duration-700 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-primary/5 to-transparent"></div>
            <CardContent className="flex flex-col items-center justify-center py-12 relative z-10">
              <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-8">
                <Loader2 className="h-10 w-10 text-purple-400 animate-spin" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white">Verification in progress</h3>
              <p className="text-gray-400 text-center mb-8 max-w-md">
                We are verifying you are human and processing your request to list on {marketplaceName}
              </p>
              
              <div className="w-full max-w-md relative mb-4 h-2">
                <div className="absolute inset-0 rounded-full bg-white/5"></div>
                <div className="h-2 rounded-full bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 animate-[progress_10s_ease-in-out_forwards] relative z-10"></div>
              </div>

              <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
                <Shield className="h-4 w-4 text-green-400" />
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
          <>
            {/* NFT Image */}
            <div className="flex justify-center mb-8">
              <div className="w-64 h-64 rounded-xl overflow-hidden border-2 border-purple-500/20 shadow-xl shadow-purple-500/10 transition-all duration-300 hover:scale-105 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-primary/5 mix-blend-overlay z-10"></div>
                <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
              </div>
            </div>
            
            {/* NFT Info Card */}
            <Card className="border border-purple-500/20 bg-black/60 backdrop-blur-lg shadow-xl mb-8 w-full">
              <CardContent className="p-6">
                <div className="flex flex-col space-y-4 mt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="font-medium text-white">{nft.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Collection:</span>
                    <span className="font-medium text-white">{nft.properties?.find(prop => prop.key === 'collection')?.value || 'Personal Collection'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Marketplace:</span>
                    <span className="font-medium text-purple-400">{marketplaceName}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Confirmation Question */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-medium text-white mb-3">Are you sure you want to sell this NFT on {marketplaceName}?</h3>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline" 
                onClick={handleNo} 
                className="w-1/2 border-purple-500/20 hover:bg-purple-500/10 hover:border-purple-500/30 text-white"
              >
                No
              </Button>
              <Button 
                onClick={handleYes} 
                className="w-1/2 bg-gradient-to-r from-purple-500 to-purple-600 hover:opacity-90 text-white"
              >
                Yes
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SellNFTConfirmation;
