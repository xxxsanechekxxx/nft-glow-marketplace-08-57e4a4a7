
import React from "react";
import { Clock } from "lucide-react";

interface TransactionProcessingProps {
  processingDetails: {
    amount: number;
    platformFee: number;
    receivedAmount: number;
    freezeDuration: number;
  };
  loadingProgress: number;
  loadingStageText: string;
  feePercent: number;
}

export const TransactionProcessing = ({
  processingDetails,
  loadingProgress,
  loadingStageText,
  feePercent
}: TransactionProcessingProps) => {
  return (
    <div className="bg-[#1A1F2C] border border-yellow-500/20 rounded-lg p-6 space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-yellow-500">Processing Transaction</h3>
        <p className="text-muted-foreground">{loadingStageText}</p>
      </div>
      
      <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-yellow-600 to-yellow-500 transition-all duration-300"
          style={{ width: `${loadingProgress}%` }}
        />
      </div>
      
      <div className="border border-yellow-500/20 bg-yellow-500/5 rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-muted-foreground">Bid Amount:</span>
          <span className="font-medium text-right">{processingDetails.amount.toFixed(2)} ETH</span>
          
          <span className="text-muted-foreground">Platform Fee ({feePercent}%):</span>
          <span className="font-medium text-right text-red-400">-{processingDetails.platformFee.toFixed(2)} ETH</span>
          
          <span className="text-muted-foreground font-medium">You Receive:</span>
          <span className="font-bold text-right text-yellow-500">{processingDetails.receivedAmount.toFixed(2)} ETH</span>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-2 text-yellow-500 bg-yellow-500/10 p-3 rounded-lg">
        <Clock className="h-5 w-5" />
        <p className="text-sm">
          Funds will be available in {processingDetails.freezeDuration} days after security verification
        </p>
      </div>
      
      <p className="text-xs text-center text-muted-foreground">
        Please do not close this window during processing
      </p>
    </div>
  );
};
