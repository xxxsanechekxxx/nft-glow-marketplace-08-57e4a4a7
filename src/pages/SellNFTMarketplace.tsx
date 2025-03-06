
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
    logoSvg: '<svg width="19" height="14" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.7927 3.74115C18.7927 5.56401 17.7277 6.47067 16.5308 6.78561C17.9633 7.21508 19 8.38897 19 10.25V13.6667H13.5337V10.4218C13.5337 9.42924 12.9494 9.0284 11.9504 9.0284H5.46627V13.6667H0V0H12.9871C16.248 0 18.7927 0.706239 18.7927 3.74115ZM5.46871 3.81832H12.8585V3.81891C12.8695 3.81852 12.8806 3.81832 12.8917 3.81832C13.3998 3.81832 13.8118 4.23545 13.8118 4.75C13.8118 5.26455 13.3998 5.68168 12.8917 5.68168C12.8806 5.68168 12.8695 5.68148 12.8585 5.68109V5.68168H5.46871V3.81832Z" fill="black"></path></svg>'
  },
  { 
    id: "opensea", 
    name: "OpenSea.io", 
    logoSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="20" height="20"><path fill="#2081E2" d="M50.4,0.5C22.8,0.3,0.3,22.8,0.5,50.4c0.2,26.9,22.2,48.8,49.1,49.1c27.7,0.2,50.2-22.3,49.9-49.9 C99.3,22.7,77.3,0.7,50.4,0.5z"/><path fill="#FFFFFF" d="M35.6,25.9c3.1,3.9,4.9,8.8,4.9,14.2c0,4.6-1.4,8.9-3.7,12.5H20.2L35.6,25.9L35.6,25.9z"/><path fill="#FFFFFF" d="M86.3,58.5c0,0.2-0.1,0.4-0.3,0.5c-1.1,0.5-4.8,2.2-6.4,4.4c-4,5.5-7,14.3-13.8,14.3H37.3 c-10.1,0-18.5-8-18.4-18.6c0-0.3,0.2-0.5,0.5-0.5h13.4c0.5,0,0.8,0.4,0.8,0.8v2.6c0,1.4,1.1,2.5,2.5,2.5h10.2v-5.9h-7 c4-5.1,6.4-11.5,6.4-18.5c0-7.8-3-14.9-7.9-20.2c3,0.3,5.8,0.9,8.4,1.7v-1.7c0-1.7,1.4-3.1,3.1-3.1c1.7,0,3.1,1.4,3.1,3.1v4 c9.5,4.4,15.8,11.8,15.8,20.2c0,4.9-2.1,9.5-5.8,13.3c-0.7,0.7-1.7,1.1-2.7,1.1h-7.2v5.9h9c1.9,0,5.4-3.7,7.1-5.9 c0,0,0.1-0.1,0.3-0.2c0.2-0.1,16.6-3.8,16.6-3.8c0.3-0.1,0.7,0.2,0.7,0.5L86.3,58.5L86.3,58.5z"/></svg>'
  },
  { 
    id: "looksrare", 
    name: "LooksRare.org", 
    logoSvg: '<svg width="22" height="22" viewBox="0 0 128 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M117.637 13.7243C115.858 13.7243 114.416 12.2829 114.416 10.5033C114.416 8.72366 115.858 7.28229 117.637 7.28229C119.415 7.28229 120.858 8.72366 120.858 10.5033C120.858 12.2829 119.415 13.7243 117.637 13.7243ZM116.236 10.5033C116.236 11.2771 116.864 11.9037 117.637 11.9037C118.41 11.9037 119.037 11.2771 119.037 10.5033C119.037 9.72954 118.41 9.10286 117.637 9.10286C116.864 9.10286 116.236 9.72954 116.236 10.5033Z" fill="#04CD58"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M107.273 10.5076L113.435 4.34137H121.838L128 10.5076L117.637 20.8665L107.273 10.5076ZM122.398 8.26257C119.78 5.63291 115.493 5.63293 112.875 8.26258L110.634 10.5033L112.875 12.744C115.493 15.3737 119.78 15.3737 122.398 12.744L124.639 10.5033L122.398 8.26257Z" fill="#04CD58"></path></svg>'
  },
  { 
    id: "dappradar", 
    name: "DappRadar.com", 
    logo: "/lovable-uploads/c6dc18ec-17e1-432d-bb25-474f413e9615.png" 
  },
  { 
    id: "debank", 
    name: "DeBank.com", 
    logoSvg: '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.8" fill-rule="evenodd" clip-rule="evenodd" d="M25.7973 19.6C25.7973 24.2392 21.9801 28 17.2714 28H1.16669V22.4H17.2714C18.8409 22.4 20.1134 21.1464 20.1134 19.6C20.1134 18.0536 18.8409 16.8 17.2714 16.8H11.5874V11.2H17.2714C18.8409 11.2 20.1134 9.9464 20.1134 8.4C20.1134 6.8536 18.8409 5.6 17.2714 5.6H1.16669V0H17.2714C21.9801 0 25.7973 3.76081 25.7973 8.4C25.7973 10.5514 24.9764 12.5139 23.6264 14C24.9764 15.4861 25.7973 17.4486 25.7973 19.6Z" fill="#FE815F"></path><path opacity="0.12" fill-rule="evenodd" clip-rule="evenodd" d="M1.16671 5.6H14.999C12.0608 2.19955 7.3829 0 2.11404 0C1.79603 0 1.48016 0.008013 1.16671 0.0238194V5.6ZM17.8966 16.8H12.5347V11.2H17.8966C18.1078 12.1047 18.2187 13.0411 18.2187 14C18.2187 14.9589 18.1078 15.8953 17.8966 16.8ZM1.16669 22.4H14.9989C12.0608 25.8005 7.38288 28 2.11402 28C1.79601 28 1.48014 27.992 1.16669 27.9762V22.4Z" fill="black"></path><path d="M1.16669 0C9.01465 0 15.3767 6.26801 15.3767 14C15.3767 21.732 9.01465 28 1.16669 28V22.4C5.87547 22.4 9.69269 18.6392 9.69269 14C9.69269 9.36081 5.87547 5.6 1.16669 5.6V0Z" fill="#FF6238"></path></svg>'
  },
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
                        {marketplace.logoSvg ? (
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
