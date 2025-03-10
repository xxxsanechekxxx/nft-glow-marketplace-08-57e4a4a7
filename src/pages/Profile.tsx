import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, Mail, Key, LogOut, Wallet, ArrowUpCircle, ArrowDownCircle, Globe, UserRound, ShoppingBag, HelpCircle, Shield, FileCheck, BadgeCheck, Home, CheckCircle2, Clock, LockIcon, DollarSign, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WalletAddressModal from "@/components/WalletAddressModal";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import DepositConfirmationDialog from "@/components/DepositConfirmationDialog";
import FraudWarningDialog from "@/components/FraudWarningDialog";
import KYCIdentityDialog from "@/components/KYCIdentityDialog";
import KYCAddressDialog from "@/components/KYCAddressDialog";
import { UserNFTCollection } from "@/components/nft/UserNFTCollection";
interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'purchase' | 'sale' | 'exchange';
  amount: string;
  created_at: string;
  status: 'pending' | 'completed' | 'failed';
  item?: string;
  frozen_until?: string;
}
interface UserData {
  id: string;
  email: string;
  login: string;
  country: string;
  avatar_url: string | null;
  balance: string;
  usdt_balance: string;
  frozen_balance: string;
  frozen_usdt_balance: string;
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
interface FrozenBalanceInfo {
  amount: number;
  days_left: number;
  unfreeze_date: string;
  transaction_id: string;
}
const Profile = () => {
  const {
    user,
    signOut
  } = useAuth();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawWalletAddress, setWithdrawWalletAddress] = useState("");
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
  const [frozenBalanceDetails, setFrozenBalanceDetails] = useState<FrozenBalanceInfo[]>([]);
  const [showFrozenDetails, setShowFrozenDetails] = useState(false);
  const [isExchangeDialogOpen, setIsExchangeDialogOpen] = useState(false);
  const [exchangeAmount, setExchangeAmount] = useState("");
  const [exchangeDirection, setExchangeDirection] = useState<"eth_to_usdt" | "usdt_to_eth">("eth_to_usdt");
  const showDelayedToast = (title: string, description: string, variant: "default" | "destructive" = "default") => {
    setTimeout(() => {
      toast({
        title,
        description,
        variant
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
          variant: "destructive"
        });
        return;
      }
      setIsIdentityDialogOpen(true);
    } catch (error) {
      console.error("Error starting verification:", error);
      toast({
        title: "Error",
        description: "Failed to start verification process. Please try again.",
        variant: "destructive"
      });
    }
  };
  const handleIdentitySuccess = async () => {
    try {
      const {
        data: profileData,
        error
      } = await supabase.from('profiles').select('*').eq('user_id', user?.id).single();
      if (error) throw error;
      setUserData(prev => prev ? {
        ...prev,
        kyc_status: profileData.kyc_status
      } : null);
      setIsIdentityDialogOpen(false);
      setIsAddressDialogOpen(true);
    } catch (error) {
      console.error("Error updating profile data:", error);
      toast({
        title: "Error",
        description: "Failed to update profile status",
        variant: "destructive"
      });
    }
  };
  const handleAddressSuccess = async () => {
    try {
      const {
        data: profileData,
        error
      } = await supabase.from('profiles').select('*').eq('user_id', user?.id).single();
      if (error) throw error;
      setUserData(prev => prev ? {
        ...prev,
        kyc_status: profileData.kyc_status
      } : null);
      setIsAddressDialogOpen(false);
      toast({
        title: "Verification In Progress",
        description: "Your documents have been submitted and are under review."
      });
    } catch (error) {
      console.error("Error updating profile data:", error);
      toast({
        title: "Error",
        description: "Failed to update profile status",
        variant: "destructive"
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
        variant: "destructive"
      });
      return;
    }
    setIsAddressDialogOpen(true);
  };
  const handleTypeIconOnly = () => {
    return true;
  };
  const handleExchangeToUSDT = (e: React.FormEvent) => {
    e.preventDefault();
    const exchangeAmountNum = parseFloat(exchangeAmount);
    const frozenBalanceNum = parseFloat(userData?.frozen_balance || "0");
    if (exchangeAmountNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive"
      });
      return;
    }
    if (exchangeAmountNum > frozenBalanceNum) {
      toast({
        title: "Insufficient funds",
        description: `Your frozen balance (${frozenBalanceNum} ETH) is less than the requested exchange amount`,
        variant: "destructive"
      });
      return;
    }
    try {
      const createTransaction = async () => {
        const {
          error
        } = await supabase.from('transactions').insert([{
          user_id: user?.id,
          type: 'exchange',
          amount: exchangeAmountNum,
          status: 'pending'
        }]);
        if (error) throw error;
        const {
          data: transactionsData,
          error: transactionsError
        } = await supabase.from('transactions').select('*').order('created_at', {
          ascending: false
        }).limit(10);
        if (transactionsError) throw transactionsError;
        if (transactionsData) {
          setTransactions(transactionsData.map(tx => {
            const dateObj = new Date(tx.created_at);
            const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
            let formattedFrozenUntil = null;
            if (tx.frozen_until) {
              const frozenDate = new Date(tx.frozen_until);
              formattedFrozenUntil = `${frozenDate.getDate().toString().padStart(2, '0')}/${(frozenDate.getMonth() + 1).toString().padStart(2, '0')}/${frozenDate.getFullYear()}`;
            }
            return {
              id: tx.id,
              type: tx.type,
              amount: tx.amount.toString(),
              created_at: formattedDate,
              status: tx.status,
              item: tx.item,
              frozen_until: formattedFrozenUntil
            };
          }));
        }
      };
      createTransaction();
      toast({
        title: "Exchange Requested",
        description: `Your exchange request for ${exchangeAmount} ETH to USDT has been submitted`
      });
      setExchangeAmount("");
      setIsExchangeDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process exchange. Please try again.",
        variant: "destructive"
      });
    }
  };
  useEffect(() => {
    let isMounted = true;
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const {
          data: {
            user: currentUser
          },
          error: authError
        } = await supabase.auth.getUser();
        if (authError) {
          throw authError;
        }
        if (!currentUser) {
          console.log("No user found");
          return;
        }
        const {
          data: totalsData,
          error: totalsError
        } = await supabase.rpc('get_user_transaction_totals', {
          user_uuid: currentUser.id
        });
        if (totalsError) {
          console.error("Error fetching transaction totals:", totalsError);
          throw totalsError;
        }
        if (totalsData) {
          setTransactionTotals(totalsData);
        }
        const {
          data: frozenData,
          error: frozenError
        } = await supabase.rpc('get_user_frozen_balances', {
          user_uuid: currentUser.id
        });
        if (frozenError) {
          console.error("Error fetching frozen balances:", frozenError);
          throw frozenError;
        }
        if (frozenData && frozenData.length > 0) {
          setFrozenBalanceDetails(frozenData[0].unfreezing_in_days || []);
        }
        const {
          data: profileData,
          error: profileError
        } = await supabase.from('profiles').select('*').eq('user_id', currentUser.id).single();
        if (profileError) {
          throw profileError;
        }
        const {
          data: transactionsData,
          error: transactionsError
        } = await supabase.from('transactions').select('*').order('created_at', {
          ascending: false
        }).limit(10);
        if (transactionsError) {
          console.error("Transactions error:", transactionsError);
          throw transactionsError;
        }
        console.log("Profile data:", profileData);
        if (isMounted && currentUser) {
          const userData: UserData = {
            id: currentUser.id,
            email: currentUser.email || '',
            login: profileData?.login || currentUser.user_metadata?.login || '',
            country: profileData?.country || currentUser.user_metadata?.country || '',
            avatar_url: profileData?.avatar_url || null,
            balance: profileData?.balance?.toString() || "0.0",
            usdt_balance: profileData?.usdt_balance?.toString() || "0.0",
            frozen_balance: profileData?.frozen_balance?.toString() || "0.0",
            frozen_usdt_balance: profileData?.frozen_usdt_balance?.toString() || "0.0",
            wallet_address: profileData?.wallet_address || '',
            erc20_address: profileData?.erc20_address || undefined,
            created_at: currentUser.created_at,
            verified: profileData?.verified || false,
            kyc_status: profileData?.kyc_status || 'not_started'
          };
          console.log("Setting user data with avatar:", userData.avatar_url);
          setUserData(userData);
          if (transactionsData) {
            setTransactions(transactionsData.map(tx => {
              const dateObj = new Date(tx.created_at);
              const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
              let formattedFrozenUntil = null;
              if (tx.frozen_until) {
                const frozenDate = new Date(tx.frozen_until);
                formattedFrozenUntil = `${frozenDate.getDate().toString().padStart(2, '0')}/${(frozenDate.getMonth() + 1).toString().padStart(2, '0')}/${frozenDate.getFullYear()}`;
              }
              return {
                id: tx.id,
                type: tx.type,
                amount: tx.amount.toString(),
                created_at: formattedDate,
                status: tx.status,
                item: tx.item,
                frozen_until: formattedFrozenUntil
              };
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (isMounted) {
          toast({
            title: "Error",
            description: "Failed to fetch user data",
            variant: "destructive"
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
        variant: "destructive"
      });
      return;
    }
    try {
      const {
        error
      } = await supabase.auth.updateUser({
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
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userData?.id) return;
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userData.id}/${crypto.randomUUID()}.${fileExt}`;
      const {
        error: uploadError
      } = await supabase.storage.from('avatars').upload(filePath, file, {
        upsert: true
      });
      if (uploadError) throw uploadError;
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const {
        error: updateError
      } = await supabase.from('profiles').update({
        avatar_url: publicUrl
      }).eq('user_id', userData.id);
      if (updateError) throw updateError;
      setUserData(prev => prev ? {
        ...prev,
        avatar_url: publicUrl
      } : null);
      toast({
        title: "Success",
        description: "Avatar updated successfully"
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Error",
        description: "Failed to upload avatar",
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
      const {
        error
      } = await supabase.auth.updateUser({
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
        variant: "destructive"
      });
      return;
    }
    if (withdrawAmountNum > balanceNum) {
      toast({
        title: "Insufficient funds",
        description: `Your balance (${balanceNum} ETH) is less than the requested withdrawal amount`,
        variant: "destructive"
      });
      return;
    }
    if (!withdrawWalletAddress) {
      toast({
        title: "Error",
        description: "Please enter a wallet address for the withdrawal",
        variant: "destructive"
      });
      return;
    }
    try {
      const {
        error
      } = await supabase.from('transactions').insert([{
        user_id: user?.id,
        type: 'withdraw',
        amount: withdrawAmountNum,
        status: 'pending',
        wallet_address: withdrawWalletAddress
      }]);
      if (error) throw error;
      toast({
        title: "Withdrawal Requested",
        description: `Your withdrawal request for ${withdrawAmount} ETH has been submitted`
      });
      setWithdrawAmount("");
      setWithdrawWalletAddress("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process withdrawal. Please try again.",
        variant: "destructive"
      });
    }
  };
  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData?.wallet_address) {
      toast({
        title: "Error",
        description: "You need to generate a wallet address in your profile first",
        variant: "destructive"
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
      const {
        error
      } = await supabase.from('profiles').update({
        wallet_address: address
      }).eq('user_id', userData?.id);
      if (error) throw error;
      setUserData(prev => prev ? {
        ...prev,
        wallet_address: address
      } : null);
      toast({
        title: "Success",
        description: "Wallet address has been generated and saved."
      });
    } catch (error) {
      console.error("Error saving wallet address:", error);
      toast({
        title: "Error",
        description: "Failed to save wallet address. Please try again.",
        variant: "destructive"
      });
    }
  };
  const handleExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const exchangeAmountNum = parseFloat(exchangeAmount);
    
    if (exchangeAmountNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive"
      });
      return;
    }
    
    // Check if user has sufficient balance
    const sourceBalance = exchangeDirection === "eth_to_usdt" 
      ? parseFloat(userData?.balance || "0") 
      : parseFloat(userData?.usdt_balance || "0");
      
    if (exchangeAmountNum > sourceBalance) {
      toast({
        title: "Insufficient funds",
        description: `Your ${exchangeDirection === "eth_to_usdt" ? "ETH" : "USDT"} balance is less than the requested exchange amount`,
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Create a transaction record
      const { error } = await supabase.from('transactions').insert({
        user_id: user?.id,
        type: 'exchange',
        amount: exchangeAmountNum,
        status: 'pending',
        item: exchangeDirection
      });
      
      if (error) throw error;
      
      // Refresh transaction history
      const {
        data: transactionsData,
        error: transactionsError
      } = await supabase.from('transactions').select('*').order('created_at', {
        ascending: false
      }).limit(10);
      
      if (transactionsError) throw transactionsError;
      
      if (transactionsData) {
        setTransactions(transactionsData.map(tx => {
          const dateObj = new Date(tx.created_at);
          const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
          let formattedFrozenUntil = null;
          if (tx.frozen_until) {
            const frozenDate = new Date(tx.frozen_until);
            formattedFrozenUntil = `${frozenDate.getDate().toString().padStart(2, '0')}/${(frozenDate.getMonth() + 1).toString().padStart(2, '0')}/${frozenDate.getFullYear()}`;
          }
          return {
            id: tx.id,
            type: tx.type,
            amount: tx.amount.toString(),
            created_at: formattedDate,
            status: tx.status,
            item: tx.item,
            frozen_until: formattedFrozenUntil
          };
        }));
      }
      
      toast({
        title: "Exchange Requested",
        description: `Your exchange request for ${exchangeAmount} ${exchangeDirection === "eth_to_usdt" ? "ETH to USDT" : "USDT to ETH"} has been submitted`
      });
      
      setExchangeAmount("");
      setIsExchangeDialogOpen(false);
    } catch (error) {
      console.error("Exchange error:", error);
      toast({
        title: "Error",
        description: "Failed to process exchange. Please try again.",
        variant: "destructive"
      });
    }
  };
  if (isLoading) {
    return <div className="container mx-auto py-8 px-4 mt-16">
        <div className="max-w-4xl mx-auto">
          <p>Loading...</p>
        </div>
      </div>;
  }
  return <div className="container mx-auto py-8 px-4 mt-16 min-h-screen bg-gradient-to-b from-background via-background/80 to-background/60">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="relative p-6 sm:p-8 rounded-2xl overflow-hidden bg-gradient-to-r from-purple-500/10 via-primary/5 to-purple-500/10 border border-primary/10 backdrop-blur-sm shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 animate-gradient"></div>
          <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6 z-10">
            <div className="relative group">
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" id="avatar-upload" />
              <label htmlFor="avatar-upload" className="cursor-pointer block relative">
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-primary/20 shadow-xl ring-2 ring-purple-500/20 transition-all duration-300 group-hover:ring-purple-500/40">
                  {userData?.avatar_url ? <AvatarImage src={userData.avatar_url} alt={userData.login} /> : <AvatarFallback className="bg-gradient-to-br from-primary/80 to-purple-600 text-white">
                      <UserRound className="w-10 h-10 sm:w-12 sm:h-12" />
                    </AvatarFallback>}
                </Avatar>
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-white text-xs font-medium">Change Avatar</p>
                </div>
              </label>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent username-truncate max-w-full">
                @{userData?.login}
              </h1>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full responsive-tabs-list p-1.5 bg-background/50 backdrop-blur-sm rounded-xl border border-primary/10 mb-6">
            {["profile", "settings", "wallet", "verification", "nft"].map(tab => <TabsTrigger key={tab} value={tab} className="responsive-tab-trigger flex items-center justify-center gap-1 transition-all duration-300 data-[state=active]:bg-primary/20 data-[state=active]:text-primary relative overflow-hidden group py-2">
                {tab === "profile" && <User className="w-4 h-4" />}
                {tab === "settings" && <Settings className="w-4 h-4" />}
                {tab === "wallet" && <Wallet className="w-4 h-4" />}
                {tab === "verification" && <Shield className="w-4 h-4" />}
                {tab === "nft" && <ShoppingBag className="w-4 h-4" />}
                <span className="relative z-10 capitalize hidden sm:inline">{tab}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </TabsTrigger>)}
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
                      <Input value={userData?.email} readOnly className="bg-background/50 border-primary/10 group-hover:border-primary/30 transition-colors pl-10" />
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
                      <Input value={userData?.country} readOnly className="bg-background/50 border-primary/10 group-hover:border-primary/30 transition-colors pl-10" />
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
                      {userData?.verified ? <span className="text-green-500 font-medium">Verified</span> : <span className="text-yellow-500 font-medium">Not Verified</span>}
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
                      <Input value={userData?.wallet_address || ''} readOnly className="bg-background/50 font-mono text-sm border-primary/10 group-hover:border-primary/30 transition-colors pl-10" placeholder="No wallet address generated" />
                      <Wallet className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      {userData?.wallet_address
