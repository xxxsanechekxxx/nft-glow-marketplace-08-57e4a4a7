
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Key, Settings, LogOut, Save, AlertCircle, Lock, User, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator";

interface SettingsTabProps {
  handleLogout: () => void;
}

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmNewPassword: z.string(),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["confirmNewPassword"],
});

export const SettingsTab = ({ handleLogout }: SettingsTabProps) => {
  const { toast } = useToast();
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const showDelayedToast = (title: string, description: string, variant: "default" | "destructive" = "default") => {
    setTimeout(() => {
      toast({
        title,
        description,
        variant
      });
    }, 1000);
  };

  const onEmailSubmit = async (values: z.infer<typeof emailSchema>) => {
    setIsEmailSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: values.email
      });
      if (error) throw error;
      toast({
        title: "Success",
        description: "Email update request has been sent. Please check your new email for verification."
      });
      emailForm.reset();
    } catch (error: any) {
      console.error("Email update error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update email",
        variant: "destructive"
      });
    } finally {
      setIsEmailSubmitting(false);
    }
  };

  const onPasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
    setIsPasswordSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword
      });
      if (error) throw error;
      showDelayedToast("Success", "Password has been updated");
      passwordForm.reset();
    } catch (error: any) {
      showDelayedToast("Error", error.message || "Failed to update password", "destructive");
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border-purple-500/20 shadow-xl shadow-purple-500/5 bg-gradient-to-b from-[#1C1F2E]/90 to-[#141824]/90 backdrop-blur-lg">
        <CardHeader className="pb-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-purple-500/20 text-purple-400">
              <Settings className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Account Settings
            </CardTitle>
          </div>
          <p className="text-sm text-white/60">
            Manage your account settings and preferences
          </p>
          <Separator className="bg-purple-500/10" />
        </CardHeader>
        
        <CardContent className="space-y-8 p-6">
          {/* Email Update Form */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Mail className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white/90">Email Address</h3>
            </div>
            <p className="text-sm text-white/60 mb-4">
              Update your email address. A verification link will be sent to your new email.
            </p>
            
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-5">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-white/80">
                        New Email Address
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            {...field} 
                            type="email" 
                            placeholder="Enter new email address" 
                            className="bg-white/5 border-purple-500/20 pl-10 transition-all duration-300 focus:border-purple-500/50 focus:ring-purple-500/30 text-white" 
                          />
                        </FormControl>
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                      </div>
                      <FormMessage className="text-red-400 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  disabled={isEmailSubmitting}
                  className="w-full bg-purple-600/80 hover:bg-purple-600 text-white transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group h-11"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-indigo-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Mail className="w-4 h-4 z-10" />
                  <span className="relative z-10 font-medium">
                    {isEmailSubmitting ? 'Updating...' : 'Update Email'}
                  </span>
                </Button>
              </form>
            </Form>
          </div>

          <Separator className="bg-purple-500/10" />

          {/* Password Update Form */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white/90">Password</h3>
            </div>
            <p className="text-sm text-white/60 mb-4">
              Update your password. Choose a strong password that you don't use elsewhere.
            </p>
            
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-5">
                {["currentPassword", "newPassword", "confirmNewPassword"].map((name, index) => (
                  <FormField
                    key={name}
                    control={passwordForm.control}
                    name={name as "currentPassword" | "newPassword" | "confirmNewPassword"}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-white/80">
                          {index === 0 ? "Current Password" : index === 1 ? "New Password" : "Confirm New Password"}
                        </FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              {...field} 
                              type="password" 
                              className="bg-white/5 border-purple-500/20 pl-10 transition-all duration-300 focus:border-purple-500/50 focus:ring-purple-500/30 text-white" 
                            />
                          </FormControl>
                          <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                        </div>
                        <FormMessage className="text-red-400 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                ))}
                <Button 
                  type="submit" 
                  disabled={isPasswordSubmitting}
                  className="w-full bg-purple-600/80 hover:bg-purple-600 text-white transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group h-11"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-indigo-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Lock className="w-4 h-4 z-10" />
                  <span className="relative z-10 font-medium">
                    {isPasswordSubmitting ? 'Updating...' : 'Update Password'}
                  </span>
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>

        <CardFooter className="p-6 bg-[#15192A]/80 border-t border-purple-500/10">
          <Button 
            variant="destructive" 
            className="w-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group h-11" 
            onClick={handleLogout}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <LogOut className="w-4 h-4 z-10" />
            <span className="relative z-10 font-medium">Logout</span>
          </Button>
        </CardFooter>
      </Card>

      <Card className="overflow-hidden border-purple-500/20 shadow-xl shadow-purple-500/5 bg-gradient-to-b from-[#1C1F2E]/90 to-[#141824]/90 backdrop-blur-lg">
        <CardHeader className="pb-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-purple-500/20 text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Security
            </CardTitle>
          </div>
          <p className="text-sm text-white/60">
            Enhance your account security with these additional settings
          </p>
          <Separator className="bg-purple-500/10" />
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between py-4 px-5 rounded-lg bg-white/5 border border-purple-500/10 transition-all duration-300 hover:bg-white/10">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-purple-500/10 text-purple-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-white/90 font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-white/60 mt-1">Protect your account with an extra layer of security</p>
                </div>
              </div>
              <Button 
                className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all duration-300"
                size="sm"
              >
                Setup
              </Button>
            </div>
            
            <div className="flex items-center justify-between py-4 px-5 rounded-lg bg-white/5 border border-purple-500/10 transition-all duration-300 hover:bg-white/10">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-purple-500/10 text-purple-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-white/90 font-medium">Account Recovery</h4>
                  <p className="text-sm text-white/60 mt-1">Configure recovery options for your account</p>
                </div>
              </div>
              <Button 
                className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all duration-300"
                size="sm"
              >
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
