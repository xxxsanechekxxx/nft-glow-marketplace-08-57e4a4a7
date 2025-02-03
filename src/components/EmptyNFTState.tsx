import { Link } from "react-router-dom";
import { ShoppingBag, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useToast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";

export const EmptyNFTState = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateNFTClick = () => {
    toast({
      title: "Access Restricted",
      description: "To create NFTs, you need to either make a purchase or deposit funds first.",
      variant: "destructive"
    });
  };

  return (
    <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-background/60">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-6">
        <div className="relative">
          <ShoppingBag className="w-16 h-16 text-muted-foreground opacity-20" />
          <Plus className="w-6 h-6 text-primary absolute -right-1 -bottom-1 animate-pulse" />
        </div>
        
        <div className="space-y-2 max-w-sm">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            You don't have any NFTs yet
          </h3>
          <p className="text-muted-foreground">
            Start your collection by buying NFTs from the marketplace or create your own!
          </p>
        </div>

        <div className="flex gap-4 flex-wrap justify-center">
          <Button asChild className="bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
            <Link to="/marketplace">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Buy NFT
            </Link>
          </Button>
          <Button 
            variant="outline"
            onClick={handleCreateNFTClick}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create NFT
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};