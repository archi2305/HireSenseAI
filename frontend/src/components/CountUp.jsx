import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

const CountUp = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  
  // Handle string values like "85%"
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
  const suffix = typeof value === 'string' ? value.replace(/[\d.]/g, '') : '';

  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, (latest) => {
    const val = Math.floor(latest);
    return suffix ? `${val}${suffix}` : val;
  });

  useEffect(() => {
    spring.set(numericValue);
  }, [numericValue, spring]);

  return <motion.span>{display}</motion.span>;
};

export default CountUp;
