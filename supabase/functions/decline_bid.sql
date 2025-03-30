
CREATE OR REPLACE FUNCTION public.decline_bid(bid_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_nft_id uuid;
  v_nft_owner_id uuid;
BEGIN
  -- Get bid details and NFT owner
  SELECT b.nft_id, n.owner_id
  INTO v_nft_id, v_nft_owner_id
  FROM public.nft_bids b
  JOIN public.nfts n ON b.nft_id = n.id
  WHERE b.id = bid_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Bid not found');
  END IF;
  
  -- Check if user is the owner of the NFT
  IF v_nft_owner_id <> auth.uid() THEN
    RETURN json_build_object('success', false, 'message', 'You are not the owner of this NFT');
  END IF;
  
  -- Delete the bid
  DELETE FROM public.nft_bids WHERE id = bid_id;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Bid declined successfully'
  );
END;
$function$;
