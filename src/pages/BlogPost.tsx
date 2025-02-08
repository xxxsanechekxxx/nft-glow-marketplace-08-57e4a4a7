import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, User, Clock } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "The Future of NFT Technology",
    content: `
      <p>The world of Non-Fungible Tokens (NFTs) continues to evolve at an unprecedented pace, reshaping our understanding of digital ownership and creativity. As we look towards the future, several key developments are set to transform the NFT landscape further.</p>

      <h2>Smart Contracts Evolution</h2>
      <p>Advanced smart contracts are enabling more complex functionality within NFTs, including automated royalty distributions and dynamic content updates. This technology is making NFTs more versatile and valuable for creators and collectors alike.</p>

      <h2>Interoperability</h2>
      <p>Cross-chain compatibility is becoming increasingly important, allowing NFTs to exist and be traded across different blockchain networks. This interoperability is crucial for the long-term sustainability and growth of the NFT ecosystem.</p>

      <h2>Real-World Integration</h2>
      <p>NFTs are beginning to bridge the gap between digital and physical assets, with tokens being used to represent ownership of real-world items, from real estate to luxury goods. This convergence is opening up new possibilities for asset ownership and trading.</p>

      <h2>Environmental Solutions</h2>
      <p>The industry is actively working on reducing its environmental impact through the development of more energy-efficient consensus mechanisms and carbon-neutral platforms.</p>

      <h2>Conclusion</h2>
      <p>As NFT technology continues to mature, we can expect to see more innovative applications and use cases emerge. The future of NFTs looks promising, with ongoing developments in functionality, accessibility, and sustainability.</p>
    `,
    author: "Alex Thompson",
    date: "March 15, 2024",
    readTime: "5 min read",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Getting Started with Digital Art Collection",
    content: `
      <p>Digital art collection is an exciting journey that allows you to explore creativity in new ways. This guide will help you navigate the world of digital art and start your collection.</p>

      <h2>Understanding Digital Art</h2>
      <p>Digital art encompasses a wide range of artistic practices that use digital technology as part of the creative or presentation process. From digital paintings to 3D models, the possibilities are endless.</p>

      <h2>Finding Artworks</h2>
      <p>There are numerous platforms where you can discover and purchase digital art. Websites like OpenSea, Rarible, and Foundation are popular marketplaces for digital art and NFTs.</p>

      <h2>Building Your Collection</h2>
      <p>When starting your collection, consider what resonates with you. Look for artists whose work you admire and invest in pieces that speak to you personally.</p>

      <h2>Storing Your Art</h2>
      <p>Once you've acquired digital art, it's essential to store it securely. Use digital wallets that support NFTs to keep your collection safe.</p>

      <h2>Conclusion</h2>
      <p>Collecting digital art can be a rewarding experience. With the right knowledge and tools, you can build a collection that reflects your taste and passion for art.</p>
    `,
    author: "Sarah Chen",
    date: "March 12, 2024",
    readTime: "7 min read",
    category: "Guide",
    image: "https://images.unsplash.com/photo-1559336197-ded8aaa244bc?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "Understanding Blockchain Security",
    content: `
      <p>Blockchain technology is revolutionizing the way we think about security in the digital world. This article explores the key aspects of blockchain security.</p>

      <h2>Decentralization</h2>
      <p>One of the primary security features of blockchain is its decentralized nature. Unlike traditional systems, where a single entity controls the data, blockchain distributes data across a network of nodes, making it more resilient to attacks.</p>

      <h2>Cryptography</h2>
      <p>Blockchain employs advanced cryptographic techniques to secure transactions and control the creation of new units. This ensures that data is tamper-proof and only accessible to authorized users.</p>

      <h2>Consensus Mechanisms</h2>
      <p>Consensus mechanisms like Proof of Work and Proof of Stake play a crucial role in maintaining the integrity of the blockchain. They ensure that all transactions are verified and agreed upon by the network participants.</p>

      <h2>Smart Contracts</h2>
      <p>Smart contracts automate processes and enforce agreements without the need for intermediaries. However, they must be coded carefully to avoid vulnerabilities.</p>

      <h2>Conclusion</h2>
      <p>Understanding blockchain security is essential for anyone involved in the digital asset space. By leveraging its unique features, we can create a more secure digital future.</p>
    `,
    author: "Michael Garcia",
    date: "March 10, 2024",
    readTime: "6 min read",
    category: "Security",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    title: "The Rise of Digital Art Marketplaces",
    content: `
      <p>Digital art marketplaces are changing the way artists and collectors interact. This article delves into the rise of these platforms and their impact on the art world.</p>

      <h2>Accessibility</h2>
      <p>Digital art marketplaces provide artists with a platform to showcase their work to a global audience. This accessibility has democratized the art world, allowing more creators to gain recognition.</p>

      <h2>New Revenue Streams</h2>
      <p>For artists, these platforms offer new revenue opportunities through sales, royalties, and collaborations. This shift is empowering artists to earn a living from their craft.</p>

      <h2>Community Building</h2>
      <p>Marketplaces foster communities where artists and collectors can connect, share ideas, and collaborate. This sense of community enhances the overall experience for everyone involved.</p>

      <h2>Challenges</h2>
      <p>Despite their benefits, digital art marketplaces face challenges such as copyright issues and market volatility. Addressing these challenges is crucial for their long-term success.</p>

      <h2>Conclusion</h2>
      <p>The rise of digital art marketplaces is reshaping the art landscape. As they continue to evolve, they will play a significant role in the future of art and creativity.</p>
    `,
    author: "Emma Wilson",
    date: "March 8, 2024",
    readTime: "8 min read",
    category: "Market",
    image: "https://images.unsplash.com/photo-1569242840510-5c2efa57c638?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 5,
    title: "NFT Gaming: A New Era of Entertainment",
    content: `
      <p>NFT gaming is revolutionizing the entertainment industry by introducing unique ownership models. This article explores the impact of NFTs on gaming.</p>

      <h2>Ownership of In-Game Assets</h2>
      <p>NFTs allow players to truly own their in-game assets, which can be bought, sold, or traded outside the game environment. This creates a new economy within gaming.</p>

      <h2>Play-to-Earn Models</h2>
      <p>Many NFT games are adopting play-to-earn models, where players can earn real-world value through gameplay. This incentivizes engagement and rewards players for their time.</p>

      <h2>Community Engagement</h2>
      <p>NFT gaming fosters strong communities where players can collaborate, compete, and share experiences. This sense of belonging enhances the gaming experience.</p>

      <h2>Future Trends</h2>
      <p>As technology advances, we can expect to see more innovative uses of NFTs in gaming, including cross-game asset compatibility and immersive experiences.</p>

      <h2>Conclusion</h2>
      <p>NFT gaming is paving the way for a new era of entertainment. By embracing this technology, we can create more engaging and rewarding gaming experiences.</p>
    `,
    author: "David Park",
    date: "March 5, 2024",
    readTime: "10 min read",
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 6,
    title: "The Environmental Impact of NFTs",
    content: `
      <p>The environmental impact of NFTs has become a significant topic of discussion. This article examines the concerns and potential solutions.</p>

      <h2>Energy Consumption</h2>
      <p>Many NFT platforms rely on energy-intensive blockchain networks, raising concerns about their carbon footprint. Understanding this impact is crucial for sustainable practices.</p>

      <h2>Carbon Offsetting</h2>
      <p>Some projects are exploring carbon offsetting initiatives to mitigate their environmental impact. This includes investing in renewable energy and reforestation efforts.</p>

      <h2>Innovative Solutions</h2>
      <p>New blockchain technologies are emerging that prioritize energy efficiency. These solutions aim to reduce the environmental impact of NFTs while maintaining their benefits.</p>

      <h2>Community Awareness</h2>
      <p>Raising awareness about the environmental impact of NFTs is essential for fostering responsible practices within the community.</p>

      <h2>Conclusion</h2>
      <p>As the NFT space evolves, addressing environmental concerns will be vital for its sustainability. By adopting innovative solutions, we can create a more eco-friendly future.</p>
    `,
    author: "Lisa Green",
    date: "March 3, 2024",
    readTime: "9 min read",
    category: "Environment",
    image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 7,
    title: "NFT Authentication and Verification",
    content: `
      <p>Understanding NFT authentication and verification is crucial for ensuring the integrity of digital assets. This article explores the key concepts.</p>

      <h2>What is NFT Authentication?</h2>
      <p>NFT authentication involves verifying the legitimacy of a digital asset. This process ensures that the asset is genuine and not a counterfeit.</p>

      <h2>Verification Methods</h2>
      <p>Various methods are used to verify NFTs, including blockchain records and third-party audits. These methods help establish trust in the marketplace.</p>

      <h2>Importance of Provenance</h2>
      <p>Provenance refers to the history of ownership of an NFT. Understanding an asset's provenance is essential for determining its value and authenticity.</p>

      <h2>Challenges in Verification</h2>
      <p>Despite advancements, challenges remain in NFT verification, including the potential for fraud and the need for standardized practices.</p>

      <h2>Conclusion</h2>
      <p>As the NFT market grows, understanding authentication and verification will be vital for buyers and sellers alike. By prioritizing these practices, we can foster a more trustworthy ecosystem.</p>
    `,
    author: "James Chen",
    date: "March 1, 2024",
    readTime: "6 min read",
    category: "Security",
    image: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 8,
    title: "Digital Art Curation Strategies",
    content: `
      <p>Curating a digital art collection requires thoughtful strategies. This article provides tips for building and maintaining a valuable collection.</p>

      <h2>Defining Your Aesthetic</h2>
      <p>Start by defining your aesthetic and what types of digital art resonate with you. This will guide your collection and help you make informed decisions.</p>

      <h2>Researching Artists</h2>
      <p>Take the time to research artists and their work. Understanding their background and style will enhance your appreciation of their art.</p>

      <h2>Engaging with the Community</h2>
      <p>Engaging with the digital art community can provide insights and opportunities for collaboration. Attend virtual exhibitions and participate in discussions.</p>

      <h2>Maintaining Your Collection</h2>
      <p>Regularly review and update your collection. Consider selling or trading pieces that no longer fit your vision.</p>

      <h2>Conclusion</h2>
      <p>Curating a digital art collection is a rewarding experience. By implementing these strategies, you can create a collection that reflects your passion for art.</p>
    `,
    author: "Maria Rodriguez",
    date: "February 28, 2024",
    readTime: "7 min read",
    category: "Guide",
    image: "https://images.unsplash.com/photo-1561998338-13ad7883b20f?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 9,
    title: "The Future of Digital Ownership",
    content: `
      <p>Digital ownership is evolving with the advent of blockchain technology. This article explores the future of ownership in the digital age.</p>

      <h2>Blockchain as a Foundation</h2>
      <p>Blockchain technology provides a secure and transparent way to establish ownership of digital assets. This foundation is crucial for the future of digital ownership.</p>

      <h2>New Business Models</h2>
      <p>As digital ownership becomes more prevalent, new business models are emerging. These models leverage blockchain to create innovative ways to buy, sell, and trade digital assets.</p>

      <h2>Legal Considerations</h2>
      <p>Understanding the legal implications of digital ownership is essential. As laws evolve, staying informed will help navigate the complexities of digital assets.</p>

      <h2>Future Trends</h2>
      <p>We can expect to see continued growth in digital ownership, with more individuals and businesses embracing blockchain technology.</p>

      <h2>Conclusion</h2>
      <p>The future of digital ownership is bright. By embracing these changes, we can create a more equitable and accessible digital landscape.</p>
    `,
    author: "Thomas Wright",
    date: "February 25, 2024",
    readTime: "8 min read",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
  }
];

const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts.find(post => post.id === Number(id));

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl text-muted-foreground">Post not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.article 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative h-[400px] mb-8 rounded-2xl overflow-hidden">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>

          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent"
            >
              {post.title}
            </motion.h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {post.author}
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {post.date}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {post.readTime}
              </span>
              <span className="px-3 py-1 rounded-full text-sm bg-primary/90 text-white">
                {post.category}
              </span>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="prose prose-invert max-w-none mt-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default BlogPost;
