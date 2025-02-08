import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, User, Clock } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "The Future of NFT Technology",
    excerpt: "Explore how NFTs are evolving and shaping the future of digital ownership and creativity.",
    author: "Alex Thompson",
    date: "March 15, 2024",
    readTime: "5 min read",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Getting Started with Digital Art Collection",
    excerpt: "A comprehensive guide for beginners looking to start their journey in collecting digital art.",
    author: "Sarah Chen",
    date: "March 12, 2024",
    readTime: "7 min read",
    category: "Guide",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "Understanding Blockchain Security",
    excerpt: "Learn about the security measures that protect your digital assets on the blockchain.",
    author: "Michael Garcia",
    date: "March 10, 2024",
    readTime: "6 min read",
    category: "Security",
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    title: "The Rise of Digital Art Marketplaces",
    excerpt: "How online platforms are revolutionizing the way we buy, sell, and trade digital art.",
    author: "Emma Wilson",
    date: "March 8, 2024",
    readTime: "8 min read",
    category: "Market",
    image: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 5,
    title: "NFT Gaming: A New Era of Entertainment",
    excerpt: "Discover how NFTs are transforming the gaming industry and creating new opportunities for players.",
    author: "David Park",
    date: "March 5, 2024",
    readTime: "10 min read",
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1642006953663-06f0387d5969?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 6,
    title: "The Environmental Impact of NFTs",
    excerpt: "An in-depth analysis of the environmental concerns surrounding NFTs and potential solutions.",
    author: "Lisa Green",
    date: "March 3, 2024",
    readTime: "9 min read",
    category: "Environment",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 7,
    title: "NFT Authentication and Verification",
    excerpt: "Understanding the technical aspects of NFT verification and avoiding fraud.",
    author: "James Chen",
    date: "March 1, 2024",
    readTime: "6 min read",
    category: "Security",
    image: "https://images.unsplash.com/photo-1641580529558-a89642aef810?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 8,
    title: "Digital Art Curation Strategies",
    excerpt: "Expert tips on building and maintaining a valuable digital art collection.",
    author: "Maria Rodriguez",
    date: "February 28, 2024",
    readTime: "7 min read",
    category: "Guide",
    image: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 9,
    title: "The Future of Digital Ownership",
    excerpt: "How blockchain technology is redefining ownership in the digital age.",
    author: "Thomas Wright",
    date: "February 25, 2024",
    readTime: "8 min read",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1642006953663-06f0387d5969?auto=format&fit=crop&q=80&w=800",
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] animate-pulse"></div>
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent"
          >
            Blog
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Latest insights, guides, and updates from the world of NFTs
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <div className="relative flex flex-col h-full rounded-2xl p-6 bg-card/60 backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-all duration-700">
                <div className="relative h-48 mb-6 overflow-hidden rounded-xl">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm bg-primary/90 text-white backdrop-blur-sm">
                    {post.category}
                  </div>
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold mb-3 text-foreground/90 group-hover:text-primary transition-colors duration-700">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {post.excerpt}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-4 pt-4 border-t border-primary/10">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {post.author}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime}
                    </span>
                  </div>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {post.date}
                  </span>
                </div>

                <Link 
                  to={`/blog/${post.id}`} 
                  className="absolute inset-0 z-10"
                  aria-label={`Read more about ${post.title}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
