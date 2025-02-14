
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
  AlertCircle
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
import { EmptyNFTState } from "@/components/EmptyNFTState";
import KYCIdentityDialog from "@/components/KYCIdentityDialog";
import KYCAddressDialog from "@/components/KYCAddressDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'purchase';
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
  kyc_status?: string | null;
  kyc_rejection_reason?: string | null;
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
    setIsIdentityDialogOpen(true);
  };

  const handleIdentitySuccess = () => {
    setIsIdentityDialogOpen(false);
    setIsAddressDialogOpen(true);
  };

  const handleAddressSuccess = async () => {
    setIsAddressDialogOpen(false);
    
    // Refresh user data
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
    if (currentUser) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();
        
      if (profileData) {
        setUserData(prev => prev ? { ...prev, kyc_status: profileData.kyc_status } : null);
      }
    }
  };

  const renderVerificationStatus = () => {
    const statusConfig = {
      'not_started': {
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/20',
        icon: <Shield className="w-8 h-8" />,
        progress: 0,
        label: 'Not Started',
        description: 'Begin your verification process to unlock full platform features'
      },
      'identity_submitted': {
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
        icon: <FileCheck className="w-8 h-8" />,
        progress: 33,
        label: 'Identity Submitted',
        description: 'Your identity documents are under initial review'
      },
      'address_submitted': {
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
        icon: <FileCheck className="w-8 h-8" />,
        progress: 66,
        label: 'Address Submitted',
        description: 'Your address verification is being processed'
      },
      'under_review': {
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/20',
        icon: <HelpCircle className="w-8 h-8" />,
        progress: 80,
        label: 'Under Review',
        description: 'Final verification check in progress'
      },
      'verified': {
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20',
        icon: <BadgeCheck className="w-8 h-8" />,
        progress: 100,
        label: 'Verified',
        description: 'Your account is fully verified'
      },
      'rejected': {
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20',
        icon: <AlertCircle className="w-8 h-8" />,
        progress: 0,
        label: 'Rejected',
        description: 'Verification unsuccessful. Please contact support'
      }
    };

    const config = statusConfig[userData?.kyc_status || 'not_started'];

    return (
      <div className="space-y-8">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/5 via-primary/10 to-purple-500/5 border border-primary/10 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className={`p-4 rounded-2xl ${config.bgColor} ${config.borderColor} border-2`}>
              <div className={`${config.color}`}>
                {config.icon}
              </div>
            </div>
            <div className="space-y-4 flex-1">
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  KYC Status: <span className={`${config.color}`}>{config.label}</span>
                </h3>
                <p className="text-muted-foreground mt-1">{config.description}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Verification Progress</span>
                  <span className={`${config.color} font-medium`}>{config.progress}%</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-primary/10 to-purple-500/10 blur-md"></div>
                  <Progress value={config.progress} className="h-2 relative z-10" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {userData?.kyc_status === 'not_started' && (
          <Button
            onClick={startKYCVerification}
            className="w-full bg-primary/20 hover:bg-primary/30 text-primary font-medium py-6 text-lg transition-colors"
          >
            <Shield className="w-5 h-5 mr-2" />
            Start Identity Verification
          </Button>
        )}

        {userData?.kyc_status === 'rejected' && userData?.kyc_rejection_reason && (
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="text-base">
              Rejection reason: {userData.kyc_rejection_reason}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Identity', 'Address', 'Verification'].map((step, index) => (
            <div
              key={step}
              className={`p-6 rounded-xl border ${
                config.progress >= index * 33 ? config.borderColor : 'border-primary/10'
              } bg-gradient-to-br from-purple-500/5 via-primary/10 to-purple-500/5`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  config.progress >= index * 33 ? config.bgColor : 'bg-primary/10'
                }`}>
                  {config.progress >= index * 33 ? (
                    <BadgeCheck className={`w-5 h-5 ${config.color}`} />
                  ) : (
                    <Shield className="w-5 h-5 text-primary/60" />
                  )}
                </div>
                <h4 className="font-medium">{step}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
            kyc_status: profileData?.kyc_status,
            kyc_rejection_reason: profileData?.kyc_rejection_reason
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
          toast({
            title: "Error",
            description: "Failed to fetch user data. Please try again.",
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

          <TabsContent value="wallet">
            <div className="space-y-6">
              <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-background/60">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">Available Balance</p>
                      <div className="space-y-2">
                        <h2 className="text-5xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-1.5">
                          <img
                            src="/eth-logo.svg"
                            alt="ETH"
                            className="w-8 h-8"
                          />
                          {userData?.balance || "0.0"} ETH
                        </h2>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="flex-1 bg-primary/20 text-primary hover:bg-primary/30 transition-colors flex items-center justify-center gap-2"
                          >
                            <ArrowUpCircle className="w-4 h-4" />
                            Deposit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Deposit ETH</DialogTitle>
                            <DialogDescription>
                              Enter the amount you want to deposit
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleDeposit} className="space-y-4">
                            <div className="space-y-2">
                              <Input
                                type="number"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
                                placeholder="Amount in ETH"
                                step="0.01"
                                min="0"
                                required
                                className="bg-background/50"
                              />
                            </div>
                            <DialogFooter>
                              <Button type="submit">
                                Confirm Deposit
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="flex-1 bg-primary/20 text-primary hover:bg-primary/30 transition-colors flex items-center justify-center gap-2"
                          >
                            <ArrowDownCircle className="w-4 h-4" />
                            Withdraw
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Withdraw ETH</DialogTitle>
                            <DialogDescription>
                              Enter the amount you want to withdraw
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleWithdraw} className="space-y-4">
                            <div className="space-y-2">
                              <Input
                                type="number"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                placeholder="Amount in ETH"
                                step="0.01"
                                min="0"
                                required
                                className="bg-background/50"
                              />
                            </div>
                            <DialogFooter>
                              <Button type="submit">
                                Confirm Withdrawal
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/10">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                    Transaction History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border border-primary/10">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-primary/5">
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((tx) => (
                          <TableRow key={tx.id} className="hover:bg-primary/5">
                            <TableCell className="font-medium capitalize">
                              <div className="flex items-center gap-2">
                                {tx.type === 'deposit' && <ArrowUpCircle className="w-4 h-4 text-green-500" />}
                                {tx.type === 'withdraw' && <ArrowDownCircle className="w-4 h-4 text-red-500" />}
                                {tx.type}
                              </div>
                            </TableCell>
                            <TableCell className="font-mono">
                              {tx.amount} ETH
                            </TableCell>
                            <TableCell>{tx.created_at}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                tx.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                tx.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                'bg-red-500/10 text-red-500'
                              }`}>
                                {tx.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="verification">
            {renderVerificationStatus()}
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

        <KYCIdentityDialog
          isOpen={isIdentityDialogOpen}
          onClose={() => setIsIdentityDialogOpen(false)}
          onSuccess={handleIdentitySuccess}
        />

        <KYCAddressDialog
          isOpen={isAddressDialogOpen}
          onClose={() => setIsAddressDialogOpen(false)}
          onSuccess={handleAddressSuccess}
        />
      </div>
    </div>
  );
};

export default Profile;
