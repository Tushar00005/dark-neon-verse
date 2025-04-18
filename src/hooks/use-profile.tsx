
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "./use-auth";

export type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  user_is_following: boolean;
};

export function useProfile(userId?: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const targetUserId = userId || user?.id;
  
  // Fetch profile data
  const {
    data: profile,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["profile", targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          followers_count:followers!following_id(count),
          following_count:followers!follower_id(count),
          posts_count:posts(count)
        `)
        .eq("id", targetUserId)
        .single();
        
      if (error) throw error;
      
      // If user is logged in and viewing someone else's profile, check if they follow them
      let isFollowing = false;
      
      if (user && user.id !== targetUserId) {
        const { data: followData } = await supabase
          .from("followers")
          .select("*")
          .eq("follower_id", user.id)
          .eq("following_id", targetUserId)
          .single();
          
        isFollowing = !!followData;
      }
      
      return {
        ...data,
        followers_count: data.followers_count[0]?.count || 0,
        following_count: data.following_count[0]?.count || 0,
        posts_count: data.posts_count[0]?.count || 0,
        user_is_following: isFollowing
      };
    },
    enabled: !!targetUserId
  });
  
  // Fetch user posts
  const {
    data: userPosts,
    isLoading: postsLoading
  } = useQuery({
    queryKey: ["userPosts", targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];
      
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles:user_id(username, full_name, avatar_url),
          likes_count:likes(count),
          comments_count:comments(count)
        `)
        .eq("user_id", targetUserId)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      // If user is logged in, check if they've liked each post
      if (user) {
        const postsWithLikeInfo = await Promise.all(
          data.map(async (post) => {
            const { data: likeData } = await supabase
              .from("likes")
              .select("*")
              .eq("post_id", post.id)
              .eq("user_id", user.id)
              .single();
              
            return {
              ...post,
              likes_count: post.likes_count[0]?.count || 0,
              comments_count: post.comments_count[0]?.count || 0,
              user_has_liked: !!likeData
            };
          })
        );
        return postsWithLikeInfo;
      }
      
      // If no user, just return posts with counts
      return data.map(post => ({
        ...post,
        likes_count: post.likes_count[0]?.count || 0,
        comments_count: post.comments_count[0]?.count || 0,
        user_has_liked: false
      }));
    },
    enabled: !!targetUserId
  });
  
  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (profileData: Partial<Profile>) => {
      if (!user) throw new Error("You must be logged in");
      if (user.id !== targetUserId) throw new Error("You can only update your own profile");
      
      const { error } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", user.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", targetUserId] });
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error(`Error updating profile: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  });
  
  // Toggle follow mutation
  const toggleFollow = useMutation({
    mutationFn: async ({ targetId, isFollowing }: { targetId: string; isFollowing: boolean }) => {
      if (!user) throw new Error("You must be logged in to follow");
      if (user.id === targetId) throw new Error("You cannot follow yourself");
      
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from("followers")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", targetId);
          
        if (error) throw error;
      } else {
        // Follow
        const { error } = await supabase
          .from("followers")
          .insert({
            follower_id: user.id,
            following_id: targetId
          });
          
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", targetUserId] });
      queryClient.invalidateQueries({ queryKey: ["userPosts", targetUserId] });
    },
    onError: (error) => {
      toast.error(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  });
  
  return {
    profile,
    userPosts,
    isLoading: isLoading || postsLoading,
    error,
    refetch,
    updateProfile,
    toggleFollow
  };
}
