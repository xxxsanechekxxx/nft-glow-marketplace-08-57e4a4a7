
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarIcon, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Alex Thompson",
    role: "Digital Artist",
    avatar: "/lovable-uploads/c6dc18ec-17e1-432d-bb25-474f413e9615.png",
    content: "PureNFT completely transformed my career as a digital artist. Their platform made it easy to monetize my work and connect with a global audience of collectors.",
    rating: 5
  },
  {
    name: "Sarah Williams",
    role: "NFT Collector",
    avatar: "/lovable-uploads/7d7924fa-23c2-468e-b4e6-439e242022e9.png",
    content: "I've used several NFT marketplaces, but PureNFT stands out for their security and user experience. The verification process ensures I'm only buying authentic pieces.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Blockchain Developer",
    avatar: "/lovable-uploads/2a47993b-b343-4016-9b9c-e3a372d31ba7.png",
    content: "From a technical perspective, PureNFT's implementation of smart contracts is impeccable. Their gas fee optimization and security protocols are industry-leading.",
    rating: 5
  }
];

export const Testimonials = () => {
  return (
    <div className="py-24 bg-background/30 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-purple-500/5 to-pink-500/5"></div>
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px] animate-[pulse_10s_ease-in-out_infinite] delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500 leading-tight">
            Community Testimonials
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl">
            Hear what our users have to say about their experience with PureNFT
          </p>
          
          {/* Added divider with glow effect */}
          <div className="relative h-1 w-24 mx-auto mt-8 mb-2">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-purple-500 to-pink-500/50 rounded-full"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="bg-background/50 backdrop-blur-xl border border-primary/10 hover:border-primary/30 transition-all duration-700 hover:translate-y-[-8px] group overflow-hidden shadow-xl shadow-primary/5 hover:shadow-primary/10"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardContent className="p-8 relative">
                {/* Enhanced gradient hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-700 group-hover:duration-200"></div>
                
                <div className="relative z-10">
                  <div className="absolute top-0 right-0">
                    <Quote className="w-10 h-10 text-primary/20 rotate-180" />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-8">
                    <Avatar className="h-16 w-16 border-2 border-primary/20 ring-4 ring-primary/5">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className="bg-primary/20 text-lg font-semibold">{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-lg">{testimonial.name}</p>
                      <p className="text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500 mr-1" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground group-hover:text-foreground/90 transition-colors duration-500 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
