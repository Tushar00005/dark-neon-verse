
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { PostCard } from "@/components/social/PostCard";
import { Badge } from "@/components/ui/badge";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Image, Smile, MapPin, User, Users, Bookmark } from "lucide-react";

// Mock data for posts that would come from Supabase in a real app
const MOCK_POSTS = [
  {
    id: "1",
    author: {
      id: "user1",
      name: "Alex Johnson",
      username: "alexjohnson",
      avatar: "https://github.com/shadcn.png",
      verified: true
    },
    content: "Just launched my new portfolio website! Check it out and let me know what you think. 🚀 #webdev #design",
    likesCount: 42,
    commentsCount: 7,
    createdAt: "2023-04-17T09:24:00Z"
  },
  {
    id: "2",
    author: {
      id: "user2",
      name: "Sarah Williams",
      username: "sarahw",
      avatar: "https://github.com/shadcn.png"
    },
    content: "Amazing sunset view from my hike today! Nature is truly incredible. 🌄",
    mediaUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    likesCount: 128,
    commentsCount: 15,
    createdAt: "2023-04-16T18:30:00Z"
  },
  {
    id: "3",
    author: {
      id: "user3",
      name: "Tech Insider",
      username: "techinsider",
      avatar: "https://github.com/shadcn.png",
      verified: true
    },
    content: "Breaking: New AI model can generate photorealistic images from text in seconds. This could revolutionize content creation across industries. What do you think about the implications? #AI #tech #future",
    likesCount: 356,
    commentsCount: 48,
    createdAt: "2023-04-16T12:15:00Z"
  },
  {
    id: "4",
    author: {
      id: "user4",
      name: "Jessica Chen",
      username: "jessicac",
      avatar: "https://github.com/shadcn.png"
    },
    content: "Just finished reading 'The Midnight Library' and it's absolutely mind-blowing. Highly recommend to anyone who loves thought-provoking fiction! 📚",
    likesCount: 73,
    commentsCount: 12,
    createdAt: "2023-04-15T21:08:00Z"
  }
];

// Sidebar suggested users
const SUGGESTED_USERS = [
  {
    id: "sugg1",
    name: "Emma Watson",
    username: "emmaw",
    avatar: "https://github.com/shadcn.png",
    verified: true
  },
  {
    id: "sugg2",
    name: "Mark Davis",
    username: "markd",
    avatar: "https://github.com/shadcn.png"
  },
  {
    id: "sugg3",
    name: "Tech News",
    username: "technews",
    avatar: "https://github.com/shadcn.png",
    verified: true
  }
];

// Trending topics
const TRENDING_TOPICS = [
  { tag: "technology", count: "24.5K" },
  { tag: "design", count: "18.2K" },
  { tag: "programming", count: "12.1K" },
  { tag: "AI", count: "42.7K" },
  { tag: "webdev", count: "9.3K" }
];

export default function Feed() {
  const [postText, setPostText] = useState("");
  
  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    // This would connect to Supabase in a real app
    console.log("New post:", postText);
    setPostText("");
    // Add animation for success
  };
  
  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Left Sidebar - Desktop only */}
        <div className="hidden lg:block lg:col-span-2">
          <div className="sticky top-24 space-y-6">
            {/* User Card */}
            <Card variant="glass" className="overflow-hidden">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <img 
                      src="https://github.com/shadcn.png" 
                      alt="Your Avatar" 
                      className="h-full w-full object-cover"
                    />
                  </Avatar>
                  <div>
                    <div className="font-semibold">Your Name</div>
                    <div className="text-sm text-muted-foreground">@username</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 text-center border-t border-white/5 pt-4">
                  <div>
                    <div className="font-semibold">120</div>
                    <div className="text-xs text-muted-foreground">Posts</div>
                  </div>
                  <div>
                    <div className="font-semibold">1.5K</div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                  <div>
                    <div className="font-semibold">350</div>
                    <div className="text-xs text-muted-foreground">Following</div>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Navigation */}
            <Card variant="glass">
              <div className="p-1">
                <Button variant="ghost" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Friends
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Saved Posts
                </Button>
              </div>
            </Card>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* New Post Card */}
          <Card variant="glass">
            <div className="p-4">
              <form onSubmit={handleSubmitPost}>
                <div className="flex items-start gap-3">
                  <Avatar>
                    <img 
                      src="https://github.com/shadcn.png" 
                      alt="Your Avatar" 
                      className="h-full w-full object-cover"
                    />
                  </Avatar>
                  <div className="flex-1">
                    <Input
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}
                      placeholder="What's on your mind?"
                      className="bg-transparent border-none text-base focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                  <div className="flex gap-2">
                    <Button type="button" variant="ghost" size="sm" className="text-muted-foreground">
                      <Image className="h-4 w-4 mr-1" />
                      Photo
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="text-muted-foreground">
                      <Smile className="h-4 w-4 mr-1" />
                      Feeling
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="text-muted-foreground hidden sm:flex">
                      <MapPin className="h-4 w-4 mr-1" />
                      Location
                    </Button>
                  </div>
                  <Button 
                    type="submit" 
                    size="sm" 
                    disabled={!postText.trim()} 
                    className="bg-neon-purple hover:bg-neon-purple/90"
                  >
                    Post
                  </Button>
                </div>
              </form>
            </div>
          </Card>
          
          {/* Feed Posts */}
          <StaggerContainer className="space-y-4">
            {MOCK_POSTS.map((post) => (
              <StaggerItem key={post.id}>
                <PostCard {...post} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
        
        {/* Right Sidebar - Desktop only */}
        <div className="hidden lg:block lg:col-span-2">
          <div className="sticky top-24 space-y-6">
            {/* Trending Topics */}
            <Card variant="glass">
              <div className="p-5">
                <h3 className="font-semibold mb-4">Trending Topics</h3>
                <div className="space-y-3">
                  {TRENDING_TOPICS.map((topic) => (
                    <div key={topic.tag} className="flex items-center justify-between">
                      <span className="text-neon-purple">#{topic.tag}</span>
                      <Badge variant="blue">{topic.count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            
            {/* Suggested Users */}
            <Card variant="glass">
              <div className="p-5">
                <h3 className="font-semibold mb-4">Suggested for You</h3>
                <div className="space-y-4">
                  {SUGGESTED_USERS.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="h-full w-full object-cover"
                          />
                        </Avatar>
                        <div>
                          <div className="flex items-center text-sm font-medium">
                            {user.name}
                            {user.verified && (
                              <Badge variant="neon" className="ml-1 h-4 px-1">
                                <span className="text-[8px]">✓</span>
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">@{user.username}</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="h-8">Follow</Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
