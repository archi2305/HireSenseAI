import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const toastVariants = {
  initial: { 
    opacity: 0, 
    y: -50, 
    scale: 0.8 
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20,
      mass: 0.8
    }
  },
  exit: { 
    opacity: 0, 
    y: -50, 
    scale: 0.8,
    transition: {
      duration: 0.2,
      ease: 'easeInOut'
    }
  }
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Listen for custom toast events
    const handleToast = (event) => {
      const { type, message, duration = 4000 } = event.detail;
      const id = Date.now();
      
      const newToast = {
        id,
        type,
        message,
        timestamp: Date.now()
      };
      
      setToasts(prev => [...prev, newToast]);
      
      // Auto remove after duration
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, duration);
    };

    window.addEventListener('showToast', handleToast);
    return () => window.removeEventListener('showToast', handleToast);
  }, []);

  const getToastStyles = (type) => {
    const baseStyles = "flex items-center gap-3 p-4 rounded-2xl shadow-lg backdrop-blur-sm border";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-success/90 text-white border-success/80`;
      case 'error':
        return `${baseStyles} bg-error/90 text-white border-error/80`;
      case 'warning':
        return `${baseStyles} bg-warning/90 text-white border-warning/80`;
      case 'info':
      default:
        return `${baseStyles} bg-info/90 text-white border-info/80`;
    }
  };

  const getIcon = (type) => {
    const iconClass = "w-5 h-5 flex-shrink-0";
    
    switch (type) {
      case 'success':
        return <CheckCircle className={iconClass} />;
      case 'error':
        return <XCircle className={iconClass} />;
      case 'warning':
        return <AlertCircle className={iconClass} />;
      case 'info':
      default:
        return <Info className={iconClass} />;
    }
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="fixed top-20 right-6 z-[95] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            variants={toastVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`${getToastStyles(toast.type)} pointer-events-auto max-w-[320px]`}
            layout
          >
            {getIcon(toast.type)}
            <div className="flex-1">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Helper function to show toasts
export const showToast = (type, message, duration) => {
  window.dispatchEvent(new CustomEvent('showToast', {
    detail: { type, message, duration }
  }));
};

export default ToastContainer;
