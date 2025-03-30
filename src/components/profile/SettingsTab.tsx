
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Key, Settings, LogOut, Shield, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Separator } from "@/components/ui/separator";

interface SettingsTabProps {
  handleLogout: () => void;
}

export const SettingsTab = ({
  handleLogout
}: SettingsTabProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const { toast } = useToast();

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
      setIsEmailLoading(true);
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
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Password has been updated successfully"
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error: any) {
      console.error("Password update error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="border-primary/10 shadow-lg transition-all duration-300 backdrop-blur-sm bg-[#1A1F2C]/90">
      <CardHeader className="border-b border-primary/10 pb-4">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          Account Settings
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-8">
        {/* Account Security Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-white/90">
            <Shield className="w-5 h-5 text-primary/80" />
            Account Security
          </h3>
          <p className="text-sm text-white/60">
            Manage your account email and password settings
          </p>
        </div>
        
        <Separator className="bg-primary/10" />
        
        {/* Email Change Form */}
        <form onSubmit={handleEmailChange} className="space-y-5">
          <div className="space-y-2">
            <h4 className="text-md font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary/80" />
              Update Email Address
            </h4>
            <p className="text-xs text-white/60">
              A verification link will be sent to your new email address
            </p>
          </div>
          
          <div className="relative">
            <Input 
              type="email" 
              value={newEmail} 
              onChange={e => setNewEmail(e.target.value)} 
              placeholder="Enter new email address" 
              required 
              className="bg-background/50 border-primary/10 transition-colors pl-10 focus:border-primary/30 focus:ring-1 focus:ring-primary/20"
            />
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" />
          </div>
          
          <Button 
            type="submit" 
            disabled={isEmailLoading}
            className="w-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center gap-2">
              {isEmailLoading ? "Processing..." : "Update Email"}
              {isEmailLoading && <span className="animate-spin">◌</span>}
            </span>
          </Button>
        </form>
        
        <Separator className="bg-primary/10" />
        
        {/* Password Change Form */}
        <form onSubmit={handlePasswordChange} className="space-y-5">
          <div className="space-y-2">
            <h4 className="text-md font-medium flex items-center gap-2">
              <Key className="w-4 h-4 text-primary/80" />
              Change Password
            </h4>
            <p className="text-xs text-white/60">
              Please make sure your new password is at least 6 characters long
            </p>
          </div>
          
          <div className="space-y-3">
            {/* Current Password */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-white/70">Current Password</label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  value={currentPassword} 
                  onChange={e => setCurrentPassword(e.target.value)} 
                  required 
                  className="bg-background/50 border-primary/10 pl-10 transition-all focus:border-primary/30 focus:ring-1 focus:ring-primary/20" 
                />
                <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" />
                <button 
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            {/* New Password */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-white/70">New Password</label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)} 
                  required 
                  className="bg-background/50 border-primary/10 pl-10 transition-all focus:border-primary/30 focus:ring-1 focus:ring-primary/20" 
                />
                <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" />
              </div>
            </div>
            
            {/* Confirm New Password */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-white/70">Confirm New Password</label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  value={confirmNewPassword} 
                  onChange={e => setConfirmNewPassword(e.target.value)} 
                  required 
                  className="bg-background/50 border-primary/10 pl-10 transition-all focus:border-primary/30 focus:ring-1 focus:ring-primary/20" 
                />
                <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" />
              </div>
              
              {newPassword && confirmNewPassword && newPassword !== confirmNewPassword && (
                <p className="text-xs text-red-500 mt-1 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Passwords don't match
                </p>
              )}
            </div>
          </div>
          
          <Button 
            type="submit"
            disabled={isLoading} 
            className="w-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? "Updating..." : "Update Password"}
              {isLoading && <span className="animate-spin">◌</span>}
            </span>
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 border-t border-primary/10 mt-6">
        <Button 
          variant="destructive" 
          className="w-full hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2 group relative overflow-hidden"
          onClick={handleLogout}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-destructive/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <LogOut className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Logout</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
