
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WalletAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (address: string) => void;
}

const WalletAddressModal = ({ isOpen, onClose, onGenerated }: WalletAddressModalProps) => {
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(true);
  const [generatedAddress, setGeneratedAddress] = useState("");
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isOpen && isGenerating) {
      const startTime = Date.now();
      const duration = 7000; // 7 seconds
      
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / duration) * 100, 100);
        
        setProgress(newProgress);
        
        if (elapsed >= duration) {
          clearInterval(interval);
          setIsGenerating(false);
          const address = "0x90c415f420Bb6E8deDd66DFF7aBd31728773373E";
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
      <DialogContent className="sm:max-w-md bg-[#0B0D17]/95 border-primary/20 text-white">
        <DialogClose className="absolute right-4 top-4 rounded-full p-1 text-white hover:bg-primary/20 transition-colors">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader>
          <DialogTitle>
            {isGenerating ? "Generating Wallet Address" : "Wallet Address Generated"}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {isGenerating ? (
              <div className="space-y-4 mt-4">
                <Progress value={progress} />
                <p className="text-center">Please wait while we generate your wallet address...</p>
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                <p>Your address has been generated successfully!</p>
                <p className={`font-mono bg-[#0F1525] p-2 rounded-md ${isMobile ? 'text-xs break-all' : 'break-all'}`}>
                  {generatedAddress}
                </p>
                <p>You can now transfer your Ethereum to this address to fund your balance.</p>
                {!generatedAddress && (
                  <Button 
                    variant="gradient" 
                    className="w-full text-white bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600"
                  >
                    Generate Address
                  </Button>
                )}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default WalletAddressModal;

