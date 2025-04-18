
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Link as LinkIcon } from "lucide-react";

interface ProfileHeaderProps {
  user: {
    id: string;
    name: string;
    username: string;
    bio: string;
    avatar?: string;
    coverImage?: string;
    location?: string;
    website?: string;
    joinedAt: string;
    verified?: boolean;
    isAdmin?: boolean;
  };
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
  isCurrentUser?: boolean;
  isFollowing?: boolean;
}

export function ProfileHeader({ 
  user, 
  stats, 
  isCurrentUser = false,
  isFollowing = false 
}: ProfileHeaderProps) {
  const [following, setFollowing] = useState(isFollowing);
  const [followersCount, setFollowersCount] = useState(stats.followers);
  
  const handleFollowClick = () => {
    // This would normally connect to Supabase database
    if (following) {
      setFollowersCount(prev => prev - 1);
    } else {
      setFollowersCount(prev => prev + 1);
    }
    setFollowing(!following);
  };
  
  // Format date to readable string
  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  return (
    <div className="w-full">
      {/* Cover Image */}
      <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden mb-16">
        <img
          src={user.coverImage || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        
        {/* Profile Picture */}
        <div className="absolute -bottom-16 left-4 md:left-8 border-4 border-dark rounded-full">
          <Avatar className="w-32 h-32">
            <img 
              src={user.avatar || "https://github.com/shadcn.png"} 
              alt={user.name} 
              className="h-full w-full object-cover"
            />
          </Avatar>
        </div>
        
        {/* Action Button */}
        <div className="absolute bottom-4 right-4">
          {isCurrentUser ? (
            <Button variant="outline" className="bg-dark/50 backdrop-blur-sm border-white/10">
              Edit Profile
            </Button>
          ) : (
            <Button 
              variant={following ? "outline" : "default"} 
              className={following ? "bg-dark/50 backdrop-blur-sm border-white/10" : "bg-neon-purple hover:bg-neon-purple/90"}
              onClick={handleFollowClick}
            >
              {following ? "Following" : "Follow"}
            </Button>
          )}
        </div>
      </div>
      
      {/* Profile Info */}
      <div className="px-4 md:px-8">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            {user.verified && (
              <Badge variant="neon" className="h-5 px-1.5">
                <span className="text-[10px]">✓</span>
              </Badge>
            )}
            {user.isAdmin && (
              <Badge variant="blue">Admin</Badge>
            )}
          </div>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>
        
        {/* Bio */}
        {user.bio && (
          <p className="mb-4">{user.bio}</p>
        )}
        
        {/* Additional Info */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-sm text-muted-foreground">
          {user.location && (
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{user.location}</span>
            </div>
          )}
          {user.website && (
            <div className="flex items-center gap-1">
              <LinkIcon size={14} />
              <a 
                href={user.website.startsWith('http') ? user.website : `https://${user.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neon-purple hover:underline"
              >
                {user.website.replace(/(^\w+:|^)\/\//, '')}
              </a>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>Joined {formatJoinDate(user.joinedAt)}</span>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex gap-4 mb-6 text-sm">
          <div>
            <span className="font-bold">{stats.posts}</span>{" "}
            <span className="text-muted-foreground">Posts</span>
          </div>
          <div>
            <span className="font-bold">{followersCount}</span>{" "}
            <span className="text-muted-foreground">Followers</span>
          </div>
          <div>
            <span className="font-bold">{stats.following}</span>{" "}
            <span className="text-muted-foreground">Following</span>
          </div>
        </div>
      </div>
      
      {/* Profile Tabs */}
      <div className="border-b border-white/10">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b border-white/5">
            <TabsTrigger 
              value="posts"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-neon-purple data-[state=active]:shadow-none px-4 py-3"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger 
              value="media"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-neon-purple data-[state=active]:shadow-none px-4 py-3"
            >
              Media
            </TabsTrigger>
            <TabsTrigger 
              value="likes"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-neon-purple data-[state=active]:shadow-none px-4 py-3"
            >
              Likes
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
