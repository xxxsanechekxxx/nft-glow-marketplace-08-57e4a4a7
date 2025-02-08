
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Share2, Heart, User, Info, Coins, Eye, Award, Gem } from "lucide-react";
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
    <div className="container mx-auto px-4 pt-24 pb-16 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-primary/5 to-secondary/5 blur-3xl -z-10" />
      
      <Link
        to="/marketplace"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 mb-8 group bg-secondary/20 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-secondary/30"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
        Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-primary/20 rounded-2xl blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative aspect-square rounded-2xl overflow-hidden animate-fade-in shadow-2xl border border-white/10 group-hover:border-primary/20 transition-colors duration-300">
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="backdrop-blur-md bg-background/20 hover:bg-background/40 transition-all duration-300"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="backdrop-blur-md bg-background/20 hover:bg-background/40 transition-all duration-300"
                onClick={handleLike}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent animate-gradient bg-300% pb-2">
              {nft.name}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground bg-secondary/20 px-4 py-2 rounded-full backdrop-blur-sm inline-block">
              <User className="h-4 w-4" />
              <span>Created by {nft.creator}</span>
            </div>
          </div>

          {nft.description && (
            <div className="space-y-2 text-muted-foreground backdrop-blur-sm bg-secondary/10 p-6 rounded-xl border border-secondary/20">
              <p>{nft.description}</p>
            </div>
          )}

          <div className="p-6 rounded-xl bg-gradient-to-br from-background/40 to-secondary/20 backdrop-blur-lg border border-white/10 hover:border-primary/20 transition-all duration-300 group">
            <div className="flex items-center gap-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
              <Coins className="h-6 w-6 text-primary" />
              <span>{nft.price} ETH</span>
            </div>
          </div>

          <div className="flex gap-4">
            {user ? (
              <Button 
                onClick={handlePurchase} 
                className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 hover:scale-[1.02] animate-shimmer"
                size="lg"
              >
                Purchase Now
              </Button>
            ) : (
              <AuthModal 
                trigger={
                  <Button className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300" size="lg">
                    Login to Purchase
                  </Button>
                }
              />
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              <h2 className="text-lg font-semibold">Details</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-secondary/10 backdrop-blur-lg border border-white/10 hover:border-primary/20 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-primary" />
                  <div className="text-sm text-muted-foreground">Token Standard</div>
                </div>
                <div className="font-medium">{nft.token_standard || 'ERC-721'}</div>
              </div>
              <div className="p-4 rounded-lg bg-secondary/10 backdrop-blur-lg border border-white/10 hover:border-primary/20 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-primary" />
                  <div className="text-sm text-muted-foreground">Chain</div>
                </div>
                <div className="font-medium">Ethereum</div>
              </div>
            </div>
            {nft.properties && nft.properties.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Gem className="h-4 w-4 text-primary" />
                  <div className="text-lg font-semibold">Properties</div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {nft.properties.map((prop, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-lg bg-secondary/10 backdrop-blur-lg border border-white/10 hover:border-primary/20 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="text-sm text-muted-foreground mb-1">{prop.key}</div>
                      <div className="font-medium">{prop.value}</div>
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
