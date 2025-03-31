
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export const EmptyNFTState = () => {
  return (
    <Card className="border-[#65539E]/20 bg-[#2E2243]/80 rounded-xl">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-6">
        <div className="relative">
          <ShoppingBag className="w-16 h-16 text-purple-300/40" />
        </div>
        
        <div className="space-y-2 max-w-sm">
          <h3 className="text-xl font-semibold text-white">
            You don't have any NFTs yet
          </h3>
          <p className="text-purple-300/70">
            Start your collection by buying NFTs from the marketplace
          </p>
        </div>

        <div className="flex gap-4 flex-wrap justify-center">
          <Button asChild className="bg-[#65539E]/40 text-white hover:bg-[#65539E]/60 border border-[#65539E]/30">
            <Link to="/marketplace">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Browse Marketplace
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
