import { Link } from "react-router-dom";
import { ShoppingBag, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export const EmptyNFTState = () => {
  return (
    <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-background/60">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-6">
        <div className="relative">
          <ShoppingBag className="w-16 h-16 text-muted-foreground opacity-20" />
          <Plus className="w-6 h-6 text-primary absolute -right-1 -bottom-1 animate-pulse" />
        </div>
        
        <div className="space-y-2 max-w-sm">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            У вас пока нет NFT
          </h3>
          <p className="text-muted-foreground">
            Начните свою коллекцию, купив NFT на маркетплейсе или создав свой собственный!
          </p>
        </div>

        <div className="flex gap-4 flex-wrap justify-center">
          <Button asChild className="bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
            <Link to="/marketplace">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Купить NFT
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/create-nft">
              <Plus className="w-4 h-4 mr-2" />
              Создать NFT
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};