
CREATE OR REPLACE FUNCTION public.update_frozen_transaction_currency(transaction_id uuid, new_currency_type text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_transaction_record transactions%ROWTYPE;
BEGIN
  -- Get the transaction record
  SELECT * INTO v_transaction_record
  FROM public.transactions
  WHERE id = transaction_id AND user_id = auth.uid(); -- Only allow users to update their own transactions
  
  -- Check if transaction exists and belongs to the user
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Transaction not found or not authorized');
  END IF;
  
  -- Check if transaction is frozen (has frozen_until date)
  IF v_transaction_record.frozen_until IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Only frozen transactions can have their currency updated');
  END IF;
  
  -- Update the transaction currency
  UPDATE public.transactions
  SET currency_type = new_currency_type
  WHERE id = transaction_id;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Transaction currency updated successfully'
  );
END;
$function$;
