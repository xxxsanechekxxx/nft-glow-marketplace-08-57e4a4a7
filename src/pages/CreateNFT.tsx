import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload, Plus, Wand2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Textarea } from "@/components/ui/textarea";

interface Property {
  key: string;
  value: string;
}

const CreateNFT = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    creator: "",
    description: "",
    image: "",
  });

  const handleAddProperty = () => {
    setProperties([...properties, { key: "", value: "" }]);
  };

  const handlePropertyChange = (index: number, field: 'key' | 'value', value: string) => {
    const newProperties = [...properties];
    newProperties[index][field] = value;
    setProperties(newProperties);
  };

  const handleRemoveProperty = (index: number) => {
    setProperties(properties.filter((_, i) => i !== index));
  };

  const generateCreatorName = () => {
    const adjectives = ["Cosmic", "Digital", "Mystic", "Cyber", "Quantum", "Neo", "Virtual", "Crypto"];
    const nouns = ["Artist", "Creator", "Master", "Genius", "Wizard", "Pioneer", "Visionary", "Maven"];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 1000);
    setFormData(prev => ({ 
      ...prev, 
      creator: `${randomAdjective}${randomNoun}${randomNumber}` 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.from('nfts').insert([
        {
          name: formData.name,
          price: formData.price,
          creator: formData.creator,
          description: formData.description,
          image: formData.image || 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=800&auto=format&fit=crop',
          properties: properties.length > 0 ? properties : null,
        }
      ]);

      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Your NFT has been created.",
      });
      
      navigate("/marketplace");
    } catch (error) {
      console.error('Error creating NFT:', error);
      toast({
        title: "Error",
        description: "Failed to create NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Create New NFT</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">NFT Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter NFT name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="creator">Creator Name</Label>
            <div className="flex gap-2">
              <Input
                id="creator"
                value={formData.creator}
                onChange={(e) => setFormData(prev => ({ ...prev, creator: e.target.value }))}
                placeholder="Enter creator name"
                required
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={generateCreatorName}
                className="flex-shrink-0"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Generate
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (ETH)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              placeholder="Enter price in ETH"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter NFT description"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Properties</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddProperty}
                className="flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Property
              </Button>
            </div>
            <div className="space-y-3">
              {properties.map((property, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Property name"
                    value={property.key}
                    onChange={(e) => handlePropertyChange(index, 'key', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Value"
                    value={property.value}
                    onChange={(e) => handlePropertyChange(index, 'value', e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveProperty(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              {formData.image ? (
                <div className="space-y-4">
                  <img
                    src={formData.image}
                    alt="NFT Preview"
                    className="mx-auto max-h-64 object-contain"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Upload Image</h3>
                    <p className="text-sm text-muted-foreground">
                      Drag and drop or click to upload
                    </p>
                  </div>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById("image")?.click()}
                  >
                    Select File
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create NFT"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateNFT;