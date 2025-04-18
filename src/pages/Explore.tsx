
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageTransition } from "@/components/ui/motion";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostItem } from "@/components/social/PostItem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePosts } from "@/hooks/use-posts";
import { Search, Loader, TrendingUp, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

type SearchResults = {
  posts: any[];
  users: any[];
};

export default function Explore() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults>({ posts: [], users: [] });
  const [isSearching, setIsSearching] = useState(false);
  const { posts, isLoading: postsLoading, toggleLike } = usePosts();
  
  // Fetch trending hashtags (mock data for now)
  const trendingHashtags = [
    { tag: "tech", count: 2345 },
    { tag: "design", count: 1892 },
    { tag: "cyberpunk", count: 1654 },
    { tag: "ai", count: 1432 },
    { tag: "metaverse", count: 1245 },
  ];
  
  // Fetch suggested users
  const { data: suggestedUsers, isLoading: usersLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id, username, full_name, avatar_url,
          followers:followers!following_id(count)
        `)
        .neq("id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
        
      if (error) throw error;
      
      return data.map(user => ({
        ...user,
        followers_count: user.followers[0]?.count || 0
      }));
    },
    enabled: !!user
  });
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      // Search users
      const { data: users } = await supabase
        .from("profiles")
        .select("*")
        .or(`username.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`)
        .limit(5);
      
      // Search posts
      const { data: posts } = await supabase
        .from("posts")
        .select(`
          *,
          profiles:user_id(username, full_name, avatar_url)
        `)
        .ilike("content", `%${searchQuery}%`)
        .limit(10);
      
      setSearchResults({
        users: users || [],
        posts: posts || []
      });
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleLike = (postId: string, liked: boolean) => {
    toggleLike.mutate({ postId, liked });
  };
  
  return (
    <Layout>
      <PageTransition className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">Explore</h1>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users, topics, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              className="pl-10"
            />
          </div>
        </div>
        
        {searchQuery && isSearching ? (
          <div className="flex justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-neon-purple" />
          </div>
        ) : searchQuery && (searchResults.users.length > 0 || searchResults.posts.length > 0) ? (
          <div className="space-y-6">
            <h2 className="text-xl font-medium mb-4">Search Results for "{searchQuery}"</h2>
            
            {searchResults.users.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">Users</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.users.map((user) => (
                    <Card key={user.id} variant="glassDark" className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar_url || ""} />
                            <AvatarFallback>{user.full_name?.charAt(0) || user.username.charAt(0)}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-grow">
                            <Link to={`/profile/${user.id}`} className="font-medium hover:text-neon-purple">
                              {user.full_name || user.username}
                            </Link>
                            <p className="text-xs text-muted-foreground">@{user.username}</p>
                          </div>
                          
                          <Button size="sm" variant="outline">View</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {searchResults.posts.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Posts</h3>
                <div className="space-y-4">
                  {searchResults.posts.map((post) => (
                    <PostItem 
                      key={post.id} 
                      post={{
                        ...post,
                        likes_count: 0,
                        comments_count: 0,
                        user_has_liked: false
                      }} 
                      onLike={handleLike} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
          </div>
        ) : (
          <Tabs defaultValue="trending">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="trending" className="flex-1">Trending</TabsTrigger>
              <TabsTrigger value="latest" className="flex-1">Latest</TabsTrigger>
              <TabsTrigger value="discover" className="flex-1">Discover People</TabsTrigger>
            </TabsList>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TabsContent value="trending" className="space-y-4">
                  {postsLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader className="h-8 w-8 animate-spin text-neon-purple" />
                    </div>
                  ) : posts ? (
                    posts.slice(0, 5).map((post) => (
                      <PostItem key={post.id} post={post} onLike={handleLike} />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No trending posts found</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="latest" className="space-y-4">
                  {postsLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader className="h-8 w-8 animate-spin text-neon-purple" />
                    </div>
                  ) : posts ? (
                    posts.map((post) => (
                      <PostItem key={post.id} post={post} onLike={handleLike} />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No posts found</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="discover" className="space-y-4">
                  {usersLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader className="h-8 w-8 animate-spin text-neon-purple" />
                    </div>
                  ) : suggestedUsers && suggestedUsers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {suggestedUsers.map((user) => (
                        <Card key={user.id} variant="glassDark">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Avatar>
                                <AvatarImage src={user.avatar_url || ""} />
                                <AvatarFallback>{user.full_name?.charAt(0) || user.username.charAt(0)}</AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-grow">
                                <Link to={`/profile/${user.id}`} className="font-medium hover:text-neon-purple">
                                  {user.full_name || user.username}
                                </Link>
                                <p className="text-xs text-muted-foreground">@{user.username}</p>
                                <div className="flex items-center mt-1">
                                  <UserCheck size={14} className="mr-1 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {user.followers_count} followers
                                  </span>
                                </div>
                              </div>
                              
                              <Button size="sm" className="bg-neon-purple hover:bg-neon-purple/90">
                                Follow
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No suggested users found</p>
                    </div>
                  )}
                </TabsContent>
              </div>
              
              <div className="space-y-6">
                {/* Trending Hashtags */}
                <Card variant="glassDark">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp size={18} className="text-neon-purple" />
                      <h3 className="text-lg font-medium">Trending Topics</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {trendingHashtags.map((tag) => (
                        <div key={tag.tag} className="flex justify-between items-center">
                          <Badge variant="neon" className="text-sm px-2 py-1 hover:bg-neon-purple/30 cursor-pointer">
                            #{tag.tag}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{tag.count} posts</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Who to Follow */}
                <Card variant="glassDark">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium mb-4">Who to Follow</h3>
                    
                    {usersLoading ? (
                      <div className="flex justify-center py-4">
                        <Loader className="h-6 w-6 animate-spin text-neon-purple" />
                      </div>
                    ) : suggestedUsers && suggestedUsers.length > 0 ? (
                      <div className="space-y-4">
                        {suggestedUsers.slice(0, 3).map((user) => (
                          <div key={user.id} className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatar_url || ""} />
                              <AvatarFallback>{user.full_name?.charAt(0) || user.username.charAt(0)}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-grow">
                              <Link to={`/profile/${user.id}`} className="font-medium hover:text-neon-purple">
                                {user.full_name || user.username}
                              </Link>
                              <p className="text-xs text-muted-foreground">@{user.username}</p>
                            </div>
                            
                            <Button size="sm" variant="outline">
                              Follow
                            </Button>
                          </div>
                        ))}
                        
                        <Button variant="ghost" size="sm" className="w-full text-neon-purple" asChild>
                          <Link to="/explore?tab=discover">Show More</Link>
                        </Button>
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-4">No suggestions available</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </Tabs>
        )}
      </PageTransition>
    </Layout>
  );
}
