
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { FileUpload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface KYCAddressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

const KYCAddressDialog = ({ isOpen, onClose, onSuccess, userId }: KYCAddressDialogProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(20);

      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/address_doc_${Date.now()}.${fileExt}`;

      setUploadProgress(40);

      const { error: uploadError } = await supabase.storage
        .from('kyc_documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      setUploadProgress(80);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          kyc_address_doc: filePath,
          kyc_status: 'under_review'
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      setUploadProgress(100);
      toast({
        title: "Success",
        description: "Address proof uploaded successfully. Your documents are now under review.",
      });
      onSuccess();
    } catch (error) {
      console.error('Error uploading address document:', error);
      toast({
        title: "Error",
        description: "Failed to upload address proof. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur">
        <DialogHeader>
          <DialogTitle>Address Verification</DialogTitle>
          <DialogDescription>
            Please upload a proof of address (utility bill, bank statement, or official government document from the last 3 months).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid w-full items-center gap-4">
            <label 
              htmlFor="address-doc" 
              className="cursor-pointer border-2 border-dashed border-primary/20 rounded-lg p-8 text-center hover:border-primary/40 transition-colors"
            >
              <Input
                id="address-doc"
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <FileUpload className="w-10 h-10 mx-auto mb-4 text-primary/60" />
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Supported formats: JPG, PNG, PDF
              </p>
            </label>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-muted-foreground text-center">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KYCAddressDialog;
