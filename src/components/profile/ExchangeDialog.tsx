
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, DollarSign, ArrowDown, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import type { UserData, Transaction } from "@/types/user";
import { Label } from "@/components/ui/label";

interface ExchangeDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userData: UserData | null;
  userId: string | undefined;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  exchangeType?: 'regular' | 'frozen';
}

export const ExchangeDialog = ({ 
  isOpen, 
  setIsOpen, 
  userData, 
  userId,
  setTransactions,
  exchangeType = 'regular'
}: ExchangeDialogProps) => {
  const [exchangeAmount, setExchangeAmount] = useState("");
  const [exchangeDirection, setExchangeDirection] = useState<'eth_to_usdt' | 'usdt_to_eth'>('eth_to_usdt');
  const [estimatedResult, setEstimatedResult] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number>(2074);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        setIsLoadingRate(true);
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        if (data && data.ethereum && data.ethereum.usd) {
          setExchangeRate(data.ethereum.usd);
        }
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      } finally {
        setIsLoadingRate(false);
      }
    };

    fetchExchangeRate();
  }, [isOpen]);

  const reverseExchangeRate = exchangeRate > 0 ? (1 / exchangeRate) : 0.000482;
  
  useEffect(() => {
    if (exchangeAmount && !isNaN(parseFloat(exchangeAmount))) {
      const rate = exchangeDirection === 'eth_to_usdt' ? exchangeRate : reverseExchangeRate;
      setEstimatedResult(parseFloat(exchangeAmount) * rate);
    } else {
      setEstimatedResult(null);
    }
  }, [exchangeAmount, exchangeRate, reverseExchangeRate, exchangeDirection]);

  const handleExchange = (e: React.FormEvent) => {
    e.preventDefault();
    const exchangeAmountNum = parseFloat(exchangeAmount);

    if (exchangeAmountNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive"
      });
      return;
    }

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
      const createTransaction = async () => {
        // Set the correct flags based on the exchange type
        const isFrozen = exchangeType === 'frozen';
        const isFrozenExchange = exchangeType === 'frozen';
        
        const { error } = await supabase.from('transactions').insert([{
          user_id: userId,
          type: 'exchange',
          amount: exchangeAmountNum,
          status: 'pending',
          is_frozen: isFrozen,
          is_frozen_exchange: isFrozenExchange
        }]);
        
        if (error) throw error;

        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (transactionsError) throw transactionsError;
        
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
      };
      
      createTransaction();
      
      toast({
        title: "Exchange Requested",
        description: `Your exchange request for ${exchangeAmount} ${exchangeDirection === 'eth_to_usdt' ? 'ETH to USDT' : 'USDT to ETH'} ${exchangeType === 'frozen' ? '(from frozen balance)' : ''} has been submitted`
      });
      
      setExchangeAmount("");
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process exchange. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleExchangeDirection = () => {
    setExchangeDirection(prev => prev === 'eth_to_usdt' ? 'usdt_to_eth' : 'eth_to_usdt');
    setExchangeAmount("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-[#261E57]/95 to-[#1E1245]/95 backdrop-blur-xl border border-purple-500/20 shadow-lg shadow-purple-500/10">
        <div className="absolute inset-0 rounded-lg bg-purple-500/5 pointer-events-none" />
        
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            {exchangeType === 'frozen' ? 'Exchange Frozen Balance' : 'Exchange Currency'}
          </DialogTitle>
          <DialogDescription className="text-purple-300/80">
            Convert between {exchangeType === 'frozen' ? 'frozen ' : ''}ETH and {exchangeType === 'frozen' ? 'frozen ' : ''}USDT with ease
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleExchange} className="space-y-5 relative">
          <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/10 shadow-inner">
            <Label className="text-sm font-medium text-purple-400 mb-3 block">Exchange Direction</Label>
            
            <div className="flex items-center justify-between">
              <div className={`flex-1 p-3 rounded-lg ${exchangeDirection === 'eth_to_usdt' ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-transparent'} text-center`}>
                <div className="flex flex-col items-center justify-center gap-2">
                  <img src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" alt="ETH" className="h-8 w-8" />
                  <span className="text-sm font-medium text-purple-100">Ethereum</span>
                </div>
              </div>
              
              <button 
                type="button"
                onClick={toggleExchangeDirection}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white shadow-md shadow-purple-600/20 border border-purple-500/50 transition-all duration-300 transform hover:rotate-180 mx-2"
              >
                <ArrowRightLeft className="h-5 w-5" />
              </button>
              
              <div className={`flex-1 p-3 rounded-lg ${exchangeDirection === 'usdt_to_eth' ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-transparent'} text-center`}>
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="h-8 w-8 flex items-center justify-center bg-usdt rounded-full text-white font-bold text-sm">
                    $
                  </div>
                  <span className="text-sm font-medium text-purple-100">USDT</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <Label className="text-sm font-medium text-purple-400/90 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Amount to Exchange
            </Label>
            <div className="relative">
              <Input 
                type="number" 
                step="0.0001" 
                min="0.0001" 
                value={exchangeAmount} 
                onChange={e => setExchangeAmount(e.target.value)} 
                placeholder={`Enter amount in ${exchangeDirection === 'eth_to_usdt' ? 'ETH' : 'USDT'}`} 
                className="bg-purple-900/10 border-purple-500/20 focus:border-purple-500/40 pl-12 pr-4 h-14 text-lg text-purple-100" 
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {exchangeDirection === 'eth_to_usdt' ? (
                  <img src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" alt="ETH" className="h-6 w-6" />
                ) : (
                  <div className="h-6 w-6 flex items-center justify-center bg-usdt rounded-full text-white font-bold text-xs">
                    $
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center py-2 text-center">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-2 border border-purple-500/20">
              <ArrowDown className="h-5 w-5 text-purple-400" />
            </div>
            
            <div className="bg-purple-900/20 rounded-xl p-4 w-full border border-purple-500/10">
              {estimatedResult !== null ? (
                <div className="space-y-1">
                  <p className="text-sm text-purple-400">You will receive approximately:</p>
                  <p className="text-xl font-semibold text-purple-100">
                    {estimatedResult.toFixed(4)} {exchangeDirection === 'eth_to_usdt' ? 'USDT' : 'ETH'}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-purple-400">Enter an amount to see conversion</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-500/10">
              <p className="text-xs text-purple-400 mb-1">Exchange Rate</p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-purple-300">
                  1 {exchangeDirection === 'eth_to_usdt' ? 'ETH' : 'USDT'} = 
                </p>
                <p className="text-sm text-purple-300 font-medium ml-1">
                  {isLoadingRate ? (
                    <span className="text-purple-400/70">Loading...</span>
                  ) : (
                    <>
                      {exchangeDirection === 'eth_to_usdt' 
                        ? exchangeRate.toFixed(2) 
                        : reverseExchangeRate.toFixed(6)} {exchangeDirection === 'eth_to_usdt' ? 'USDT' : 'ETH'}
                    </>
                  )}
                </p>
              </div>
            </div>
            
            <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-500/10">
              <p className="text-xs text-purple-400 mb-1">Available</p>
              <p className="text-sm text-purple-300">
                {exchangeDirection === 'eth_to_usdt' 
                  ? `${Number(exchangeType === 'regular' ? userData?.balance || 0 : userData?.frozen_balance || 0).toFixed(4)} ETH` 
                  : `${Number(exchangeType === 'regular' ? userData?.usdt_balance || 0 : userData?.frozen_usdt_balance || 0).toFixed(2)} USDT`}
              </p>
            </div>
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white py-6 rounded-lg transition-all duration-300 shadow-md shadow-purple-600/20 border border-purple-500/50 h-12"
            >
              <ArrowRightLeft className="h-5 w-5 mr-2" />
              Confirm Exchange
            </Button>
          </div>
          
          <div className="flex items-start gap-2 text-xs text-purple-400/70 bg-purple-500/5 p-3 rounded-lg border border-purple-500/10">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>Exchange requests are processed manually and may take up to 24 hours to complete. The final exchange rate may differ slightly from the estimated rate.</p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
