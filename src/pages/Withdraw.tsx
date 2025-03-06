
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldAlert, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Withdraw = () => {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [isVerified, setIsVerified] = useState(false);
  const [registrationDate, setRegistrationDate] = useState<Date | null>(null);
  const [isEligible, setIsEligible] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      toast({
        title: "Authentication required",
        description: "Please log in to access this page",
      });
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError) throw profileError;
        
        setUserProfile(profileData);
        setUserBalance(profileData?.balance || 0);
        setIsVerified(profileData?.kyc_status === 'verified');
        
        // Fetch user registration date
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        if (userData.user?.created_at) {
          const createdAt = new Date(userData.user.created_at);
          setRegistrationDate(createdAt);
          
          // Check if 2 weeks have passed since registration
          const twoWeeksAgo = new Date();
          twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
          
          setIsEligible(createdAt < twoWeeksAgo && profileData?.kyc_status === 'verified');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load user profile"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, navigate, toast]);

  const handleSubmit = async () => {
    if (!isEligible) {
      toast({
        variant: "destructive",
        title: "Not eligible",
        description: "Your account must be verified and at least 2 weeks old to withdraw funds"
      });
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (!withdrawAmount || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid amount greater than 0"
      });
      return;
    }

    if (amount > userBalance) {
      toast({
        variant: "destructive",
        title: "Insufficient funds",
        description: "The withdrawal amount exceeds your balance"
      });
      return;
    }

    if (!walletAddress || walletAddress.length < 10) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid wallet address"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create a withdraw transaction
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: user?.id,
            amount: amount,
            type: 'withdraw',
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Withdrawal requested",
        description: "Your withdrawal request has been submitted and is being processed"
      });
      
      setWithdrawAmount("");
      setWalletAddress("");
      
      // Fetch updated balance
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('balance')
        .eq('user_id', user?.id)
        .single();
        
      if (!profileError) {
        setUserBalance(profileData?.balance || 0);
      }
      
    } catch (error) {
      console.error('Error during withdraw:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while processing your withdrawal"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusMessage = () => {
    if (!isVerified) {
      return {
        title: "Account Not Verified",
        description: "Your account must be verified to withdraw funds. Please complete the KYC process.",
        variant: "destructive" as const,
        icon: <ShieldAlert className="h-4 w-4" />
      };
    }
    
    if (registrationDate) {
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      
      if (registrationDate > twoWeeksAgo) {
        const daysRemaining = Math.ceil((twoWeeksAgo.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24) * -1);
        return {
          title: "Account Too New",
          description: `Your account must be at least 2 weeks old to withdraw funds. Days remaining: ${daysRemaining}`,
          variant: "default" as const,
          icon: <AlertTriangle className="h-4 w-4" />
        };
      }
    }
    
    return null;
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="container max-w-xl py-10">
      <Card className="bg-background/95 backdrop-blur-xl border border-primary/10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background/95 to-background/90" />
        <div className="relative">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary">Withdraw</CardTitle>
            <CardDescription className="text-muted-foreground">
              Withdraw ETH from your account balance
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
              </div>
            ) : (
              <>
                {statusMessage && (
                  <Alert variant={statusMessage.variant}>
                    {statusMessage.icon}
                    <AlertTitle>{statusMessage.title}</AlertTitle>
                    <AlertDescription>
                      {statusMessage.description}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="py-2">
                  <p className="text-sm text-muted-foreground">Your balance: <span className="font-semibold text-primary">{userBalance} ETH</span></p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary/80">
                    Withdraw Amount
                  </label>
                  <Input
                    type="number"
                    step="0.0001"
                    min="0.0001"
                    max={userBalance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount to withdraw"
                    className="bg-background/40 border-primary/20 focus:border-primary/40"
                    disabled={!isEligible}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary/80">
                    Wallet Address
                  </label>
                  <Input
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="Enter your wallet address"
                    className="font-mono bg-background/40 border-primary/20 focus:border-primary/40"
                    disabled={!isEligible}
                  />
                </div>

                <Button 
                  className="w-full bg-primary/20 hover:bg-primary/30 text-primary mt-4" 
                  onClick={handleSubmit}
                  disabled={!isEligible || isSubmitting || !withdrawAmount || !walletAddress}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Withdraw'
                  )}
                </Button>

                {!isEligible && (
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Withdrawal requires a verified account that is at least 2 weeks old
                  </p>
                )}
              </>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default Withdraw;
