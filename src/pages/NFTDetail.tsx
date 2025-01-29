import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { NFTCard } from "@/components/NFTCard";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const NFTDetail = () => {
  const { id } = useParams();
  const [nft, setNft] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNFT = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/nfts/${id}`);
        setNft(response.data);
      } catch (error) {
        toast.error("Failed to fetch NFT details");
      } finally {
        setLoading(false);
      }
    };

    fetchNFT();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  if (!nft) {
    return <div className="text-center">NFT not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <NFTCard {...nft} />
      <Button className="mt-4">Buy Now</Button>
    </div>
  );
};

export default NFTDetail;
