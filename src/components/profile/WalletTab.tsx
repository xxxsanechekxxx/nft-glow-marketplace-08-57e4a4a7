
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { WalletBalance } from "./WalletBalance";
import { TransactionButtons } from "./TransactionButtons";
import { TransactionHistory } from "./TransactionHistory";
import type { UserData, FrozenBalanceInfo, Transaction } from "@/types/user";

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
    <div className="space-y-6">
      <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-[#1A1F2C]/95 to-[#1A1F2C]/80 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px] opacity-30"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600/50 via-primary/40 to-purple-600/50"></div>
        <CardContent className="p-8 relative z-10">
          <WalletBalance 
            userData={userData}
            frozenBalanceDetails={frozenBalanceDetails}
            showFrozenDetails={showFrozenDetails}
            setShowFrozenDetails={setShowFrozenDetails}
            setIsExchangeDialogOpen={setIsExchangeDialogOpen}
            setExchangeType={setExchangeType}
          />
        </CardContent>
      </Card>

      <TransactionButtons />

      <TransactionHistory transactions={transactions} />
    </div>
  );
};
