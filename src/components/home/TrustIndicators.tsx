
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
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-purple-500/10 to-pink-500/5"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px] animate-[pulse_10s_ease-in-out_infinite] delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500 leading-tight">
            Why Trust PureNFT
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl">
            We are committed to providing the most secure and trustworthy NFT marketplace experience
          </p>
          
          {/* Added divider with glow effect */}
          <div className="relative h-1 w-24 mx-auto mt-8 mb-2">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-purple-500 to-pink-500/50 rounded-full"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {trustFeatures.map((feature, index) => (
            <div 
              key={index}
              className="flex flex-col p-10 rounded-2xl bg-background/70 backdrop-blur-xl border border-primary/10 hover:border-primary/30 transition-all duration-700 hover:translate-y-[-8px] group relative overflow-hidden shadow-xl shadow-primary/5 hover:shadow-primary/10"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Enhanced gradient hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-700 group-hover:duration-200"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-8 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-500 ring-4 ring-primary/5 group-hover:ring-primary/20">
                  <feature.icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground text-center group-hover:text-foreground/90 transition-colors duration-500 line-height-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 flex justify-center">
          <div className="p-6 bg-background/70 backdrop-blur-xl rounded-xl border border-primary/10 max-w-4xl shadow-lg">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center ring-4 ring-primary/5">
                  <Shield className="w-10 h-10 text-primary" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500">Security Commitment</h4>
                <p className="text-muted-foreground">
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
