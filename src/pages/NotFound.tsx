
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { PageTransition } from "@/components/ui/motion";

export default function NotFound() {
  return (
    <Layout showNavbar={false}>
      <PageTransition className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="space-y-6 text-center max-w-md">
          <div className="text-9xl font-bold neon-text">404</div>
          <h1 className="text-3xl font-bold">Page not found</h1>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild className="bg-neon-purple hover:bg-neon-purple/90">
            <Link to="/" className="flex items-center gap-2">
              <Home size={18} /> Return Home
            </Link>
          </Button>
        </div>
      </PageTransition>
    </Layout>
  );
}
