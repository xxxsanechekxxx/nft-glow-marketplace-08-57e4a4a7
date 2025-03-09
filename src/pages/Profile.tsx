import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Wallet } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Tables } from "@/types/supabase";
import ExchangeDialog from "@/components/ExchangeDialog";
import { RefreshCw } from "lucide-react";

interface ProfileProps {}

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [userUsdtBalance, setUserUsdtBalance] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Add state for exchange dialog
  const [exchangeDialogOpen, setExchangeDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: authUser } = await supabase.auth.getUser();
      if (authUser?.user) {
        setUser(authUser.user);
        fetchBalance(authUser.user.id);
      } else {
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const fetchBalance = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (profileError) throw profileError;

      setUserBalance(profileData?.balance || 0);
      setUserUsdtBalance(profileData?.usdt_balance || 0);
    } catch (error: any) {
      toast({
        title: "Error fetching balance",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error logging out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/login");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid gap-8">
        {/* Profile Section */}
        <div className="bg-white/5 rounded-lg p-6 shadow-md">
          <h1 className="text-2xl font-bold mb-4">
            Welcome, {user.email}
          </h1>
          <p>User ID: {user.id}</p>
          <Button onClick={handleLogout} variant="destructive" size="sm">
            Logout
          </Button>
        </div>

        {/* Available Balance Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Available Balance</h2>
            </div>
            <Button variant="outline" size="sm" className="text-xs px-4 py-1 h-7 bg-primary/10 border-primary/20">
              Active
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="bg-purple-900/30 rounded-lg p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/20 p-2 rounded-full">
                  <img src="/lovable-uploads/0e51dc88-2aac-485e-84c5-0bb4ab88f00b.png" alt="ETH" className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">Ethereum</div>
                  <div className="text-sm text-muted-foreground">ETH</div>
                </div>
              </div>
              <div className="text-xl font-semibold">{userBalance?.toFixed(2) || "0.00"}</div>
            </div>
            
            <div className="bg-purple-900/30 rounded-lg p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-2 rounded-full">
                  <div className="text-green-500 font-bold">$</div>
                </div>
                <div>
                  <div className="font-medium">Tether</div>
                  <div className="text-sm text-muted-foreground">USDT</div>
                </div>
              </div>
              <div className="text-xl font-semibold">{userUsdtBalance?.toFixed(2) || "0.00"}</div>
            </div>
            
            {/* Exchange Button */}
            <Button 
              variant="exchange"
              className="w-full py-3 rounded-lg flex items-center justify-center gap-2"
              onClick={() => setExchangeDialogOpen(true)}
            >
              <RefreshCw className="w-5 h-5" />
              Exchange
            </Button>
          </div>
        </div>
        
        {/* Hold Balance Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-orange-500/10 p-2 rounded-full">
                <Wallet className="w-5 h-5 text-orange-500" />
              </div>
              <h2 className="text-xl font-semibold">Hold Balance</h2>
            </div>
            <Button variant="outline" size="sm" className="text-xs px-4 py-1 h-7 bg-orange-500/10 border-orange-500/20">
              Hold
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="bg-purple-900/30 rounded-lg p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/20 p-2 rounded-full">
                  <img src="/lovable-uploads/0e51dc88-2aac-485e-84c5-0bb4ab88f00b.png" alt="ETH" className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">Ethereum</div>
                  <div className="text-sm text-muted-foreground">ETH</div>
                </div>
              </div>
              <div className="text-xl font-semibold">0.00</div>
            </div>
            
            <div className="bg-purple-900/30 rounded-lg p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-2 rounded-full">
                  <div className="text-green-500 font-bold">$</div>
                </div>
                <div>
                  <div className="font-medium">Tether</div>
                  <div className="text-sm text-muted-foreground">USDT</div>
                </div>
              </div>
              <div className="text-xl font-semibold">0.00</div>
            </div>
          </div>
        </div>

        {/* Transactions History Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-gray-500/10 p-2 rounded-full">
                <Wallet className="w-5 h-5 text-gray-500" />
              </div>
              <h2 className="text-xl font-semibold">Transactions History</h2>
            </div>
            <Button variant="outline" size="sm" className="text-xs px-4 py-1 h-7 bg-gray-500/10 border-gray-500/20">
              View All
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    Deposit
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    1.00 ETH
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    Completed
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    2024-04-29
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    Withdraw
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    0.50 ETH
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    Completed
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    2024-04-28
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Render the Exchange Dialog */}
      <ExchangeDialog 
        open={exchangeDialogOpen} 
        onOpenChange={setExchangeDialogOpen} 
      />
    </div>
  );
};

export default Profile;
