
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { NFTImage } from "@/components/nft/NFTImage";
import { NFTHeader } from "@/components/nft/NFTHeader";
import { NFTDetails } from "@/components/nft/NFTDetails";
import { PurchaseButton } from "@/components/nft/PurchaseButton";
import { Badge } from "@/components/ui/badge";
import type { NFT } from "@/types/nft";

const NFTDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const { data: userData } = useQuery({
    queryKey: ['user-balance', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handlePurchaseComplete = () => {
    // Invalidate and refetch queries to update UI
    queryClient.invalidateQueries({ queryKey: ['nft', id] });
    queryClient.invalidateQueries({ queryKey: ['user-balance', user?.id] });
    queryClient.invalidateQueries({ queryKey: ['nfts'] });
    
    // Navigate to profile page after successful purchase
    setTimeout(() => {
      navigate('/profile');
    }, 2000);
  };

  // Get marketplace display name
  const getMarketplaceDisplay = () => {
    if (!nft?.marketplace) return null;
    
    const marketplaceMap: Record<string, string> = {
      'purenft': 'PureNFT.io',
      'rarible': 'Rarible.com',
      'opensea': 'OpenSea.io',
      'looksrare': 'LooksRare.org',
      'dappradar': 'DappRadar.com',
      'debank': 'DeBank.com'
    };
    
    return marketplaceMap[nft.marketplace] || nft.marketplace;
  };

  // Check if the NFT is owned by the current user
  const isOwned = nft?.owner_id === user?.id;
  
  // Check if NFT is for sale
  const isForSale = nft?.for_sale === true;

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

  return (
    <div className="min-h-[90vh] relative overflow-hidden bg-gradient-to-b from-background via-background/80 to-background/60">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-500/10 via-pink-500/5 to-primary/10 blur-3xl -z-10" />
      
      <div className="container mx-auto px-4 pt-24 pb-16 relative">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 mb-8 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          <div className="relative z-10 flex items-center gap-2 px-6 py-2.5 bg-white/5 rounded-full backdrop-blur-xl border border-white/10 group-hover:border-primary/20 shadow-lg group-hover:shadow-primary/20">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Marketplace
          </div>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="relative">
            <NFTImage image={nft.image} name={nft.name} />
            
            {nft.marketplace && isForSale && (
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-black/70 text-white border-white/20 backdrop-blur-md px-4 py-1.5 text-sm font-medium">
                  Listed on {getMarketplaceDisplay()}
                </Badge>
              </div>
            )}
          </div>

          <div className="space-y-8 animate-fade-in">
            <NFTHeader name={nft.name} creator={nft.creator} />
            
            {/* Display NFT Price */}
            <div className="relative group">
              <div className="absolute -inset-px bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur opacity-75 group-hover:opacity-100 transition-all duration-700" />
              <div className="relative flex items-center justify-between backdrop-blur-xl bg-white/5 p-6 rounded-xl border border-white/10 group-hover:border-primary/20 transition-all duration-300 group-hover:bg-white/10 shadow-lg group-hover:shadow-primary/20">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current price</p>
                  <div className="flex items-center gap-2">
                    <img 
                      src="/lovable-uploads/5a5e2e7d-5299-480e-974e-1a494f67ec68.png" 
                      alt="Ethereum"
                      className="h-6 w-6"
                    />
                    <span className="text-2xl font-bold bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
                      {nft.price}
                    </span>
                  </div>
                </div>
                {nft.owner_id && !isForSale && (
                  <div className="bg-white/10 px-4 py-2 rounded-full border border-white/10">
                    <p className="text-sm text-muted-foreground">
                      Already purchased
                    </p>
                  </div>
                )}
                {isOwned && (
                  <div className="bg-white/10 px-4 py-2 rounded-full border border-white/10">
                    <p className="text-sm text-muted-foreground">
                      You own this
                    </p>
                  </div>
                )}
              </div>
            </div>

            {nft.description && (
              <div className="relative group">
                <div className="absolute -inset-px bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-700" />
                <div className="relative space-y-2 text-muted-foreground backdrop-blur-xl bg-white/5 p-8 rounded-xl border border-white/10 group-hover:border-primary/20 transition-all duration-300 group-hover:bg-white/10 shadow-lg group-hover:shadow-primary/20">
                  <p className="leading-relaxed">{nft.description}</p>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              {isOwned ? (
                <div className="w-full py-4 px-6 text-center bg-white/10 border border-primary/20 rounded-lg backdrop-blur-xl">
                  <p className="text-lg text-primary font-medium">You own this NFT</p>
                </div>
              ) : (nft.owner_id && !isForSale) ? (
                <div className="w-full py-4 px-6 text-center bg-white/10 border border-white/10 rounded-lg backdrop-blur-xl">
                  <p className="text-lg text-muted-foreground">This NFT has already been purchased</p>
                </div>
              ) : (
                <PurchaseButton 
                  isLoggedIn={!!user}
                  onPurchase={handlePurchaseComplete}
                  nftId={nft.id}
                />
              )}
            </div>

            <NFTDetails 
              tokenStandard={nft.token_standard}
              properties={nft.properties}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetail;
