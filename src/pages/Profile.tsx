
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
  Upload,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
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
import { EmptyNFTState } from "@/components/EmptyNFTState";

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'purchase';
  amount: string;
  created_at: string;
  status: 'pending' | 'completed' | 'failed';
  item?: string;
}

interface TransactionTotals {
  total_deposits: number;
  total_withdrawals: number;
}

interface KYCStatus {
  status: 'not_started' | 'identity_submitted' | 'address_submitted' | 'under_review' | 'verified' | 'rejected';
  identityDoc?: string | null;
  addressDoc?: string | null;
  rejectionReason?: string | null;
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
  kyc_status: KYCStatus['status'];
  kyc_identity_doc: string | null;
  kyc_address_doc: string | null;
  kyc_rejection_reason: string | null;
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

  const startKYCVerification = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ verified: true })
        .eq('user_id', userData?.id);

      if (error) throw error;

      setUserData(prev => prev ? { ...prev, verified: true } : null);
      
      toast({
        title: "Verification Started",
        description: "Your verification request has been submitted. Our team will review your documents shortly.",
      });
    } catch (error) {
      console.error("Error starting verification:", error);
      toast({
        title: "Error",
        description: "Failed to start verification process. Please try again.",
        variant: "destructive",
      });
    }
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

        console.log("Profile data:", profileData);
        
        if (isMounted && currentUser) {
          setUserData({
            id: currentUser.id,
            email: currentUser.email || '',
            login: profileData?.login || currentUser.user_metadata?.login || '',
            country: profileData?.country || currentUser.user_metadata?.country || '',
            avatar_url: null,
            balance: profileData?.balance?.toString() || "0.0",
            wallet_address: profileData?.wallet_address || '',
            created_at: currentUser.created_at,
            verified: profileData?.verified || false,
            kyc_status: profileData?.kyc_status || 'not_started',
            kyc_identity_doc: profileData?.kyc_identity_doc || null,
            kyc_address_doc: profileData?.kyc_address_doc || null,
            kyc_rejection_reason: profileData?.kyc_rejection_reason || null,
          });

          setTransactions(transactionsData?.map(tx => ({
            id: tx.id,
            type: tx.type,
            amount: tx.amount.toString(),
            created_at: new Date(tx.created_at).toISOString().split('T')[0],
            status: tx.status,
            item: tx.item
          })) || []);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (isMounted) {
          showDelayedToast("Error", "Failed to fetch user data. Please try again.", "destructive");
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
      showDelayedToast("Error", "Please enter a valid amount greater than 0", "destructive");
      return;
    }

    if (withdrawAmountNum > balanceNum) {
      showDelayedToast(
        "Insufficient funds",
        `Your balance (${balanceNum} ETH) is less than the requested withdrawal amount`,
        "destructive"
      );
      return;
    }

    try {
      const { error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: userData?.id,
            type: 'withdraw',
            amount: withdrawAmountNum,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      showDelayedToast(
        "Withdrawal Requested",
        `Your withdrawal request for ${withdrawAmount} ETH has been submitted`
      );
      
      setWithdrawAmount("");
    } catch (error) {
      showDelayedToast(
        "Error",
        "Failed to process withdrawal. Please try again.",
        "destructive"
      );
    }
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData?.wallet_address) {
      showDelayedToast(
        "Error",
        "You need to generate a wallet address in your profile first",
        "destructive"
      );
      return;
    }

    setIsDepositConfirmationOpen(true);
  };

  const handleDepositConfirm = () => {
    setIsDepositConfirmationOpen(false);
    setIsFraudWarningOpen(true);
    setDepositAmount("");
    
    showDelayedToast(
      "Rejected",
      `Deposit of ${depositAmount} the rejected. Please contact our support team on Telegram for transaction verification`
    );
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

  const handleDocumentUpload = async (type: 'identity' | 'address', file: File) => {
    try {
      if (!userData?.id) {
        throw new Error('User not found');
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${userData.id}/${type}_${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('kyc_documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('kyc_documents')
        .getPublicUrl(filePath);

      const updates: Partial<UserData> = {
        [`kyc_${type}_doc`]: publicUrl,
        kyc_status: type === 'identity' ? 'identity_submitted' : 'address_submitted'
      };

      // If both documents are uploaded, update status to under_review
      if (type === 'address' && userData.kyc_identity_doc) {
        updates.kyc_status = 'under_review';
      } else if (type === 'identity' && userData.kyc_address_doc) {
        updates.kyc_status = 'under_review';
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userData.id);

      if (updateError) throw updateError;

      setUserData(prev => prev ? { ...prev, ...updates } : null);

      toast({
        title: "Document Uploaded",
        description: `Your ${type} document has been uploaded successfully.`,
      });
    } catch (error) {
      console.error(`Error uploading ${type} document:`, error);
      toast({
        title: "Error",
        description: `Failed to upload ${type} document. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const renderVerificationStatus = () => {
    const statusConfig = {
      'not_started': {
        color: 'text-yellow-500',
        icon: <Shield className="w-6 h-6" />,
        progress: 0
      },
      'identity_submitted': {
        color: 'text-blue-500',
        icon: <FileCheck className="w-6 h-6" />,
        progress: 33
      },
      'address_submitted': {
        color: 'text-blue-500',
        icon: <FileCheck className="w-6 h-6" />,
        progress: 66
      },
      'under_review': {
        color: 'text-orange-500',
        icon: <HelpCircle className="w-6 h-6" />,
        progress: 80
      },
      'verified': {
        color: 'text-green-500',
        icon: <BadgeCheck className="w-6 h-6" />,
        progress: 100
      },
      'rejected': {
        color: 'text-red-500',
        icon: <AlertCircle className="w-6 h-6" />,
        progress: 0
      }
    };

    const config = statusConfig[userData?.kyc_status || 'not_started'];

    return (
      <div className="space-y-4">
        <div className={`flex items-center gap-2 ${config.color}`}>
          {config.icon}
          <span className="capitalize font-medium">
            {(userData?.kyc_status || 'not_started').replace(/_/g, ' ')}
          </span>
        </div>
        <Progress value={config.progress} className="h-2" />
      </div>
    );
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
            <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-background/60">
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
            <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-background/60">
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
              <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-background/60">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Wallet className="w-6 h-6 text-primary" />
                    </div>
                    Wallet Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Add your wallet content here */}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="verification">
            <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-background/60">
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  KYC Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add your verification content here */}
                {renderVerificationStatus()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nft">
            <EmptyNFTState />
          </TabsContent>
        </Tabs>

        <WalletAddressModal 
          isOpen={isWalletModalOpen} 
          onClose={() => setIsWalletModalOpen(false)}
          onGenerated={handleGenerateWalletAddress}
        />

        <DepositConfirmationDialog
          isOpen={isDepositConfirmationOpen}
          onClose={() => setIsDepositConfirmationOpen(false)}
          onConfirm={handleDepositConfirm}
          amount={depositAmount}
        />

        <FraudWarningDialog
          isOpen={isFraudWarningOpen}
          onClose={() => setIsFraudWarningOpen(false)}
        />
      </div>
    </div>
  );
};

export default Profile;
