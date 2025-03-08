import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Check, X, PencilLine } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface NFTCardProps {
  id: string;
  name: string;
  image: string;
  price: string;
  creator: string;
  owner_id?: string | null;
  for_sale?: boolean;
  marketplace?: string | null;
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
  marketplace,
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

  const getMarketplaceDisplay = () => {
    if (!marketplace) return null;
    
    const marketplaceMap: Record<string, string> = {
      'purenft': 'PureNFT',
      'rarible': 'Rarible',
      'opensea': 'OpenSea',
      'looksrare': 'LooksRare',
      'dappradar': 'DappRadar',
      'debank': 'DeBank'
    };
    
    return marketplaceMap[marketplace] || marketplace;
  };

  return (
    <Link to={`/nft/${id}`} className="block group marketplace-nft-card">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-primary/10 to-purple-500/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105 pulse-glow" />
        <div className="relative rounded-xl overflow-hidden bg-background/60 backdrop-blur-sm border border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-700 h-full">
          <div className="aspect-square overflow-hidden relative max-h-[250px] sm:max-h-[350px] flex items-center justify-center">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
            />
            
            {marketplace && isForSale && (
              <div className="absolute top-2 left-2 z-10">
                <Badge 
                  variant="outline" 
                  className="bg-black/60 text-white border-white/20 backdrop-blur-md px-2 py-0.5 text-[10px] sm:text-xs"
                >
                  {getMarketplaceDisplay()}
                </Badge>
              </div>
            )}
          </div>
          <div className="p-3 sm:p-4 md:p-6 space-y-1 sm:space-y-2 md:space-y-3">
            <h3 className="font-semibold text-base sm:text-lg md:text-xl transition-colors duration-700 group-hover:text-primary line-clamp-1">{name}</h3>
            
            {marketplace && isForSale && (
              <p className="text-xs sm:text-sm text-[#9F9EA1] line-clamp-1">
                Listed on {getMarketplaceDisplay()}
              </p>
            )}
            
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground line-clamp-1">by {creator}</p>
            
            <div className="flex items-center justify-between mt-2 sm:mt-3 md:mt-5">
              {isEditingPrice ? (
                <div className="flex items-center gap-1 sm:gap-2 flex-1">
                  <Input 
                    type="number" 
                    value={newPrice} 
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="h-7 sm:h-8 md:h-10 w-16 sm:w-20 md:w-24 text-xs sm:text-sm"
                    min="0"
                    step="0.01"
                    onClick={(e) => e.preventDefault()}
                  />
                  <Button 
                    size="icon" 
                    className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                    variant="ghost"
                    onClick={handleSavePrice}
                  >
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  </Button>
                  <Button 
                    size="icon" 
                    className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                    variant="ghost"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  <img 
                    src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                    alt="ETH"
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5"
                  />
                  <span className="text-sm sm:text-base md:text-lg font-medium text-white">
                    {price}
                  </span>
                </div>
              )}
              
              {isProfileView ? (
                <div className="flex gap-1 sm:gap-2">
                  {isForSale ? (
                    <>
                      {!isEditingPrice && (
                        <Button 
                          onClick={handleEditPrice} 
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 p-0"
                        >
                          <PencilLine className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                        </Button>
                      )}
                      <Button 
                        onClick={handleCancelSale} 
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 p-0"
                      >
                        <X className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={handleSell} 
                      size="sm"
                      className="relative overflow-hidden transition-all duration-700 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 px-2 sm:px-3 md:px-5 py-1 h-7 sm:h-8 md:h-10 text-[10px] sm:text-xs md:text-sm"
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
                    className="relative overflow-hidden transition-all duration-700 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 px-2 sm:px-3 md:px-5 py-1 h-7 sm:h-8 md:h-10 text-[10px] sm:text-xs md:text-sm"
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
