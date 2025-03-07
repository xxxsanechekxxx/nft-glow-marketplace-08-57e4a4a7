
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
  properties?: Property[] | any; // Allow any to accommodate Json type from database
  token_standard?: string;
  owner_id?: string | null;
  for_sale?: boolean;
  marketplace?: string | null;
  marketplace_status?: string;
  created_at?: string;
}

export interface NFTBid {
  id: string;
  nft_id: string;
  bidder_address: string;
  bid_amount: string;
  created_at: string;
  marketplace: string;
  nft?: NFT; 
  bidder_rating?: string;
  bidder_verified?: boolean;
  verified?: boolean; // Additional field to match database
  bidder_joined?: string;
}
