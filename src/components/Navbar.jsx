import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Skills', path: '/skills' },
  { label: 'Experiences', path: '/experiences' },
  { label: 'Certificates', path: '/certificates' },
  { label: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `nav-link ${isActive(path) ? 'nav-link-active' : 'nav-link-inactive'}`;

  return (
    <nav className="sticky top-0 z-50 panel border-x-0 border-t-0 rounded-none shadow-md dark:shadow-slate-900/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-800 dark:text-white hover:opacity-90 transition-opacity"
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="gradient-text font-mono text-lg"
            >
              ~/aung
            </motion.span>
          </Link>

          {/* Desktop nav — chip toolbar */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} className={navLinkClass(item.path)}>
                  {item.label}
                </Link>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDark(!isDark)}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-700/50 bg-slate-100/80 dark:bg-slate-800/40 hover:border-primary-500/40 transition-colors"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? 'moon' : 'sun'}
                  initial={{ y: -12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 12, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {isDark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDark(!isDark)}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-700/50"
            >
              {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Open navigation menu"
              className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-700/50 hover:border-primary-500/40 transition-colors"
            >
              {isMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Scroll status bar */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/90 dark:bg-slate-900/90"
          >
            <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between gap-4 text-[11px] font-mono text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="status-badge-dot" />
                Available for Senior DevSecOps / Platform Engineering roles
              </span>
              <a
                href="https://trwm2-7aaaa-aaaal-qwm6q-cai.icp0.io"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                Deployed on ICP ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t border-slate-200/50 dark:border-slate-700/50"
          >
            <div className="px-4 py-3 space-y-1 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md">
              <p className="text-[10px] font-mono text-gray-400 dark:text-gray-500 px-1 pb-2">
                {'// navigate'}
              </p>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block ${navLinkClass(item.path)}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
