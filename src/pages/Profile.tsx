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
  CheckCircle2,
  Clock,
  LockIcon,
  DollarSign,
  RefreshCw,
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DepositConfirmationDialog from "@/components/DepositConfirmationDialog";
import FraudWarningDialog from "@/components/FraudWarningDialog";
import KYCIdentityDialog from "@/components/KYCIdentityDialog";
import KYCAddressDialog from "@/components/KYCAddressDialog";
import { UserNFTCollection } from "@/components/nft/UserNFTCollection";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

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
  const { user, signOut } = useAuth();
  const { toast } = useToast();
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
        variant: "destructive",
      });
      return;
    }

    if (exchangeAmountNum > frozenBalanceNum) {
      toast({
        title: "Insufficient funds",
        description: `Your frozen balance (${frozenBalanceNum} ETH) is less than the requested exchange amount`,
        variant: "destructive",
      });
      return;
    }

    try {
      const createTransaction = async () => {
        const { error } = await supabase
          .from('transactions')
          .insert([
            {
              user_id: user?.id,
              type: 'exchange',
              amount: exchangeAmountNum,
              status: 'pending'
            }
          ]);

        if (error) throw error;

        // Fetch updated transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

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

        const { data: frozenData, error: frozenError } = await supabase
          .rpc('get_user_frozen_balances', {
            user_uuid: currentUser.id
          });

        if (frozenError) {
          console.error("Error fetching frozen balances:", frozenError);
          throw frozenError;
        }

        if (frozenData && frozenData.length > 0) {
          setFrozenBalanceDetails(frozenData[0].unfreezing_in_days || []);
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

    if (!withdrawWalletAddress) {
      toast({
        title: "Error",
        description: "Please enter a wallet address for the withdrawal",
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
            status: 'pending',
            wallet_address: withdrawWalletAddress
          }
        ]);

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

  const renderBalanceCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="relative overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-background/80 z-0"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full filter blur-2xl transform translate-x-10 -translate-y-10 z-0"></div>
          
          <div className="relative z-10 p-6 h-full">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-full bg-primary/20 text-primary">
                  <Wallet className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Available Balance</h3>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                Active
              </Badge>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <img 
                    src="/lovable-uploads/0e51dc88-2aac-485e-84c5-0bb4ab88f00b.png" 
                    alt="ETH"
                    className="h-8 w-8 rounded-full p-1 bg-white/10"
                  />
                  <div>
                    <span className="text-sm text-muted-foreground">Ethereum</span>
                    <h4 className="font-medium text-white">ETH</h4>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {userData?.balance || "0.00"}
                </h2>
              </div>
              
              <div className="flex items-center justify-between bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center bg-green-500/20 rounded-full h-8 w-8">
                    <span className="text-green-500 font-bold">$</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Tether</span>
                    <h4 className="font-medium text-green-500">USDT</h4>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-green-500">
                  {userData?.usdt_balance || "0.00"}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {parseFloat(userData?.frozen_balance || "0") > 0 && (
          <div className="relative overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-amber-500/10 to-background/80 z-0"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 rounded-full filter blur-2xl transform translate-x-10 -translate-y-10 z-0"></div>
            
            <div className="relative z-10 p-6 h-full">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-full bg-yellow-500/20 text-yellow-500">
                    <LockIcon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-yellow-500">Hold Balance</h3>
                </div>
                <Button
                  variant="outline"
                  className="border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 h-8 px-3"
                  size="sm"
                  onClick={() => setShowFrozenDetails(!showFrozenDetails)}
                >
                  {showFrozenDetails ? "Hide Details" : "Show Details"}
                </Button>
              </div>
              
              <div className="space-y-5">
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-4 border border-yellow-500/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-yellow-500/20">
                      <img 
                        src="/lovable-uploads/2a47993b-b343-4016-9b9c-e3a372d31ba7.png" 
                        alt="ETH" 
                        className="h-5 w-5"
                      />
                    </div>
                    <div>
                      <span className="text-sm text-yellow-500/80">Frozen ETH</span>
                      <h4 className="font-medium text-yellow-500">Hold Period: 15 days</h4>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <h2 className="text-2xl font-bold text-yellow-500">
                      {userData?.frozen_balance || "0.00"}
                    </h2>
                  </div>
                </div>
                
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-4 border border-blue-500/20">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center bg-blue-500/20 rounded-full h-8 w-8">
                      <LockIcon className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <span className="text-sm text-blue-500/80">Frozen USDT</span>
                      <h4 className="font-medium text-blue-500">Hold Period: 15 days</h4>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-blue-500">
                    {userData?.frozen_usdt_balance || "0.00"}
                  </h2>
                </div>
              </div>
              
              <Button
                variant="exchange"
                onClick={() => setIsExchangeDialogOpen(true)}
                className="mt-3 w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                <span>Exchange to USDT</span>
              </Button>
              
              {showFrozenDetails && frozenBalanceDetails.length > 0 && (
                <div className="mt-5 border-t border-yellow-500/20 pt-4 space-y-3 animate-in fade-in duration-300">
                  <p className="text-sm font-medium text-yellow-500">Upcoming Releases:</p>
                  <div className="max-h-48 overflow-y-auto pr-1 space-y-3">
                    {frozenBalanceDetails.map((item) => (
                      <div 
                        key={item.transaction_id} 
                        className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-yellow-500 font-medium">{item.days_left} days remaining</span>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end sm:gap-4">
                          <div className="flex items-center gap-2">
                            <img 
                              src="/lovable-uploads/2a47993b-b343-4016-9b9c-e3a372d31ba7.png" 
                              alt="ETH" 
                              className="h-4 w-4"
                            />
                            <span className="text-sm font-bold text-yellow-500">{item.amount.toFixed(2)}</span>
                          </div>
                          <Badge variant="outline" className="text-yellow-500/70 border-yellow-500/30 bg-yellow-500/5">
                            {item.unfreeze_date}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 mt-16 min-h-screen bg-gradient-to-b from-background via-background/80 to-background/60">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="relative p-6 sm:p-8 rounded-2xl overflow-hidden bg-gradient-to-r from-purple-500/10 via-primary/5 to-purple-500/10 border border-primary/10 backdrop-blur-sm shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 animate-gradient"></div>
          <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6 z-10">
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
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-primary/20 shadow-xl ring-2 ring-purple-500/20 transition-all duration-300 group-hover:ring-purple-500/40">
                  {userData?.avatar_url ? (
                    <AvatarImage src={userData.avatar_url} alt={userData.login} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-primary/80 to-purple-600 text-white">
                      <UserRound className="w-10 h-10 sm:w-12 sm:h-12" />
                    </AvatarFallback>
                  )}
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

        <Tabs defaultValue
