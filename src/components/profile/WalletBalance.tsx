
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, LockIcon, ArrowRightLeft } from "lucide-react";
import type { UserData, FrozenBalanceInfo } from "@/types/user";

interface WalletBalanceProps {
  userData: UserData | null;
  frozenBalanceDetails: FrozenBalanceInfo[];
  showFrozenDetails: boolean;
  setShowFrozenDetails: (show: boolean) => void;
  setIsExchangeDialogOpen: (open: boolean) => void;
  setExchangeType: (type: 'regular' | 'frozen') => void;
}

export const WalletBalance = ({ 
  userData, 
  frozenBalanceDetails, 
  showFrozenDetails, 
  setShowFrozenDetails,
  setIsExchangeDialogOpen,
  setExchangeType
}: WalletBalanceProps) => {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isLoadingRate, setIsLoadingRate] = useState(false);

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
        setExchangeRate(2074);
      } finally {
        setIsLoadingRate(false);
      }
    };

    fetchExchangeRate();
    const intervalId = setInterval(fetchExchangeRate, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleRegularExchange = () => {
    setExchangeType('regular');
    setIsExchangeDialogOpen(true);
  };

  const handleFrozenExchange = () => {
    setExchangeType('frozen');
    setIsExchangeDialogOpen(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="rounded-xl bg-balance-available/90 overflow-hidden relative shadow-lg shadow-purple-600/10">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600/50 via-primary/40 to-purple-600/50"></div>
        
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-balance-available-accent/20">
              <Wallet className="h-5 w-5 text-balance-available-accent" />
            </div>
            <h3 className="text-lg font-semibold text-white">Available Balance</h3>
          </div>
          <div className="px-3 py-1 rounded-full bg-purple-800/50 border border-purple-500/20 text-xs font-medium text-purple-400">
            Active
          </div>
        </div>

        <div className="flex flex-col space-y-2 p-4 relative">
          <div className="p-4 rounded-lg bg-black/20 backdrop-blur-sm border border-white/5 flex items-center justify-between hover:bg-black/30 transition-colors duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-eth/10 shadow-lg shadow-purple-500/10">
                <img src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" alt="ETH" className="h-6 w-6" />
              </div>
              <div>
                <p className="text-gray-300 text-sm">Ethereum</p>
                <p className="text-white font-medium">ETH</p>
              </div>
            </div>
            <p className="text-white font-bold text-lg">
              {Number(userData?.balance || 0).toFixed(2)}
            </p>
          </div>

          <div className="flex justify-center items-center h-8 my-0 relative z-10">
            <Button 
              variant="circularSmall" 
              size="circleSmall" 
              className="flex items-center justify-center circular-button-glow" 
              onClick={handleRegularExchange}
              aria-label="Exchange currencies"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-4 rounded-lg bg-black/20 backdrop-blur-sm border border-white/5 flex items-center justify-between hover:bg-black/30 transition-colors duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-usdt/10 shadow-lg shadow-purple-500/10">
                <div className="h-6 w-6 flex items-center justify-center bg-usdt rounded-full text-white font-bold text-sm">
                  $
                </div>
              </div>
              <div>
                <p className="text-gray-300 text-sm">Tether</p>
                <p className="text-white font-medium">USDT</p>
              </div>
            </div>
            <p className="font-bold text-slate-50 text-lg">
              {Number(userData?.usdt_balance || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {Number(userData?.frozen_balance || 0) > 0 && (
        <div className="rounded-xl bg-balance-hold/90 overflow-hidden relative shadow-lg shadow-amber-600/10">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600/50 via-amber-500/40 to-amber-600/50"></div>
          
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-balance-hold-accent/20">
                <LockIcon className="h-5 w-5 text-balance-hold-accent" />
              </div>
              <h3 className="text-lg font-semibold text-white">Hold Balance</h3>
            </div>
            <Button 
              variant="outline" 
              className="px-3 py-1 h-auto border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs shadow-sm" 
              onClick={() => setShowFrozenDetails(!showFrozenDetails)}
            >
              {showFrozenDetails ? "Hide Details" : "Show Details"}
            </Button>
          </div>

          <div className="flex flex-col space-y-2 p-4">
            <div className="p-4 rounded-lg bg-black/20 backdrop-blur-sm border border-amber-500/10 flex items-center justify-between hover:bg-black/30 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-eth/10 shadow-lg shadow-amber-500/10">
                  <img alt="ETH" className="h-6 w-6" src="/lovable-uploads/7d7924fa-23c2-468e-b4e6-439e242022e9.png" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Ethereum</p>
                  <p className="text-white font-medium">ETH</p>
                </div>
              </div>
              <div className="flex items-center">
                <p className="text-amber-400 font-bold text-lg">
                  {Number(userData?.frozen_balance || 0).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex justify-center items-center h-8 my-0 relative z-10">
              <Button 
                variant="circularSmall" 
                size="circleSmall" 
                className="flex items-center justify-center circular-button-glow border-amber-500/50 from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 shadow-amber-600/20" 
                onClick={handleFrozenExchange}
                aria-label="Exchange frozen currencies"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 rounded-lg bg-black/20 backdrop-blur-sm border border-amber-500/10 flex items-center justify-between hover:bg-black/30 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-usdt/10 shadow-lg shadow-amber-500/10">
                  <div className="h-6 w-6 flex items-center justify-center bg-usdt rounded-full text-white font-bold text-sm">
                    $
                  </div>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Tether</p>
                  <p className="text-white font-medium">USDT</p>
                </div>
              </div>
              <div className="flex items-center">
                <p className="text-amber-400 font-bold text-lg">
                  {Number(userData?.frozen_usdt_balance || 0).toFixed(2)}
                </p>
              </div>
            </div>

            {showFrozenDetails && frozenBalanceDetails.length > 0 && (
              <div className="mt-4 pt-4 space-y-3 border-t border-amber-500/20">
                <p className="text-amber-400 font-medium text-sm">Upcoming Releases:</p>
                <div className="max-h-[150px] overflow-y-auto pr-1 space-y-2 scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent">
                  {frozenBalanceDetails.map(item => (
                    <div key={item.transaction_id} className="p-3 rounded-lg bg-black/30 border border-amber-500/20 hover:bg-black/40 transition-colors duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        {/* Top section with days remaining and amount */}
                        <div className="flex items-center gap-2">
                          <div className="min-w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <LockIcon className="h-3.5 w-3.5 text-amber-400" />
                          </div>
                          <span className="text-amber-300 font-semibold text-xs whitespace-nowrap">
                            {item.days_left} days remaining
                          </span>
                        </div>
                        
                        {/* Amount and date section - improved for mobile */}
                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
                          <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20 shadow-sm">
                            {item.amount.toFixed(2)}
                          </span>
                          <span className="text-xs text-amber-400/70 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 whitespace-nowrap shadow-sm">
                            {item.unfreeze_date}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
