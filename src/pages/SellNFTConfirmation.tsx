
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Loader2, Shield, ArrowRight } from "lucide-react";
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
  const [marketplaceLogo, setMarketplaceLogo] = useState<string | null>(null);

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

    if (savedMarketplace === 'purenft') {
      setMarketplaceName('PureNFT.io');
      setMarketplaceLogo('/lovable-uploads/1a4506f1-61ef-49dd-a8e8-0ef41959d79d.png');
    }
    if (savedMarketplace === 'rarible') {
      setMarketplaceName('Rarible.com');
      setMarketplaceLogo('/lovable-uploads/4079ebe1-e8eb-4d32-b629-1baaaa70558f.png');
    }
    if (savedMarketplace === 'opensea') {
      setMarketplaceName('OpenSea.io');
      setMarketplaceLogo('/lovable-uploads/607e13eb-1487-4c92-9043-c1a7c6be55b0.png');
    }
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
    <div className="min-h-screen bg-gradient-to-b from-[#09081A] via-[#0E0D26] to-[#13123A] relative overflow-hidden py-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full filter blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse opacity-20"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full filter blur-3xl animate-pulse opacity-20"></div>
      </div>

      <div className="container max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400">
            Confirm Listing
          </h1>
          <p className="text-lg text-purple-200/80 max-w-2xl mx-auto">
            Verify the details before proceeding with {marketplaceName}
          </p>
        </div>

        {isVerifying ? (
          <Card className="border-0 bg-gradient-to-b from-purple-900/40 to-purple-800/20 backdrop-blur-md shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 opacity-50"></div>
            <div className="absolute inset-0 border border-purple-500/20 rounded-lg"></div>
            
            <CardContent className="flex flex-col items-center justify-center py-12 relative z-10">
              <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-8">
                <Loader2 className="h-10 w-10 text-purple-400 animate-spin" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white">Verification in progress</h3>
              <p className="text-purple-200/70 text-center mb-8">
                Connecting to {marketplaceName}. Verifying wallet signature...
              </p>
              
              <div className="w-full max-w-md relative mb-4 h-2">
                <div className="absolute inset-0 rounded-full bg-purple-500/10"></div>
                <div className="h-2 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 animate-[progress_10s_ease-in-out_forwards] relative z-10"></div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="border-0 bg-gradient-to-b from-purple-900/40 to-purple-800/20 backdrop-blur-md shadow-xl relative overflow-hidden mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 opacity-50"></div>
              <div className="absolute inset-0 border border-purple-500/20 rounded-lg"></div>
              
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-40 h-40 rounded-xl overflow-hidden border-2 border-purple-500/20">
                    <img src={nft?.image} alt={nft?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <h3 className="text-2xl font-semibold text-white">{nft?.name}</h3>
                    <div className="space-y-2 text-purple-200/70">
                      <p>Created by {nft?.creator}</p>
                      <div className="flex items-center gap-2">
                        <p>Listing on {marketplaceName}</p>
                        {marketplaceLogo && (
                          <div className="w-6 h-6 rounded-full overflow-hidden">
                            <img 
                              src={marketplaceLogo} 
                              alt={marketplaceName} 
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline" 
                onClick={handleNo}
                className="px-8 py-6 border-purple-500/20 hover:bg-purple-500/10 hover:border-purple-500/30 text-purple-100"
              >
                Go Back
              </Button>
              <Button 
                onClick={handleYes}
                className="px-8 py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Continue to Pricing
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SellNFTConfirmation;
