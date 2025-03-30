import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Key, Settings, LogOut, Shield, AlertTriangle, Eye, EyeOff, CheckCircle2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Separator } from "@/components/ui/separator";

interface SettingsTabProps {
  handleLogout: () => void;
}

export const SettingsTab = ({ handleLogout }: SettingsTabProps) => {
  return (
    <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-[#1A1F2C]/95 to-[#1A1F2C]/80 overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px] opacity-30"></div>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600/50 via-primary/40 to-purple-600/50"></div>
      
      <CardHeader className="space-y-2 border-b border-primary/10 pb-4 relative z-10">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          Account Settings
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-8 p-6 relative z-10">
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
        <form onSubmit={handleEmailChange} className="space-y-5 relative">
          <div className="space-y-2">
            <h4 className="text-md font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary/80" />
              Update Email Address
            </h4>
            <p className="text-xs text-white/60">
              A verification link will be sent to your new email address
            </p>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            <Input 
              type="email" 
              value={newEmail} 
              onChange={e => setNewEmail(e.target.value)} 
              placeholder="Enter new email address" 
              required 
              className="bg-white/5 border-white/10 group-hover:border-primary/30 transition-all pl-10 focus:border-primary/30 focus:ring-1 focus:ring-primary/20 pr-10 text-white/90 h-12"
            />
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary/60" />
            
            {emailSent && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>
          
          {emailSent && (
            <div className="text-sm text-green-500 flex items-center gap-2 animate-pulse">
              <CheckCircle2 className="w-4 h-4" />
              Verification email sent!
            </div>
          )}
          
          <Button 
            type="submit" 
            disabled={isEmailLoading}
            variant="gradient"
            size="settings"
            className="group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center gap-2">
              {isEmailLoading ? (
                <>
                  <span className="animate-pulse">Processing</span>
                  <span className="inline-block animate-spin">◌</span>
                </>
              ) : (
                <>Update Email</>
              )}
            </span>
          </Button>
        </form>
        
        <Separator className="bg-primary/10" />
        
        {/* Password Change Form */}
        <form onSubmit={handlePasswordChange} className="space-y-5 relative">
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
              <label className="text-xs font-medium text-white/70 flex items-center justify-between">
                <span>Current Password</span>
                <button 
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-primary/60 hover:text-primary/80 transition-colors text-xs flex items-center gap-1"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3 h-3" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" />
                      <span>Show</span>
                    </>
                  )}
                </button>
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                <Input 
                  type={showPassword ? "text" : "password"}
                  value={currentPassword} 
                  onChange={e => setCurrentPassword(e.target.value)} 
                  required 
                  className="bg-white/5 border-white/10 group-hover:border-primary/30 pl-10 transition-all focus:border-primary/30 focus:ring-1 focus:ring-primary/20 text-white/90 h-12" 
                />
                <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary/60" />
              </div>
            </div>
            
            {/* New Password */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-white/70">New Password</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                <Input 
                  type={showPassword ? "text" : "password"}
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)} 
                  required 
                  className="bg-white/5 border-white/10 group-hover:border-primary/30 pl-10 transition-all focus:border-primary/30 focus:ring-1 focus:ring-primary/20 text-white/90 h-12" 
                />
                <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary/60" />
              </div>
              
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70">Password strength:</span>
                    <span className={`font-medium ${
                      passwordStrength.text === "Weak" || passwordStrength.text === "Fair" 
                        ? "text-orange-500" 
                        : passwordStrength.text === "Good" 
                          ? "text-yellow-500" 
                          : "text-green-500"
                    }`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-gray-700/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Confirm New Password */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-white/70">Confirm New Password</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                <Input 
                  type={showPassword ? "text" : "password"}
                  value={confirmNewPassword} 
                  onChange={e => setConfirmNewPassword(e.target.value)} 
                  required 
                  className={`bg-white/5 border-white/10 group-hover:border-primary/30 pl-10 transition-all focus:border-primary/30 focus:ring-1 focus:ring-primary/20 text-white/90 h-12 ${
                    newPassword && confirmNewPassword && newPassword !== confirmNewPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`} 
                />
                <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary/60" />
                
                {newPassword && confirmNewPassword && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {newPassword === confirmNewPassword ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <X className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              
              {newPassword && confirmNewPassword && newPassword !== confirmNewPassword && (
                <p className="text-xs text-red-500 mt-1 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Passwords don't match
                </p>
              )}
            </div>
          </div>
          
          {passwordChanged && (
            <div className="text-sm text-green-500 flex items-center gap-2 animate-pulse">
              <CheckCircle2 className="w-4 h-4" />
              Password updated successfully!
            </div>
          )}
          
          <Button 
            type="submit"
            disabled={isLoading || (newPassword && confirmNewPassword && newPassword !== confirmNewPassword)} 
            variant="gradient"
            size="settings"
            className="group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? (
                <>
                  <span className="animate-pulse">Updating</span>
                  <span className="inline-block animate-spin">◌</span>
                </>
              ) : (
                <>Update Password</>
              )}
            </span>
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 border-t border-primary/10 mt-6 relative z-10">
        <Button 
          variant="gradientDestructive" 
          size="settings"
          className="group"
          onClick={handleLogout}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-destructive/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <LogOut className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Logout</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
