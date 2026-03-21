import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <motion.div
        className="w-16 h-16 relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-primary-200 dark:border-gray-700 rounded-full"></div>
        <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-primary-500 dark:border-primary-400 rounded-full border-t-transparent animate-spin"></div>
      </motion.div>
      <motion.p 
        className="mt-4 text-gray-600 dark:text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default LoadingSpinner; 