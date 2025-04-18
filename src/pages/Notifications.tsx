
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { PageTransition } from "@/components/ui/motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Bell, Heart, MessageSquare, UserPlus, Loader } from "lucide-react";
import { Link } from "react-router-dom";

type Notification = {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'message';
  created_at: string;
  read: boolean;
  from_user_id: string;
  related_post_id: string | null;
  profiles: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
};

export default function Notifications() {
  const { user } = useAuth();
  
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("notifications")
        .select(`
          *,
          profiles:from_user_id(username, full_name, avatar_url)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!user
  });
  
  // Mark all as read (simplified for now)
  const markAsRead = async () => {
    if (!user) return;
    
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);
  };
  
  function getNotificationIcon(type: string) {
    switch (type) {
      case 'like':
        return <Heart size={16} className="text-red-500" />;
      case 'comment':
        return <MessageSquare size={16} className="text-blue-500" />;
      case 'follow':
        return <UserPlus size={16} className="text-green-500" />;
      case 'message':
        return <MessageSquare size={16} className="text-purple-500" />;
      default:
        return <Bell size={16} />;
    }
  }
  
  function getNotificationText(notification: Notification) {
    const username = notification.profiles?.full_name || notification.profiles?.username || 'Someone';
    
    switch (notification.type) {
      case 'like':
        return `${username} liked your post`;
      case 'comment':
        return `${username} commented on your post`;
      case 'follow':
        return `${username} started following you`;
      case 'message':
        return `${username} sent you a message`;
      default:
        return 'You have a new notification';
    }
  }
  
  return (
    <Layout>
      <PageTransition className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="mentions" className="flex-1">Mentions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader className="h-8 w-8 animate-spin text-neon-purple" />
              </div>
            ) : notifications && notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    variant="glassDark"
                    className={`p-4 transition-all ${!notification.read ? 'border-l-4 border-l-neon-purple' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={notification.profiles?.avatar_url || ""} />
                        <AvatarFallback>
                          {notification.profiles?.username.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p>
                              <Link 
                                to={`/profile/${notification.from_user_id}`} 
                                className="font-medium hover:underline"
                              >
                                {notification.profiles?.full_name || notification.profiles?.username}
                              </Link>{" "}
                              <span className="text-muted-foreground">
                                {getNotificationText(notification)}
                              </span>
                            </p>
                            
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center text-xs text-muted-foreground">
                                {getNotificationIcon(notification.type)}
                                <span className="ml-1">
                                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                </span>
                              </div>
                              
                              {!notification.read && (
                                <Badge variant="neon" className="text-xs">New</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No notifications yet.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="mentions">
            <div className="text-center py-12">
              <p className="text-muted-foreground">No mentions yet.</p>
            </div>
          </TabsContent>
        </Tabs>
      </PageTransition>
    </Layout>
  );
}
