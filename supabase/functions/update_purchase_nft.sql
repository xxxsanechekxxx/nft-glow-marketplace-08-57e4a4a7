
CREATE OR REPLACE FUNCTION public.purchase_nft(nft_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_nft_price numeric;
  v_user_balance numeric;
  v_creator text;
  v_transaction_id uuid;
  v_owner_id uuid;
  v_for_sale boolean;
  v_seller_transaction_id uuid;
  v_platform_fee_percent numeric := 2.5;
  v_seller_receives numeric;
  v_frozen_until timestamp;
  v_currency_type text := 'eth'; -- Default currency is ETH
BEGIN
  -- Check if NFT exists and is available for purchase (either no owner or for_sale is true)
  SELECT price, creator, owner_id, for_sale INTO v_nft_price, v_creator, v_owner_id, v_for_sale
  FROM public.nfts
  WHERE id = nft_id AND (owner_id IS NULL OR for_sale = true);
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'NFT not found or not available for purchase');
  END IF;
  
  -- Check if the user is trying to buy their own NFT
  IF v_owner_id = auth.uid() THEN
    RETURN json_build_object('success', false, 'message', 'You cannot purchase your own NFT');
  END IF;
  
  -- Check if user has enough balance
  SELECT balance INTO v_user_balance
  FROM public.profiles
  WHERE user_id = auth.uid();
  
  IF v_user_balance < v_nft_price THEN
    RETURN json_build_object('success', false, 'message', 'Insufficient balance');
  END IF;

  -- Set frozen_until date (15 days from now)
  v_frozen_until := NOW() + INTERVAL '15 days';
  
  -- If there's an original owner, add the payment to their frozen_balance after deducting platform fee
  IF v_owner_id IS NOT NULL THEN
    -- Calculate amount seller receives after platform fee
    v_seller_receives := v_nft_price * (1 - v_platform_fee_percent / 100);
    
    -- Update seller's frozen_balance with the amount after commission
    UPDATE public.profiles
    SET frozen_balance = frozen_balance + v_seller_receives
    WHERE user_id = v_owner_id;
    
    -- Record transaction for seller (sale) with frozen_until date and is_frozen flag set to true
    INSERT INTO public.transactions (amount, type, item, status, user_id, frozen_until, is_frozen, currency_type)
    VALUES (v_seller_receives, 'sale', nft_id::text, 'completed', v_owner_id, v_frozen_until, true, v_currency_type)
    RETURNING id INTO v_seller_transaction_id;
  END IF;
  
  -- Update NFT ownership and for_sale status
  UPDATE public.nfts
  SET owner_id = auth.uid(), for_sale = false
  WHERE id = nft_id;
  
  -- Update buyer's balance with full price (buyer pays full price)
  UPDATE public.profiles
  SET balance = balance - v_nft_price
  WHERE user_id = auth.uid();
  
  -- Record transaction for buyer (purchase)
  INSERT INTO public.transactions (amount, type, item, status, user_id, currency_type)
  VALUES (v_nft_price, 'purchase', nft_id::text, 'completed', auth.uid(), v_currency_type)
  RETURNING id INTO v_transaction_id;
  
  RETURN json_build_object(
    'success', true, 
    'message', 'NFT purchased successfully',
    'transaction_id', v_transaction_id
  );
END;
$function$;
