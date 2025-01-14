import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { NFT_DATA } from "@/data/nfts";
import { ArrowLeft, Share2, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NFTDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const nft = NFT_DATA.find((nft) => nft.id === id);

  if (!nft) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <h1>NFT not found</h1>
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
      description: "Like functionality will be available soon!",
    });
  };

  return (
    <div className="container mx-auto px-4 pt-24">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/marketplace")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplace
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* NFT Image Section */}
        <div className="relative group">
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full rounded-lg shadow-xl"
          />
          <div className="absolute top-4 right-4 space-x-2">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full"
              onClick={handleLike}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* NFT Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{nft.name}</h1>
            <p className="text-muted-foreground">Created by {nft.creator}</p>
          </div>

          <div className="p-6 bg-card rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4">Current Price</h2>
            <div className="flex items-baseline space-x-2 mb-6">
              <span className="text-3xl font-bold">{nft.price}</span>
              <span className="text-xl">ETH</span>
            </div>
            <Button className="w-full" size="lg" onClick={handlePurchase}>
              Purchase Now
            </Button>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Contract Address</span>
                <span className="font-mono">0x1234...5678</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Token ID</span>
                <span>{nft.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Token Standard</span>
                <span>ERC-721</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Blockchain</span>
                <span>Ethereum</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetail;