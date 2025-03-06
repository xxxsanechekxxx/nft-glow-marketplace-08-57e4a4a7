
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Tag, CheckCircle } from "lucide-react";
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
      // Update the price, marketplace, and for_sale flag in the database
      const { error } = await supabase
        .from('nfts')
        .update({
          price: parseFloat(price),
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

  return (
    <div className="min-h-[90vh] relative overflow-hidden bg-gradient-to-b from-background via-background/80 to-background/60">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-500/10 via-pink-500/5 to-primary/10 blur-3xl -z-10" />
      
      <div className="container mx-auto px-4 pt-24 pb-16 relative">
        <Link
          to={`/sell-nft/${id}/confirm`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 mb-8 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          <div className="relative z-10 flex items-center gap-2 px-6 py-2.5 bg-white/5 rounded-full backdrop-blur-xl border border-white/10 group-hover:border-primary/20 shadow-lg group-hover:shadow-primary/20">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Back
          </div>
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-primary">Set Your Price</h1>
            <p className="text-lg text-muted-foreground">Enter the amount you want to sell your NFT for on {marketplaceName}</p>
          </div>

          {isSuccess ? (
            <Card className="border border-primary/20 bg-background/60 backdrop-blur-sm shadow-lg transition-all duration-700 p-8">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mb-8" />
                <h3 className="text-xl font-semibold mb-2">NFT Listed Successfully!</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Your NFT is now listed for sale on {marketplaceName} for {price} ETH
                </p>
                <p className="text-sm text-muted-foreground">Redirecting to marketplace...</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-primary/20 bg-background/60 backdrop-blur-sm shadow-lg hover:shadow-primary/5 transition-all duration-700">
              <CardContent className="pt-6">
                <div className="flex gap-6 mb-8 items-center">
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-primary/20 shadow-lg shadow-primary/10">
                    <img src={nft?.image} alt={nft?.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{nft?.name}</h2>
                    <p className="text-muted-foreground">Created by {nft?.creator}</p>
                    <p className="text-muted-foreground">Listing on {marketplaceName}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="price" className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Tag className="h-4 w-4 text-primary" />
                      Price (ETH)
                    </label>
                    <div className="relative">
                      <Input
                        id="price"
                        type="text"
                        value={price}
                        onChange={handlePriceChange}
                        placeholder="0.00"
                        className="pl-10 border-primary/20 focus:border-primary"
                        required
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <img 
                          src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                          alt="ETH"
                          className="h-4 w-4"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Enter the price in ETH you want to sell this NFT for</p>
                  </div>

                  <Button 
                    type="submit"
                    disabled={isSubmitting || !price}
                    className="w-full relative overflow-hidden transition-all duration-700 hover:scale-105 group"
                  >
                    <span className="relative z-10">
                      {isSubmitting ? "Processing..." : "Confirm"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-purple-500/80 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellNFTPrice;
