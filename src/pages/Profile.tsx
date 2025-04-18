
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PostItem } from "@/components/social/PostItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Loader, MapPin, Calendar, Link2 } from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import { usePosts } from "@/hooks/use-posts";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/use-auth";

export default function Profile() {
  const { userId } = useParams();
  const { user } = useAuth();
  const { profile, userPosts, isLoading, toggleFollow, updateProfile } = useProfile(userId);
  const { toggleLike } = usePosts();
  
  const [editForm, setEditForm] = useState({
    full_name: "",
    username: "",
    bio: "",
    avatar_url: ""
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const handleFollowToggle = () => {
    if (!profile) return;
    toggleFollow.mutate({
      targetId: profile.id,
      isFollowing: profile.user_is_following
    });
  };
  
  const handleLike = (postId: string, liked: boolean) => {
    toggleLike.mutate({ postId, liked });
  };
  
  const handleEditProfile = () => {
    if (!profile) return;
    
    setEditForm({
      full_name: profile.full_name || "",
      username: profile.username,
      bio: profile.bio || "",
      avatar_url: profile.avatar_url || ""
    });
    
    setIsEditDialogOpen(true);
  };
  
  const handleSaveProfile = () => {
    updateProfile.mutate(editForm);
    setIsEditDialogOpen(false);
  };
  
  const isCurrentUser = profile && user && profile.id === user.id;
  
  if (isLoading || !profile) {
    return (
      <Layout>
        <div className="flex justify-center py-16">
          <Loader className="h-8 w-8 animate-spin text-neon-purple" />
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Cover Image */}
        <div className="h-48 md:h-64 rounded-lg overflow-hidden mb-6 bg-gradient-to-r from-neon-purple/30 to-blue-500/30">
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
            alt="Cover"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        
        {/* Profile Header */}
        <div className="relative px-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="absolute -top-16 left-8 md:relative md:top-0 md:left-0">
              <Avatar className="h-24 w-24 ring-4 ring-background">
                <AvatarImage src={profile.avatar_url || ""} alt={profile.username} />
                <AvatarFallback className="text-2xl">
                  {profile.full_name?.charAt(0).toUpperCase() || profile.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            
            {/* Profile Info */}
            <div className="mt-10 md:mt-0 flex-grow">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    {profile.full_name || profile.username}
                  </h1>
                  <p className="text-muted-foreground">@{profile.username}</p>
                </div>
                
                <div>
                  {isCurrentUser ? (
                    <Button onClick={handleEditProfile} variant="outline" className="gap-2">
                      <Edit size={16} />
                      Edit Profile
                    </Button>
                  ) : (
                    <Button
                      onClick={handleFollowToggle}
                      variant={profile.user_is_following ? "outline" : "default"}
                      className={profile.user_is_following ? "" : "bg-neon-purple hover:bg-neon-purple/90"}
                    >
                      {profile.user_is_following ? "Following" : "Follow"}
                    </Button>
                  )}
                </div>
              </div>
              
              {profile.bio && (
                <p className="mt-4 text-sm">{profile.bio}</p>
              )}
              
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  <span>Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}</span>
                </div>
              </div>
              
              <div className="flex gap-6 mt-6">
                <div>
                  <span className="font-semibold">{profile.posts_count}</span>{" "}
                  <span className="text-muted-foreground">Posts</span>
                </div>
                <div>
                  <span className="font-semibold">{profile.followers_count}</span>{" "}
                  <span className="text-muted-foreground">Followers</span>
                </div>
                <div>
                  <span className="font-semibold">{profile.following_count}</span>{" "}
                  <span className="text-muted-foreground">Following</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* User Content Tabs */}
        <div className="mt-8">
          <Tabs defaultValue="posts">
            <TabsList className="w-full border-b border-white/10 bg-transparent">
              <TabsTrigger value="posts" className="flex-1">Posts</TabsTrigger>
              <TabsTrigger value="media" className="flex-1">Media</TabsTrigger>
              <TabsTrigger value="likes" className="flex-1">Likes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts" className="mt-6 space-y-4">
              {userPosts && userPosts.length > 0 ? (
                <StaggerContainer staggerDelay={0.1} initialDelay={0.3}>
                  {userPosts.map((post) => (
                    <StaggerItem key={post.id}>
                      <PostItem post={post} onLike={handleLike} />
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No posts yet.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="media" className="mt-6">
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">Media gallery will be displayed here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="likes" className="mt-6">
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">Liked posts will be displayed here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Edit Profile Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Avatar URL</label>
                <Input
                  value={editForm.avatar_url}
                  onChange={(e) => setEditForm({...editForm, avatar_url: e.target.value})}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Display Name</label>
                <Input
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                  placeholder="Your name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <Input
                  value={editForm.username}
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                  placeholder="username"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <Textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} className="bg-neon-purple hover:bg-neon-purple/90">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
