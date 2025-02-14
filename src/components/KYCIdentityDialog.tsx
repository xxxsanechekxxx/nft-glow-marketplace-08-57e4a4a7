
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
import { supabase } from "@/lib/supabase";
import { Upload, Shield } from "lucide-react";

interface KYCIdentityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

const KYCIdentityDialog = ({ isOpen, onClose, onSuccess, userId }: KYCIdentityDialogProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/identity_doc_${crypto.randomUUID()}.${fileExt}`;

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
          kyc_identity_doc: publicUrl,
          kyc_status: 'identity_submitted'
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Identity document uploaded successfully",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error uploading identity document:", error);
      toast({
        title: "Error",
        description: "Failed to upload identity document. Please try again.",
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
          <DialogTitle>Identity Verification</DialogTitle>
          <DialogDescription>
            Upload a valid government-issued ID (passport, driver's license, or national ID card)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center justify-center gap-4 p-6 border-2 border-dashed border-primary/20 rounded-lg bg-primary/5">
            <Shield className="w-12 h-12 text-primary/60" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Supported formats: JPG, PNG, PDF
              </p>
              <p className="text-sm text-muted-foreground">
                Maximum file size: 5MB
              </p>
            </div>
            <label htmlFor="identity-doc-upload">
              <input
                id="identity-doc-upload"
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
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload Document"}
              </Button>
            </label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KYCIdentityDialog;
