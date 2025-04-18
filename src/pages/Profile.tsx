
import { Layout } from "@/components/layout/Layout";
import { ProfileHeader } from "@/components/social/ProfileHeader";
import { PostCard } from "@/components/social/PostCard";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";

// Mock data for a user profile - would come from Supabase in a real app
const MOCK_USER = {
  id: "user1",
  name: "Alex Johnson",
  username: "alexjohnson",
  bio: "Product Designer & Developer | Creating intuitive interfaces | Photography enthusiast | Coffee addict ☕",
  avatar: "https://github.com/shadcn.png",
  coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  location: "San Francisco, CA",
  website: "alexjohnson.design",
  joinedAt: "2022-06-01T12:00:00Z",
  verified: true
};

// Mock stats
const MOCK_STATS = {
  posts: 120,
  followers: 1543,
  following: 350
};

// Mock posts data - would come from Supabase in a real app
const MOCK_USER_POSTS = [
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
    id: "5",
    author: {
      id: "user1",
      name: "Alex Johnson",
      username: "alexjohnson",
      avatar: "https://github.com/shadcn.png",
      verified: true
    },
    content: "Working on some exciting new UI components for a client project. Here's a sneak peek!",
    mediaUrl: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
    likesCount: 87,
    commentsCount: 12,
    createdAt: "2023-04-14T15:32:00Z"
  },
  {
    id: "6",
    author: {
      id: "user1",
      name: "Alex Johnson",
      username: "alexjohnson",
      avatar: "https://github.com/shadcn.png",
      verified: true
    },
    content: "Design tip: Create stronger visual hierarchies by using contrast in size, color, and spacing. It helps users understand what's most important on the page.",
    likesCount: 124,
    commentsCount: 8,
    createdAt: "2023-04-12T11:15:00Z"
  }
];

export default function Profile() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <ProfileHeader 
          user={MOCK_USER} 
          stats={MOCK_STATS} 
          isCurrentUser={true} 
        />
        
        {/* User Posts */}
        <div className="mt-6 space-y-4">
          <StaggerContainer staggerDelay={0.1} initialDelay={0.3}>
            {MOCK_USER_POSTS.map((post) => (
              <StaggerItem key={post.id}>
                <PostCard {...post} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </Layout>
  );
}
