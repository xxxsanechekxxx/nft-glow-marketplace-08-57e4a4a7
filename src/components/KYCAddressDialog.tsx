
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Home } from "lucide-react";

interface KYCAddressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  userId: string;
}

const KYCAddressDialog = ({ isOpen, onClose, onSuccess, userId }: KYCAddressDialogProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUploadClick = () => {
    // Programmatically click the hidden file input
    document.getElementById('address-doc-upload')?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/address_doc_${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('kyc_documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('kyc_documents')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          kyc_address_doc: publicUrl,
          kyc_status: 'under_review'
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Address document uploaded successfully",
      });

      await onSuccess();
      onClose();
    } catch (error) {
      console.error("Error uploading address document:", error);
      toast({
        title: "Error",
        description: "Failed to upload address document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Address Verification</DialogTitle>
          <DialogDescription>
            Upload a proof of address (utility bill, bank statement, or official government document)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center justify-center gap-4 p-6 border-2 border-dashed border-primary/20 rounded-lg bg-primary/5">
            <Home className="w-12 h-12 text-primary/60" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Document must be less than 3 months old
              </p>
              <p className="text-sm text-muted-foreground">
                Supported formats: JPG, PNG, PDF
              </p>
              <p className="text-sm text-muted-foreground">
                Maximum file size: 5MB
              </p>
            </div>
            <input
              id="address-doc-upload"
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <Button 
              variant="outline" 
              className="mt-2"
              disabled={isUploading}
              onClick={handleUploadClick}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload Document"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KYCAddressDialog;
