
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, Home, LogOut, MessageSquare, Search, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Animation variants
const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 15,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 }
};

export function Navbar() {
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  
  const getInitials = () => {
    if (!user?.user_metadata?.full_name) return "UN";
    const nameParts = user.user_metadata.full_name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`;
    }
    return nameParts[0].charAt(0);
  };
  
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 py-4 px-6 glass border-b border-white/5"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto flex items-center justify-between">
        <motion.div variants={itemVariants} className="flex items-center">
          <Link to="/" className="text-2xl font-bold neon-text">NeoConnect</Link>
        </motion.div>
        
        <div className="hidden md:flex items-center gap-6">
          {/* Desktop Navigation */}
          {user ? (
            <>
              <motion.nav className="flex items-center gap-2" variants={itemVariants}>
                <NavLink to="/feed" icon={<Home size={20} />} label="Feed" />
                <NavLink to="/explore" icon={<Search size={20} />} label="Explore" />
                <NavLink to="/notifications" icon={<Bell size={20} />} label="Notifications" />
                <NavLink to="/messages" icon={<MessageSquare size={20} />} label="Messages" />
                <NavLink to="/profile" icon={<User size={20} />} label="Profile" />
                <NavLink to="/settings" icon={<Settings size={20} />} label="Settings" />
              </motion.nav>
              
              <motion.div variants={itemVariants} className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-white/10">
                  <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || "User"} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </Button>
              </motion.div>
            </>
          ) : (
            <motion.div variants={itemVariants} className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button variant="default" size="sm" className="bg-neon-purple hover:bg-neon-purple/80" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </motion.div>
          )}
        </div>
        
        {/* Mobile Navigation - Fixed at Bottom */}
        {isMobile && (
          <motion.div 
            className="fixed bottom-0 left-0 right-0 bg-dark-secondary border-t border-white/5 py-2 flex justify-around items-center"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {user ? (
              <>
                <MobileNavLink to="/feed" icon={<Home size={24} />} />
                <MobileNavLink to="/explore" icon={<Search size={24} />} />
                <MobileNavLink to="/notifications" icon={<Bell size={24} />} />
                <MobileNavLink to="/messages" icon={<MessageSquare size={24} />} />
                <MobileNavLink to="/profile" icon={<User size={24} />} />
              </>
            ) : (
              <>
                <MobileNavLink to="/" icon={<Home size={24} />} />
                <MobileNavLink to="/login" icon={<User size={24} />} />
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}

// Desktop Navigation Link
function NavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      to={to}
      className="flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-white/5 transition-all text-sm font-medium"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

// Mobile Navigation Link
function MobileNavLink({ to, icon }: { to: string; icon: React.ReactNode }) {
  return (
    <Link 
      to={to}
      className="p-3 text-gray-400 hover:text-neon-purple transition-colors"
    >
      {icon}
    </Link>
  );
}
