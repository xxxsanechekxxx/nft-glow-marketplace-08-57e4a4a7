
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { TransactionHistory } from "./TransactionHistory";
import { WalletBalance } from "./WalletBalance";
import { TransactionButtons } from "./TransactionButtons";
import type { UserData, Transaction, FrozenBalanceInfo } from "@/types/user";

interface WalletTabProps {
  userData: UserData | null;
  frozenBalanceDetails: FrozenBalanceInfo[];
  showFrozenDetails: boolean;
  setShowFrozenDetails: (show: boolean) => void;
  setIsExchangeDialogOpen: (open: boolean) => void;
  transactions: Transaction[];
  setExchangeType: (type: 'regular' | 'frozen') => void;
}

export const WalletTab = ({
  userData,
  frozenBalanceDetails,
  showFrozenDetails,
  setShowFrozenDetails,
  setIsExchangeDialogOpen,
  transactions,
  setExchangeType
}: WalletTabProps) => {
  return (
    <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-[#1A1F2C]/95 to-[#1A1F2C]/80 overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px] opacity-30"></div>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600/50 via-primary/40 to-purple-600/50"></div>
      
      <CardHeader className="space-y-2 border-b border-primary/10 pb-4 relative z-10">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          Wallet
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 relative z-10 space-y-6">
        <WalletBalance 
          userData={userData}
          frozenBalanceDetails={frozenBalanceDetails}
          showFrozenDetails={showFrozenDetails}
          setShowFrozenDetails={setShowFrozenDetails}
          setIsExchangeDialogOpen={setIsExchangeDialogOpen}
          setExchangeType={setExchangeType}
        />
        
        <TransactionButtons />
        
        <TransactionHistory transactions={transactions} />
      </CardContent>
    </Card>
  );
};
