import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchNFTById } from "@/api/nfts";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Coins } from "lucide-react";

const NFTDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: nft, isLoading } = useQuery({
    queryKey: ['nft', id],
    queryFn: () => fetchNFTById(id as string),
  });

  const handlePurchase = () => {
    toast({
      title: "Connect your wallet",
      description: "Please connect your Ethereum wallet to make a purchase.",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-24 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold">NFT not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square overflow-hidden rounded-lg">
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{nft.name}</h1>
          <p className="text-muted-foreground">Created by {nft.creator}</p>
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            <span className="text-xl font-semibold">{nft.price} ETH</span>
          </div>
          <Button onClick={handlePurchase} className="w-full">
            Purchase NFT
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NFTDetail;