
import { Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface NFTImageProps {
  image: string;
  name: string;
}

export const NFTImage = ({ image, name }: NFTImageProps) => {
  const { toast } = useToast();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "NFT link has been copied to clipboard",
    });
  };

  const handleLike = () => {
    toast({
      title: "Feature coming soon",
      description: "Liking NFTs will be available soon!",
    });
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-2xl group-hover:opacity-75 transition-all duration-500 -z-10 opacity-0 group-hover:opacity-100" />
      <div className="relative aspect-square rounded-2xl overflow-hidden animate-fade-in shadow-2xl border border-white/10 group-hover:border-primary/20 transition-all duration-500 flex items-center justify-center">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain transition-all duration-700 hover:scale-110 group-hover:saturate-150"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 group-hover:opacity-0 transition-opacity duration-500" />
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="backdrop-blur-xl bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-primary/20 shadow-lg hover:shadow-primary/20"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="backdrop-blur-xl bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-primary/20 shadow-lg hover:shadow-primary/20"
            onClick={handleLike}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
