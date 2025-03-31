
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
    <div className="relative">
      <div className="bg-[#2E2243] border border-[#65539E]/30 rounded-xl overflow-hidden relative">
        <div className="aspect-square w-full overflow-hidden flex items-center justify-center relative">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-black/40 hover:bg-black/60 border border-white/10"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-black/40 hover:bg-black/60 border border-white/10"
              onClick={handleLike}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
