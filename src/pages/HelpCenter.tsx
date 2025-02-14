
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { MessageSquare, Mail, FileCheck, ShieldCheck, Wallet, DollarSign, HelpCircle } from "lucide-react";

const HelpCenter = () => {
  const faqs = [
    {
      icon: <Wallet className="w-5 h-5" />,
      question: "How do I connect my wallet?",
      answer: "To connect your wallet, click the 'Connect Wallet' button in the top right corner. We support major Web3 wallets including MetaMask, WalletConnect, and Coinbase Wallet. Make sure your wallet is configured for the Ethereum network."
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      question: "How does the verification process work?",
      answer: "Our verification process consists of two steps: identity verification and address verification. You'll need to provide valid government-issued ID and proof of address (utility bill or bank statement). This helps ensure platform security and compliance with regulations."
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      question: "What are the fees for buying and selling NFTs?",
      answer: "Our platform charges a small service fee for transactions. The exact fee amount will be displayed before you confirm any purchase or sale. Additionally, there are gas fees for transactions on the Ethereum network, which vary depending on network congestion."
    },
    {
      icon: <FileCheck className="w-5 h-5" />,
      question: "What types of NFTs are supported?",
      answer: "We support all ERC-721 and ERC-1155 standard NFTs on the Ethereum network. This includes digital art, collectibles, gaming items, and more. All NFTs must comply with our content guidelines and terms of service."
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      question: "How can I ensure my NFT purchase is secure?",
      answer: "All transactions on our platform are secured by smart contracts and the Ethereum blockchain. We implement rigorous security measures and verify all sellers. Always check the NFT contract address and seller's verification status before making a purchase."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              How can we help?
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Find answers to common questions about our NFT marketplace, or get in touch with our support team.
            </p>
          </div>
          
          <Card className="p-8 bg-secondary/5 backdrop-blur-sm border border-primary/10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">Contact Support</h2>
              </div>
              <p className="text-muted-foreground">
                Our support team is available 24/7 to help you with any questions or issues you may have.
              </p>
              <div className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                <Mail className="w-5 h-5" />
                <a href="mailto:support@purenft.io" className="hover:underline">
                  support@purenft.io
                </a>
              </div>
            </div>
          </Card>

          <div className="grid gap-4">
            <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`} 
                  className="bg-secondary/5 backdrop-blur-sm border border-primary/10 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-4 hover:no-underline hover:bg-primary/5 data-[state=open]:bg-primary/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-full bg-primary/10">
                        {faq.icon}
                      </div>
                      <span>{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
