
import { Building2, Building, Globe, Handshake } from "lucide-react";
import { motion } from "framer-motion";

const Partners = () => {
  const partners = [
    {
      name: "Crypto Exchange Hub",
      description: "Leading cryptocurrency exchange providing secure and fast transactions for NFTs.",
      type: "Exchange Partner",
      icon: Building2,
    },
    {
      name: "Digital Art Gallery",
      description: "Exclusive online gallery showcasing works of talented digital artists.",
      type: "Art Partner",
      icon: Building,
    },
    {
      name: "BlockTech Solutions",
      description: "Innovative blockchain company providing technological infrastructure.",
      type: "Technology Partner",
      icon: Globe,
    },
    {
      name: "NFT Innovators",
      description: "Pioneers in NFT technology creating unique solutions for digital art.",
      type: "Innovation Partner",
      icon: Handshake,
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] animate-pulse"></div>
          </div>
          
          <div className="min-h-[100px] flex items-center justify-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent py-6"
            >
              Our Partners
            </motion.h1>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Together we are creating the future of digital art and NFT technology
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <div className="relative rounded-2xl p-8 bg-card/60 backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-all duration-700">
                <div className="flex items-start gap-6">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-700">
                    <partner.icon className="w-8 h-8" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-foreground/90 group-hover:text-primary transition-colors duration-700">
                        {partner.name}
                      </h3>
                      <span className="text-sm text-muted-foreground px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        {partner.type}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {partner.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="min-h-[80px] flex items-center justify-center">
            <h2 className="text-2xl font-semibold mb-4 text-foreground/90 py-6">Become Our Partner</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            We are always open to new partnerships and collaboration opportunities.
            Contact us to learn more about our partnership program.
          </p>
          <a 
            href="https://t.me/purenftsupport" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/30 text-primary transition-all duration-300 group"
          >
            <Handshake className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
            Contact Us
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Partners;
