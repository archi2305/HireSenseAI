import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

const Tooltip = ({ 
  children, 
  content, 
  position = 'top',
  delay = 200,
  className = '',
  arrow = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const updateCoords = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        let x = 0, y = 0;

        switch (position) {
          case 'top':
            x = rect.left + rect.width / 2;
            y = rect.top;
            break;
          case 'bottom':
            x = rect.left + rect.width / 2;
            y = rect.bottom;
            break;
          case 'left':
            x = rect.left;
            y = rect.top + rect.height / 2;
            break;
          case 'right':
            x = rect.right;
            y = rect.top + rect.height / 2;
            break;
        }

        setCoords({ x, y });
      }
    };

    updateCoords();
    window.addEventListener('scroll', updateCoords);
    window.addEventListener('resize', updateCoords);

    return () => {
      window.removeEventListener('scroll', updateCoords);
      window.removeEventListener('resize', updateCoords);
    };
  }, [position]);

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const getTooltipStyles = () => {
    const baseStyles = {
      position: 'fixed',
      zIndex: 50,
    };

    switch (position) {
      case 'top':
        return {
          ...baseStyles,
          left: coords.x,
          top: coords.y - 10,
          transform: 'translate(-50%, -100%) translateY(-8px)',
        };
      case 'bottom':
        return {
          ...baseStyles,
          left: coords.x,
          top: coords.y + 10,
          transform: 'translate(-50%, 0) translateY(8px)',
        };
      case 'left':
        return {
          ...baseStyles,
          left: coords.x - 10,
          top: coords.y,
          transform: 'translate(-100%, -50%) translateX(-8px)',
        };
      case 'right':
        return {
          ...baseStyles,
          left: coords.x + 10,
          top: coords.y,
          transform: 'translate(0, -50%) translateX(8px)',
        };
      default:
        return baseStyles;
    }
  };

  const getArrowStyles = () => {
    const baseArrow = {
      position: 'absolute',
      width: 0,
      height: 0,
      border: '6px solid transparent',
    };

    switch (position) {
      case 'top':
        return {
          ...baseArrow,
          bottom: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderTopColor: 'rgba(15, 23, 42, 0.9)',
        };
      case 'bottom':
        return {
          ...baseArrow,
          top: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderBottomColor: 'rgba(15, 23, 42, 0.9)',
        };
      case 'left':
        return {
          ...baseArrow,
          right: '-12px',
          top: '50%',
          transform: 'translateY(-50%)',
          borderLeftColor: 'rgba(15, 23, 42, 0.9)',
        };
      case 'right':
        return {
          ...baseArrow,
          left: '-12px',
          top: '50%',
          transform: 'translateY(-50%)',
          borderRightColor: 'rgba(15, 23, 42, 0.9)',
        };
      default:
        return baseArrow;
    }
  };

  const tooltipContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          style={getTooltipStyles()}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`pointer-events-none ${className}`}
        >
          <div className="bg-slate-900/90 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-lg shadow-lg max-w-xs">
            {content}
            {arrow && <div style={getArrowStyles()} />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>
      {typeof window !== 'undefined' && createPortal(tooltipContent, document.body)}
    </>
  );
};

export default Tooltip;
