
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import WalletAddressModal from "@/components/WalletAddressModal";
import DepositConfirmationDialog from "@/components/DepositConfirmationDialog";
import FraudWarningDialog from "@/components/FraudWarningDialog";
import { EmptyNFTState } from "@/components/EmptyNFTState";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileInformation } from "@/components/profile/ProfileInformation";
import { AccountSettings } from "@/components/profile/AccountSettings";
import { WalletOperations } from "@/components/profile/WalletOperations";
import { TransactionHistory } from "@/components/profile/TransactionHistory";
import { UserData } from "@/types/user";
import { Transaction } from "@/types/transaction";

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isDepositConfirmationOpen, setIsDepositConfirmationOpen] = useState(false);
  const [isFraudWarningOpen, setIsFraudWarningOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");

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
            wallet_address: profileData?.wallet_address || ''
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

  const handleGenerateWalletAddress = async (address: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ wallet_address: address })
        .eq('user_id', userData?.id);

      if (error) throw error;

      setUserData(prev => prev ? { ...prev, wallet_address: address } : null);
      
      showDelayedToast("Success", "Wallet address has been generated and saved.");
    } catch (error) {
      console.error("Error saving wallet address:", error);
      showDelayedToast("Error", "Failed to save wallet address. Please try again.", "destructive");
    }
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
    <div className="container mx-auto py-8 px-4 mt-16 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <ProfileHeader userData={userData} />

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 p-1 bg-background/50 backdrop-blur-sm rounded-xl">
            {["profile", "settings", "wallet", "nft"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="flex items-center gap-2 capitalize transition-all duration-300 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="profile">
            <ProfileInformation 
              userData={userData}
              setIsWalletModalOpen={setIsWalletModalOpen}
            />
          </TabsContent>

          <TabsContent value="settings">
            <AccountSettings handleLogout={handleLogout} />
          </TabsContent>

          <TabsContent value="wallet">
            <div className="space-y-6">
              <WalletOperations
                userData={userData}
                setIsDepositConfirmationOpen={setIsDepositConfirmationOpen}
                depositAmount={depositAmount}
                setDepositAmount={setDepositAmount}
              />

              <TransactionHistory transactions={transactions} />
            </div>
            <div className="flex items-center gap-2 p-4 bg-background/60 rounded-lg border border-primary/10">
              <span className="text-white font-medium">My Limits - 0 / 5</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-primary cursor-help transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Due to the fact that you have only recently created your account, we are forced to limit the number of orders that you can join. This limit is updated every month.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </TabsContent>

          <TabsContent value="nft">
            <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-background/60">
              <CardContent>
                <EmptyNFTState />
              </CardContent>
            </Card>
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
    </div>
  );
};

export default Profile;

