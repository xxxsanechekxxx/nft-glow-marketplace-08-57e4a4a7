
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Key, Settings, LogOut, Save, AlertCircle } from "lucide-react";
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
        <div className="space-y-8">
          {/* Email Update Form */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-white/90">Email Address</h3>
            </div>
            <Separator className="bg-primary/10" />
            
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4 p-4 rounded-xl bg-primary/5 border border-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium flex items-center gap-2 text-white/80">
                        New Email Address
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            {...field} 
                            type="email" 
                            placeholder="Enter new email address" 
                            className="bg-background/50 border-primary/10 pl-10 transition-all duration-300 focus:border-primary/30 focus:ring-primary/30" 
                          />
                        </FormControl>
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      </div>
                      <FormMessage className="text-red-400 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span></span>
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  disabled={isEmailSubmitting}
                  className="w-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    {isEmailSubmitting ? 'Updating...' : 'Update Email'}
                    <Save className="w-4 h-4" />
                  </span>
                </Button>
              </form>
            </Form>
          </div>

          {/* Password Update Form */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-white/90">Change Password</h3>
            </div>
            <Separator className="bg-primary/10" />
            
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 p-4 rounded-xl bg-primary/5 border border-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
                {["currentPassword", "newPassword", "confirmNewPassword"].map((name, index) => (
                  <FormField
                    key={name}
                    control={passwordForm.control}
                    name={name as "currentPassword" | "newPassword" | "confirmNewPassword"}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium flex items-center gap-2 text-white/80">
                          {index === 0 ? "Current Password" : index === 1 ? "New Password" : "Confirm New Password"}
                        </FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              {...field} 
                              type="password" 
                              className="bg-background/50 border-primary/10 pl-10 transition-all duration-300 focus:border-primary/30 focus:ring-primary/30" 
                            />
                          </FormControl>
                          <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        </div>
                        <FormMessage className="text-red-400 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span></span>
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                ))}
                <Button 
                  type="submit" 
                  disabled={isPasswordSubmitting}
                  className="w-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    {isPasswordSubmitting ? 'Updating...' : 'Update Password'}
                    <Save className="w-4 h-4" />
                  </span>
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </CardContent>

      <div className="px-6 pb-6 mt-6">
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
