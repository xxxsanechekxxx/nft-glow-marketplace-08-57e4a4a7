
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

-- Make sure the trigger exists (replace if it already exists)
DROP TRIGGER IF EXISTS unfrozen_balance_update ON public.transactions;

CREATE TRIGGER unfrozen_balance_update
AFTER UPDATE OF frozen_until ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.unfreeze_balances();

-- Create a function to process expired frozen transactions
CREATE OR REPLACE FUNCTION public.process_expired_frozen_transactions()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  affected_rows integer := 0;
BEGIN
  -- Find and update transactions where frozen_until has passed
  UPDATE public.transactions
  SET frozen_until = NULL
  WHERE frozen_until IS NOT NULL 
    AND frozen_until <= NOW();
  
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  
  RETURN affected_rows;
END;
$function$;

-- Create a cron job function that will run periodically to check for expired frozen transactions
CREATE OR REPLACE FUNCTION public.scheduled_process_expired_frozen_transactions()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_count integer;
BEGIN
  SELECT public.process_expired_frozen_transactions() INTO v_count;
  
  -- Log the execution
  INSERT INTO public.cron_job_logs (
    job_name,
    details,
    created_at
  ) VALUES (
    'process_expired_frozen_transactions',
    json_build_object('transactions_processed', v_count),
    NOW()
  );
  
EXCEPTION WHEN OTHERS THEN
  -- Log any errors
  INSERT INTO public.cron_job_logs (
    job_name,
    details,
    created_at
  ) VALUES (
    'process_expired_frozen_transactions',
    json_build_object('error', SQLERRM),
    NOW()
  );
END;
$function$;
