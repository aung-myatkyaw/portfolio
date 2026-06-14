import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiX } from 'react-icons/fi';
import { useAskMe } from '../../hooks/useAskMe';
import { isAskMeConfigured } from '../../lib/askMeActor';
import TerminalWindow from '../TerminalWindow';
import AskMePanel from './AskMePanel';

const AskMeDock = () => {
  const { isOpen, close, toggle } = useAskMe();
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const isConfigured = isAskMeConfigured();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        close();
        triggerRef.current?.focus();
      }
    };

    const handleClickOutside = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, close]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        panelRef.current?.querySelector('input')?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <>
      {/* Floating trigger */}
      <motion.button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls="ask-me-panel"
        aria-label="Ask AI about Aung"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full
                   bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-900/30
                   dark:shadow-cyan-900/40 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-slate-950"
      >
        <FiCpu className="w-5 h-5" />
        <span className="text-sm font-medium">Ask AI</span>
        {isConfigured && (
          <span className="w-2 h-2 rounded-full bg-status-healthy animate-pulse-dot" aria-hidden="true" />
        )}
      </motion.button>

      {/* Backdrop (mobile) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm sm:hidden"
            onClick={close}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Slide-up panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            id="ask-me-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Ask AI about Aung"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed z-50
                       inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto
                       sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[440px] sm:max-h-[calc(100vh-7rem)]"
          >
            <TerminalWindow
              title="ask-about-me"
              bodyClassName="p-5 sm:p-5"
              headerRight={
                <div className="flex items-center gap-2">
                  <span className="status-badge hidden sm:inline-flex">
                    <span className="status-badge-dot" />
                    ICP Canister
                  </span>
                  <button
                    type="button"
                    onClick={close}
                    className="p-1 rounded-md text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Close AI chat"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              }
              className="shadow-2xl dark:shadow-cyan-900/20 sm:rounded-lg rounded-t-xl"
            >
              <AskMePanel variant="dock" />
            </TerminalWindow>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AskMeDock;
