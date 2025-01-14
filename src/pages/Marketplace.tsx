import { NFTCard } from "@/components/NFTCard";

const FEATURED_NFTS = [
  {
    id: "1",
    name: "Cosmic Dreamer #1",
    image: "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c",
    price: "0.85",
    creator: "CryptoArtist",
  },
  {
    id: "2",
    name: "Digital Horizon",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e",
    price: "1.2",
    creator: "DigitalCreator",
  },
  {
    id: "3",
    name: "Abstract Mind",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
    price: "0.95",
    creator: "ArtisticSoul",
  },
  {
    id: "4",
    name: "Future Vision",
    image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead",
    price: "1.5",
    creator: "FutureArtist",
  },
];

const Marketplace = () => {
  return (
    <div className="container mx-auto px-4 pt-24">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold mb-4">NFT Marketplace</h1>
        <p className="text-muted-foreground">
          Discover, collect, and sell extraordinary NFTs
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURED_NFTS.map((nft) => (
          <NFTCard key={nft.id} {...nft} />
        ))}
      </div>
    </div>
  );
};

export default Marketplace;