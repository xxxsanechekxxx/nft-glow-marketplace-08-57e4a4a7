import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FraudWarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const FraudWarningDialog = ({ isOpen, onClose }: FraudWarningDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <X className="w-16 h-16 text-red-500" strokeWidth={2.5} />
            <DialogTitle>Fraud Operation Warning</DialogTitle>
          </div>
          <DialogDescription className="space-y-4">
            <p className="mt-4">
              Please contact our support team on Telegram for transaction verification.
            </p>
            <Button 
              className="w-full"
              onClick={() => window.open('https://t.me/purenftsupport', '_blank')}
            >
              Contact Support
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default FraudWarningDialog;