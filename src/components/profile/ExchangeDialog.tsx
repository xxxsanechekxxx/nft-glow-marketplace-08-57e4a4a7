
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, DollarSign, ArrowDown, Info } from "lucide-react";
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
}

export const ExchangeDialog = ({ 
  isOpen, 
  setIsOpen, 
  userData, 
  userId,
  setTransactions 
}: ExchangeDialogProps) => {
  const [exchangeAmount, setExchangeAmount] = useState("");
  const [exchangeDirection, setExchangeDirection] = useState<'eth_to_usdt' | 'usdt_to_eth'>('eth_to_usdt');
  const [estimatedResult, setEstimatedResult] = useState<number | null>(null);
  const { toast } = useToast();
  
  // Mock exchange rate - in a real app, this would come from an API
  const exchangeRate = exchangeDirection === 'eth_to_usdt' ? 3150 : 0.000317;
  
  useEffect(() => {
    if (exchangeAmount && !isNaN(parseFloat(exchangeAmount))) {
      setEstimatedResult(parseFloat(exchangeAmount) * exchangeRate);
    } else {
      setEstimatedResult(null);
    }
  }, [exchangeAmount, exchangeRate, exchangeDirection]);

  const handleExchange = (e: React.FormEvent) => {
    e.preventDefault();
    const exchangeAmountNum = parseFloat(exchangeAmount);

    // Validate amount is greater than zero
    if (exchangeAmountNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive"
      });
      return;
    }

    // Check if user has sufficient balance based on exchange direction
    if (exchangeDirection === 'eth_to_usdt') {
      const balanceNum = parseFloat(userData?.balance || "0");
      if (exchangeAmountNum > balanceNum) {
        toast({
          title: "Insufficient funds",
          description: `Your ETH balance (${balanceNum} ETH) is less than the requested exchange amount`,
          variant: "destructive"
        });
        return;
      }
    } else {
      const usdtBalanceNum = parseFloat(userData?.usdt_balance || "0");
      if (exchangeAmountNum > usdtBalanceNum) {
        toast({
          title: "Insufficient funds",
          description: `Your USDT balance (${usdtBalanceNum} USDT) is less than the requested exchange amount`,
          variant: "destructive"
        });
        return;
      }
    }
    
    try {
      const createTransaction = async () => {
        const { error } = await supabase.from('transactions').insert([{
          user_id: userId,
          type: 'exchange',
          amount: exchangeAmountNum,
          status: 'pending'
        }]);
        
        if (error) throw error;

        // Refresh transactions list
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
              frozen_until: formattedFrozenUntil
            };
          }));
        }
      };
      
      createTransaction();
      
      toast({
        title: "Exchange Requested",
        description: `Your exchange request for ${exchangeAmount} ${exchangeDirection === 'eth_to_usdt' ? 'ETH to USDT' : 'USDT to ETH'} has been submitted`
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-[#1A1F2C]/95 to-[#131B31]/95 backdrop-blur-xl border border-blue-500/20 shadow-lg shadow-blue-500/10">
        <div className="absolute inset-0 rounded-lg bg-blue-500/5 pointer-events-none" />
        
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Exchange Currency</DialogTitle>
          <DialogDescription className="text-blue-300/80">
            Convert between ETH and USDT with ease
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleExchange} className="space-y-5 relative">
          {/* Currency Selection */}
          <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/10 shadow-inner">
            <Label className="text-sm font-medium text-blue-400 mb-3 block">Select Direction</Label>
            <div className="grid grid-cols-2 gap-2 bg-background/20 rounded-lg p-1 border border-blue-400/10">
              <button 
                type="button" 
                className={`py-3 px-3 rounded-md flex items-center justify-center gap-2 transition-all ${
                  exchangeDirection === 'eth_to_usdt' 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md' 
                    : 'text-blue-400 hover:bg-blue-500/10'
                }`}
                onClick={() => setExchangeDirection('eth_to_usdt')}
              >
                <img src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" alt="ETH" className="h-5 w-5" />
                <span>ETH to USDT</span>
              </button>
              <button 
                type="button" 
                className={`py-3 px-3 rounded-md flex items-center justify-center gap-2 transition-all ${
                  exchangeDirection === 'usdt_to_eth' 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md' 
                    : 'text-blue-400 hover:bg-blue-500/10'
                }`} 
                onClick={() => setExchangeDirection('usdt_to_eth')}
              >
                <div className="h-5 w-5 flex items-center justify-center bg-usdt rounded-full text-white font-bold text-xs">
                  $
                </div>
                <span>USDT to ETH</span>
              </button>
            </div>
          </div>
          
          {/* Amount Input with floating label */}
          <div className="space-y-1">
            <Label className="text-sm font-medium text-blue-400/90 flex items-center gap-2">
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
                className="bg-blue-900/10 border-blue-500/20 focus:border-blue-500/40 pl-12 pr-4 h-14 text-lg text-blue-100" 
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
          
          {/* Exchange Rate Information */}
          <div className="flex flex-col items-center justify-center py-2 text-center">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2 border border-blue-500/20">
              <ArrowDown className="h-5 w-5 text-blue-400" />
            </div>
            
            {/* Estimated result */}
            <div className="bg-blue-900/20 rounded-xl p-4 w-full border border-blue-500/10">
              {estimatedResult !== null ? (
                <div className="space-y-1">
                  <p className="text-sm text-blue-400">You will receive approximately:</p>
                  <p className="text-xl font-semibold text-blue-100">
                    {estimatedResult.toFixed(4)} {exchangeDirection === 'eth_to_usdt' ? 'USDT' : 'ETH'}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-blue-400">Enter an amount to see conversion</p>
              )}
            </div>
          </div>
          
          {/* Exchange Rate and Available Balance */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-500/10">
              <p className="text-xs text-blue-400 mb-1">Exchange Rate</p>
              <p className="text-sm text-blue-300">
                1 {exchangeDirection === 'eth_to_usdt' ? 'ETH' : 'USDT'} = {exchangeRate.toFixed(exchangeDirection === 'eth_to_usdt' ? 0 : 6)} {exchangeDirection === 'eth_to_usdt' ? 'USDT' : 'ETH'}
              </p>
            </div>
            
            <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-500/10">
              <p className="text-xs text-blue-400 mb-1">Available</p>
              <p className="text-sm text-blue-300">
                {exchangeDirection === 'eth_to_usdt' 
                  ? `${Number(userData?.balance || 0).toFixed(4)} ETH` 
                  : `${Number(userData?.usdt_balance || 0).toFixed(2)} USDT`}
              </p>
            </div>
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-6 rounded-lg transition-all duration-300 shadow-md shadow-blue-600/20 border border-blue-500/50 h-12"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Confirm Exchange
            </Button>
          </div>
          
          {/* Disclaimer */}
          <div className="flex items-start gap-2 text-xs text-blue-400/70 bg-blue-500/5 p-3 rounded-lg border border-blue-500/10">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>Exchange requests are processed manually and may take up to 24 hours to complete. The final exchange rate may differ slightly from the estimated rate.</p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
