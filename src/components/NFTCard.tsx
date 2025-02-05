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
            <span className="text-sm font-medium flex items-center gap-1">
              <Coins className="h-4 w-4" />
              {price} ETH
            </span>
            <Button onClick={handlePurchase} size="sm">
              Purchase
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};