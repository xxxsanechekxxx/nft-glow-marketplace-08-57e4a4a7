
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Check, X, PencilLine } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface NFTCardProps {
  id: string;
  name: string;
  image: string;
  price: string;
  creator: string;
  owner_id?: string | null;
  for_sale?: boolean;
  isProfileView?: boolean;
  onCancelSale?: (id: string) => Promise<void>;
  onUpdatePrice?: (id: string, price: string) => Promise<void>;
}

export const NFTCard = ({ 
  id, 
  name, 
  image, 
  price, 
  creator, 
  owner_id, 
  for_sale, 
  isProfileView = false,
  onCancelSale,
  onUpdatePrice
}: NFTCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState(price);
  
  const isOwner = user?.id === owner_id;
  const isForSale = for_sale === true;

  const handlePurchase = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/nft/${id}`);
  };

  const handleSell = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/sell-nft/${id}`);
  };

  const handleCancelSale = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (onCancelSale) {
      await onCancelSale(id);
      toast({
        title: "Sale cancelled",
        description: "Your NFT is no longer for sale.",
      });
    }
  };

  const handleEditPrice = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditingPrice(true);
  };

  const handleSavePrice = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (onUpdatePrice) {
      await onUpdatePrice(id, newPrice);
      setIsEditingPrice(false);
      toast({
        title: "Price updated",
        description: "Your NFT's price has been updated.",
      });
    }
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditingPrice(false);
    setNewPrice(price);
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
              {isEditingPrice ? (
                <div className="flex items-center gap-1 flex-1">
                  <Input 
                    type="number" 
                    value={newPrice} 
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="h-8 w-16"
                    min="0"
                    step="0.01"
                    onClick={(e) => e.preventDefault()}
                  />
                  <Button 
                    size="icon" 
                    className="h-7 w-7"
                    variant="ghost"
                    onClick={handleSavePrice}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    className="h-7 w-7"
                    variant="ghost"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <span className="text-sm font-medium flex items-center gap-1.5 text-white">
                  <img 
                    src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                    alt="ETH"
                    className="h-4 w-4"
                  />
                  {price}
                </span>
              )}
              
              {isProfileView ? (
                <div className="flex gap-1">
                  {isForSale ? (
                    <>
                      {!isEditingPrice && (
                        <Button 
                          onClick={handleEditPrice} 
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <PencilLine className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        onClick={handleCancelSale} 
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={handleSell} 
                      size="sm"
                      className="relative overflow-hidden transition-all duration-700 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                    >
                      <span className="relative z-10">Sell</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-purple-500/80 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </Button>
                  )}
                </div>
              ) : (
                !isProfileView && (
                  <Button 
                    onClick={(isOwner && !isForSale) ? handleSell : handlePurchase} 
                    size="sm"
                    className="relative overflow-hidden transition-all duration-700 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                  >
                    <span className="relative z-10">
                      {(isOwner && !isForSale) ? "Sell" : (isOwner ? "View" : "Purchase")}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-purple-500/80 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
