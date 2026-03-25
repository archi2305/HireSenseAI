import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Inbox, 
  TrendingUp, 
  Users,
  Briefcase,
  Sparkles
} from 'lucide-react';

const EmptyState = ({ 
  type = 'default',
  title,
  description,
  action,
  className = ''
}) => {
  const emptyStateVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const iconVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.1,
        ease: 'easeOut'
      }
    }
  };

  const contentVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.2,
        ease: 'easeOut'
      }
    }
  };

  const getIcon = () => {
    const iconClass = "w-16 h-16 text-slate-300";
    switch (type) {
      case 'documents':
        return <FileText className={iconClass} />;
      case 'search':
        return <Search className={iconClass} />;
      case 'candidates':
        return <Users className={iconClass} />;
      case 'analytics':
        return <TrendingUp className={iconClass} />;
      case 'jobs':
        return <Briefcase className={iconClass} />;
      default:
        return <Inbox className={iconClass} />;
    }
  };

  const getDefaultContent = () => {
    switch (type) {
      case 'documents':
        return {
          title: 'No documents yet',
          description: 'Upload your first resume to get started with AI-powered analysis.',
        };
      case 'search':
        return {
          title: 'No results found',
          description: 'Try adjusting your search terms or filters to find what you\'re looking for.',
        };
      case 'candidates':
        return {
          title: 'No candidates yet',
          description: 'Start by uploading resumes to build your candidate pipeline.',
        };
      case 'analytics':
        return {
          title: 'No data to display',
          description: 'Upload some resumes to see analytics and insights.',
        };
      case 'jobs':
        return {
          title: 'No job postings',
          description: 'Create your first job posting to start matching candidates.',
        };
      default:
        return {
          title: 'Nothing here yet',
          description: 'Get started by adding your first item.',
        };
    }
  };

  const { title: defaultTitle, description: defaultDescription } = getDefaultContent();
  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;

  return (
    <motion.div
      variants={emptyStateVariants}
      initial="initial"
      animate="animate"
      className={`flex flex-col items-center justify-center text-center py-16 px-8 ${className}`}
    >
      <motion.div
        variants={iconVariants}
        className="relative mb-8"
      >
        {getIcon()}
        <motion.div
          className="absolute -top-2 -right-2"
          animate={{
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Sparkles className="w-6 h-6 text-brand-purple animate-pulse-soft" />
        </motion.div>
      </motion.div>

      <motion.div
        variants={contentVariants}
        className="space-y-4 max-w-md"
      >
        <h3 className="text-xl font-semibold text-slate-700">
          {finalTitle}
        </h3>
        <p className="text-slate-500 leading-relaxed">
          {finalDescription}
        </p>
        
        {action && (
          <motion.div
            className="pt-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {action}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default EmptyState;
