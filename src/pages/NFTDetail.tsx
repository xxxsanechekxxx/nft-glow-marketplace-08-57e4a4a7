import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowLeft, Share2, Heart, DollarSign, User, Info, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CountdownTimer } from "@/components/CountdownTimer";
import { fetchNFTById } from "@/api/nfts";

const NFTDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [nft, setNft] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNFT = async () => {
      try {
        const data = await fetchNFTById(id!);
        setNft(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load NFT details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadNFT();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
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

  const handlePurchase = () => {
    toast({
      title: "Connect your wallet",
      description: "Please connect your Ethereum wallet to make a purchase.",
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

          <div 
            className="space-y-4 animate-fade-in" 
            style={{ animationDelay: "300ms" }}
          >
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              <h2 className="text-lg font-semibold">Auction Ends In</h2>
            </div>
            <CountdownTimer endTime={nft.endTime} />
          </div>

          <div 
            className="p-4 rounded-lg bg-secondary/50 animate-fade-in hover:scale-105 transition-transform duration-300" 
            style={{ animationDelay: "400ms" }}
          >
            <div className="flex items-center gap-2 text-2xl font-bold">
              <DollarSign className="h-6 w-6" />
              <span>{nft.price} ETH</span>
            </div>
          </div>

          <div 
            className="flex gap-4 animate-fade-in" 
            style={{ animationDelay: "600ms" }}
          >
            <Button 
              onClick={handlePurchase} 
              className="flex-1 hover:scale-105 transition-transform duration-300"
            >
              Purchase Now
            </Button>
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
                <div className="text-muted-foreground">Contract Address</div>
                <div className="font-mono">0x1234...5678</div>
              </div>
              <div className="hover:scale-105 transition-transform duration-300">
                <div className="text-muted-foreground">Token ID</div>
                <div className="font-mono">#{id}</div>
              </div>
              <div className="hover:scale-105 transition-transform duration-300">
                <div className="text-muted-foreground">Token Standard</div>
                <div>ERC-721</div>
              </div>
              <div className="hover:scale-105 transition-transform duration-300">
                <div className="text-muted-foreground">Blockchain</div>
                <div>Ethereum</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetail;