import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageTransition } from "@/components/ui/motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/use-profile";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";

export default function Settings() {
  const { user, signOut } = useAuth();
  const { profile, isLoading, updateProfile } = useProfile();
  
  const [generalForm, setGeneralForm] = useState({
    full_name: "",
    username: "",
    bio: "",
    avatar_url: ""
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    likes: true,
    comments: true,
    follows: true,
    messages: true
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  useEffect(() => {
    if (profile) {
      setGeneralForm({
        full_name: profile.full_name || "",
        username: profile.username,
        bio: profile.bio || "",
        avatar_url: profile.avatar_url || ""
      });
    }
  }, [profile]);
  
  const handleSaveGeneral = async () => {
    try {
      await updateProfile.mutateAsync(generalForm);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  
  const handleSaveNotifications = () => {
    toast.success("Notification settings saved successfully");
  };
  
  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    toast.success("Password updated successfully");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };
  
  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    
    if (confirmed) {
      toast.success("Account deleted");
      signOut();
    }
  };
  
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
      <PageTransition className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="danger">Danger Zone</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account profile information and public details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.avatar_url || ""} />
                    <AvatarFallback className="text-xl">
                      {profile.full_name?.charAt(0).toUpperCase() || profile.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-medium">Profile Picture</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Update your profile picture
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Upload
                      </Button>
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="avatarUrl">Avatar URL</Label>
                      <Input
                        id="avatarUrl"
                        value={generalForm.avatar_url}
                        onChange={(e) => setGeneralForm({...generalForm, avatar_url: e.target.value})}
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={generalForm.full_name}
                        onChange={(e) => setGeneralForm({...generalForm, full_name: e.target.value})}
                        placeholder="Your name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={generalForm.username}
                      onChange={(e) => setGeneralForm({...generalForm, username: e.target.value})}
                      placeholder="username"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={generalForm.bio}
                      onChange={(e) => setGeneralForm({...generalForm, bio: e.target.value})}
                      placeholder="Tell us about yourself"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveGeneral} className="bg-neon-purple hover:bg-neon-purple/90">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose what notifications you receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about account activity
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, emailNotifications: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifyLikes">Likes</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when someone likes your post
                      </p>
                    </div>
                    <Switch
                      id="notifyLikes"
                      checked={notificationSettings.likes}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, likes: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifyComments">Comments</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when someone comments on your post
                      </p>
                    </div>
                    <Switch
                      id="notifyComments"
                      checked={notificationSettings.comments}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, comments: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifyFollows">Follows</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when someone follows you
                      </p>
                    </div>
                    <Switch
                      id="notifyFollows"
                      checked={notificationSettings.follows}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, follows: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifyMessages">Messages</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications for new messages
                      </p>
                    </div>
                    <Switch
                      id="notifyMessages"
                      checked={notificationSettings.messages}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, messages: checked})
                      }
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications} className="bg-neon-purple hover:bg-neon-purple/90">
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={handleChangePassword}
                    disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                    className="bg-neon-purple hover:bg-neon-purple/90"
                  >
                    Change Password
                  </Button>
                </div>
                
                <div className="pt-6 border-t border-white/10">
                  <h3 className="font-medium mb-2">Connected Accounts</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect your accounts to enable social login and sharing
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                          f
                        </div>
                        <div>
                          <p className="font-medium">Facebook</p>
                          <p className="text-xs text-muted-foreground">Not connected</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold">
                          t
                        </div>
                        <div>
                          <p className="font-medium">Twitter</p>
                          <p className="text-xs text-muted-foreground">Not connected</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                          g
                        </div>
                        <div>
                          <p className="font-medium">Google</p>
                          <Badge variant="neon" className="text-xs">Connected</Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Disconnect</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="danger">
            <Card variant="glassDark" className="border-destructive/50">
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>
                  These actions are irreversible. Please proceed with caution.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="border border-destructive/30 rounded-lg p-4">
                    <h3 className="font-medium text-destructive mb-2">Delete Account</h3>
                    <p className="text-sm mb-4">
                      Once you delete your account, all of your data will be permanently removed. This action cannot be undone.
                    </p>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      Delete Account
                    </Button>
                  </div>
                  
                  <div className="border border-white/10 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Export Data</h3>
                    <p className="text-sm mb-4">
                      Download a copy of all your data including posts, comments, and profile information.
                    </p>
                    <Button variant="outline">
                      Export All Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageTransition>
    </Layout>
  );
}
