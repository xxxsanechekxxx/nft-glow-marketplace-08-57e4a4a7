
CREATE OR REPLACE FUNCTION public.unfreeze_balances()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- If the transaction has a frozen_until date and it has passed
  IF OLD.frozen_until IS NOT NULL AND 
     OLD.frozen_until <= NOW() AND 
     NEW.frozen_until IS NULL THEN
     
    -- Check currency type to determine which balance to update
    IF OLD.currency_type = 'eth' OR OLD.currency_type IS NULL THEN
      -- Default to ETH if currency_type is not specified
      UPDATE public.profiles
      SET balance = balance + OLD.amount
      WHERE user_id = OLD.user_id;
    ELSIF OLD.currency_type = 'usdt' THEN
      -- Add to USDT balance if specified
      UPDATE public.profiles
      SET usdt_balance = usdt_balance + OLD.amount
      WHERE user_id = OLD.user_id;
    END IF;
    
    -- Log the unfreeze action
    INSERT INTO public.transaction_logs (
      transaction_id, 
      action, 
      details, 
      created_at
    ) VALUES (
      OLD.id, 
      'unfreeze', 
      json_build_object(
        'amount', OLD.amount, 
        'currency', COALESCE(OLD.currency_type, 'eth')
      ), 
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Make sure the trigger exists
CREATE TRIGGER unfrozen_balance_update
AFTER UPDATE OF frozen_until ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.unfreeze_balances();
