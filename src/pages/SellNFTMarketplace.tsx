
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
  { id: "purenft", name: "PureNFT.io", logo: "/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" },
  { 
    id: "rarible", 
    name: "Rarible.com", 
    logoSvg: '<svg width="19" height="14" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.7927 3.74115C18.7927 5.56401 17.7277 6.47067 16.5308 6.78561C17.9633 7.21508 19 8.38897 19 10.25V13.6667H13.5337V10.4218C13.5337 9.42924 12.9494 9.0284 11.9504 9.0284H5.46627V13.6667H0V0H12.9871C16.248 0 18.7927 0.706239 18.7927 3.74115ZM5.46871 3.81832H12.8585V3.81891C12.8695 3.81852 12.8806 3.81832 12.8917 3.81832C13.3998 3.81832 13.8118 4.23545 13.8118 4.75C13.8118 5.26455 13.3998 5.68168 12.8917 5.68168C12.8806 5.68168 12.8695 5.68148 12.8585 5.68109V5.68168H5.46871V3.81832Z" fill="white"></path></svg>'
  },
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
    <div className="bg-gradient-to-b from-[#09081A] via-[#0E0D26] to-[#13123A] relative overflow-hidden py-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full filter blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse opacity-20"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full filter blur-3xl animate-pulse opacity-20"></div>
      </div>
      
      <div className="container max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400">
            Select Marketplace
          </h1>
          <p className="text-lg text-purple-200/80 max-w-2xl mx-auto">
            Choose where you want to list your NFT for sale
          </p>
        </div>

        <div className="flex gap-6 mb-8">
          <div className="w-32 h-32 rounded-lg overflow-hidden border border-purple-500/20 shadow-lg">
            <img src={nft?.image} alt={nft?.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">{nft?.name}</h2>
            <p className="text-purple-200/70">Created by {nft?.creator}</p>
          </div>
        </div>

        <Card className="border-0 bg-gradient-to-b from-purple-900/40 to-purple-800/20 backdrop-blur-md shadow-xl relative overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 opacity-50"></div>
          <div className="absolute inset-0 border border-purple-500/20 rounded-lg"></div>
          
          <CardContent className="p-8">
            <RadioGroup 
              value={selectedMarketplace || ""} 
              onValueChange={setSelectedMarketplace}
              className="space-y-4"
            >
              {marketplaces.map((marketplace) => (
                <div
                  key={marketplace.id}
                  className="relative flex items-center"
                >
                  <RadioGroupItem 
                    value={marketplace.id} 
                    id={marketplace.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={marketplace.id}
                    className="flex items-center justify-between w-full p-4 rounded-lg border border-purple-500/20 hover:bg-purple-500/5 peer-data-[state=checked]:border-purple-400 peer-data-[state=checked]:bg-purple-500/10 cursor-pointer transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                        {marketplace.id === "rarible" ? (
                          <div dangerouslySetInnerHTML={{ __html: marketplace.logoSvg }} />
                        ) : (
                          <img src={marketplace.logo} alt={marketplace.name} className="w-5 h-5" />
                        )}
                      </div>
                      <span className="text-purple-100">{marketplace.name}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-end mt-8">
              <Button 
                onClick={handleContinue}
                disabled={!selectedMarketplace}
                className="relative overflow-hidden group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Continue to Confirmation
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellNFTMarketplace;
