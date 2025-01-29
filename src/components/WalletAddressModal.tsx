import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface WalletAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (address: string) => void;
}

const WalletAddressModal = ({ isOpen, onClose, onGenerated }: WalletAddressModalProps) => {
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(true);
  const [generatedAddress, setGeneratedAddress] = useState("");

  useEffect(() => {
    if (isOpen && isGenerating) {
      const startTime = Date.now();
      const duration = 30000; // 30 seconds
      
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / duration) * 100, 100);
        
        setProgress(newProgress);
        
        if (elapsed >= duration) {
          clearInterval(interval);
          setIsGenerating(false);
          const address = "0xc68c825191546453e36aaa005ebf10b5219ce175";
          setGeneratedAddress(address);
          onGenerated(address);
        }
      }, 100);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isOpen, isGenerating, onGenerated]);

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      if (!isGenerating) {
        setIsGenerating(true);
        setProgress(0);
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isGenerating ? "Generating Wallet Address" : "Wallet Address Generated"}
          </DialogTitle>
          <DialogDescription>
            {isGenerating ? (
              <div className="space-y-4 mt-4">
                <Progress value={progress} />
                <p className="text-center">Please wait while we generate your wallet address...</p>
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                <p>Your address has been generated successfully!</p>
                <p className="font-mono bg-muted p-2 rounded-md break-all">
                  {generatedAddress}
                </p>
                <p>You can now transfer your Ethereum to this address to fund your balance.</p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default WalletAddressModal;