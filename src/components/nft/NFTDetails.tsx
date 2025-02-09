
import { Info, Award, Gem } from "lucide-react";
import { Property } from "@/types/nft";

interface NFTDetailsProps {
  tokenStandard?: string;
  properties?: Property[];
}

export const NFTDetails = ({ tokenStandard, properties }: NFTDetailsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Info className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Details</h2>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-primary/20 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 group shadow-lg hover:shadow-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
            <div className="text-sm text-muted-foreground">Token Standard</div>
          </div>
          <div className="font-medium text-lg">{tokenStandard || 'ERC-721'}</div>
        </div>
      </div>
      {properties && properties.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Gem className="h-5 w-5 text-primary" />
            <div className="text-xl font-semibold">Properties</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {properties.map((prop, index) => (
              <div 
                key={index}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-primary/20 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 group shadow-lg hover:shadow-primary/20"
              >
                <div className="text-sm text-muted-foreground mb-2">{prop.key}</div>
                <div className="font-medium text-lg">{prop.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
