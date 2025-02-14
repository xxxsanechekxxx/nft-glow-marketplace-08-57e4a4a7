
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
import { Upload, Home, FileCheck } from "lucide-react";

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

      // Важно: сначала вызываем onSuccess, затем onClose
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

  const handleDialogClose = async () => {
    // Убедимся, что если диалог закрывается во время загрузки, мы не выполняем никаких действий
    if (!isUploading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-b from-background via-background/95 to-background/90 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
            <Home className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl text-center pt-2">Address Verification</DialogTitle>
          <DialogDescription className="text-center max-w-[280px] mx-auto">
            Upload a proof of address (utility bill, bank statement, or official government document)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-6">
          <div className="flex flex-col items-center justify-center gap-6 p-8 border-2 border-dashed border-primary/20 rounded-xl bg-gradient-to-b from-primary/5 via-primary/[0.02] to-primary/5 hover:from-primary/10 hover:via-primary/[0.05] hover:to-primary/10 transition-all duration-300">
            <div className="text-center space-y-4">
              <div className="flex items-center gap-2 justify-center text-sm font-medium bg-primary/20 text-primary px-4 py-2 rounded-full">
                <FileCheck className="w-4 h-4" />
                Secure Upload
              </div>
              <div className="space-y-1">
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
              size="lg"
              className="relative group hover:border-primary/50 hover:bg-primary/5"
              disabled={isUploading}
              onClick={handleUploadClick}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
              <Upload className="w-4 h-4 mr-2 relative z-10" />
              <span className="relative z-10">{isUploading ? "Uploading..." : "Upload Document"}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KYCAddressDialog;
