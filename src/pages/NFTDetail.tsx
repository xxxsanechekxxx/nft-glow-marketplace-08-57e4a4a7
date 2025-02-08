
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Share2, Heart, User, Info, Eye, Award, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/AuthModal";
import { cn } from "@/lib/utils";

interface Property {
  key: string;
  value: string;
}

interface NFT {
  id: string;
  name: string;
  image: string;
  price: string;
  creator: string;
  description?: string;
  properties?: Property[];
  token_standard?: string;
}

const NFTDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();

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

  const handlePurchase = async () => {
    if (!user) return;

    const nftPrice = parseFloat(nft?.price || "0");
    const userBalance = parseFloat(userData?.balance || "0");

    if (userBalance < nftPrice) {
      toast({
        title: "Insufficient funds",
        description: `Your balance (${userBalance} ETH) is less than the NFT price (${nftPrice} ETH)`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Purchase initiated",
      description: "Processing your purchase...",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "NFT link has been copied to clipboard",
    });
  };

  const handleLike = () => {
    toast({
      title: "Feature coming soon",
      description: "Liking NFTs will be available soon!",
    });
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

  return (
    <div className="container mx-auto px-4 pt-24 pb-16 relative min-h-[90vh]">
      {/* Enhanced background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-500/10 via-pink-500/5 to-secondary/10 blur-3xl -z-10" />
      <div className="absolute inset-0 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-secondary/5 to-purple-500/5 blur-3xl -z-10" />
      
      <Link
        to="/marketplace"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 mb-8 group bg-white/5 px-6 py-2.5 rounded-full backdrop-blur-xl hover:bg-white/10 border border-white/10 hover:border-primary/20 shadow-lg hover:shadow-primary/20"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
        Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="relative group">
          {/* Enhanced image container */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-2xl group-hover:opacity-75 transition-all duration-500 -z-10 opacity-0 group-hover:opacity-100" />
          <div className="relative aspect-square rounded-2xl overflow-hidden animate-fade-in shadow-2xl border border-white/10 group-hover:border-primary/20 transition-all duration-500">
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-full object-cover transition-all duration-700 hover:scale-110 group-hover:saturate-150"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 group-hover:opacity-0 transition-opacity duration-500" />
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="backdrop-blur-xl bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-primary/20 shadow-lg hover:shadow-primary/20"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="backdrop-blur-xl bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-primary/20 shadow-lg hover:shadow-primary/20"
                onClick={handleLike}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-purple-400 to-pink-500 bg-clip-text text-transparent animate-gradient bg-300% pb-2">
              {nft.name}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground bg-white/5 px-6 py-3 rounded-full backdrop-blur-xl border border-white/10 hover:border-primary/20 transition-all duration-300 hover:bg-white/10 inline-block shadow-lg hover:shadow-primary/20">
              <User className="h-4 w-4" />
              <span>Created by {nft.creator}</span>
            </div>
          </div>

          {nft.description && (
            <div className="space-y-2 text-muted-foreground backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-primary/20 transition-all duration-300 hover:bg-white/10 shadow-lg hover:shadow-primary/20">
              <p className="leading-relaxed">{nft.description}</p>
            </div>
          )}

          <div className="p-8 rounded-2xl bg-gradient-to-r from-[rgba(147,39,143,0.1)] to-[rgba(234,172,232,0.1)] backdrop-blur-xl border border-white/20 hover:border-primary/30 group">
            <div className="flex items-center gap-3 text-3xl font-bold">
              <img 
                src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                alt="ETH"
                className="h-8 w-8 text-primary"
              />
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                {nft.price}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            {user ? (
              <Button 
                onClick={handlePurchase} 
                className="flex-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:from-primary/90 hover:via-purple-500/90 hover:to-pink-500/90 transition-all duration-500 hover:scale-[1.02] animate-shimmer shadow-lg hover:shadow-primary/20 text-lg py-6"
                size="lg"
              >
                Purchase Now
              </Button>
            ) : (
              <AuthModal 
                trigger={
                  <Button className="flex-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:from-primary/90 hover:via-purple-500/90 hover:to-pink-500/90 transition-all duration-500 shadow-lg hover:shadow-primary/20 text-lg py-6" size="lg">
                    Login to Purchase
                  </Button>
                }
              />
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Details</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-primary/20 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 group shadow-lg hover:shadow-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-sm text-muted-foreground">Token Standard</div>
                </div>
                <div className="font-medium text-lg">{nft.token_standard || 'ERC-721'}</div>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-primary/20 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 group shadow-lg hover:shadow-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-sm text-muted-foreground">Rarity</div>
                </div>
                <div className="font-medium text-lg">Legendary</div>
              </div>
            </div>
            {nft.properties && nft.properties.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Gem className="h-5 w-5 text-primary" />
                  <div className="text-xl font-semibold">Properties</div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {nft.properties.map((prop, index) => (
                    <div 
                      key={index}
                      className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-primary/20 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 group shadow-lg hover:shadow-primary/20"
                    >
                      <div className="text-sm text-muted-foreground mb-2">{prop.key}</div>
                      <div className="font-medium text-lg">{prop.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetail;
