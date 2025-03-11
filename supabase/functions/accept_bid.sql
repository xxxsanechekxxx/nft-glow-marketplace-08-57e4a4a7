
CREATE OR REPLACE FUNCTION public.accept_bid(bid_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_nft_id uuid;
  v_bid_amount numeric;
  v_bidder_address text;
  v_nft_owner_id uuid;
  v_seller_receives numeric;
  v_platform_fee_percent numeric := 2.5;
  v_frozen_until timestamp;
  v_currency_type text := 'eth'; -- Default currency is ETH
BEGIN
  -- Get bid details
  SELECT b.nft_id, b.bid_amount, b.bidder_address, n.owner_id
  INTO v_nft_id, v_bid_amount, v_bidder_address, v_nft_owner_id
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
  
  -- Set frozen_until date (15 days from now)
  v_frozen_until := NOW() + INTERVAL '15 days';
  
  -- Calculate seller's received amount after platform fee
  v_seller_receives := v_bid_amount * (1 - v_platform_fee_percent / 100);
  
  -- Add to the seller's frozen balance
  UPDATE public.profiles
  SET frozen_balance = frozen_balance + v_seller_receives
  WHERE user_id = auth.uid();
  
  -- Update NFT ownership (will be marked as owned by the bidder)
  UPDATE public.nfts
  SET owner_id = NULL, bidder_wallet_address = v_bidder_address, for_sale = false
  WHERE id = v_nft_id;
  
  -- Record the sale transaction with currency_type
  INSERT INTO public.transactions (user_id, type, amount, status, item, frozen_until, currency_type)
  VALUES (auth.uid(), 'sale', v_seller_receives, 'completed', v_nft_id::text, v_frozen_until, v_currency_type);
  
  -- Mark the bid as accepted
  DELETE FROM public.nft_bids WHERE id = bid_id;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Bid accepted successfully'
  );
END;
$function$;
