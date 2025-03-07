
import { supabase } from "@/integrations/supabase/client";
import type { NFT } from "@/types/nft";

export const addBidToNFT = async (
  nftId: string,
  bidderAddress: string,
  bidAmount: string,
  marketplace?: string | null
) => {
  // Verify the NFT exists first to avoid foreign key constraint errors
  const { data: nftExists, error: nftCheckError } = await supabase
    .from('nfts')
    .select('id')
    .eq('id', nftId)
    .single();
  
  if (nftCheckError || !nftExists) {
    throw new Error(`NFT with ID ${nftId} doesn't exist. Please check the NFT ID.`);
  }
  
  // Format the bid amount as a string
  const formattedBidAmount = bidAmount.toString();
  
  // Create the new bid
  const { data, error } = await supabase
    .from('nft_bids')
    .insert({
      nft_id: nftId,
      bidder_address: bidderAddress,
      bid_amount: formattedBidAmount,
      marketplace: marketplace || null,
      verified: false // Default to unverified
    })
    .select();
  
  if (error) {
    console.error("Error creating bid:", error);
    throw error;
  }
  
  return data[0];
};

export const getBidsForNFT = async (nftId: string) => {
  const { data, error } = await supabase
    .from('nft_bids')
    .select('*')
    .eq('nft_id', nftId)
    .order('bid_amount', { ascending: false });
  
  if (error) {
    console.error("Error fetching bids:", error);
    throw error;
  }
  
  // Convert bid amounts to strings to match our NFTBid type
  return data.map(bid => ({
    ...bid,
    bid_amount: bid.bid_amount.toString()
  }));
};

export const getNFTById = async (nftId: string): Promise<NFT | null> => {
  const { data, error } = await supabase
    .from('nfts')
    .select('*')
    .eq('id', nftId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null;
    }
    console.error("Error fetching NFT:", error);
    throw error;
  }
  
  // Convert price to string to match our NFT type
  return {
    ...data,
    price: data.price.toString()
  } as NFT;
};
