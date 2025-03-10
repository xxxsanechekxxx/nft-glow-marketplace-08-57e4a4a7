import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, LockIcon, RefreshCw } from "lucide-react";
import type { UserData, FrozenBalanceInfo } from "@/types/user";

interface WalletBalanceProps {
  userData: UserData | null;
  frozenBalanceDetails: FrozenBalanceInfo[];
  showFrozenDetails: boolean;
  setShowFrozenDetails: (show: boolean) => void;
  setIsExchangeDialogOpen: (open: boolean) => void;
}

export const WalletBalance = ({ 
  userData, 
  frozenBalanceDetails, 
  showFrozenDetails, 
  setShowFrozenDetails,
  setIsExchangeDialogOpen
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="rounded-xl bg-balance-available/90 overflow-hidden">
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

        <div className="flex flex-col space-y-6 p-4 relative">
          <div className="p-4 rounded-lg bg-black/20 backdrop-blur-sm border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-eth/10">
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
              onClick={() => setIsExchangeDialogOpen(true)}
              aria-label="Exchange currencies"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-4 rounded-lg bg-black/20 backdrop-blur-sm border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-usdt/10">
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
        <div className="rounded-xl bg-balance-hold/90 overflow-hidden">
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-balance-hold-accent/20">
                <LockIcon className="h-5 w-5 text-balance-hold-accent" />
              </div>
              <h3 className="text-lg font-semibold text-white">Hold Balance</h3>
            </div>
            <Button 
              variant="outline" 
              className="px-3 py-1 h-auto border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs" 
              onClick={() => setShowFrozenDetails(!showFrozenDetails)}
            >
              {showFrozenDetails ? "Hide Details" : "Show Details"}
            </Button>
          </div>

          <div className="flex flex-col space-y-2 p-4">
            <div className="p-4 rounded-lg bg-black/20 backdrop-blur-sm border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-eth/10">
                  <img alt="ETH" className="h-6 w-6" src="/lovable-uploads/7d7924fa-23c2-468e-b4e6-439e242022e9.png" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Ethereum</p>
                  <p className="text-white font-medium">ETH</p>
                </div>
              </div>
              <p className="text-amber-400 font-bold text-lg">
                {Number(userData?.frozen_balance || 0).toFixed(2)}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-black/20 backdrop-blur-sm border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-usdt/10">
                  <div className="h-6 w-6 flex items-center justify-center bg-usdt rounded-full text-white font-bold text-sm">
                    $
                  </div>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Tether</p>
                  <p className="text-white font-medium">USDT</p>
                </div>
              </div>
              <p className="text-amber-400 font-bold text-lg">
                {Number(userData?.frozen_usdt_balance || 0).toFixed(2)}
              </p>
            </div>

            {showFrozenDetails && frozenBalanceDetails.length > 0 && (
              <div className="mt-4 pt-4 space-y-3 border-t border-amber-500/20">
                <p className="text-amber-400 font-medium text-sm">Upcoming Releases:</p>
                <div className="max-h-[150px] overflow-y-auto pr-1 space-y-2 scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent">
                  {frozenBalanceDetails.map(item => (
                    <div key={item.transaction_id} className="p-3 rounded-lg bg-black/30 border border-amber-500/20 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LockIcon className="h-4 w-4 text-amber-500" />
                        <span className="text-amber-300 font-semibold text-xs">{item.days_left} days remaining</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center bg-yellow-600/30">
                            <LockIcon className="h-3 w-3 text-yellow-500" />
                          </div>
                          <span className="text-amber-400 font-bold">{item.amount.toFixed(2)}</span>
                        </div>
                        <span className="text-xs text-amber-400/70 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                          {item.unfreeze_date}
                        </span>
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
