
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, Wallet, ArrowUpCircle, Shield, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WalletAddressModal from "@/components/WalletAddressModal";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import DepositConfirmationDialog from "@/components/DepositConfirmationDialog";
import FraudWarningDialog from "@/components/FraudWarningDialog";
import KYCIdentityDialog from "@/components/KYCIdentityDialog";
import KYCAddressDialog from "@/components/KYCAddressDialog";
import { UserNFTCollection } from "@/components/nft/UserNFTCollection";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { SettingsTab } from "@/components/profile/SettingsTab";
import { WalletTab } from "@/components/profile/WalletTab";
import { VerificationTab } from "@/components/profile/VerificationTab";
import { ExchangeDialog } from "@/components/profile/ExchangeDialog";
import type { UserData, Transaction, TransactionTotals, FrozenBalanceInfo } from "@/types/user";

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawWalletAddress, setWithdrawWalletAddress] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isDepositConfirmationOpen, setIsDepositConfirmationOpen] = useState(false);
  const [isFraudWarningOpen, setIsFraudWarningOpen] = useState(false);
  const [transactionTotals, setTransactionTotals] = useState<TransactionTotals>({
    total_deposits: 0,
    total_withdrawals: 0
  });
  const [isIdentityDialogOpen, setIsIdentityDialogOpen] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [frozenBalanceDetails, setFrozenBalanceDetails] = useState<FrozenBalanceInfo[]>([]);
  const [showFrozenDetails, setShowFrozenDetails] = useState(false);
  const [isExchangeDialogOpen, setIsExchangeDialogOpen] = useState(false);

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
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (error) throw error;
      
      setUserData(prev => prev ? { ...prev, kyc_status: profileData.kyc_status } : null);
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
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (error) throw error;
      
      setUserData(prev => prev ? { ...prev, kyc_status: profileData.kyc_status } : null);
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
      const { error } = await supabase
        .from('transactions')
        .insert([{
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
      const { error } = await supabase
        .from('profiles')
        .update({ wallet_address: address })
        .eq('user_id', userData?.id);
      
      if (error) throw error;
      
      setUserData(prev => prev ? { ...prev, wallet_address: address } : null);
      
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

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userData?.id) return;
    
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userData.id}/${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
      
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
        
        // Fetch transaction totals
        const { data: totalsData, error: totalsError } = await supabase.rpc(
          'get_user_transaction_totals',
          { user_uuid: currentUser.id }
        );
        
        if (totalsError) {
          console.error("Error fetching transaction totals:", totalsError);
          throw totalsError;
        }
        
        if (totalsData) {
          setTransactionTotals(totalsData);
        }
        
        // Fetch frozen balances
        const { data: frozenData, error: frozenError } = await supabase.rpc(
          'get_user_frozen_balances',
          { user_uuid: currentUser.id }
        );
        
        if (frozenError) {
          console.error("Error fetching frozen balances:", frozenError);
          throw frozenError;
        }
        
        if (frozenData && frozenData.length > 0) {
          setFrozenBalanceDetails(frozenData[0].unfreezing_in_days || []);
        }
        
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', currentUser.id)
          .single();
        
        if (profileError) {
          throw profileError;
        }
        
        // Fetch transactions
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
        <ProfileHeader userData={userData} handleAvatarUpload={handleAvatarUpload} />

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full responsive-tabs-list p-1.5 bg-background/50 backdrop-blur-sm rounded-xl border border-primary/10 mb-6">
            {["profile", "settings", "wallet", "verification", "nft"].map(tab => (
              <TabsTrigger 
                key={tab} 
                value={tab} 
                className="responsive-tab-trigger flex items-center justify-center gap-1 transition-all duration-300 data-[state=active]:bg-primary/20 data-[state=active]:text-primary relative overflow-hidden group py-2"
              >
                {tab === "profile" && <User className="w-4 h-4" />}
                {tab === "settings" && <Settings className="w-4 h-4" />}
                {tab === "wallet" && <Wallet className="w-4 h-4" />}
                {tab === "verification" && <Shield className="w-4 h-4" />}
                {tab === "nft" && <ShoppingBag className="w-4 h-4" />}
                <span className="relative z-10 capitalize hidden sm:inline">{tab}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="profile">
            <ProfileInfo userData={userData} setIsWalletModalOpen={setIsWalletModalOpen} />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab handleLogout={handleLogout} />
          </TabsContent>

          <TabsContent value="wallet">
            <WalletTab 
              userData={userData}
              frozenBalanceDetails={frozenBalanceDetails}
              showFrozenDetails={showFrozenDetails}
              setShowFrozenDetails={setShowFrozenDetails}
              setIsExchangeDialogOpen={setIsExchangeDialogOpen}
              setIsDepositConfirmationOpen={setIsDepositConfirmationOpen}
              withdrawAmount={withdrawAmount}
              setWithdrawAmount={setWithdrawAmount}
              withdrawWalletAddress={withdrawWalletAddress}
              setWithdrawWalletAddress={setWithdrawWalletAddress}
              handleWithdraw={handleWithdraw}
              transactions={transactions}
            />
          </TabsContent>

          <TabsContent value="verification">
            <VerificationTab 
              userData={userData}
              startKYCVerification={startKYCVerification}
              continueKYCVerification={continueKYCVerification}
            />
          </TabsContent>

          <TabsContent value="nft">
            <UserNFTCollection />
          </TabsContent>
        </Tabs>
      </div>

      {/* Модальные окна */}
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

      <ExchangeDialog 
        isOpen={isExchangeDialogOpen}
        setIsOpen={setIsExchangeDialogOpen}
        userData={userData}
        userId={user?.id}
        setTransactions={setTransactions}
      />
    </div>
  );
};

export default Profile;
