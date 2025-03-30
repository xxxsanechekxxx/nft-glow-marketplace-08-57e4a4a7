
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

const Withdraw = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawWalletAddress, setWithdrawWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<{balance: string} | null>(null);

  React.useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      
      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('balance')
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        setUserData({
          balance: profileData?.balance?.toString() || "0.0"
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch balance data",
          variant: "destructive"
        });
      }
    };
    
    fetchUserData();
  }, [user, toast]);

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
    
    setIsLoading(true);
    
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
      
      navigate('/profile');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process withdrawal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 mt-16 min-h-screen">
      <div className="max-w-md mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/profile')}
          className="mb-6 pl-0 text-muted-foreground flex items-center gap-2 hover:bg-transparent hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to profile
        </Button>
        
        <Card className="border-primary/10 shadow-lg transition-all duration-300 backdrop-blur-sm bg-[#1A1F2C]/90">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/20">
                <ArrowUpCircle className="w-6 h-6 text-destructive" />
              </div>
              Withdraw
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleWithdraw} className="space-y-6">
              {userData && (
                <div className="p-3 border border-primary/10 rounded-lg bg-primary/5 flex justify-between">
                  <span>Available Balance:</span>
                  <span className="font-medium">{userData.balance} ETH</span>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-destructive/80">
                    Amount (ETH)
                  </label>
                  <Input 
                    type="number" 
                    step="0.0001" 
                    min="0.0001" 
                    value={withdrawAmount} 
                    onChange={e => setWithdrawAmount(e.target.value)} 
                    placeholder="Enter amount" 
                    className="bg-background/40 border-destructive/20 focus:border-destructive/40" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-destructive/80">
                    Wallet Address
                  </label>
                  <Input 
                    type="text" 
                    value={withdrawWalletAddress} 
                    onChange={e => setWithdrawWalletAddress(e.target.value)} 
                    placeholder="Enter wallet address" 
                    className="bg-background/40 border-destructive/20 focus:border-destructive/40" 
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-destructive/20 hover:bg-destructive/30 text-destructive"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Confirm Withdrawal"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Withdraw;
