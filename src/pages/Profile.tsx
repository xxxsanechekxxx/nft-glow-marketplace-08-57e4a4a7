importtypescript
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserNFTCollection } from "@/components/nft/UserNFTCollection";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FraudWarningDialog } from "@/components/FraudWarningDialog";
import { WalletAddressModal } from "@/components/WalletAddressModal";
import { DepositConfirmationDialog } from "@/components/DepositConfirmationDialog";
import { KYCIdentityDialog } from "@/components/KYCIdentityDialog";
import { KYCAddressDialog } from "@/components/KYCAddressDialog";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ArrowDownCircle, ArrowUpCircle, Upload, ChevronRight, Copy, AlertTriangle, CheckCircle, LockIcon, Clock, RefreshCw, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProfileData {
  avatar_url: string;
  balance: number;
  country: string;
  created_at: string;
  frozen_balance: number;
  frozen_usdt_balance: number;
  id: string;
  kyc_address_doc: string;
  kyc_identity_doc: string;
  kyc_rejection_reason: string;
  kyc_status: string;
  login: string;
  usdt_balance: number;
  user_id: string;
  verified: boolean;
  wallet_address: string;
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

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showWalletAddressModal, setShowWalletAddressModal] = useState(false);
  const [showDepositConfirmation, setShowDepositConfirmation] = useState(false);
  const [showFraudWarning, setShowFraudWarning] = useState(false);
  const [showKYCIdentityDialog, setShowKYCIdentityDialog] = useState(false);
  const [showKYCAddressDialog, setShowKYCAddressDialog] = useState(false);
  const [transactionTotals, setTransactionTotals] = useState<TransactionTotals>({
    total_deposits: 0,
    total_withdrawals: 0
  });
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [exchangeAmount, setExchangeAmount] = useState<string>("");
  const [showFrozenDetails, setShowFrozenDetails] = useState(false);
  const [frozenBalanceDetails, setFrozenBalanceDetails] = useState<FrozenBalanceInfo[]>([]);

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const fetchProfileData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Fetch profile data
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (error) throw error;
      
      setProfileData(data);
      
      // Fetch transaction totals
      const { data: totalsData, error: totalsError } = await supabase
        .rpc('get_user_transaction_totals', {
          user_uuid: user.id
        });
      
      if (totalsError) throw totalsError;
      
      if (totalsData) {
        setTransactionTotals(totalsData[0]);
      }

      // Fetch frozen balance details
      const { data: frozenData, error: frozenError } = await supabase
        .rpc('get_user_frozen_balances', {
          user_uuid: user.id
        });

      if (frozenError) {
        console.error("Error fetching frozen balances:", frozenError);
      } else if (frozenData && frozenData.length > 0) {
        setFrozenBalanceDetails(frozenData[0].unfreezing_in_days || []);
      }
      
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast({
        title: "Error",
        description: "Could not load profile data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateWalletAddress = async (address: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ wallet_address: address })
        .eq("user_id", user?.id);
      
      if (error) throw error;
      
      setShowWalletAddressModal(false);
      
      // Update profileData with the new wallet address
      if (profileData) {
        setProfileData({
          ...profileData,
          wallet_address: address
        });
      }
      
      toast({
        title: "Wallet address generated",
        description: "Your wallet address has been generated successfully",
      });
    } catch (error) {
      console.error("Error updating wallet address:", error);
      toast({
        title: "Error",
        description: "Could not generate wallet address",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Wallet address copied to clipboard",
      variant: "default"
    });
  };

  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid deposit amount",
        variant: "destructive"
      });
      return;
    }
    
    setShowDepositConfirmation(true);
  };

  const handleConfirmDeposit = async () => {
    try {
      // Create a deposit transaction record
      const { error } = await supabase
        .from("transactions")
        .insert({
          user_id: user?.id,
          amount: parseFloat(depositAmount),
          type: "deposit",
          status: "pending"
        });
      
      if (error) throw error;
      
      // Close the confirmation dialog and reset the deposit amount
      setShowDepositConfirmation(false);
      setDepositAmount("");
      
      // Show a success message
      toast({
        title: "Deposit requested",
        description: "Your deposit request has been submitted and is pending approval",
        variant: "default"
      });
    } catch (error) {
      console.error("Error creating deposit transaction:", error);
      toast({
        title: "Error",
        description: "Could not process deposit request",
        variant: "destructive"
      });
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive"
      });
      return;
    }
    
    if (!profileData?.wallet_address) {
      toast({
        title: "No wallet address",
        description: "Please generate a wallet address before withdrawing",
        variant: "destructive"
      });
      return;
    }
    
    if (parseFloat(withdrawAmount) > (profileData?.balance || 0)) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Create a withdrawal transaction record
      const { error } = await supabase
        .from("transactions")
        .insert({
          user_id: user?.id,
          amount: parseFloat(withdrawAmount),
          type: "withdraw",
          status: "pending"
        });
      
      if (error) throw error;
      
      // Reset the withdrawal amount
      setWithdrawAmount("");
      
      // Show a success message
      toast({
        title: "Withdrawal requested",
        description: "Your withdrawal request has been submitted and is pending approval",
        variant: "default"
      });
    } catch (error) {
      console.error("Error creating withdrawal transaction:", error);
      toast({
        title: "Error",
        description: "Could not process withdrawal request",
        variant: "destructive"
      });
    }
  };

  const handleKYCIdentitySuccess = async () => {
    try {
      // Update KYC status to identity_submitted
      const { error } = await supabase
        .from("profiles")
        .update({ kyc_status: "identity_submitted" })
        .eq("user_id", user?.id);
      
      if (error) throw error;
      
      // Update local state
      if (profileData) {
        setProfileData({
          ...profileData,
          kyc_status: "identity_submitted"
        });
      }
      
      // Close the dialog
      setShowKYCIdentityDialog(false);
      
      // Show a success message
      toast({
        title: "Identity verification submitted",
        description: "Your identity document has been submitted for verification",
        variant: "default"
      });
    } catch (error) {
      console.error("Error updating KYC status:", error);
      toast({
        title: "Error",
        description: "Could not update KYC status",
        variant: "destructive"
      });
    }
  };

  const handleKYCAddressSuccess = async () => {
    try {
      // Update KYC status to address_submitted
      const { error } = await supabase
        .from("profiles")
        .update({ 
          kyc_status: profileData?.kyc_status === "identity_submitted" 
            ? "under_review" 
            : "address_submitted" 
        })
        .eq("user_id", user?.id);
      
      if (error) throw error;
      
      // Update local state
      if (profileData) {
        setProfileData({
          ...profileData,
          kyc_status: profileData.kyc_status === "identity_submitted" 
            ? "under_review" 
            : "address_submitted"
        });
      }
      
      // Close the dialog
      setShowKYCAddressDialog(false);
      
      // Show a success message
      toast({
        title: "Address verification submitted",
        description: profileData?.kyc_status === "identity_submitted" 
          ? "Your address document has been submitted. Your KYC is now under review." 
          : "Your address document has been submitted for verification",
        variant: "default"
      });
    } catch (error) {
      console.error("Error updating KYC status:", error);
      toast({
        title: "Error",
        description: "Could not update KYC status",
        variant: "destructive"
      });
    }
  };

  const handleExchangeToUSDT = async () => {
    if (!user?.id) return;
    
    try {
      const amount = parseFloat(exchangeAmount);
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid amount greater than 0",
          variant: "destructive"
        });
        return;
      }

      if (amount > (profileData?.frozen_balance || 0)) {
        toast({
          title: "Insufficient Balance",
          description: "You don't have enough frozen balance for this exchange",
          variant: "destructive"
        });
        return;
      }
      
      // Call the exchange_to_usdt function
      const { data, error } = await supabase.rpc('exchange_to_usdt', {
        amount: amount
      });
      
      if (error) throw error;
      
      toast({
        title: "Exchange Request Submitted",
        description: "Your request to exchange frozen balance to USDT is being processed",
        variant: "default"
      });
      
      // Update the local balance immediately to reflect the change
      if (profileData) {
        setProfileData({
          ...profileData,
          frozen_balance: profileData.frozen_balance - amount
        });
      }
      
      setShowExchangeDialog(false);
      setExchangeAmount("");
      
      // Refresh data to ensure we have the latest state
      fetchProfileData();
    } catch (error) {
      console.error("Error requesting exchange:", error);
      toast({
        title: "Error",
        description: "Failed to submit exchange request",
        variant: "destructive"
      });
    }
  };

  // Render the balance cards
  const renderBalanceCards = () => {
    if (!profileData || (profileData.balance === 0 && profileData.frozen_balance === 0)) {
      return null;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
                  {profileData?.balance.toFixed(2)}
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
                  {profileData?.usdt_balance.toFixed(2)}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {profileData?.frozen_balance > 0 && (
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
                      {profileData?.frozen_balance.toFixed(2)}
                    </h2>
                  </div>
                </div>
                
                {profileData?.frozen_usdt_balance > 0 && (
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
                      {profileData?.frozen_usdt_balance.toFixed(2)}
                    </h2>
                  </div>
                )}
              </div>
              
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
              
              <div className="mt-5">
                <Button
                  variant="outline"
                  onClick={() => setShowExchangeDialog(true)}
                  className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Exchange to USDT
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const user = useAuth().user;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !profileData) {
    return <div>Not authorized</div>;
  }

  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="collection">Collection</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                View and update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={profileData.avatar_url || ""} />
                  <AvatarFallback>{profileData.login.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">{profileData.login}</h2>
                  <p className="text-muted-foreground">User ID: {profileData.user_id}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={user.email || "N/A"} disabled />
              </div>
              
              <div className="space-y-2">
                <Label>Login</Label>
                <Input type="text" value={profileData.login || "N/A"} disabled />
              </div>
              
              <div className="space-y-2">
                <Label>Country</Label>
                <Input type="text" value={profileData.country || "N/A"} disabled />
              </div>
              
              <div className="space-y-2">
                <Label>Created At</Label>
                <Input type="text" value={new Date(profileData.created_at).toLocaleDateString()} disabled />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="wallet" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Management</CardTitle>
              <CardDescription>
                Manage your wallet address and balances
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderBalanceCards()}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card/30 backdrop-blur-sm border-primary/10">
                  <CardHeader>
                    <CardTitle className="text-lg">Your Wallet Address</CardTitle>
                    <CardDescription>
                      Use this address for deposits
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {profileData?.wallet_address ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/10 rounded-lg">
                          <code className="text-xs sm:text-sm text-white font-mono break-all">
                            {profileData.wallet_address}
                          </code>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => copyToClipboard(profileData.wallet_address)}
                            className="shrink-0 ml-2"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button 
                          onClick={() => setShowWalletAddressModal(true)} 
                          variant="outline"
                          className="w-full"
                        >
                          Generate New Address
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <Wallet className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No Wallet Address Generated</h3>
                        <p className="text-muted-foreground mb-4">
                          You need a wallet address to receive payments
                        </p>
                        <Button 
                          onClick={() => setShowWalletAddressModal(true)}
                          className="w-full sm:w-auto"
                        >
                          Generate Wallet Address
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <div className="space-y-6">
                  <Card className="bg-card/30 backdrop-blur-sm border-primary/10">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ArrowDownCircle className="h-5 w-5 text-green-500" />
                        Deposit
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="deposit-amount">Amount (ETH)</Label>
                          <Input
                            id="deposit-amount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="0.00"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                          />
                        </div>
                        <Button 
                          onClick={handleDeposit}
                          disabled={!depositAmount || !profileData?.wallet_address}
                          className="w-full"
                        >
                          Request Deposit
                        </Button>
                        {!profileData?.wallet_address && (
                          <p className="text-xs text-muted-foreground mt-2">
                            You need to generate a wallet address first
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/30 backdrop-blur-sm border-primary/10">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ArrowUpCircle className="h-5 w-5 text-red-500" />
                        Withdraw
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="withdraw-amount">Amount (ETH)</Label>
                            <span className="text-xs text-muted-foreground">
                              Available: {profileData?.balance.toFixed(2) || "0.00"} ETH
                            </span>
                          </div>
                          <Input
                            id="withdraw-amount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            max={profileData?.balance}
                            placeholder="0.00"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                          />
                        </div>
                        <Button 
                          onClick={handleWithdraw}
                          disabled={
                            !withdrawAmount || 
                            !profileData?.wallet_address || 
                            parseFloat(withdrawAmount) > (profileData?.balance || 0)
                          }
                          className="w-full"
                        >
                          Request Withdrawal
                        </Button>
                        {!profileData?.wallet_address && (
                          <p className="text-xs text-muted-foreground mt-2">
                            You need to generate a wallet address first
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <Card className="bg-card/30 backdrop-blur-sm border-primary/10">
                <CardHeader>
                  <CardTitle className="text-lg">Transaction Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-full bg-green-500/20">
                          <ArrowDownCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <h3 className="font-medium">Total Deposits</h3>
                      </div>
                      <p className="text-2xl font-bold text-green-500">
                        {transactionTotals.total_deposits.toFixed(2)} ETH
                      </p>
                    </div>
                    
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-full bg-red-500/20">
                          <ArrowUpCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <h3 className="font-medium">Total Withdrawals</h3>
                      </div>
                      <p className="text-2xl font-bold text-red-500">
                        {transactionTotals.total_withdrawals.toFixed(2)} ETH
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-primary/20 mt-1">
                        <AlertTriangle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Important Information</h3>
                        <p className="text-sm text-muted-foreground">
                          Deposits and withdrawals are processed manually within 24 hours. 
                          If you haven't received your funds after 24 hours, please contact support.
                        </p>
                        <Button 
                          variant="link"
                          className="text-primary p-0 h-auto mt-2"
                          onClick={() => setShowFraudWarning(true)}
                        >
                          View fraud warning
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/30 backdrop-blur-sm border-primary/10">
                <CardHeader>
                  <CardTitle className="text-lg">KYC Verification</CardTitle>
                  <CardDescription>
                    Complete KYC verification to unlock higher withdrawal limits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
