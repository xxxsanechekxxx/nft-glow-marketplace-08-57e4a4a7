
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AuthModal } from "@/components/AuthModal";

interface PurchaseButtonProps {
  isLoggedIn: boolean;
  onPurchase: () => void;
}

export const PurchaseButton = ({ isLoggedIn, onPurchase }: PurchaseButtonProps) => {
  return isLoggedIn ? (
    <Button 
      onClick={onPurchase} 
      className="flex-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:from-primary/90 hover:via-purple-500/90 hover:to-pink-500/90 transition-all duration-500 hover:scale-[1.02] animate-shimmer shadow-lg hover:shadow-primary/20 text-lg py-6"
      size="lg"
    >
      Purchase Now
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
