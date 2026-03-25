import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ 
  className = '', 
  variant = 'default',
  lines = 3,
  height = 'h-4',
  width = 'w-full' 
}) => {
  const skeletonVariants = {
    default: (
      <div className={`space-y-2 ${className}`}>
        {[...Array(lines)].map((_, i) => (
          <motion.div
            key={i}
            className={`${height} ${width} bg-slate-100 rounded-lg`}
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    ),
    card: (
      <motion.div
        className={`bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-card ${className}`}
        animate={{
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="w-12 h-12 bg-slate-100 rounded-xl"
              animate={{
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="w-20 h-5 bg-slate-100 rounded-full"
              animate={{
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.2,
                ease: 'easeInOut',
              }}
            />
          </div>
          <motion.div
            className="h-3 bg-slate-100 rounded-lg w-3/4"
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.4,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="h-8 bg-slate-100 rounded-lg w-1/2"
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.6,
              ease: 'easeInOut',
            }}
          />
        </div>
      </motion.div>
    ),
    table: (
      <div className={`space-y-2 ${className}`}>
        {[...Array(lines)].map((_, i) => (
          <motion.div
            key={i}
            className="flex items-center space-x-4 p-4 bg-white/40 rounded-xl"
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
          >
            <div className="flex-1 h-4 bg-slate-100 rounded-lg" />
            <div className="w-24 h-4 bg-slate-100 rounded-lg" />
            <div className="w-16 h-4 bg-slate-100 rounded-lg" />
          </motion.div>
        ))}
      </div>
    ),
    circle: (
      <motion.div
        className={`w-12 h-12 bg-slate-100 rounded-full ${className}`}
        animate={{
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    ),
  };

  return skeletonVariants[variant] || skeletonVariants.default;
};

export default LoadingSkeleton;
