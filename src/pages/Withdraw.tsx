
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpCircle, AlertTriangle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { differenceInDays } from "date-fns";

interface UserData {
  balance: string;
  verified: boolean;
}

const Withdraw = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [daysUntilWithdrawal, setDaysUntilWithdrawal] = useState<number | null>(null);
  const [registrationDate, setRegistrationDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('balance, verified')
          .eq('user_id', user.id)
          .single();

        if (profileError) throw profileError;

        // Get user creation date
        const { data: { user: userData }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;

        if (userData?.created_at) {
          const createdAt = new Date(userData.created_at);
          setRegistrationDate(createdAt);
          
          const today = new Date();
          const daysDifference = differenceInDays(today, createdAt);
          const requiredDays = 14;
          
          if (daysDifference < requiredDays) {
            setDaysUntilWithdrawal(requiredDays - daysDifference);
          } else {
            setDaysUntilWithdrawal(0);
          }
        }

        setUserData(profileData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate, toast]);

  const canWithdraw = (): { canWithdraw: boolean; message: string } => {
    if (!userData) {
      return { canWithdraw: false, message: "User data is not available" };
    }
    
    if (!userData.verified) {
      return { canWithdraw: false, message: "Account is not verified. Please complete KYC verification" };
    }
    
    if (daysUntilWithdrawal && daysUntilWithdrawal > 0) {
      return { 
        canWithdraw: false, 
        message: `Account age requirement not met. Please wait ${daysUntilWithdrawal} more days` 
      };
    }
    
    return { canWithdraw: true, message: "" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { canWithdraw: isEligible, message } = canWithdraw();
    
    if (!isEligible) {
      toast({
        title: "Withdrawal not allowed",
        description: message,
        variant: "destructive",
      });
      return;
    }
    
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

    if (!withdrawAddress || !withdrawAddress.startsWith('0x')) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid ERC-20 wallet address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user?.id,
            type: 'withdraw',
            amount: withdrawAmountNum,
            status: 'pending',
            withdraw_address: withdrawAddress
          }
        ]);

      if (error) throw error;

      toast({
        title: "Withdrawal Requested",
        description: `Your withdrawal request for ${withdrawAmount} ETH has been submitted`
      });
      
      navigate("/profile");
    } catch (error) {
      console.error("Error submitting withdrawal:", error);
      toast({
        title: "Error",
        description: "Failed to process withdrawal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const { canWithdraw: isEligible, message: eligibilityMessage } = canWithdraw();

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 mt-16 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 mt-16 min-h-screen bg-gradient-to-b from-background via-background/80 to-background/60">
      <div className="max-w-2xl mx-auto">
        <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-[#1A1F2C]/90">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <ArrowUpCircle className="w-6 h-6 text-red-500" />
              </div>
              Withdraw Funds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isEligible ? (
              <div className="space-y-6">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-500">Withdrawal Restricted</h3>
                    <p className="text-sm text-muted-foreground">{eligibilityMessage}</p>
                  </div>
                </div>
                
                {registrationDate && daysUntilWithdrawal && daysUntilWithdrawal > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Account created on {registrationDate.toLocaleDateString()}</span>
                    </div>
                    <div className="w-full bg-background/50 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-primary/50"
                        style={{ 
                          width: `${((14 - daysUntilWithdrawal) / 14) * 100}%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      {daysUntilWithdrawal} days remaining until withdrawal is available
                    </p>
                  </div>
                )}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/profile")}
                  className="w-full"
                >
                  Back to Profile
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Available Balance</label>
                  <div className="flex items-center p-3 bg-background/50 border border-primary/10 rounded">
                    <span className="font-medium">{parseFloat(userData?.balance || "0").toFixed(2)} ETH</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Withdrawal Address</label>
                  <Input
                    type="text"
                    placeholder="0x..."
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                    required
                    className="bg-background/50 border-primary/10 font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your ERC-20 compatible wallet address
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount (ETH)</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    required
                    className="bg-background/50 border-primary/10"
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/profile")}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-500"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Submit Withdrawal"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Withdraw;
