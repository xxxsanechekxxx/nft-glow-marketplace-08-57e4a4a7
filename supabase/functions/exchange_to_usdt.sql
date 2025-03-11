
CREATE OR REPLACE FUNCTION public.exchange_to_usdt(amount numeric, is_frozen boolean DEFAULT false)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_user_id uuid;
  v_balance numeric;
  v_frozen_balance numeric;
  v_rate numeric := 2074; -- Example fixed rate
  v_usdt_amount numeric;
  v_currency_from text;
  v_currency_to text;
BEGIN
  -- Get the user ID from the auth context
  v_user_id := auth.uid();
  
  -- Get user's current balance
  SELECT balance, frozen_balance INTO v_balance, v_frozen_balance
  FROM public.profiles
  WHERE user_id = v_user_id;
  
  -- Check if the user has sufficient balance
  IF is_frozen THEN
    -- Exchange from frozen ETH balance
    IF v_frozen_balance < amount THEN
      RETURN json_build_object('success', false, 'message', 'Insufficient frozen balance');
    END IF;
    v_currency_from := 'eth';
    v_currency_to := 'usdt';
    
    -- Calculate USDT amount
    v_usdt_amount := amount * v_rate;
    
    -- Update balances
    UPDATE public.profiles
    SET frozen_balance = frozen_balance - amount,
        frozen_usdt_balance = frozen_usdt_balance + v_usdt_amount
    WHERE user_id = v_user_id;
    
    -- Record transaction
    INSERT INTO public.transactions (user_id, type, amount, status, is_frozen, is_frozen_exchange, currency_type)
    VALUES (v_user_id, 'exchange', amount, 'completed', true, true, v_currency_to);
    
  ELSE
    -- Exchange from regular ETH balance
    IF v_balance < amount THEN
      RETURN json_build_object('success', false, 'message', 'Insufficient balance');
    END IF;
    v_currency_from := 'eth';
    v_currency_to := 'usdt';
    
    -- Calculate USDT amount
    v_usdt_amount := amount * v_rate;
    
    -- Update balances
    UPDATE public.profiles
    SET balance = balance - amount,
        usdt_balance = usdt_balance + v_usdt_amount
    WHERE user_id = v_user_id;
    
    -- Record transaction
    INSERT INTO public.transactions (user_id, type, amount, status, currency_type)
    VALUES (v_user_id, 'exchange', amount, 'completed', v_currency_to);
  END IF;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Exchange completed successfully',
    'from_currency', v_currency_from,
    'to_currency', v_currency_to,
    'amount', amount,
    'usdt_amount', v_usdt_amount
  );
END;
$function$;
