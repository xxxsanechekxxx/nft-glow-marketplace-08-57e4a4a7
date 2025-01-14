export const NFT_DATA = [
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
  {
    id: "5",
    name: "Neon Dreams",
    image: "https://images.unsplash.com/photo-1633101585411-8b1eaa9e0e5b",
    price: "2.1",
    creator: "NeonMaster",
  },
  {
    id: "6",
    name: "Cyber Punk",
    image: "https://images.unsplash.com/photo-1618172193763-c511deb635ca",
    price: "1.8",
    creator: "CyberCreator",
  },
  {
    id: "7",
    name: "Digital Wave",
    image: "https://images.unsplash.com/photo-1618172193622-ae2d025f4032",
    price: "1.3",
    creator: "WaveArtist",
  },
  {
    id: "8",
    name: "Meta Universe",
    image: "https://images.unsplash.com/photo-1618172193679-f7cd2d69c197",
    price: "2.5",
    creator: "MetaCreator",
  },
  {
    id: "9",
    name: "Virtual Reality",
    image: "https://images.unsplash.com/photo-1633101585445-d8fc48b1c72a",
    price: "1.9",
    creator: "VRMaster",
  },
  {
    id: "10",
    name: "Digital Art #42",
    image: "https://images.unsplash.com/photo-1618172193555-37461444e4c3",
    price: "1.6",
    creator: "DigitalMaster",
  },
  // ... добавляем еще 20 NFT с разными изображениями
  {
    id: "11",
    name: "Ethereal Beauty",
    image: "https://images.unsplash.com/photo-1618172193679-f7cd2d69c197",
    price: "2.2",
    creator: "EtherealArtist",
  },
  // ... продолжаем до 30 NFT
];

export const fetchNFTs = (page: number, limit: number = 8) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  const hasMore = end < NFT_DATA.length;
  
  return {
    nfts: NFT_DATA.slice(start, end),
    hasMore,
    total: NFT_DATA.length
  };
};