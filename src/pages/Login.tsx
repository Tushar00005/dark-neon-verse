
import { AuthForm } from "@/components/auth/AuthForm";
import { Layout } from "@/components/layout/Layout";
import { PageTransition } from "@/components/ui/motion";

export default function Login() {
  return (
    <Layout showNavbar={false}>
      <PageTransition className="min-h-screen flex flex-col justify-center py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold neon-text mb-2">NeoConnect</h1>
          <p className="text-muted-foreground">Login to your account</p>
        </div>
        
        <div className="w-full max-w-md mx-auto">
          <AuthForm />
        </div>
      </PageTransition>
    </Layout>
  );
}
