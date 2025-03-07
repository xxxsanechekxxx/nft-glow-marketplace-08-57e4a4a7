
export interface Property {
  key: string;
  value: string;
}

export interface NFT {
  id: string;
  name: string;
  image: string;
  price: string;
  creator: string;
  description?: string;
  properties?: Property[];
  token_standard?: string;
  owner_id?: string | null;
  for_sale?: boolean;
  marketplace?: string | null;
  marketplace_status?: string;
}

export interface NFTBid {
  id: string;
  nft_id: string;
  bidder_address: string;
  bid_amount: string;
  created_at: string;
  marketplace: string;
  nft?: NFT; // Make nft optional to fix the TypeScript error
}
