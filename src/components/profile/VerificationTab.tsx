
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, User, Home, BadgeCheck, CheckCircle2, HelpCircle } from "lucide-react";
import type { UserData } from "@/types/user";

interface VerificationTabProps {
  userData: UserData | null;
  startKYCVerification: () => void;
  continueKYCVerification: () => void;
}

export const VerificationTab = ({ userData, startKYCVerification, continueKYCVerification }: VerificationTabProps) => {
  return (
    <Card className="border-primary/10 shadow-lg hover:shadow-primary/5 transition-all duration-300 backdrop-blur-sm bg-[#1A1F2C]/90">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          KYC Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="p-6 rounded-xl bg-[#12151C]/80 border border-primary/10 space-y-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${userData?.verified ? 'bg-green-500/10 border border-green-500/20' : 'bg-orange-500/10 border border-orange-500/20'}`}>
              {userData?.verified ? <CheckCircle2 className="w-8 h-8 text-green-500" /> : <HelpCircle className="w-8 h-8 text-orange-500" />}
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  KYC Status:{' '}
                  <span className={`${userData?.verified ? 'text-green-500' : 'text-orange-500'}`}>
                    {userData?.verified ? 'Verified' : userData?.kyc_status === 'not_started' ? 'Not Started' : userData?.kyc_status === 'identity_submitted' ? 'Identity Submitted' : userData?.kyc_status === 'under_review' ? 'Under Review' : 'Not Verified'}
                  </span>
                </h3>
                {userData?.kyc_status === 'under_review' && <span className="text-sm text-orange-500 font-medium">80%</span>}
              </div>
              <p className="text-sm text-muted-foreground">
                {userData?.verified ? 'Your account is fully verified and has access to all features' : userData?.kyc_status === 'under_review' ? 'Final verification check in progress' : 'Complete verification to unlock all features'}
              </p>
              {userData?.kyc_status === 'under_review' && (
                <div className="mt-4 w-full bg-orange-500/10 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-1000" 
                    style={{ width: '80%' }} 
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-6 rounded-xl border transition-all duration-300 space-y-4 ${userData?.kyc_status === 'not_started' ? 'bg-primary/5 border-primary/20' : 'bg-[#12151C]/80 border-primary/10'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${userData?.kyc_status === 'not_started' ? 'bg-primary/20' : 'bg-green-500/20'}`}>
                <User className={`w-5 h-5 ${userData?.kyc_status === 'not_started' ? 'text-primary' : 'text-green-500'}`} />
              </div>
              <h3 className="font-semibold">Identity</h3>
            </div>
            {userData?.kyc_status === 'not_started' && (
              <Button onClick={startKYCVerification} className="w-full bg-primary/20 hover:bg-primary/30 text-primary">
                Start Verification
              </Button>
            )}
          </div>

          <div className={`p-6 rounded-xl border transition-all duration-300 space-y-4 ${userData?.kyc_status === 'identity_submitted' ? 'bg-primary/5 border-primary/20' : 'bg-[#12151C]/80 border-primary/10'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${userData?.kyc_status === 'identity_submitted' ? 'bg-primary/20' : userData?.kyc_status === 'under_review' || userData?.verified ? 'bg-green-500/20' : 'bg-muted/20'}`}>
                <Home className={`w-5 h-5 ${userData?.kyc_status === 'identity_submitted' ? 'text-primary' : userData?.kyc_status === 'under_review' || userData?.verified ? 'text-green-500' : 'text-muted-foreground'}`} />
              </div>
              <h3 className="font-semibold">Address</h3>
            </div>
            {(userData?.kyc_status === 'identity_submitted' || userData?.kyc_status === 'not_started') && (
              <Button 
                onClick={continueKYCVerification} 
                className="w-full bg-primary/20 hover:bg-primary/30 text-primary" 
                disabled={userData?.kyc_status === 'not_started'}
              >
                Submit Address Documents
              </Button>
            )}
          </div>

          <div className={`p-6 rounded-xl border transition-all duration-300 space-y-4 ${userData?.verified ? 'bg-green-500/5 border-green-500/20' : 'bg-[#12151C]/80 border-primary/10'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${userData?.verified ? 'bg-green-500/20' : 'bg-muted/20'}`}>
                <BadgeCheck className={`w-5 h-5 ${userData?.verified ? 'text-green-500' : 'text-muted-foreground'}`} />
              </div>
              <h3 className="font-semibold">Verification</h3>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
