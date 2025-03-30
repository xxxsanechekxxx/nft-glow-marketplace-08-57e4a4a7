
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
      <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-[#1A1F2C]/90">
        <CardContent className="p-8">
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
