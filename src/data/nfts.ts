import { supabase } from "@/lib/supabase";

export interface NFT {
  id: string;
  name: string;
  image: string;
  price: string;
  creator: string;
  endTime: string;
}

export interface NFTsResponse {
  nfts: NFT[];
  hasMore: boolean;
  total: number;
}

export const fetchNFTs = async (page: number, limit: number = 8): Promise<NFTsResponse> => {
  const start = (page - 1) * limit;
  
  // Get total count
  const { count } = await supabase
    .from('nfts')
    .select('*', { count: 'exact', head: true });

  // Fetch paginated data
  const { data: nfts, error } = await supabase
    .from('nfts')
    .select('*')
    .range(start, start + limit - 1)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching NFTs:', error);
    throw new Error('Failed to fetch NFTs');
  }

  return {
    nfts: nfts || [],
    hasMore: count ? start + limit < count : false,
    total: count || 0
  };
};