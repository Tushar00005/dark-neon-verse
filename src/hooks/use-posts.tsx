
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "./use-auth";

export type Post = {
  id: string;
  content: string;
  created_at: string;
  media_url: string | null;
  user_id: string;
  profiles: {
    username: string;
    full_name: string;
    avatar_url: string;
  };
  likes_count: number;
  comments_count: number;
  user_has_liked: boolean;
};

export function usePosts() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Fetch all posts
  const {
    data: posts,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles:user_id(username, full_name, avatar_url),
          likes_count:likes(count),
          comments_count:comments(count)
        `)
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
    enabled: true
  });
  
  // Create post mutation
  const createPost = useMutation({
    mutationFn: async ({ content, mediaUrl }: { content: string; mediaUrl?: string }) => {
      if (!user) throw new Error("You must be logged in to create a post");
      
      const { data, error } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          content,
          media_url: mediaUrl
        })
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post created successfully");
    },
    onError: (error) => {
      toast.error(`Error creating post: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  });
  
  // Like/unlike post mutation
  const toggleLike = useMutation({
    mutationFn: async ({ postId, liked }: { postId: string; liked: boolean }) => {
      if (!user) throw new Error("You must be logged in to like a post");
      
      if (liked) {
        // Unlike
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);
          
        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from("likes")
          .insert({
            post_id: postId,
            user_id: user.id
          });
          
        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  });
  
  return {
    posts,
    isLoading,
    error,
    refetch,
    createPost,
    toggleLike
  };
}
