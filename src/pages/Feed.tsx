
import { Layout } from "@/components/layout/Layout";
import { PostItem } from "@/components/social/PostItem";
import { PostForm } from "@/components/social/PostForm";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader } from "lucide-react";
import { usePosts } from "@/hooks/use-posts";

export default function Feed() {
  const { posts, isLoading, error, createPost, toggleLike } = usePosts();

  const handleCreatePost = (content: string, mediaUrl?: string) => {
    createPost.mutate({ content, mediaUrl });
  };

  const handleLike = (postId: string, liked: boolean) => {
    toggleLike.mutate({ postId, liked });
  };

  return (
    <Layout>
      <PageTransition className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold mb-6">Your Feed</h1>
          
          {/* Post creation form */}
          <PostForm onSubmit={handleCreatePost} isLoading={createPost.isPending} />
          
          {/* Posts list */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-neon-purple" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load posts. Please try again later.
              </AlertDescription>
            </Alert>
          ) : posts && posts.length > 0 ? (
            <StaggerContainer>
              {posts.map((post) => (
                <StaggerItem key={post.id} className="mb-4">
                  <PostItem post={post} onLike={handleLike} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
            </div>
          )}
        </div>
      </PageTransition>
    </Layout>
  );
}
