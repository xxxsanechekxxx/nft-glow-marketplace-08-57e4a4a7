const Partners = () => {
  return (
    <div className="container mx-auto px-4 pt-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Partners</h1>
        <p className="text-muted-foreground">
          Working together to build the future of digital art
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="p-6 rounded-lg bg-card hover:bg-accent/5 transition-colors">
          <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
          <p className="text-muted-foreground">
            We're currently establishing partnerships with leading companies in the NFT and crypto space.
            Stay tuned for exciting announcements!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Partners;