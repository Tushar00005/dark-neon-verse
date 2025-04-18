
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/social/PostCard";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Search, TrendingUp, Users, Image as ImageIcon, Hash } from "lucide-react";

// Mock trending posts - would come from Supabase in a real app
const MOCK_TRENDING_POSTS = [
  {
    id: "t1",
    author: {
      id: "tech1",
      name: "Tech Insider",
      username: "techinsider",
      avatar: "https://github.com/shadcn.png",
      verified: true
    },
    content: "Breaking: New AI model can generate photorealistic images from text in seconds. This could revolutionize content creation across industries. What do you think about the implications? #AI #tech #future",
    likesCount: 2445,
    commentsCount: 342,
    createdAt: "2023-04-16T12:15:00Z"
  },
  {
    id: "t2",
    author: {
      id: "travel1",
      name: "Wanderlust",
      username: "wanderlust",
      avatar: "https://github.com/shadcn.png",
      verified: true
    },
    content: "This hidden beach in Thailand is a paradise that most tourists never discover. The most beautiful sunset I've ever seen! 🏝️ #travel #thailand #beach",
    mediaUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    likesCount: 3872,
    commentsCount: 256,
    createdAt: "2023-04-17T08:30:00Z"
  },
  {
    id: "t3",
    author: {
      id: "news1",
      name: "Global News",
      username: "globalnews",
      avatar: "https://github.com/shadcn.png",
      verified: true
    },
    content: "Scientists discover a new renewable energy technique that could potentially solve our energy crisis. The method converts atmospheric CO2 into fuel with 90% efficiency. #science #climate #energy",
    likesCount: 5243,
    commentsCount: 721,
    createdAt: "2023-04-18T09:15:00Z"
  }
];

// Mock recent posts with photos - would come from Supabase in a real app
const MOCK_PHOTO_POSTS = [
  {
    id: "p1",
    author: {
      id: "photo1",
      name: "Nature Captures",
      username: "naturecaptures",
      avatar: "https://github.com/shadcn.png"
    },
    content: "Spring is finally here! The cherry blossoms in full bloom at the park today. 🌸",
    mediaUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    likesCount: 843,
    commentsCount: 42,
    createdAt: "2023-04-18T14:20:00Z"
  },
  {
    id: "p2",
    author: {
      id: "photo2",
      name: "Urban Perspective",
      username: "urbanperspective",
      avatar: "https://github.com/shadcn.png"
    },
    content: "City lights never get old. Shot this from the rooftop last night. 🌃",
    mediaUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    likesCount: 1204,
    commentsCount: 87,
    createdAt: "2023-04-17T22:45:00Z"
  }
];

// Mock trending topics
const TRENDING_TOPICS = [
  { tag: "technology", count: "24.5K" },
  { tag: "design", count: "18.2K" },
  { tag: "programming", count: "12.1K" },
  { tag: "AI", count: "42.7K" },
  { tag: "webdev", count: "9.3K" },
  { tag: "travel", count: "31.8K" },
  { tag: "photography", count: "22.6K" },
  { tag: "music", count: "19.4K" },
  { tag: "books", count: "7.2K" },
  { tag: "startup", count: "16.9K" }
];

// Mock suggested accounts to follow
const SUGGESTED_ACCOUNTS = [
  {
    id: "sugg1",
    name: "Emma Watson",
    username: "emmaw",
    avatar: "https://github.com/shadcn.png",
    followers: "1.2M",
    verified: true
  },
  {
    id: "sugg2",
    name: "Tech News",
    username: "technews",
    avatar: "https://github.com/shadcn.png",
    followers: "845K",
    verified: true
  },
  {
    id: "sugg3",
    name: "Travel Stories",
    username: "travelstories",
    avatar: "https://github.com/shadcn.png",
    followers: "512K"
  },
  {
    id: "sugg4",
    name: "Design Inspiration",
    username: "designinspire",
    avatar: "https://github.com/shadcn.png",
    followers: "378K",
    verified: true
  }
];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Search Header */}
        <Card variant="glass" className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search people, posts, and hashtags..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Card>
        
        {/* Main Content */}
        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="trending" className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4" /> 
              <span className="hidden sm:inline">Trending</span>
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-1.5">
              <ImageIcon className="h-4 w-4" /> 
              <span className="hidden sm:inline">Photos</span>
            </TabsTrigger>
            <TabsTrigger value="topics" className="flex items-center gap-1.5">
              <Hash className="h-4 w-4" /> 
              <span className="hidden sm:inline">Topics</span>
            </TabsTrigger>
            <TabsTrigger value="people" className="flex items-center gap-1.5">
              <Users className="h-4 w-4" /> 
              <span className="hidden sm:inline">People</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trending" className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Trending Now</h2>
            <StaggerContainer className="space-y-4">
              {MOCK_TRENDING_POSTS.map((post) => (
                <StaggerItem key={post.id}>
                  <PostCard {...post} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </TabsContent>
          
          <TabsContent value="photos" className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Popular Photos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_PHOTO_POSTS.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="topics" className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Trending Topics</h2>
            <Card variant="glass">
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {TRENDING_TOPICS.map((topic) => (
                    <Card key={topic.tag} variant="glassDark" className="overflow-hidden hover:border-neon-purple/50 transition-colors">
                      <div className="p-4 text-center">
                        <div className="text-lg text-neon-purple font-semibold mb-1">#{topic.tag}</div>
                        <Badge variant="blue">{topic.count} posts</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="people" className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Suggested Accounts</h2>
            <Card variant="glass">
              <div className="divide-y divide-white/5">
                {SUGGESTED_ACCOUNTS.map((account) => (
                  <div key={account.id} className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full overflow-hidden">
                        <img 
                          src={account.avatar} 
                          alt={account.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-semibold">{account.name}</span>
                          {account.verified && (
                            <Badge variant="neon" className="ml-1 h-5 px-1.5">
                              <span className="text-[10px]">✓</span>
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">@{account.username}</div>
                        <div className="text-xs text-muted-foreground">{account.followers} followers</div>
                      </div>
                    </div>
                    <button className="bg-neon-purple hover:bg-neon-purple/90 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
