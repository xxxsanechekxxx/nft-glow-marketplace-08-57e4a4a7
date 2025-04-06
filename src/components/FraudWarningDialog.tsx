
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ExternalLink } from "lucide-react";

interface FraudWarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const FraudWarningDialog = ({ isOpen, onClose }: FraudWarningDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md pt-10 bg-gradient-to-b from-[#2E2243] to-[#1E1633] border-[#65539E]/40 shadow-xl shadow-purple-900/20">
        <DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-500" strokeWidth={2} />
            </div>
            <DialogTitle className="text-xl sm:text-2xl bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">Fraud Warning</DialogTitle>
          </div>
          <DialogDescription className="space-y-6 mt-4">
            <p className="text-center text-muted-foreground">
              If you suspect fraudulent activity with this NFT, please contact our support team on Telegram for immediate assistance and transaction verification.
            </p>
            
            <div className="flex flex-col space-y-2">
              <Button 
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg"
                onClick={() => window.open('https://t.me/purenftsupport', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
              
              <Button 
                variant="outline"
                className="w-full border-[#65539E]/40 bg-white/5 hover:bg-white/10"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default FraudWarningDialog;
