import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Settings, 
  Mail, 
  Key, 
  LogOut, 
  Wallet, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Globe, 
  UserRound, 
  ShoppingBag, 
  HelpCircle,
  Shield,
  FileCheck,
  BadgeCheck,
  Home,
  CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import WalletAddressModal from "@/components/WalletAddressModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import DepositConfirmationDialog from "@/components/DepositConfirmationDialog";
import FraudWarningDialog from "@/components/FraudWarningDialog";
import KYCIdentityDialog from "@/components/KYCIdentityDialog";
import KYCAddressDialog from "@/components/KYCAddressDialog";
import { UserNFTCollection } from "@/components/nft/UserNFTCollection";

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'purchase' | 'sale';
  amount: string;
  created_at: string;
  status: 'pending' | 'completed' | 'failed';
  item?: string;
}

interface UserData {
  id: string;
  email: string;
  login: string;
  country: string;
  avatar_url: string | null;
  balance: string;
  wallet_address?: string;
  erc20_address?: string;
  created_at: string;
  verified: boolean;
  kyc_status?: string;
}

interface TransactionTotals {
  total_deposits: number;
  total_withdrawals: number;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isDepositConfirmationOpen, setIsDepositConfirmationOpen] = useState(false);
  const [isFraudWarningOpen, setIsFraudWarningOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [transactionTotals, setTransactionTotals] = useState<TransactionTotals>({
    total_deposits: 0,
    total_withdrawals: 0
  });
  const [isIdentityDialogOpen, setIsIdentityDialogOpen] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);

  const showDelayedToast = (title: string, description: string, variant: "default" | "destructive" = "default") => {
    setTimeout(() => {
      toast({
        title,
        description,
        variant,
      });
    }, 1000);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      showDelayedToast("Success", "Logged out successfully");
      navigate("/");
    } catch (error) {
      showDelayedToast("Error", "Failed to log out", "destructive");
    }
  };

  const startKYCVerification = () => {
    try {
      if (!user?.id) {
        toast({
          title: "Error",
          description: "You must be logged in to start verification",
          variant: "destructive",
        });
        return;
      }
      
      setIsIdentityDialogOpen(true);
    } catch (error) {
      console.error("Error starting verification:", error);
      toast({
        title: "Error",
        description: "Failed to start verification process. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleIdentitySuccess = async () => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      setUserData(prev => prev ? {
        ...prev,
        kyc_status: profileData.kyc_status,
      } : null);

      setIsIdentityDialogOpen(false);
      setIsAddressDialogOpen(true);
    } catch (error) {
      console.error("Error updating profile data:", error);
      toast({
        title: "Error",
        description: "Failed to update profile status",
        variant: "destructive",
      });
    }
  };

  const handleAddressSuccess = async () => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      setUserData(prev => prev ? {
        ...prev,
        kyc_status: profileData.kyc_status,
      } : null);

      setIsAddressDialogOpen(false);
      
      toast({
        title: "Verification In Progress",
        description: "Your documents have been submitted and are under review.",
      });
    } catch (error) {
      console.error("Error updating profile data:", error);
      toast({
        title: "Error",
        description: "Failed to update profile status",
        variant: "destructive",
      });
    }
  };

  const handleAddressClose = () => {
    setIsAddressDialogOpen(false);
  };

  const continueKYCVerification = () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to continue verification",
        variant: "destructive",
      });
      return;
    }
    setIsAddressDialogOpen(true);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          throw authError;
        }

        if (!currentUser) {
          console.log("No user found");
          return;
        }

        const { data: totalsData, error: totalsError } = await supabase
          .rpc('get_user_transaction_totals', {
            user_uuid: currentUser.id
          });

        if (totalsError) {
          console.error("Error fetching transaction totals:", totalsError);
          throw totalsError;
        }

        if (totalsData) {
          setTransactionTotals(totalsData);
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', currentUser.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (transactionsError) {
          console.error("Transactions error:", transactionsError);
          throw transactionsError;
        }

        console.log("Profile data:", profileData); // Добавляем лог для отладки

        if (isMounted && currentUser) {
          const userData: UserData = {
            id: currentUser.id,
            email: currentUser.email || '',
            login: profileData?.login || currentUser.user_metadata?.login || '',
            country: profileData?.country || currentUser.user_metadata?.country || '',
            avatar_url: profileData?.avatar_url || null,
            balance: profileData?.balance?.toString() || "0.0",
            wallet_address: profileData?.wallet_address || '',
            erc20_address: profileData?.erc20_address || undefined,
            created_at: currentUser.created_at,
            verified: profileData?.verified || false,
            kyc_status: profileData?.kyc_status || 'not_started'
          };

          console.log("Setting user data with avatar:", userData.avatar_url); // Добавляем лог для отладки
          setUserData(userData);

          if (transactionsData) {
            setTransactions(transactionsData.map(tx => ({
              id: tx.id,
              type: tx.type,
              amount: tx.amount.toString(),
              created_at: new Date(tx.created_at).toISOString().split('T')[0],
              status: tx.status,
              item: tx.item
            })));
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (isMounted) {
          toast({
            title: "Error",
            description: "Failed to fetch user data",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [toast]);

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
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Email update request has been sent. Please check your new email for verification.",
      });
      
      setNewEmail("");
    } catch (error: any) {
      console.error("Email update error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update email",
        variant: "destructive",
      });
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userData?.id) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userData.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', userData.id);

      if (updateError) throw updateError;

      setUserData(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      
      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive",
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

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const withdrawAmountNum = parseFloat(withdrawAmount);
    const balanceNum = parseFloat(userData?.balance || "0");
    
    if (withdrawAmountNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (withdrawAmountNum > balanceNum) {
      toast({
        title: "Insufficient funds",
        description: `Your balance (${balanceNum} ETH) is less than the requested withdrawal amount`,
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user?.id,
            type: 'withdraw',
            amount: withdrawAmountNum,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Withdrawal Requested",
        description: `Your withdrawal request for ${withdrawAmount} ETH has been submitted`
      });
      
      setWithdrawAmount("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process withdrawal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData?.wallet_address) {
      toast({
        title: "Error",
        description: "You need to generate a wallet address in your profile first",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(depositAmount);
    if (!depositAmount || amount <= 0) {
      setTimeout(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please enter a valid amount greater than 0"
        });
      }, 1000);
      return;
    }

    setIsDepositConfirmationOpen(true);
  };

  const handleDepositConfirm = () => {
    setIsDepositConfirmationOpen(false);
    setIsFraudWarningOpen(true);
    setDepositAmount("");
    
    toast({
      title: "Rejected",
      description: `Deposit of ${depositAmount} the rejected. Please contact our support team on Telegram for transaction verification`
    });
  };

  const handleGenerateWalletAddress = async (address: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ wallet_address: address })
        .eq('user_id', userData?.id);

      if (error) throw error;

      setUserData(prev => prev ? { ...prev, wallet_address: address } : null);
      
      toast({
        title: "Success",
        description: "Wallet address has been generated and saved.",
      });
    } catch (error) {
      console.error("Error saving wallet address:", error);
      toast({
        title: "Error",
        description: "Failed to save wallet address. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 mt-16">
        <div className="max-w-4xl mx-auto">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 mt-16 min-h-screen bg-gradient-to-b from-background via-background/80 to-background/60">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="relative p-8 rounded-2xl overflow-hidden bg-gradient-to-r from-purple-500/10 via-primary/5 to-purple-500/10 border border-primary/10 backdrop-blur-sm shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 animate-gradient"></div>
          <div className="relative flex items-center gap-6 z-10">
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                id="avatar-upload"
              />
              <label 
                htmlFor="avatar-upload" 
                className="cursor-pointer block relative"
              >
                <Avatar className="w-24 h-24 border-4 border-primary/20 shadow-xl ring-2 ring-purple-500/20 transition-all duration-300 group-hover:ring-purple-500/40">
                  {userData?.avatar_url ? (
                    <AvatarImage src={userData.avatar_url} alt={userData.login} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-primary/80 to-purple-600 text-white">
                      <UserRound className="w-12 h-12" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-white text-xs font-medium">Change Avatar</p>
                </div>
              </label>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                @{userData?.login}
              </h1>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5 p-1.5 bg-background/50 backdrop-blur-sm rounded-xl border border-primary/10 mb-6">
            {["profile", "settings", "wallet", "verification", "nft"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="flex items-center gap-2 transition-all duration-300 data-[state=active]:bg-primary/20 data-[state=active]:text-primary relative overflow-hidden group"
              >
                {tab === "profile" && <User className="w-4 h-4" />}
                {tab === "settings" && <Settings className="w-4 h-4" />}
                {tab === "wallet" && <Wallet className="w-4 h-4" />}
                {tab === "verification" && <Shield className="w-4 h-4" />}
                {tab === "nft" && <ShoppingBag className="w-4 h-4" />}
                <span className="relative z-10 capitalize">{tab}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="profile">
            <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-[#1A1F2C]/90">
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <UserRound className="w-6 h-6 text-primary" />
                  </div>
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <div className="relative overflow-hidden rounded-lg transition-all duration-300 group-hover:shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Input
                        value={userData?.email}
                        readOnly
                        className="bg-background/50 border-primary/10 group-hover:border-primary/30 transition-colors pl-10"
                      />
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <Globe className="w-4 h-4" />
                      Country
                    </label>
                    <div className="relative overflow-hidden rounded-lg transition-all duration-300 group-hover:shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Input
                        value={userData?.country}
                        readOnly
                        className="bg-background/50 border-primary/10 group-hover:border-primary/30 transition-colors pl-10"
                      />
                      <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <HelpCircle className="w-4 h-4" />
                    Verification Status
                  </label>
                  <div className="relative overflow-hidden rounded-lg transition-all duration-300 group-hover:shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="bg-background/50 border border-primary/10 group-hover:border-primary/30 transition-colors rounded-lg p-3 pl-10 flex items-center">
                      {userData?.verified ? (
                        <span className="text-green-500 font-medium">Verified</span>
                      ) : (
                        <span className="text-yellow-500 font-medium">Not Verified</span>
                      )}
                    </div>
                    <HelpCircle className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <Wallet className="w-4 h-4" />
                    Wallet Address
                  </label>
                  <div className="flex gap-4 items-start">
                    <div className="flex-grow flex gap-2 items-center relative overflow-hidden rounded-lg transition-all duration-300 group-hover:shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Input
                        value={userData?.wallet_address || ''}
                        readOnly
                        className="bg-background/50 font-mono text-sm border-primary/10 group-hover:border-primary/30 transition-colors pl-10"
                        placeholder="No wallet address generated"
                      />
                      <Wallet className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      {userData?.wallet_address && (
                        <div className="bg-primary/20 px-3 py-1.5 rounded-md text-sm text-primary font-medium min-w-[80px] text-center">
                          ERC-20
                        </div>
                      )}
                    </div>
                    {!userData?.wallet_address && (
                      <Button
                        onClick={() => setIsWalletModalOpen(true)}
                        className="bg-primary/20 text-primary hover:bg-primary/30 transition-colors flex items-center gap-2 group relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <Wallet className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">Generate Address</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
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
                          onChange={(e) => setNewEmail(e.target.value)}
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
                              value={
                                index === 0
                                  ? currentPassword
                                  : index === 1
                                  ? newPassword
                                  : confirmNewPassword
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                index === 0
                                  ? setCurrentPassword(value)
                                  : index === 1
                                  ? setNewPassword(value)
                                  : setConfirmNewPassword(value);
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
            </Card>

            <div className="mt-6">
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
          </TabsContent>

          <TabsContent value="wallet">
            <div className="space-y-6">
              <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-[#1A1F2C]/90">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">Available Balance</p>
                      <div className="space-y-2">
                        <h2 className="text-5xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-1.5">
                          <img 
                            src="/lovable-uploads/7dcd0dff-e904-44df-813e-caf5a6160621.png" 
                            alt="ETH"
                            className="h-10 w-10"
                          />
                          {Number(userData?.balance || 0).toFixed(2)}
                        </h2>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => setIsDepositConfirmationOpen(true)}
                  className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-500 flex items-center gap-3 p-6 h-auto group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="p-3 rounded-xl bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                    <ArrowDownCircle className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-lg font-semibold">Deposit</span>
                    <span className="text-sm text-muted-foreground">Add funds to your wallet</span>
                  </div>
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full bg-destructive/20 hover:bg-destructive/30 text-destructive flex items-center gap-3 p-6 h-auto group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-destructive/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="p-3 rounded-xl bg-destructive/20 group-hover:bg-destructive/30 transition-colors">
                        <ArrowUpCircle className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-lg font-semibold">Withdraw</span>
                        <span className="text-sm text-muted-foreground">Transfer funds to your wallet</span>
                      </div>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border border-destructive/10">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-destructive">Withdraw</DialogTitle>
                      <DialogDescription>
                        Transfer funds to your wallet
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleWithdraw} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-destructive/80">
                          Amount (ETH)
                        </label>
                        <Input
                          type="number"
                          step="0.0001"
                          min="0.0001"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="bg-background/40 border-destructive/20 focus:border-destructive/40"
                        />
                      </div>
                      <Button 
                        type="submit"
                        className="w-full bg-destructive/20 hover:bg-destructive/30 text-destructive"
                      >
                        Confirm Withdrawal
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-[#1A1F2C]/90">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <ArrowUpCircle className="w-6 h-6 rotate-45 text-primary" />
                    </div>
                    Transaction History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {transactions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-primary/5">
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount (ETH)</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactions.map((transaction) => (
                            <TableRow
                              key={transaction.id}
                              className="hover:bg-primary/5 transition-colors"
                            >
                              <TableCell>{transaction.created_at}</TableCell>
                              <TableCell className="capitalize flex items-center gap-2">
                                {transaction.type === 'deposit' && (
                                  <ArrowDownCircle className="w-4 h-4 text-green-500" />
                                )}
                                {transaction.type === 'withdraw' && (
                                  <ArrowUpCircle className="w-4 h-4 text-red-500" />
                                )}
                                {transaction.type === 'purchase' && (
                                  <ShoppingBag className="w-4 h-4 text-blue-500" />
                                )}
                                {transaction.type === 'sale' && (
                                  <ShoppingBag className="w-4 h-4 text-green-500" />
                                )}
                                {transaction.type}
                              </TableCell>
                              <TableCell>{transaction.amount}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  transaction.status === 'completed'
                                    ? 'bg-green-500/20 text-green-500'
                                    : transaction.status === 'pending'
                                    ? 'bg-yellow-500/20 text-yellow-500'
                                    : 'bg-red-500/20 text-red-500'
                                }`}>
                                  {transaction.status}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No transactions found
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="verification">
            <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-[#1A1F2C]/90">
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  KYC Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="p-6 rounded-xl bg-[#12151C]/80 border border-primary/10 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${userData?.verified ? 'bg-green-500/10 border border-green-500/20' : 'bg-orange-500/10 border border-orange-500/20'}`}>
                      {userData?.verified ? (
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                      ) : (
                        <HelpCircle className="w-8 h-8 text-orange-500" />
                      )}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          KYC Status:{' '}
                          <span className={`${userData?.verified ? 'text-green-500' : 'text-orange-500'}`}>
                            {userData?.verified ? 'Verified' : (
                              userData?.kyc_status === 'not_started' ? 'Not Started' :
                              userData?.kyc_status === 'identity_submitted' ? 'Identity Submitted' :
                              userData?.kyc_status === 'under_review' ? 'Under Review' : 'Not Verified'
                            )}
                          </span>
                        </h3>
                        {userData?.kyc_status === 'under_review' && (
                          <span className="text-sm text-orange-500 font-medium">80%</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {userData?.verified 
                          ? 'Your account is fully verified and has access to all features'
                          : userData?.kyc_status === 'under_review' 
                            ? 'Final verification check in progress'
                            : 'Complete verification to unlock all features'}
                      </p>
                      {userData?.kyc_status === 'under_review' && (
                        <div className="mt-4 w-full bg-orange-500/10 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-1000"
                            style={{ width: '80%' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-6 rounded-xl border transition-all duration-300 space-y-4 ${
                    userData?.kyc_status === 'not_started'
                      ? 'bg-primary/5 border-primary/20'
                      : 'bg-[#12151C]/80 border-primary/10'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        userData?.kyc_status === 'not_started'
                          ? 'bg-primary/20'
                          : 'bg-green-500/20'
                      }`}>
                        <User className={`w-5 h-5 ${
                          userData?.kyc_status === 'not_started'
                            ? 'text-primary'
                            : 'text-green-500'
                        }`} />
                      </div>
                      <h3 className="font-semibold">Identity</h3>
                    </div>
                    {userData?.kyc_status === 'not_started' && (
                      <Button 
                        onClick={startKYCVerification}
                        className="w-full bg-primary/20 hover:bg-primary/30 text-primary"
                      >
                        Start Verification
                      </Button>
                    )}
                  </div>

                  <div className={`p-6 rounded-xl border transition-all duration-300 space-y-4 ${
                    userData?.kyc_status === 'identity_submitted'
                      ? 'bg-primary/5 border-primary/20'
                      : 'bg-[#12151C]/80 border-primary/10'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        userData?.kyc_status === 'identity_submitted'
                          ? 'bg-primary/20'
                          : userData?.kyc_status === 'under_review' || userData?.verified
                          ? 'bg-green-500/20'
                          : 'bg-muted/20'
                      }`}>
                        <Home className={`w-5 h-5 ${
                          userData?.kyc_status === 'identity_submitted'
                            ? 'text-primary'
                            : userData?.kyc_status === 'under_review' || userData?.verified
                            ? 'text-green-500'
                            : 'text-muted-foreground'
                        }`} />
                      </div>
                      <h3 className="font-semibold">Address</h3>
                    </div>
                    {(userData?.kyc_status === 'identity_submitted' || userData?.kyc_status === 'not_started') && (
                      <Button 
                        onClick={() => setIsAddressDialogOpen(true)}
                        className="w-full bg-primary/20 hover:bg-primary/30 text-primary"
                        disabled={userData?.kyc_status === 'not_started'}
                      >
                        Submit Address Documents
                      </Button>
                    )}
                  </div>

                  <div className={`p-6 rounded-xl border transition-all duration-300 space-y-4 ${
                    userData?.verified
                      ? 'bg-green-500/5 border-green-500/20'
                      : 'bg-[#12151C]/80 border-primary/10'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        userData?.verified
                          ? 'bg-green-500/20'
                          : 'bg-muted/20'
                      }`}>
                        <BadgeCheck className={`w-5 h-5 ${
                          userData?.verified
                            ? 'text-green-500'
                            : 'text-muted-foreground'
                        }`} />
                      </div>
                      <h3 className="font-semibold">Verification</h3>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nft">
            <UserNFTCollection />
          </TabsContent>
        </Tabs>
      </div>

      <WalletAddressModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onGenerated={handleGenerateWalletAddress}
      />

      <DepositConfirmationDialog
        isOpen={isDepositConfirmationOpen}
        onClose={() => setIsDepositConfirmationOpen(false)}
        amount={depositAmount}
        onConfirm={handleDepositConfirm}
      />

      <FraudWarningDialog
        isOpen={isFraudWarningOpen}
        onClose={() => setIsFraudWarningOpen(false)}
      />

      <KYCIdentityDialog
        isOpen={isIdentityDialogOpen}
        onClose={() => setIsIdentityDialogOpen(false)}
        onSuccess={handleIdentitySuccess}
        userId={user?.id || ''}
      />

      <KYCAddressDialog
        isOpen={isAddressDialogOpen}
        onClose={handleAddressClose}
        onSuccess={handleAddressSuccess}
        userId={user?.id || ''}
      />
    </div>
  );
};

export default Profile;
