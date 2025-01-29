import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, Mail, Key, LogOut, Wallet, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
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

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, logout, loadUser } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");

  useEffect(() => {
    if (!user) {
      loadUser();
    }
  }, [user, loadUser]);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Success",
      description: "Password has been updated",
    });
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 mt-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardContent className="flex items-center justify-center h-[200px]">
              <p>Please log in to view your profile</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 mt-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-6 p-6 bg-card rounded-lg border">
          <Avatar className="w-24 h-24">
            <AvatarImage src="https://github.com/shadcn.png" alt={user.nickname} />
            <AvatarFallback>{user.nickname[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{user.nickname}</h1>
            <p className="text-muted-foreground">@{user.login}</p>
            <div className="flex items-center gap-2 text-primary">
              <Wallet className="w-4 h-4" />
              <span>{user.balance} ETH</span>
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
            <Card>
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
                    <Input value={user.email} readOnly />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nickname</label>
                    <Input value={user.nickname} readOnly />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Country</label>
                    <Input value={user.country} readOnly />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Birth Date</label>
                    <Input value={user.birthDate} readOnly />
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
                      {/* Mock transaction history (replace with actual data when backend is integrated) */}
                      <TableRow>
                        <TableCell>2024-03-15</TableCell>
                        <TableCell className="capitalize">deposit</TableCell>
                        <TableCell>0.5</TableCell>
                        <TableCell className="capitalize">completed</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2024-03-14</TableCell>
                        <TableCell className="capitalize">withdraw</TableCell>
                        <TableCell>0.2</TableCell>
                        <TableCell className="capitalize">completed</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2024-03-13</TableCell>
                        <TableCell className="capitalize">purchase</TableCell>
                        <TableCell>0.3</TableCell>
                        <TableCell className="capitalize">completed</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
