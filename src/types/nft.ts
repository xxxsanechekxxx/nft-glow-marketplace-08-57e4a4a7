
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
}
