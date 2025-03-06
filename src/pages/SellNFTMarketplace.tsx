
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Globe } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { NFT } from "@/types/nft";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const marketplaces = [
  { id: "purenft", name: "PureNFT.com", logo: "/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" },
  { id: "rarible", name: "Rarible.com", logo: "/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" },
  { id: "opensea", name: "OpenSea.io", logo: "/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" },
  { id: "looksrare", name: "LooksRare.org", logo: "/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" },
  { id: "dappradar", name: "DappRadar.com", logo: "/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" },
  { id: "debank", name: "DeBank.com", logo: "/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" },
];

const SellNFTMarketplace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedMarketplace, setSelectedMarketplace] = useState<string | null>(null);

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

  const handleContinue = () => {
    if (!selectedMarketplace) {
      toast({
        title: "Select marketplace",
        description: "Please select a marketplace to continue",
        variant: "destructive",
      });
      return;
    }

    // Save selection to session storage for later steps
    sessionStorage.setItem('sellNFT_marketplace', selectedMarketplace);
    navigate(`/sell-nft/${id}/confirm`);
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

  return (
    <div className="min-h-[90vh] relative overflow-hidden bg-gradient-to-b from-background via-background/80 to-background/60">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-500/10 via-pink-500/5 to-primary/10 blur-3xl -z-10" />
      
      <div className="container mx-auto px-4 pt-24 pb-16 relative">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 mb-8 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          <div className="relative z-10 flex items-center gap-2 px-6 py-2.5 bg-white/5 rounded-full backdrop-blur-xl border border-white/10 group-hover:border-primary/20 shadow-lg group-hover:shadow-primary/20">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Profile
          </div>
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-primary">Sell Your NFT</h1>
            <p className="text-lg text-muted-foreground">Choose a marketplace where you want to sell your NFT</p>
          </div>

          <div className="flex gap-6 mb-8 items-center">
            <div className="w-32 h-32 rounded-lg overflow-hidden border border-primary/20 shadow-lg shadow-primary/10">
              <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{nft.name}</h2>
              <p className="text-muted-foreground">Created by {nft.creator}</p>
              <p className="flex items-center gap-1.5 mt-2">
                <img 
                  src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                  alt="ETH"
                  className="h-4 w-4"
                />
                <span>{nft.price}</span>
              </p>
            </div>
          </div>

          <Card className="border border-primary/20 bg-background/60 backdrop-blur-sm shadow-lg hover:shadow-primary/5 transition-all duration-700">
            <CardContent className="pt-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Select Marketplace
                </h3>
                
                <RadioGroup 
                  value={selectedMarketplace || ""} 
                  onValueChange={setSelectedMarketplace}
                  className="grid gap-4"
                >
                  {marketplaces.map((marketplace) => (
                    <div key={marketplace.id} className="flex items-center">
                      <RadioGroupItem 
                        value={marketplace.id} 
                        id={marketplace.id}
                        className="peer sr-only" 
                      />
                      <Label
                        htmlFor={marketplace.id}
                        className="flex items-center justify-between w-full p-4 rounded-lg border border-white/10 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                            <img src={marketplace.logo} alt={marketplace.name} className="w-5 h-5" />
                          </div>
                          <span>{marketplace.name}</span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleContinue}
                  disabled={!selectedMarketplace}
                  className="relative overflow-hidden transition-all duration-700 hover:scale-105 group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Continue
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-purple-500/80 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SellNFTMarketplace;
