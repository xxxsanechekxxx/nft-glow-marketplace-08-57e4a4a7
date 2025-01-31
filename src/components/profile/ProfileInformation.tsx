import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Globe, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileInformationProps {
  email: string;
  country: string;
  walletAddress: string;
  onGenerateWallet: () => void;
}

export const ProfileInformation = ({
  email,
  country,
  walletAddress,
  onGenerateWallet,
}: ProfileInformationProps) => {
  return (
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
            <Input value={email} readOnly className="bg-muted/50" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Country
            </label>
            <Input value={country} readOnly className="bg-muted/50" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Wallet Address
          </label>
          <div className="flex gap-4 items-start">
            <div className="flex-grow flex gap-2 items-center">
              <Input 
                value={walletAddress || ''} 
                readOnly 
                className="bg-muted/50 font-mono text-sm flex-grow"
                placeholder="No wallet address generated"
              />
              {walletAddress && (
                <Input
                  value="ERC-20"
                  readOnly
                  className="bg-muted/50 w-24 text-sm text-center"
                />
              )}
            </div>
            {!walletAddress && (
              <Button onClick={onGenerateWallet}>
                Generate Address
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};