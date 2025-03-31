
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Check, X, PencilLine, ShoppingCart, Tag, ExternalLink, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  viewMode?: 'grid' | 'list';
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
  viewMode = 'grid',
  onCancelSale,
  onUpdatePrice
}: NFTCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState(price);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  const isOwner = user?.id === owner_id;
  const isForSale = for_sale === true;
  const isGridView = viewMode === 'grid';

  const handlePurchase = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/nft/${id}`);
  };

  const handleSell = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/sell-nft/${id}`);
  };

  const handleCancelSale = async () => {
    if (onCancelSale) {
      await onCancelSale(id);
      setShowCancelDialog(false);
    }
  };

  const handleEditPrice = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditingPrice(true);
  };

  const handleSavePrice = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!newPrice || parseFloat(newPrice) <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price greater than 0.",
        variant: "destructive"
      });
      return;
    }
    
    if (onUpdatePrice) {
      await onUpdatePrice(id, newPrice);
      setIsEditingPrice(false);
    }
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditingPrice(false);
    setNewPrice(price);
  };

  const openCancelDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCancelDialog(true);
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

  // Grid view card
  if (isGridView) {
    return (
      <>
        <Link to={`/nft/${id}`} className="block group marketplace-nft-card">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/5 to-purple-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"></div>
            <div className="relative rounded-xl overflow-hidden bg-background/60 backdrop-blur-sm border border-primary/10 shadow-md hover:shadow-primary/10 transition-all duration-500 h-full">
              {isForSale && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge 
                    variant="outline" 
                    className="bg-emerald-500/30 text-emerald-300 border-emerald-500/30 backdrop-blur-sm px-2 py-1 text-xs font-medium animate-pulse"
                  >
                    For Sale
                  </Badge>
                </div>
              )}
              
              <div className="aspect-square overflow-hidden relative max-h-[250px] flex items-center justify-center group-hover:opacity-90 transition-opacity duration-300">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {marketplace && isForSale && (
                  <div className="absolute top-3 left-3 z-10">
                    <Badge 
                      variant="outline" 
                      className="flex items-center gap-1 bg-black/60 text-white border-white/20 backdrop-blur-md px-2 py-0.5 text-xs"
                    >
                      {getMarketplaceDisplay()}
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-base md:text-lg transition-colors duration-300 group-hover:text-primary line-clamp-1">
                  {name}
                </h3>
                
                <p className="text-xs text-muted-foreground line-clamp-1">
                  by {creator}
                </p>
                
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-primary/10">
                  {isEditingPrice ? (
                    <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                      <Input 
                        type="number" 
                        value={newPrice} 
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="h-8 w-20 text-xs"
                        min="0.01"
                        step="0.01"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Button 
                        size="icon" 
                        className="h-8 w-8"
                        variant="ghost"
                        onClick={handleSavePrice}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        className="h-8 w-8"
                        variant="ghost"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <img 
                        src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                        alt="ETH"
                        className="h-4 w-4"
                      />
                      <span className="text-base font-medium text-white">
                        {price}
                      </span>
                    </div>
                  )}
                  
                  {isProfileView ? (
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      {isForSale ? (
                        <>
                          {!isEditingPrice && (
                            <Button 
                              onClick={handleEditPrice} 
                              size="nftAction"
                              variant="nftAction"
                              className="flex gap-1 items-center"
                              title="Edit Price"
                            >
                              <Edit className="h-3 w-3" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                          )}
                          <Button 
                            onClick={openCancelDialog} 
                            size="nftAction"
                            variant="nftCancel"
                            className="flex gap-1 items-center"
                            title="Cancel Sale"
                          >
                            <X className="h-3 w-3" />
                            <span className="hidden sm:inline">Cancel</span>
                          </Button>
                        </>
                      ) : (
                        <Button 
                          onClick={handleSell} 
                          size="nftAction"
                          variant="nftSell"
                          className="flex items-center gap-1"
                        >
                          <Tag className="h-3 w-3" />
                          <span>Sell</span>
                        </Button>
                      )}
                    </div>
                  ) : (
                    !isProfileView && (
                      <Button 
                        onClick={(isOwner && !isForSale) ? handleSell : handlePurchase} 
                        size="nftAction"
                        variant={isOwner && !isForSale ? "nftSell" : "nftAction"}
                        className="flex items-center gap-1"
                      >
                        {(isOwner && !isForSale) ? (
                          <>
                            <Tag className="h-3 w-3" />
                            <span>Sell</span>
                          </>
                        ) : (isOwner ? (
                          <span>View</span>
                        ) : (
                          <>
                            <ShoppingCart className="h-3 w-3" />
                            <span>Buy</span>
                          </>
                        ))}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
        
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent className="bg-background/95 backdrop-blur-md border border-primary/20">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold">Cancel NFT Sale</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                Are you sure you want to cancel the sale of <span className="text-primary font-medium">"{name}"</span>? This will remove the NFT from all marketplaces.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel 
                onClick={(e) => e.stopPropagation()}
                className="border-primary/20 bg-background hover:bg-background/80"
              >
                No, keep it listed
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelSale();
                }}
                className="bg-destructive/90 text-destructive-foreground hover:bg-destructive"
              >
                Yes, cancel sale
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }
  
  // List view card
  return (
    <>
      <Link to={`/nft/${id}`} className="block group">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/5 to-purple-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          <div className="relative rounded-xl overflow-hidden bg-background/60 backdrop-blur-sm border border-primary/10 shadow-md hover:shadow-primary/10 transition-all duration-500">
            <div className="flex flex-col sm:flex-row">
              {/* Image section */}
              <div className="sm:w-1/4 lg:w-1/5 relative">
                <div className="aspect-square sm:h-full overflow-hidden relative max-h-[180px] sm:max-h-none flex items-center justify-center">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                {isForSale && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge 
                      variant="outline" 
                      className="bg-emerald-500/30 text-emerald-300 border-emerald-500/30 backdrop-blur-sm px-2 py-1 text-xs font-medium"
                    >
                      For Sale
                    </Badge>
                  </div>
                )}
                
                {marketplace && isForSale && (
                  <div className="absolute bottom-2 left-2 z-10">
                    <Badge 
                      variant="outline" 
                      className="flex items-center gap-1 bg-black/60 text-white border-white/20 backdrop-blur-md px-2 py-0.5 text-xs"
                    >
                      {getMarketplaceDisplay()}
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </Badge>
                  </div>
                )}
              </div>
              
              {/* Content section */}
              <div className="sm:w-3/4 lg:w-4/5 p-4 flex flex-col sm:flex-row justify-between">
                <div className="space-y-1 sm:w-1/2">
                  <h3 className="font-semibold text-base md:text-lg transition-colors duration-300 group-hover:text-primary">
                    {name}
                  </h3>
                  
                  <p className="text-xs text-muted-foreground">
                    by {creator}
                  </p>
                  
                  <div className="flex items-center gap-1 mt-2">
                    <img 
                      src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                      alt="ETH"
                      className="h-4 w-4"
                    />
                    <span className="text-base font-medium text-white">
                      {isEditingPrice ? (
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <Input 
                            type="number" 
                            value={newPrice} 
                            onChange={(e) => setNewPrice(e.target.value)}
                            className="h-8 w-24 text-xs"
                            min="0.01"
                            step="0.01"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Button 
                            size="icon" 
                            className="h-8 w-8"
                            variant="ghost"
                            onClick={handleSavePrice}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            className="h-8 w-8"
                            variant="ghost"
                            onClick={handleCancelEdit}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : price}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-2 mt-4 sm:mt-0">
                  {isProfileView ? (
                    <div onClick={(e) => e.stopPropagation()}>
                      {isForSale ? (
                        <div className="flex gap-2">
                          {!isEditingPrice && (
                            <Button 
                              onClick={handleEditPrice} 
                              variant="nftAction"
                              className="flex gap-1.5 items-center"
                              title="Edit Price"
                            >
                              <PencilLine className="h-3.5 w-3.5" />
                              <span>Edit Price</span>
                            </Button>
                          )}
                          <Button 
                            onClick={openCancelDialog} 
                            variant="nftCancel"
                            className="flex gap-1.5 items-center"
                            title="Cancel Sale"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Cancel Sale</span>
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          onClick={handleSell} 
                          variant="nftSell"
                          className="flex items-center gap-1.5"
                        >
                          <Tag className="h-3.5 w-3.5" />
                          <span>Sell NFT</span>
                        </Button>
                      )}
                    </div>
                  ) : (
                    !isProfileView && (
                      <Button 
                        onClick={(isOwner && !isForSale) ? handleSell : handlePurchase} 
                        variant={isOwner && !isForSale ? "nftSell" : "nftAction"}
                        className="flex items-center gap-1.5"
                      >
                        {(isOwner && !isForSale) ? (
                          <>
                            <Tag className="h-3.5 w-3.5" />
                            <span>Sell NFT</span>
                          </>
                        ) : (isOwner ? (
                          <span>View Details</span>
                        ) : (
                          <>
                            <ShoppingCart className="h-3.5 w-3.5" />
                            <span>Purchase Now</span>
                          </>
                        ))}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
      
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="bg-background/95 backdrop-blur-md border border-primary/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold">Cancel NFT Sale</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to cancel the sale of <span className="text-primary font-medium">"{name}"</span>? This will remove the NFT from all marketplaces.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel 
              onClick={(e) => e.stopPropagation()}
              className="border-primary/20 bg-background hover:bg-background/80"
            >
              No, keep it listed
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.stopPropagation();
                handleCancelSale();
              }}
              className="bg-destructive/90 text-destructive-foreground hover:bg-destructive"
            >
              Yes, cancel sale
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
