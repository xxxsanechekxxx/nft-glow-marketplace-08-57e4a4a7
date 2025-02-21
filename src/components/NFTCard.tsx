
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface NFTCardProps {
  id: string;
  image: string;
  name: string;
  price?: number;
}

export const NFTCard = ({ id, image, name, price }: NFTCardProps) => {
  return (
    <Link to={`/nft/${id}`}>
      <Card className="overflow-hidden border-primary/10 hover:border-primary/30 transition-colors group">
        <div className="aspect-square md:aspect-[4/5] relative overflow-hidden">
          <img
            src={image}
            alt={name}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="p-4 space-y-2 bg-gradient-to-b from-background/80 to-background">
          <h3 className="font-semibold text-lg text-white/90 truncate">{name}</h3>
          {price && (
            <p className="text-sm text-white/70">
              Price: {price} ETH
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
};
