import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, Mail, Key, LogOut, Wallet, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
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

interface Transaction {
  id: number;
  type: string;
  amount: string;
  date: string;
  status: string;
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

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching user data...");
        
        const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          console.error("Auth error:", authError);
          throw authError;
        }

        if (!currentUser) {
          console.log("No user found");
          return;
        }

        console.log("Current user:", currentUser);

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', currentUser.id)
          .single();

        if (profileError) {
          console.error("Profile error:", profileError);
          throw profileError;
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

          setTransactions([
            { id: 1, type: "deposit", amount: "0.5", date: "2024-03-15", status: "completed" },
            { id: 2, type: "withdraw", amount: "0.2", date: "2024-03-14", status: "completed" },
            { id: 3, type: "purchase", amount: "0.3", date: "2024-03-13", status: "completed" }
          ]);
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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password has been updated",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      });
    }
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success",
      description: `Withdrawal of ${withdrawAmount} ETH initiated`,
    });
    setWithdrawAmount("");
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success",
      description: `Deposit of ${depositAmount} ETH initiated`,
    });
    setDepositAmount("");
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Success",
        description: "You have been logged out",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
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
    <div className="container mx-auto py-8 px-4 mt-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-6 p-8 bg-card rounded-lg border shadow-lg hover:shadow-xl transition-shadow duration-300">
          <Avatar className="w-24 h-24 border-2 border-primary/20">
            <AvatarFallback>
              <User className="w-12 h-12 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground">@{userData?.login}</h1>
            <div className="flex items-center gap-2 text-primary">
              <Wallet className="w-5 h-5" />
              <span className="text-lg font-semibold">{userData?.balance} ETH</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Wallet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <Input value={userData?.email} readOnly className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Country</label>
                    <Input value={userData?.country} readOnly className="bg-muted/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Wallet Address
                  </label>
                  <div className="flex gap-4 items-start">
                    <Input 
                      value={userData?.wallet_address || ''} 
                      readOnly 
                      className="bg-muted/50 font-mono text-sm"
                      placeholder="No wallet address generated"
                    />
                    {!userData?.wallet_address && (
                      <Button
                        onClick={() => setIsWalletModalOpen(true)}
                      >
                        Generate Address
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      Current Password
                    </label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <Input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit">Update Password</Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="wallet">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Operations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive">
                          <ArrowUpCircle className="w-4 h-4 mr-2" />
                          Withdraw
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Withdraw ETH</DialogTitle>
                          <DialogDescription>
                            Enter the amount of ETH you want to withdraw.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleWithdraw} className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Amount (ETH)</label>
                            <Input
                              type="number"
                              step="0.001"
                              min="0"
                              value={withdrawAmount}
                              onChange={(e) => setWithdrawAmount(e.target.value)}
                              placeholder="0.00"
                              required
                            />
                          </div>
                          <DialogFooter>
                            <Button type="submit">Confirm Withdrawal</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <ArrowDownCircle className="w-4 h-4 mr-2" />
                          Deposit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Deposit ETH</DialogTitle>
                          <DialogDescription>
                            Enter the amount of ETH you want to deposit.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleDeposit} className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Amount (ETH)</label>
                            <Input
                              type="number"
                              step="0.001"
                              min="0"
                              value={depositAmount}
                              onChange={(e) => setDepositAmount(e.target.value)}
                              placeholder="0.00"
                              required
                            />
                          </div>
                          <DialogFooter>
                            <Button type="submit">Confirm Deposit</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount (ETH)</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell className="capitalize">{transaction.type}</TableCell>
                          <TableCell>{transaction.amount}</TableCell>
                          <TableCell className="capitalize">{transaction.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <WalletAddressModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onGenerated={handleGenerateWalletAddress}
      />
    </div>
  );
};

export default Profile;