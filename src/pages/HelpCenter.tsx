import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const HelpCenter = () => {
  const faqs = [
    {
      question: "What is an NFT?",
      answer: "An NFT (Non-Fungible Token) is a unique digital asset that represents ownership of a specific item or piece of content on the blockchain. Unlike cryptocurrencies, each NFT is unique and cannot be replaced with something else of equal value."
    },
    {
      question: "How do I buy an NFT?",
      answer: "To buy an NFT on our platform, you'll need to connect your wallet, browse our marketplace, and when you find an NFT you like, click the 'Buy Now' or 'Place Bid' button. Follow the prompts to complete your purchase."
    },
    {
      question: "What wallets do you support?",
      answer: "We support major Web3 wallets including MetaMask, WalletConnect, and Coinbase Wallet. Make sure your wallet is connected to the Ethereum network to interact with our platform."
    },
    {
      question: "How do I sell my NFT?",
      answer: "To sell your NFT, you'll need to connect your wallet, go to your profile, select the NFT you want to sell, and click 'List for Sale'. You can then set your price and listing duration."
    },
    {
      question: "Are there any fees?",
      answer: "Yes, there are gas fees for transactions on the Ethereum network, and our platform charges a small service fee. The exact amounts will be displayed before you confirm any transaction."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
          Help Center
        </h1>
        
        <Card className="p-6 mb-8 bg-secondary/5 backdrop-blur-sm border border-primary/10">
          <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
          <p className="text-muted-foreground mb-4">
            Find answers to common questions about NFTs, our marketplace, and how to get started.
          </p>
          <p className="text-muted-foreground">
            Can't find what you're looking for? Contact our support team at{" "}
            <a href="mailto:support@nftverse.com" className="text-primary hover:underline">
              support@nftverse.com
            </a>
          </p>
        </Card>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-secondary/5 backdrop-blur-sm border border-primary/10">
              <AccordionTrigger className="px-4 hover:no-underline hover:bg-primary/5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default HelpCenter;