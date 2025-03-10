
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Key, Settings, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface SettingsTabProps {
  handleLogout: () => void;
}

export const SettingsTab = ({ handleLogout }: SettingsTabProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const { toast } = useToast();

  const showDelayedToast = (title: string, description: string, variant: "default" | "destructive" = "default") => {
    setTimeout(() => {
      toast({
        title,
        description,
        variant
      });
    }, 1000);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(newEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });
      if (error) throw error;
      toast({
        title: "Success",
        description: "Email update request has been sent. Please check your new email for verification."
      });
      setNewEmail("");
    } catch (error: any) {
      console.error("Email update error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update email",
        variant: "destructive"
      });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      showDelayedToast("Error", "New passwords do not match", "destructive");
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      showDelayedToast("Success", "Password has been updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      showDelayedToast("Error", "Failed to update password", "destructive");
    }
  };

  return (
    <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-[#1A1F2C]/90">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          Account Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <form onSubmit={handleEmailChange} className="space-y-4 p-6 rounded-xl bg-primary/5 border border-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                New Email
              </label>
              <div className="relative">
                <Input 
                  type="email" 
                  value={newEmail} 
                  onChange={e => setNewEmail(e.target.value)} 
                  placeholder="Enter new email address" 
                  required 
                  className="bg-background/50 border-primary/10 group-hover:border-primary/30 transition-colors pl-10" 
                />
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Update Email</span>
            </Button>
          </form>

          <form onSubmit={handlePasswordChange} className="space-y-4 p-6 rounded-xl bg-primary/5 border border-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
            <div className="space-y-4">
              {["Current Password", "New Password", "Confirm New Password"].map((label, index) => (
                <div key={label} className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Key className="w-4 h-4 text-primary" />
                    {label}
                  </label>
                  <div className="relative">
                    <Input 
                      type="password" 
                      value={index === 0 ? currentPassword : index === 1 ? newPassword : confirmNewPassword} 
                      onChange={e => {
                        const value = e.target.value;
                        index === 0 ? setCurrentPassword(value) : index === 1 ? setNewPassword(value) : setConfirmNewPassword(value);
                      }} 
                      required 
                      className="bg-background/50 border-primary/10 pl-10 transition-all duration-300 focus:border-primary/30 focus:ring-primary/30" 
                    />
                    <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Update Password</span>
            </Button>
          </form>
        </div>
      </CardContent>

      <div className="px-6 pb-6">
        <Button 
          variant="destructive" 
          className="w-full hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2 group relative overflow-hidden" 
          onClick={handleLogout}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-destructive/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <LogOut className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Logout</span>
        </Button>
      </div>
    </Card>
  );
};
