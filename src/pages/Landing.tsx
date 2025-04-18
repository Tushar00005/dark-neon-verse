
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { 
  ArrowRight, 
  MessageCircle, 
  Users, 
  TrendingUp,
  Shield,
  Search,
  Bell
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark to-dark-lighter">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-24 pb-20 flex flex-col lg:flex-row items-center">
        <div className="flex-1 mb-10 lg:mb-0 lg:pr-10">
          <StaggerContainer className="space-y-6">
            <StaggerItem>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Connect with <span className="neon-text">friends</span> and the <span className="neon-text-blue">world</span> around you
              </h1>
            </StaggerItem>
            
            <StaggerItem>
              <p className="text-xl text-muted-foreground">
                Join NeoConnect, the next generation social platform with a modern, sleek interface and powerful features.
              </p>
            </StaggerItem>
            
            <StaggerItem>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="bg-neon-purple hover:bg-neon-purple/90 text-white">
                  <Link to="/signup">
                    Create Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/login">Already have an account? Log in</Link>
                </Button>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
        
        {/* Hero Image */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img 
            src="/placeholder.svg" 
            alt="NeoConnect App" 
            className="w-full max-w-xl mx-auto rounded-lg shadow-2xl glass" 
          />
        </motion.div>
      </section>
      
      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <StaggerContainer className="mb-16 text-center">
          <StaggerItem>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The social network <span className="neon-text">reimagined</span>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience social media the way it should be - beautiful, powerful, and focused on what matters.
            </p>
          </StaggerItem>
        </StaggerContainer>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<MessageCircle className="h-8 w-8 text-neon-purple" />}
            title="Real-time Messaging"
            description="Instantly connect with friends through our lightning-fast direct messaging system."
          />
          
          <FeatureCard 
            icon={<Users className="h-8 w-8 text-neon-purple" />}
            title="Community Focus"
            description="Build meaningful connections with people who share your interests and passions."
          />
          
          <FeatureCard 
            icon={<TrendingUp className="h-8 w-8 text-neon-blue" />}
            title="Trending Content"
            description="Discover what's popular right now and join the conversation around trending topics."
          />
          
          <FeatureCard 
            icon={<Shield className="h-8 w-8 text-neon-blue" />}
            title="Privacy & Security"
            description="Your data is protected with industry-leading security and granular privacy controls."
          />
          
          <FeatureCard 
            icon={<Search className="h-8 w-8 text-neon-purple" />}
            title="Powerful Explore"
            description="Find new content, people, and communities with our smart recommendation system."
          />
          
          <FeatureCard 
            icon={<Bell className="h-8 w-8 text-neon-blue" />}
            title="Smart Notifications"
            description="Stay updated with real-time notifications about activity that matters to you."
          />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4">
        <Card variant="neon" className="max-w-5xl mx-auto overflow-hidden">
          <div className="p-12 text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Ready to experience the future of social media?
            </motion.h2>
            
            <motion.p 
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Join thousands of users already connecting, sharing, and discovering on NeoConnect.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Button asChild size="lg" className="bg-neon-purple hover:bg-neon-purple/90 text-white">
                <Link to="/signup">
                  Join NeoConnect for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </Card>
      </section>
      
      {/* Footer */}
      <footer className="container mx-auto px-4 py-10 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="text-xl font-bold neon-text">NeoConnect</Link>
            <p className="text-sm text-muted-foreground mt-1">
              &copy; {new Date().getFullYear()} NeoConnect. All rights reserved.
            </p>
          </div>
          
          <div className="flex gap-6">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-white transition-colors">
              About
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-white transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="/help" className="text-sm text-muted-foreground hover:text-white transition-colors">
              Help Center
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card variant="glass" className="h-full">
        <div className="p-6">
          <div className="mb-4">{icon}</div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </Card>
    </motion.div>
  );
}
