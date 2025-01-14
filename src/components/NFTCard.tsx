import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface NFTCardProps {
  id: string;
  name: string;
  image: string;
  price: string;
  creator: string;
}

export const NFTCard = ({ id, name, image, price, creator }: NFTCardProps) => {
  const { toast } = useToast();

  const handlePurchase = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Connect your wallet",
      description: "Please connect your Ethereum wallet to make a purchase.",
    });
  };

  return (
    <Link to={`/nft/${id}`} className="block">
      <div className="nft-card group">
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground">by {creator}</p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm font-medium">{price} ETH</span>
            <Button onClick={handlePurchase} size="sm">
              Purchase
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};