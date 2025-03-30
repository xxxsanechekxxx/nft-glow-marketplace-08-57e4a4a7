
import { Shield, Award, CheckCircle2, BadgeCheck, Lock } from "lucide-react";

const trustFeatures = [
  {
    icon: Shield,
    title: "Secure Trading",
    description: "Advanced blockchain security and escrow system protects every transaction"
  },
  {
    icon: Award,
    title: "Verified Artists",
    description: "All creators are thoroughly vetted to ensure authentic, high-quality NFTs"
  },
  {
    icon: CheckCircle2,
    title: "100% Ownership",
    description: "Full digital rights and provable ownership of all purchased collectibles"
  },
  {
    icon: BadgeCheck,
    title: "Authenticity Guaranteed",
    description: "Every NFT is verified with blockchain certification of authenticity"
  },
  {
    icon: Lock,
    title: "Privacy Protected",
    description: "Your personal information is always secure and never shared"
  }
];

export const TrustIndicators = () => {
  return (
    <div className="py-24 bg-background/40 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-purple-500/5 to-pink-500/5"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[150px] animate-[pulse_10s_ease-in-out_infinite] delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500">
            Why Trust PureNFT
          </h2>
          <p className="text-muted-foreground text-lg">
            We are committed to providing the most secure and trustworthy NFT marketplace experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trustFeatures.map((feature, index) => (
            <div 
              key={index}
              className="flex flex-col items-center p-8 rounded-2xl bg-background/30 backdrop-blur-xl border border-primary/10 hover:border-primary/30 transition-all duration-700 hover:scale-[1.03] group relative overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative z-10">
                <div className="mb-6 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-500">
                  <feature.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground text-center group-hover:text-muted-foreground/80 transition-colors duration-500">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 flex justify-center">
          <div className="p-4 bg-primary/5 backdrop-blur-sm rounded-xl border border-primary/10 max-w-3xl">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-1">Security Commitment</h4>
                <p className="text-muted-foreground text-sm">
                  PureNFT implements state-of-the-art security measures including multi-signature wallets, 
                  smart contract audits, and 24/7 security monitoring to ensure your assets remain safe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
