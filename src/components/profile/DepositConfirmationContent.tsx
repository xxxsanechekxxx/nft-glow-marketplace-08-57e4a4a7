import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Loader2, HelpCircle, ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DepositConfirmationContentProps {
  step: 'amount' | 'hash';
  depositAmount: string;
  transactionHash: string;
  isSubmitting: boolean;
  walletAddress: string;
  onDepositAmountChange: (value: string) => void;
  onTransactionHashChange: (value: string) => void;
  onNextStep: () => void;
  onClose: () => void;
  onSubmit: () => void;
  onTelegramHelp: () => void;
}

export const DepositConfirmationContent = ({
  step,
  depositAmount,
  transactionHash,
  isSubmitting,
  walletAddress,
  onDepositAmountChange,
  onTransactionHashChange,
  onNextStep,
  onClose,
  onSubmit,
  onTelegramHelp,
}: DepositConfirmationContentProps) => {
  if (step === 'amount') {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Amount (ETH)
          </label>
          <Input
            type="number"
            step="0.0001"
            min="0.0001"
            value={depositAmount}
            onChange={(e) => onDepositAmountChange(e.target.value)}
            placeholder="Enter amount"
          />
        </div>
        <Button 
          className="w-full" 
          onClick={onNextStep}
        >
          Continue
        </Button>
      </div>
    );
  }

  return (
    <>
      <p>We have created a request for you.</p>
      
      <div className="mt-4">
        <CountdownTimer endTime={new Date(new Date().getTime() + 30 * 60000).toISOString()} />
      </div>
      
      <div className="space-y-2 mt-4">
        <p>To send {depositAmount} ETH to the following address:</p>
        <div className="bg-muted p-2 rounded-md break-all font-mono">
          {walletAddress}
          <div className="mt-1 text-sm text-muted-foreground">
            (ERC-20)
          </div>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <p>If you have already transferred Ethereum, but the timer has expired, the funds will be credited back to your original wallet.</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 flex-shrink-0" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>We give time limits due to frequent fraudulent activities. During this time, the transfer is guaranteed to be secure for both parties. You cannot cancel deposits more than 3 times per 24 hours.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">
            Transaction Hash
          </label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>This is the transaction ID. After successful withdrawal of funds from another wallet, you will need to provide a confirmation with the number that appears in other wallet.</p>
                <Button 
                  variant="link" 
                  className="mt-2 h-auto p-0 text-primary"
                  onClick={onTelegramHelp}
                >
                  I need help <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          value={transactionHash}
          onChange={(e) => onTransactionHashChange(e.target.value)}
          placeholder="Enter transaction hash"
          className="font-mono"
        />
      </div>

      <div className="flex gap-2">
        <Button 
          variant="outline"
          className="flex-1"
          onClick={onClose}
        >
          Cancel transaction
        </Button>
        <Button 
          className="flex-1" 
          onClick={onSubmit}
          disabled={!transactionHash || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Confirm'
          )}
        </Button>
      </div>

      <div className="text-center mt-2">
        <Button
          variant="link"
          className="text-primary h-auto p-0"
          onClick={onTelegramHelp}
        >
          Need help?<ExternalLink className="ml-0.5 h-3 w-3" />
        </Button>
      </div>
    </>
  );
};