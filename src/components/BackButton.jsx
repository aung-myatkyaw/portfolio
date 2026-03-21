import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate(-1)}
      className="fixed left-8 top-24 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg text-gray-600 dark:text-gray-300 z-40 hidden md:flex items-center group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <FiArrowLeft className="w-5 h-5 group-hover:text-primary-500 transition-colors" />
      <span className="ml-2 text-sm font-medium opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
        Back
      </span>
    </motion.button>
  );
};

export default BackButton; 