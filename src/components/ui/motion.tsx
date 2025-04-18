
// Animation components using Framer Motion
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Fade In animation
export function FadeIn({ 
  children, 
  className, 
  delay = 0, 
  duration = 0.5,
  ...props 
}: { 
  children: ReactNode; 
  className?: string;
  delay?: number;
  duration?: number;
} & MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Slide Up animation
export function SlideUp({ 
  children, 
  className, 
  delay = 0, 
  duration = 0.5,
  distance = 20,
  ...props 
}: { 
  children: ReactNode; 
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
} & MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: distance }}
      transition={{ 
        duration, 
        delay,
        type: "spring",
        damping: 25,
        stiffness: 500
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Scale In animation
export function ScaleIn({ 
  children, 
  className, 
  delay = 0, 
  duration = 0.5,
  ...props 
}: { 
  children: ReactNode; 
  className?: string;
  delay?: number;
  duration?: number;
} & MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        duration, 
        delay,
        type: "spring",
        damping: 25,
        stiffness: 500
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Staggered children animation container
export function StaggerContainer({ 
  children, 
  className,
  staggerDelay = 0.1,
  initialDelay = 0,
  ...props 
}: { 
  children: ReactNode; 
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
} & MotionProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: initialDelay
          }
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Staggered child item - to be used with StaggerContainer
export function StaggerItem({ 
  children, 
  className,
  direction = "y", // "x", "y", or "scale"
  distance = 20,
  ...props 
}: { 
  children: ReactNode; 
  className?: string;
  direction?: "x" | "y" | "scale";
  distance?: number;
} & MotionProps) {
  
  const getVariants = () => {
    switch(direction) {
      case "x":
        return {
          hidden: { opacity: 0, x: distance },
          visible: { opacity: 1, x: 0 }
        };
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.9 },
          visible: { opacity: 1, scale: 1 }
        };
      default: // "y"
        return {
          hidden: { opacity: 0, y: distance },
          visible: { opacity: 1, y: 0 }
        };
    }
  };

  return (
    <motion.div
      variants={getVariants()}
      transition={{ 
        type: "spring",
        damping: 25,
        stiffness: 500
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Modal animation wrapper
export function AnimatedModal({ 
  children, 
  isOpen, 
  onClose,
  className
}: { 
  children: ReactNode; 
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className={cn(
              "fixed z-50 rounded-lg overflow-hidden shadow-2xl",
              "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              className
            )}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Page transition wrapper
export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
