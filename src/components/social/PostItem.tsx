
import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageSquare, Share2, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScaleIn } from "@/components/ui/motion";
import { type Post } from "@/hooks/use-posts";
import { useAuth } from "@/hooks/use-auth";

interface PostItemProps {
  post: Post;
  onLike: (postId: string, liked: boolean) => void;
}

export function PostItem({ post, onLike }: PostItemProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.user_has_liked);
  const [likeCount, setLikeCount] = useState(post.likes_count);
  
  const handleLike = () => {
    if (!user) return;
    
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
    onLike(post.id, isLiked);
  };
  
  const getInitials = () => {
    if (!post.profiles.full_name) return post.profiles.username.charAt(0).toUpperCase();
    const nameParts = post.profiles.full_name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
    }
    return nameParts[0].charAt(0).toUpperCase();
  };
  
  return (
    <ScaleIn>
      <Card variant="glassDark" className="overflow-hidden">
        {/* Post header with user info */}
        <div className="p-4 flex items-center justify-between">
          <Link to={`/profile/${post.user_id}`} className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.profiles.avatar_url} alt={post.profiles.username} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{post.profiles.full_name || post.profiles.username}</span>
              <span className="text-xs text-muted-foreground">@{post.profiles.username}</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="neon" className="text-xs">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal size={16} />
            </Button>
          </div>
        </div>
        
        {/* Post content */}
        <div className="px-4 pb-3">
          <p className="whitespace-pre-wrap mb-3">{post.content}</p>
          
          {post.media_url && (
            <div className="rounded-md overflow-hidden mb-3">
              <img 
                src={post.media_url} 
                alt="Post media" 
                className="w-full h-auto max-h-96 object-cover"
                onError={(e) => {
                  // Handle image loading errors
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
          )}
        </div>
        
        {/* Post actions */}
        <div className="px-4 pb-4 pt-2 border-t border-white/5 flex items-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 ${isLiked ? 'text-neon-purple' : ''}`}
            onClick={handleLike}
          >
            <Heart size={18} className={isLiked ? 'fill-neon-purple' : ''} />
            <span>{likeCount}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="gap-2">
            <MessageSquare size={18} />
            <span>{post.comments_count}</span>
          </Button>
          
          <Button variant="ghost" size="sm">
            <Share2 size={18} />
          </Button>
        </div>
      </Card>
    </ScaleIn>
  );
}
