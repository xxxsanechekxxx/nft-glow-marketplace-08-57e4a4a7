
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AuthModal } from "@/components/AuthModal";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface PurchaseButtonProps {
  isLoggedIn: boolean;
  onPurchase: () => void;
  nftId: string;
}

export const PurchaseButton = ({ isLoggedIn, onPurchase, nftId }: PurchaseButtonProps) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { toast } = useToast();

  const handlePurchase = async () => {
    if (!isLoggedIn) return;
    
    try {
      setIsPurchasing(true);
      
      const { data, error } = await supabase.rpc('purchase_nft', {
        nft_id: nftId
      });
      
      if (error) {
        throw error;
      }
      
      // Handle the response safely with type checking
      if (data && typeof data === 'object' && 'success' in data) {
        if (!data.success && 'message' in data) {
          toast({
            title: "Purchase Failed",
            description: String(data.message),
            variant: "destructive",
          });
          return;
        }
      } else {
        throw new Error("Unexpected response format");
      }
      
      toast({
        title: "Purchase Successful",
        description: "The NFT has been added to your collection!",
      });
      
      onPurchase();
    } catch (error: any) {
      console.error("Purchase error:", error);
      toast({
        title: "Purchase Error",
        description: error.message || "An error occurred during purchase",
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  return isLoggedIn ? (
    <Button 
      onClick={handlePurchase} 
      className="flex-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:from-primary/90 hover:via-purple-500/90 hover:to-pink-500/90 transition-all duration-500 hover:scale-[1.02] animate-shimmer shadow-lg hover:shadow-primary/20 text-lg py-6"
      size="lg"
      disabled={isPurchasing}
    >
      {isPurchasing ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Processing...
        </>
      ) : (
        "Purchase Now"
      )}
    </Button>
  ) : (
    <AuthModal 
      trigger={
        <Button className="flex-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:from-primary/90 hover:via-purple-500/90 hover:to-pink-500/90 transition-all duration-500 shadow-lg hover:shadow-primary/20 text-lg py-6" size="lg">
          Login to Purchase
        </Button>
      }
    />
  );
};
