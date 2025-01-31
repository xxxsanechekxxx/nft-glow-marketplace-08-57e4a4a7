import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FraudWarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const FraudWarningDialog = ({ isOpen, onClose }: FraudWarningDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Fraud Operation Warning</DialogTitle>
          <DialogDescription className="space-y-4">
            <p className="mt-4">
              Необходимо связаться с поддержкой в телеграм для проверки операции.
            </p>
            <Button 
              className="w-full"
              onClick={() => window.open('https://t.me/purenftsupport', '_blank')}
            >
              Связаться с поддержкой
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default FraudWarningDialog;