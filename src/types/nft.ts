
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
  marketplace_status?: 'unlisted' | 'waiting_for_bids' | 'available_bids' | 'sold';
}

export interface NFTBid {
  id: string;
  nft_id: string;
  bidder_address: string;
  bid_amount: string;
  status: 'active' | 'accepted' | 'declined' | 'expired';
  created_at: string;
  expires_at: string;
}
