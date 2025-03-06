import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Tag, CheckCircle, Sparkles, FileCheck } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { NFT } from "@/types/nft";
import { Card, CardContent } from "@/components/ui/card";

const SellNFTPrice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [marketplace, setMarketplace] = useState<string | null>(null);
  const [marketplaceName, setMarketplaceName] = useState<string>("selected marketplace");
  const queryClient = useQueryClient();
  
  // Platform fee percentage
  const PLATFORM_FEE_PERCENT = 2.5;

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
    if (savedMarketplace === 'purenft') setMarketplaceName('PureNFT.io');
    if (savedMarketplace === 'rarible') setMarketplaceName('Rarible.com');
    if (savedMarketplace === 'opensea') setMarketplaceName('OpenSea.io');
    if (savedMarketplace === 'looksrare') setMarketplaceName('LooksRare.org');
    if (savedMarketplace === 'dappradar') setMarketplaceName('DappRadar.com');
    if (savedMarketplace === 'debank') setMarketplaceName('DeBank.com');
  }, []);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimal point
    const value = e.target.value;
    if (/^(\d+)?(\.\d{0,6})?$/.test(value) || value === "") {
      setPrice(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!price || parseFloat(price) <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price greater than 0",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Calculate the amount seller will receive after platform fee
      const priceValue = parseFloat(price);
      const sellerReceives = priceValue * (1 - PLATFORM_FEE_PERCENT / 100);
      
      // Update the price, marketplace, and for_sale flag in the database
      const { error } = await supabase
        .from('nfts')
        .update({
          price: priceValue,
          marketplace: marketplace,
          for_sale: true  // Set for_sale flag to true
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // After successful update
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['nft', id] });
      queryClient.invalidateQueries({ queryKey: ['nfts'] });
      
      toast({
        title: "NFT listed for sale",
        description: `Your NFT is now listed for sale on ${marketplaceName} for ${price} ETH`,
      });
      
      // Redirect to marketplace after 3 seconds
      setTimeout(() => {
        navigate("/marketplace");
      }, 3000);
      
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error listing NFT:", error);
      toast({
        title: "Error listing NFT",
        description: "There was an error listing your NFT for sale. Please try again.",
        variant: "destructive",
      });
    }
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

  // Calculate seller's proceeds after platform fee
  const calculateSellerProceeds = () => {
    if (!price) return "0.0000";
    const priceValue = parseFloat(price);
    const sellerReceives = priceValue * (1 - PLATFORM_FEE_PERCENT / 100);
    return sellerReceives.toFixed(4);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#09081A] via-[#0E0D26] to-[#13123A] relative overflow-hidden py-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full filter blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse opacity-20"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full filter blur-3xl animate-pulse opacity-20"></div>
      </div>
      
      <div className="container max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400">
            Set Your Price
          </h1>
          <p className="text-lg text-purple-200/80 max-w-2xl mx-auto">
            Enter the amount you want to sell your NFT for on {marketplaceName}
          </p>
        </div>

        {isSuccess ? (
          <Card className="border-0 bg-gradient-to-b from-purple-900/40 to-purple-800/20 backdrop-blur-md shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 opacity-50"></div>
            <div className="absolute inset-0 border border-purple-500/20 rounded-lg"></div>
            
            <CardContent className="flex flex-col items-center justify-center py-12 px-6">
              <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-8 shadow-lg shadow-green-500/20">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-white">NFT Listed Successfully!</h3>
              <p className="text-lg text-purple-200/90 text-center mb-6 max-w-md">
                Your NFT is now listed for sale on {marketplaceName} for {price} ETH
              </p>
              
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <p className="text-purple-200/90">
                  You'll receive: <span className="text-green-400 font-medium">{calculateSellerProceeds()} ETH</span> after platform fee
                </p>
                <div className="flex items-center justify-center space-x-2 text-purple-300/70 text-sm mt-2">
                  <Sparkles className="h-4 w-4" />
                  <p>Redirecting to marketplace...</p>
                </div>
              </div>
              
              <div className="w-full max-w-xs mt-8 relative h-1.5">
                <div className="absolute inset-0 bg-purple-900/60 rounded-full"></div>
                <div className="h-1.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-[progress_3s_ease-in-out_forwards] relative"></div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            {/* NFT Preview Card */}
            <div className="lg:w-2/5">
              <div className="group relative rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl shadow-purple-500/5">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 z-10"></div>
                <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                  <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-1">{nft?.name}</h3>
                    <p className="text-purple-200/80 text-sm">Created by {nft?.creator}</p>
                  </div>
                </div>
                <img 
                  src={nft?.image} 
                  alt={nft?.name} 
                  className="w-full h-full object-cover aspect-square" 
                />
              </div>
              
              <div className="mt-6 p-5 bg-purple-900/20 backdrop-blur-md rounded-xl border border-purple-500/20">
                <div className="flex items-center gap-3 text-purple-200/80 mb-2">
                  <FileCheck className="h-5 w-5 text-purple-400" />
                  <span className="text-sm font-medium">Marketplace Details</span>
                </div>
                <div className="pl-8">
                  <p className="text-sm text-purple-200/60 mb-1">
                    <span className="text-purple-200/40 mr-2">Listing on:</span>
                    <span className="text-purple-300 font-medium">{marketplaceName}</span>
                  </p>
                  <p className="text-sm text-purple-200/60">
                    <span className="text-purple-200/40 mr-2">Network:</span>
                    <span className="text-purple-300 font-medium">Ethereum Mainnet</span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Price Setting Card */}
            <div className="lg:w-3/5">
              <Card className="border-0 h-full bg-gradient-to-b from-purple-900/40 to-purple-800/20 backdrop-blur-md shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 opacity-50"></div>
                <div className="absolute inset-0 border border-purple-500/20 rounded-lg"></div>
                
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                    Set Your Price
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label htmlFor="price" className="flex items-center gap-2 text-md font-medium text-purple-100">
                          <Tag className="h-5 w-5 text-purple-400" />
                          Price (ETH)
                        </label>
                        <div className="text-xs text-purple-300/60 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                          <span className="font-medium">Current Floor:</span> 0.24 ETH
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6">
                          <img 
                            src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                            alt="ETH"
                            className="h-5 w-5"
                          />
                        </div>
                        <Input
                          id="price"
                          type="text"
                          value={price}
                          onChange={handlePriceChange}
                          placeholder="0.00"
                          className="pl-12 py-6 text-lg border-purple-500/30 bg-purple-900/30 focus:border-purple-400 focus:ring-purple-400/50 shadow-inner shadow-purple-500/5"
                          required
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300/50 text-sm">
                          ETH
                        </div>
                      </div>
                      
                      <div className="space-y-3 mt-4">
                        <div className="flex items-center justify-between text-sm">
                          <p className="text-purple-200/60">Platform fee ({PLATFORM_FEE_PERCENT}%):</p>
                          {price && (
                            <p className="text-purple-200/60">
                              {(parseFloat(price) * PLATFORM_FEE_PERCENT / 100).toFixed(4)} ETH
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <p className="text-purple-200/60">You'll receive:</p> 
                          {price && (
                            <p className="text-green-400 font-medium">
                              {calculateSellerProceeds()} ETH
                            </p>
                          )}
                        </div>
                        
                        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent my-1"></div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        type="submit"
                        disabled={isSubmitting || !price}
                        className="w-full py-6 text-lg relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-100 group-hover:opacity-90 transition-opacity"></div>
                        <span className="relative z-10 font-bold flex items-center justify-center gap-2">
                          {isSubmitting ? (
                            <>
                              <span className="h-5 w-5 border-2 border-white/30 border-t-white/90 rounded-full animate-spin"></span>
                              Processing...
                            </>
                          ) : (
                            <>
                              List NFT for Sale
                              <Sparkles className="h-5 w-5 text-yellow-200 animate-pulse" />
                            </>
                          )}
                        </span>
                      </Button>
                      
                      <p className="text-center text-xs text-purple-200/50 mt-4">
                        By confirming, you agree to our Terms of Service and NFT Listing Policy
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellNFTPrice;
