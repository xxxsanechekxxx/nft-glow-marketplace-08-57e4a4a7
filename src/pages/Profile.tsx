import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, Mail, Key, LogOut, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");

  // Mock user data (replace with actual user data when backend is integrated)
  const userData = {
    name: "John Doe",
    email: "john@example.com",
    login: "johndoe",
    nickname: "JD",
    country: "United States",
    birthDate: "1990-01-01",
    avatar: "https://github.com/shadcn.png",
    balance: "1.5" // Mock ETH balance
  };

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
    // Add withdraw logic here when backend is integrated
    toast({
      title: "Success",
      description: `Withdrawal of ${withdrawAmount} ETH initiated`,
    });
    setWithdrawAmount("");
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add deposit logic here when backend is integrated
    toast({
      title: "Success",
      description: `Deposit of ${depositAmount} ETH initiated`,
    });
    setDepositAmount("");
  };

  const handleLogout = () => {
    toast({
      title: "Success",
      description: "You have been logged out",
    });
    navigate('/');
  };

  return (
    <div className="container mx-auto py-8 px-4 mt-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-6 p-6 bg-card rounded-lg border">
          <Avatar className="w-24 h-24">
            <AvatarImage src={userData.avatar} alt={userData.name} />
            <AvatarFallback>{userData.name[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{userData.name}</h1>
            <p className="text-muted-foreground">@{userData.login}</p>
            <div className="flex items-center gap-2 text-primary">
              <Wallet className="w-4 h-4" />
              <span>{userData.balance} ETH</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid gap-6">
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
                      <Input value={userData.email} readOnly />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nickname</label>
                      <Input value={userData.nickname} readOnly />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Country</label>
                      <Input value={userData.country} readOnly />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Birth Date</label>
                      <Input value={userData.birthDate} readOnly />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Wallet Operations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <form onSubmit={handleWithdraw} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Withdraw Amount (ETH)</label>
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
                      <Button type="submit" variant="destructive">Withdraw</Button>
                    </form>

                    <form onSubmit={handleDeposit} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Deposit Amount (ETH)</label>
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
                      <Button type="submit">Deposit</Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </div>
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
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;