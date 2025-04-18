
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface PostProps {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    verified?: boolean;
  };
  content: string;
  mediaUrl?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  className?: string;
}

export function PostCard({
  id,
  author,
  content,
  mediaUrl,
  likesCount,
  commentsCount,
  createdAt,
  className,
}: PostProps) {
  const [liked, setLiked] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(likesCount);

  // Toggle like action
  const handleLike = () => {
    if (liked) {
      setLocalLikesCount(prev => prev - 1);
    } else {
      setLocalLikesCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  // Format date to relative time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval}y`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval}mo`;
    
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval}d`;
    
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval}h`;
    
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval}m`;
    
    return `${Math.floor(seconds)}s`;
  };

  return (
    <motion.div
      className={className}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card variant="glass" className="overflow-hidden">
        <div className="p-4">
          {/* Post Header */}
          <div className="flex items-start justify-between mb-3">
            <Link to={`/profile/${author.id}`} className="flex items-center gap-2 group">
              <Avatar>
                <img 
                  src={author.avatar || "https://github.com/shadcn.png"} 
                  alt={author.name} 
                  className="h-full w-full object-cover"
                />
              </Avatar>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-semibold group-hover:text-neon-purple transition-colors">
                    {author.name}
                  </span>
                  {author.verified && (
                    <Badge variant="neon" className="h-5 px-1.5">
                      <span className="text-[10px]">✓</span>
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                  <span>@{author.username}</span>
                  <span>•</span>
                  <span>{formatDate(createdAt)}</span>
                </div>
              </div>
            </Link>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MoreHorizontal size={16} />
            </Button>
          </div>
          
          {/* Post Content */}
          <div className="mb-3">
            <p className="text-foreground whitespace-pre-line">{content}</p>
          </div>
          
          {/* Post Media */}
          {mediaUrl && (
            <div className="mt-3 mb-3 rounded-lg overflow-hidden">
              <img 
                src={mediaUrl} 
                alt="Post media" 
                className="w-full h-auto object-cover" 
              />
            </div>
          )}
          
          {/* Post Actions */}
          <div className="flex items-center gap-4 mt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "flex items-center gap-1.5 rounded-full text-muted-foreground", 
                liked && "text-red-500 hover:text-red-400"
              )}
              onClick={handleLike}
            >
              <Heart 
                size={18} 
                className={cn(liked && "fill-current")} 
              />
              <span>{localLikesCount}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1.5 rounded-full text-muted-foreground"
              asChild
            >
              <Link to={`/post/${id}`}>
                <MessageCircle size={18} />
                <span>{commentsCount}</span>
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1.5 rounded-full text-muted-foreground"
            >
              <Share2 size={18} />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
