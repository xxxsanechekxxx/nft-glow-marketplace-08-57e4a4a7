
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { UserData, Transaction } from "@/types/user";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchExchangeRate, 
  calculateReverseRate, 
  calculateEstimatedResult 
} from "@/utils/exchangeRate";

export type ExchangeDirection = 'eth_to_usdt' | 'usdt_to_eth';
export type ExchangeType = 'regular' | 'frozen';

interface UseExchangeProps {
  userData: UserData | null;
  userId: string | undefined;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  exchangeType?: ExchangeType;
}

export const useExchange = ({
  userData, 
  userId, 
  setTransactions,
  exchangeType = 'regular'
}: UseExchangeProps) => {
  const [exchangeAmount, setExchangeAmount] = useState("");
  const [exchangeDirection, setExchangeDirection] = useState<ExchangeDirection>('eth_to_usdt');
  const [estimatedResult, setEstimatedResult] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number>(2074);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const { toast } = useToast();
  
  const reverseExchangeRate = calculateReverseRate(exchangeRate);
  
  // Fetch exchange rate when hook is initialized
  const fetchCurrentExchangeRate = async () => {
    setIsLoadingRate(true);
    const rate = await fetchExchangeRate();
    setExchangeRate(rate);
    setIsLoadingRate(false);
  };
  
  // Calculate estimated result whenever inputs change
  useEffect(() => {
    const result = calculateEstimatedResult(
      exchangeAmount, 
      exchangeRate, 
      reverseExchangeRate, 
      exchangeDirection
    );
    setEstimatedResult(result);
  }, [exchangeAmount, exchangeRate, reverseExchangeRate, exchangeDirection]);
  
  // Toggle exchange direction
  const toggleExchangeDirection = () => {
    setExchangeDirection(prev => prev === 'eth_to_usdt' ? 'usdt_to_eth' : 'eth_to_usdt');
    setExchangeAmount("");
  };
  
  // Get available balance based on exchange direction and type
  const getAvailableBalance = () => {
    if (exchangeDirection === 'eth_to_usdt') {
      return `${Number(exchangeType === 'regular' ? userData?.balance || 0 : userData?.frozen_balance || 0).toFixed(4)} ETH`;
    } else {
      return `${Number(exchangeType === 'regular' ? userData?.usdt_balance || 0 : userData?.frozen_usdt_balance || 0).toFixed(2)} USDT`;
    }
  };
  
  // Handle exchange submission
  const handleExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    const exchangeAmountNum = parseFloat(exchangeAmount);

    // Validation
    if (exchangeAmountNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive"
      });
      return;
    }

    // Check sufficient funds
    if (exchangeDirection === 'eth_to_usdt') {
      const balanceField = exchangeType === 'regular' ? 'balance' : 'frozen_balance';
      const balanceNum = parseFloat(exchangeType === 'regular' ? userData?.balance || "0" : userData?.frozen_balance || "0");
      
      if (exchangeAmountNum > balanceNum) {
        toast({
          title: "Insufficient funds",
          description: `Your ${exchangeType === 'regular' ? '' : 'frozen '}ETH balance (${balanceNum} ETH) is less than the requested exchange amount`,
          variant: "destructive"
        });
        return;
      }
    } else {
      const usdtBalanceField = exchangeType === 'regular' ? 'usdt_balance' : 'frozen_usdt_balance';
      const usdtBalanceNum = parseFloat(exchangeType === 'regular' ? userData?.usdt_balance || "0" : userData?.frozen_usdt_balance || "0");
      
      if (exchangeAmountNum > usdtBalanceNum) {
        toast({
          title: "Insufficient funds",
          description: `Your ${exchangeType === 'regular' ? '' : 'frozen '}USDT balance (${usdtBalanceNum} USDT) is less than the requested exchange amount`,
          variant: "destructive"
        });
        return;
      }
    }
    
    try {
      // Set the correct flags based on the exchange type
      const isFrozen = exchangeType === 'frozen';
      const isFrozenExchange = exchangeType === 'frozen';
      
      // Create transaction
      const { error } = await supabase.from('transactions').insert([{
        user_id: userId,
        type: 'exchange',
        amount: exchangeAmountNum,
        status: 'pending',
        is_frozen: isFrozen,
        is_frozen_exchange: isFrozenExchange
      }]);
      
      if (error) throw error;

      // Fetch updated transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (transactionsError) throw transactionsError;
      
      // Format and update transactions
      if (transactionsData) {
        setTransactions(transactionsData.map(tx => {
          const dateObj = new Date(tx.created_at);
          const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
          
          let formattedFrozenUntil = null;
          if (tx.frozen_until) {
            const frozenDate = new Date(tx.frozen_until);
            formattedFrozenUntil = `${frozenDate.getDate().toString().padStart(2, '0')}/${(frozenDate.getMonth() + 1).toString().padStart(2, '0')}/${frozenDate.getFullYear()}`;
          }
          
          return {
            id: tx.id,
            type: tx.type,
            amount: tx.amount.toString(),
            created_at: formattedDate,
            status: tx.status,
            item: tx.item,
            frozen_until: formattedFrozenUntil,
            is_frozen: tx.is_frozen,
            is_frozen_exchange: tx.is_frozen_exchange
          };
        }));
      }
      
      // Show success message
      toast({
        title: "Exchange Requested",
        description: `Your exchange request for ${exchangeAmount} ${exchangeDirection === 'eth_to_usdt' ? 'ETH to USDT' : 'USDT to ETH'} ${exchangeType === 'frozen' ? '(from frozen balance)' : ''} has been submitted`
      });
      
      // Reset form
      setExchangeAmount("");
      
      return true; // Return success status
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process exchange. Please try again.",
        variant: "destructive"
      });
      return false; // Return failure status
    }
  };

  return {
    exchangeAmount,
    setExchangeAmount,
    exchangeDirection,
    estimatedResult,
    exchangeRate,
    reverseExchangeRate,
    isLoadingRate,
    fetchCurrentExchangeRate,
    toggleExchangeDirection,
    getAvailableBalance,
    handleExchange
  };
};
