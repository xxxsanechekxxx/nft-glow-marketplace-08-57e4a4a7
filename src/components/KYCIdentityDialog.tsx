
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
import { Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface KYCIdentityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

const KYCIdentityDialog = ({ isOpen, onClose, onSuccess, userId }: KYCIdentityDialogProps) => {
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
      const filePath = `${userId}/identity_doc_${Date.now()}.${fileExt}`;

      setUploadProgress(40);

      const { error: uploadError } = await supabase.storage
        .from('kyc_documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      setUploadProgress(80);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          kyc_identity_doc: filePath,
          kyc_status: 'identity_submitted'
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      setUploadProgress(100);
      toast({
        title: "Success",
        description: "Identity document uploaded successfully",
      });
      onSuccess();
    } catch (error) {
      console.error('Error uploading identity document:', error);
      toast({
        title: "Error",
        description: "Failed to upload identity document. Please try again.",
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
          <DialogTitle>Identity Verification</DialogTitle>
          <DialogDescription>
            Please upload a valid government-issued ID document (passport, driver's license, or national ID card).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid w-full items-center gap-4">
            <label 
              htmlFor="identity-doc" 
              className="cursor-pointer border-2 border-dashed border-primary/20 rounded-lg p-8 text-center hover:border-primary/40 transition-colors"
            >
              <Input
                id="identity-doc"
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <Upload className="w-10 h-10 mx-auto mb-4 text-primary/60" />
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

export default KYCIdentityDialog;
