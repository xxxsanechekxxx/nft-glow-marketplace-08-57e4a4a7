
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import React from "react";

interface NFTCardProps {
  id: string;
  name: string;
  image: string;
  price: string;
  creator: string;
}

export const NFTCard = ({ id, name, image, price, creator }: NFTCardProps) => {
  const navigate = useNavigate();

  const handlePurchase = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/nft/${id}`);
  };

  return (
    <Link to={`/nft/${id}`} className="block group">
      <div className="rounded-xl overflow-hidden bg-background/60 backdrop-blur-sm border border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-700">
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-lg transition-colors duration-700 group-hover:text-primary">{name}</h3>
          <p className="text-sm text-muted-foreground">by {creator}</p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm font-medium flex items-center gap-1 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              <Coins className="h-4 w-4 transition-transform duration-700 group-hover:rotate-12" />
              {price} ETH
            </span>
            <Button 
              onClick={handlePurchase} 
              size="sm"
              className="transition-all duration-700 hover:scale-105"
            >
              Purchase
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};
