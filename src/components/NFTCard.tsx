
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <div className="relative rounded-xl overflow-hidden bg-background/60 backdrop-blur-sm border border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-700">
          <div className="aspect-square overflow-hidden">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
            />
          </div>
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-lg transition-colors duration-700 group-hover:text-primary line-clamp-1">{name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">by {creator}</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm font-medium flex items-center gap-1.5 text-white">
                <img 
                  src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                  alt="ETH"
                  className="h-4 w-4"
                />
                {price}
              </span>
              <Button 
                onClick={handlePurchase} 
                size="sm"
                className="relative overflow-hidden transition-all duration-700 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
              >
                <span className="relative z-10">Purchase</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-purple-500/80 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
