import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface NFTCardProps {
  id: string;
  name: string;
  image: string;
  price: string;
  creator: string;
}

export const NFTCard = ({ id, name, image, price, creator }: NFTCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePurchase = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Connect your wallet",
      description: "Please connect your Ethereum wallet to make a purchase.",
    });
  };

  return (
    <div 
      className="nft-card group cursor-pointer rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300"
      onClick={() => navigate(`/nft/${id}`)}
    >
      <div className="aspect-square overflow-hidden rounded-t-lg">
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
  );
};