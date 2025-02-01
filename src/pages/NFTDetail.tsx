import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Share2, Heart, User, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/AuthModal";

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
    if (!user) {
      return;
    }

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

    // Here you would implement the actual purchase logic
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
        <div className="text-center">Loading...</div>
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
    <div className="container mx-auto px-4 pt-24">
      <Link
        to="/marketplace"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 animate-fade-in"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square rounded-lg overflow-hidden animate-scale-in">
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="space-y-6 animate-fade-in">
          <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <h1 className="text-4xl font-bold mb-2">{nft.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Created by {nft.creator}</span>
            </div>
          </div>

          {nft.description && (
            <div 
              className="space-y-2 animate-fade-in" 
              style={{ animationDelay: "300ms" }}
            >
              <p className="text-muted-foreground">{nft.description}</p>
            </div>
          )}

          <div 
            className="p-4 rounded-lg bg-secondary/50 animate-fade-in hover:scale-105 transition-transform duration-300" 
            style={{ animationDelay: "400ms" }}
          >
            <div className="flex items-center gap-2 text-2xl font-bold">
              <span>{nft.price} ETH</span>
            </div>
          </div>

          <div 
            className="flex gap-4 animate-fade-in" 
            style={{ animationDelay: "600ms" }}
          >
            {user ? (
              <Button 
                onClick={handlePurchase} 
                className="flex-1 hover:scale-105 transition-transform duration-300"
              >
                Purchase Now
              </Button>
            ) : (
              <AuthModal 
                trigger={
                  <Button className="flex-1">
                    Login to Purchase
                  </Button>
                }
              />
            )}
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleShare}
              className="hover:scale-110 transition-transform duration-300"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleLike}
              className="hover:scale-110 transition-transform duration-300"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          <div 
            className="space-y-4 animate-fade-in" 
            style={{ animationDelay: "800ms" }}
          >
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <h2 className="text-lg font-semibold">Details</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="hover:scale-105 transition-transform duration-300">
                <div className="text-muted-foreground">Token Standard</div>
                <div>{nft.token_standard || 'ERC-721'}</div>
              </div>
              {nft.properties && nft.properties.length > 0 && (
                <div className="col-span-2 space-y-2">
                  <div className="text-lg font-semibold">Properties</div>
                  <div className="grid grid-cols-2 gap-2">
                    {nft.properties.map((prop, index) => (
                      <div 
                        key={index}
                        className="p-2 rounded-lg bg-secondary/30 hover:scale-105 transition-transform duration-300"
                      >
                        <div className="text-xs text-muted-foreground">{prop.key}</div>
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
    </div>
  );
};

export default NFTDetail;
