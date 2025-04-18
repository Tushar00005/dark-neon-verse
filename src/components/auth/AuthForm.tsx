
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { ScaleIn } from "@/components/ui/motion";

export function AuthForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  
  const [signupForm, setSignupForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would normally connect to Supabase Auth
    console.log("Login form submitted:", loginForm);
    // Simulate successful login
    navigate("/feed");
  };
  
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would normally connect to Supabase Auth
    console.log("Signup form submitted:", signupForm);
    // Simulate successful signup
    navigate("/feed");
  };
  
  return (
    <ScaleIn>
      <Card variant="glassDark" className="w-full max-w-md mx-auto">
        <div className="p-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      id="email"
                      type="email" 
                      placeholder="your@email.com" 
                      className="pl-10"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-xs text-muted-foreground"
                      onClick={() => navigate("/forgot-password")}
                      type="button"
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      id="password"
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="pl-10"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full bg-neon-purple hover:bg-neon-purple/90">
                  Log In
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      id="name"
                      type="text" 
                      placeholder="John Doe" 
                      className="pl-10"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                    <Input 
                      id="username"
                      type="text" 
                      placeholder="johndoe" 
                      className="pl-10"
                      value={signupForm.username}
                      onChange={(e) => setSignupForm({...signupForm, username: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      id="signup-email"
                      type="email" 
                      placeholder="your@email.com" 
                      className="pl-10"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      id="signup-password"
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="pl-10"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Password must be at least 8 characters.
                  </p>
                </div>
                
                <Button type="submit" className="w-full bg-neon-purple hover:bg-neon-purple/90">
                  Create Account
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  By signing up, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </ScaleIn>
  );
}
