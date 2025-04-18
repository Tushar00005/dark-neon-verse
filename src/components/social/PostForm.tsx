
import { useState } from "react";
import { Image, Smile, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";

interface PostFormProps {
  onSubmit: (content: string, mediaUrl?: string) => void;
  isLoading?: boolean;
}

export function PostForm({ onSubmit, isLoading = false }: PostFormProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [isPreviewingMedia, setIsPreviewingMedia] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    onSubmit(content, mediaUrl || undefined);
    setContent("");
    setMediaUrl("");
    setIsPreviewingMedia(false);
  };
  
  const handleMediaUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMediaUrl(e.target.value);
    setIsPreviewingMedia(!!e.target.value);
  };
  
  const clearMedia = () => {
    setMediaUrl("");
    setIsPreviewingMedia(false);
  };
  
  return (
    <Card variant="glassDark" className="mb-6">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-24 mb-3 resize-none bg-transparent border-white/10 focus-visible:ring-neon-purple focus-visible:ring-offset-0"
            />
            
            {isPreviewingMedia && mediaUrl && (
              <div className="relative mb-3 rounded-md overflow-hidden border border-white/10">
                <img 
                  src={mediaUrl} 
                  alt="Media preview" 
                  className="w-full h-auto max-h-64 object-cover"
                  onError={() => setIsPreviewingMedia(false)}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={clearMedia}
                >
                  <X size={16} />
                </Button>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={mediaUrl}
                    onChange={handleMediaUrlChange}
                    placeholder="Image URL"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => {
                      const url = prompt("Enter image URL:");
                      if (url) {
                        setMediaUrl(url);
                        setIsPreviewingMedia(true);
                      }
                    }}
                  >
                    <Image size={16} className="mr-1" />
                    Add Image
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-muted-foreground"
                >
                  <Smile size={16} className="mr-1" />
                  Emoji
                </Button>
              </div>
              
              <Button 
                type="submit"
                disabled={!content.trim() || isLoading}
                className="bg-neon-purple hover:bg-neon-purple/90"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
}
