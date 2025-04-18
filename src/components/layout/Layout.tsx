
import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { motion } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
}

export function Layout({ children, showNavbar = true }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-dark">
      {showNavbar && <Navbar />}
      <main className="flex-grow pt-20 pb-16 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
