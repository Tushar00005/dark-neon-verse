
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { PageTransition } from "@/components/ui/motion";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Loader, Search, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

type User = {
  id: string;
  full_name: string | null;
  username: string;
  avatar_url: string | null;
};

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  sender: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
};

export default function Messages() {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageText, setMessageText] = useState("");
  
  const { data: contacts, isLoading: contactsLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      if (!user) return [];
      
      // This is simplified - in a real app, you would query actual contacts
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url")
        .neq("id", user.id)
        .limit(10);
        
      if (error) throw error;
      return data as User[];
    },
    enabled: !!user
  });
  
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", selectedUser?.id],
    queryFn: async () => {
      if (!user || !selectedUser) return [];
      
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:sender_id(username, full_name, avatar_url)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${selectedUser.id},receiver_id.eq.${selectedUser.id}`)
        .order("created_at", { ascending: true });
        
      if (error) throw error;
      
      // Filter to only include messages between the current user and selected user
      return data.filter(
        msg => 
          (msg.sender_id === user.id && msg.receiver_id === selectedUser.id) || 
          (msg.sender_id === selectedUser.id && msg.receiver_id === user.id)
      ) as unknown as Message[];
    },
    enabled: !!user && !!selectedUser
  });
  
  const sendMessage = async () => {
    if (!user || !selectedUser || !messageText.trim()) return;
    
    const { error } = await supabase
      .from("messages")
      .insert({
        sender_id: user.id,
        receiver_id: selectedUser.id,
        content: messageText
      });
      
    if (!error) {
      setMessageText("");
    }
  };
  
  return (
    <Layout>
      <PageTransition className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>
        
        <div className="flex rounded-lg overflow-hidden h-[calc(100vh-200px)]">
          {/* Contacts Sidebar */}
          <div className="w-1/3 border-r border-white/10 bg-dark-secondary">
            <div className="p-3 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search contacts" 
                  className="pl-9 bg-white/5 border-white/10"
                />
              </div>
            </div>
            
            <div className="overflow-y-auto h-[calc(100%-57px)]">
              {contactsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader className="h-6 w-6 animate-spin text-neon-purple" />
                </div>
              ) : contacts && contacts.length > 0 ? (
                <div>
                  {contacts.map((contact) => (
                    <div 
                      key={contact.id}
                      className={`p-3 cursor-pointer hover:bg-white/5 transition-colors flex items-center gap-3 ${selectedUser?.id === contact.id ? 'bg-white/10' : ''}`}
                      onClick={() => setSelectedUser(contact)}
                    >
                      <Avatar>
                        <AvatarImage src={contact.avatar_url || ""} />
                        <AvatarFallback>
                          {contact.full_name?.charAt(0) || contact.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <p className="font-medium">{contact.full_name || contact.username}</p>
                        <p className="text-xs text-muted-foreground">@{contact.username}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No contacts found.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Message Area */}
          <div className="flex-1 flex flex-col bg-dark">
            {selectedUser ? (
              <>
                {/* Header */}
                <div className="p-3 border-b border-white/10 flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedUser.avatar_url || ""} />
                    <AvatarFallback>
                      {selectedUser.full_name?.charAt(0) || selectedUser.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <p className="font-medium">{selectedUser.full_name || selectedUser.username}</p>
                    <p className="text-xs text-muted-foreground">@{selectedUser.username}</p>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messagesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader className="h-6 w-6 animate-spin text-neon-purple" />
                    </div>
                  ) : messages && messages.length > 0 ? (
                    <div>
                      {messages.map((message) => {
                        const isOwnMessage = message.sender_id === user?.id;
                        
                        return (
                          <div 
                            key={message.id}
                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
                          >
                            <div className="flex gap-3 max-w-[70%]">
                              {!isOwnMessage && (
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={message.sender.avatar_url || ""} />
                                  <AvatarFallback>
                                    {message.sender.username.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              
                              <div>
                                <Card 
                                  variant={isOwnMessage ? "neon" : "glassDark"}
                                  className={`p-3 ${isOwnMessage ? 'bg-neon-purple/20' : ''}`}
                                >
                                  <p>{message.content}</p>
                                </Card>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
                    </div>
                  )}
                </div>
                
                {/* Message Input */}
                <div className="p-3 border-t border-white/10">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Type a message..." 
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="bg-white/5 border-white/10"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={sendMessage}
                      disabled={!messageText.trim()}
                      className="bg-neon-purple hover:bg-neon-purple/90"
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">Select a contact to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
}
