const Blog = () => {
  return (
    <div className="container mx-auto px-4 pt-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-muted-foreground">
          Latest news and updates from PureNFT
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="p-6 rounded-lg bg-card hover:bg-accent/5 transition-colors">
          <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
          <p className="text-muted-foreground">
            Our blog is currently under development. Check back soon for articles about NFTs, 
            digital art, and blockchain technology.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Blog;