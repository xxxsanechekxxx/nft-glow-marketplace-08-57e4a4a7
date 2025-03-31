
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Check, X, ExternalLink, Edit } from "lucide-react";
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

  const handleCancelSale = async () => {
    if (onCancelSale) {
      await onCancelSale(id);
      setShowCancelDialog(false);
    }
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

  if (isGridView) {
    return (
      <>
        <Link to={`/nft/${id}`} className="block group">
          <div className="relative rounded-xl overflow-hidden">
            <div className="bg-[#2E2243] border border-[#65539E]/30 rounded-xl">
              {/* Marketplace badge */}
              {marketplace && isForSale && (
                <div className="absolute top-2 left-2 z-10">
                  <Badge 
                    variant="outline" 
                    className="flex items-center gap-1 bg-black/60 text-white border-white/20 px-2 py-1 text-xs rounded-md"
                  >
                    {getMarketplaceDisplay()}
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </Badge>
                </div>
              )}
              
              {/* For Sale badge */}
              {isForSale && (
                <div className="absolute top-2 right-2 z-10">
                  <Badge 
                    variant="outline" 
                    className="bg-green-500/50 text-white border-green-500/30 px-2 py-1 text-xs rounded-md"
                  >
                    For Sale
                  </Badge>
                </div>
              )}
              
              {/* NFT Image */}
              <div className="aspect-square w-full overflow-hidden relative max-h-[250px]">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* NFT Info */}
              <div className="p-3 space-y-1">
                <h3 className="font-medium text-base text-white line-clamp-1">
                  {name}
                </h3>
                
                <p className="text-xs text-purple-300/80 line-clamp-1">
                  by {creator}
                </p>
                
                <div className="flex items-center justify-between pt-2 border-t border-purple-500/20 mt-2">
                  {isEditingPrice ? (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <Input 
                        type="number" 
                        value={newPrice} 
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="h-8 w-16 text-xs"
                        min="0.01"
                        step="0.01"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Button 
                        size="icon" 
                        className="h-6 w-6"
                        variant="ghost"
                        onClick={handleSavePrice}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="icon" 
                        className="h-6 w-6"
                        variant="ghost"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <img 
                        src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                        alt="ETH"
                        className="h-4 w-4"
                      />
                      <span className="text-sm font-medium text-white">
                        {price}
                      </span>
                    </div>
                  )}
                  
                  {/* Action buttons */}
                  {isProfileView && isForSale && (
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      {!isEditingPrice && (
                        <Button 
                          onClick={handleEditPrice} 
                          size="nftAction"
                          variant="secondary"
                          className="h-6 px-2 py-0 text-xs rounded-md bg-purple-500/20"
                          title="Edit Price"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                      <Button 
                        onClick={openCancelDialog} 
                        size="nftAction"
                        variant="secondary"
                        className="h-6 px-2 py-0 text-xs rounded-md bg-red-500/20 text-red-300"
                        title="Cancel Sale"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
        
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent className="bg-[#2E2243] border border-[#65539E]/30">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold">Cancel NFT Sale</AlertDialogTitle>
              <AlertDialogDescription className="text-purple-300/80">
                Are you sure you want to cancel the sale of <span className="text-purple-300 font-medium">"{name}"</span>? This will remove the NFT from all marketplaces.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel 
                onClick={(e) => e.stopPropagation()}
                className="border-purple-500/20 bg-[#2E2243] hover:bg-[#3B2C59]"
              >
                No, keep it listed
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelSale();
                }}
                className="bg-red-500/80 text-white hover:bg-red-500"
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
        <div className="relative rounded-xl overflow-hidden">
          <div className="bg-[#2E2243] border border-[#65539E]/30 rounded-xl">
            <div className="flex flex-col sm:flex-row">
              {/* Image section */}
              <div className="sm:w-1/4 lg:w-1/5 relative">
                <div className="h-full aspect-square overflow-hidden">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Marketplace badge */}
                {marketplace && isForSale && (
                  <div className="absolute bottom-2 left-2 z-10">
                    <Badge 
                      variant="outline" 
                      className="flex items-center gap-1 bg-black/60 text-white border-white/20 px-2 py-0.5 text-xs"
                    >
                      {getMarketplaceDisplay()}
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </Badge>
                  </div>
                )}
                
                {/* For Sale badge */}
                {isForSale && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge 
                      variant="outline" 
                      className="bg-green-500/50 text-white border-green-500/30 px-2 py-1 text-xs"
                    >
                      For Sale
                    </Badge>
                  </div>
                )}
              </div>
              
              {/* Content section */}
              <div className="sm:w-3/4 lg:w-4/5 p-4 flex flex-col sm:flex-row justify-between">
                <div className="space-y-1 sm:w-1/2">
                  <h3 className="font-medium text-base md:text-lg text-white">
                    {name}
                  </h3>
                  
                  <p className="text-xs text-purple-300/80">
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
                  {isProfileView && isForSale && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-2">
                        {!isEditingPrice && (
                          <Button 
                            onClick={handleEditPrice} 
                            variant="secondary"
                            className="h-8 px-3 text-xs rounded-md bg-purple-500/20"
                            title="Edit Price"
                          >
                            <Edit className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                        )}
                        <Button 
                          onClick={openCancelDialog} 
                          variant="secondary"
                          className="h-8 px-3 text-xs rounded-md bg-red-500/20 text-red-300"
                          title="Cancel Sale"
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
      
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="bg-[#2E2243] border border-[#65539E]/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold">Cancel NFT Sale</AlertDialogTitle>
            <AlertDialogDescription className="text-purple-300/80">
              Are you sure you want to cancel the sale of <span className="text-purple-300 font-medium">"{name}"</span>? This will remove the NFT from all marketplaces.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel 
              onClick={(e) => e.stopPropagation()}
              className="border-purple-500/20 bg-[#2E2243] hover:bg-[#3B2C59]"
            >
              No, keep it listed
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.stopPropagation();
                handleCancelSale();
              }}
              className="bg-red-500/80 text-white hover:bg-red-500"
            >
              Yes, cancel sale
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
