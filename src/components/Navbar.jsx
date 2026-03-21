import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navItems = ['Home', 'About', 'Skills', 'Experiences', 'Certificates', 'Contact'];

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg dark:shadow-slate-900/50 sticky top-0 z-50 dark:border-b dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="gradient-text"
              >
                Aung
              </motion.span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="relative text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {item}
                {location.pathname === (item === 'Home' ? '/' : `/${item.toLowerCase().replace(/\s+/g, '-')}`) && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400 bottom-[-4px]"
                  />
                )}
              </Link>
            ))}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 transition-colors"
            >
              <AnimatePresence mode='wait'>
                <motion.div
                  key={isDark ? 'moon' : 'sun'}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="px-4 pt-2 pb-3 space-y-1 bg-white dark:bg-slate-900 shadow-lg">
              {navItems.map((item) => (
                <Link
                  key={item}
                  to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {item}
                </Link>
              ))}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDark(!isDark)}
                className="w-full px-3 py-2 rounded-md text-left text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar; 