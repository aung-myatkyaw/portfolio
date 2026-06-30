import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiUser, FiCpu, FiAlertCircle, FiShield } from 'react-icons/fi';
import { useAskMe } from '../../hooks/useAskMe';
import {
  isAskMeConfigured,
  SUGGESTED_QUESTIONS,
} from '../../lib/askMeActor';

const messageVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25 } },
};

const TypingIndicator = () => (
  <motion.div
    variants={messageVariants}
    initial="hidden"
    animate="visible"
    className="flex items-start gap-2.5"
  >
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600/20 dark:bg-primary-500/20 flex items-center justify-center mt-0.5">
      <FiCpu className="w-4 h-4 text-primary-500" />
    </div>
    <div className="panel px-4 py-3.5 flex-1 min-w-0">
      <div className="flex gap-1.5 items-center h-4">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary-400"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  </motion.div>
);

const Message = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${
          isUser
            ? 'bg-accent-600/20 dark:bg-accent-500/20'
            : 'bg-primary-600/20 dark:bg-primary-500/20'
        }`}
      >
        {isUser ? (
          <FiUser className="w-4 h-4 text-accent-500" />
        ) : (
          <FiCpu className="w-4 h-4 text-primary-500" />
        )}
      </div>
      <div
        className={`panel flex-1 min-w-0 px-4 py-3.5 text-sm leading-6 ${
          isUser
            ? 'bg-accent-600/10 dark:bg-accent-500/10 border-accent-500/20'
            : ''
        }`}
      >
        {msg.content}
      </div>
    </motion.div>
  );
};

Message.propTypes = {
  msg: PropTypes.shape({
    role: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
};

const AskMePanel = ({ variant = 'default' }) => {
  const {
    messages,
    input,
    setInput,
    isLoading,
    error,
    sendMessage,
    inputRef,
  } = useAskMe();

  const chatContainerRef = useRef(null);
  const isConfigured = isAskMeConfigured();
  const isDock = variant === 'dock';

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (!isConfigured) {
    return (
      <div className="py-8 px-2 text-center flex flex-col items-center gap-4">
        <FiAlertCircle className="w-8 h-8 text-amber-400" />
        <p className="text-gray-600 dark:text-gray-300 font-medium text-sm leading-relaxed">
          Backend canister not yet deployed
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-xs max-w-sm leading-relaxed">
          Backend canister ID is missing. Deploy with icp-cli so the asset canister sets the{' '}
          <code className="text-primary-400 font-mono">ic_env</code> cookie, or set{' '}
          <code className="text-primary-400 font-mono">VITE_BACKEND_CANISTER_ID</code> in{' '}
          <code className="text-primary-400 font-mono">.env.local</code> for local dev.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-1">
      <div
        ref={chatContainerRef}
        className={`panel overflow-y-auto flex flex-col gap-5 scroll-smooth ${
          isDock ? 'h-80 min-h-[280px] p-4' : 'h-72 p-4 mb-1'
        }`}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <Message key={i} msg={msg} />
          ))}
          {isLoading && <TypingIndicator key="typing" />}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-400 text-xs text-center py-2 flex items-center justify-center gap-1.5 leading-relaxed"
          >
            <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
          </motion.p>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="flex gap-2.5 pt-2">
        <div className="flex-1 relative min-w-0">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 300))}
            maxLength={300}
            placeholder="Ask about experience, skills, certs…"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm leading-normal disabled:opacity-50 transition-colors"
          />
          {input.length > 0 && (
            <span className={`absolute right-3 bottom-2.5 text-[10px] font-mono ${input.length >= 280 ? 'text-red-400' : 'text-gray-400 dark:text-gray-600'}`}>
              {input.length}/300
            </span>
          )}
        </div>
        <motion.button
          type="submit"
          disabled={!input.trim() || isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-3 rounded-lg bg-primary-600 hover:bg-primary-500 disabled:bg-gray-400 dark:disabled:bg-slate-700 text-white transition-colors flex items-center gap-2 text-sm font-medium flex-shrink-0"
          aria-label="Send message"
        >
          <FiSend className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </motion.button>
      </form>

      <div className="pt-4">
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 font-mono leading-relaxed">
          {'// not sure where to start?'}
        </p>
        <div className="flex flex-col gap-2.5">
          {SUGGESTED_QUESTIONS.map((q) => (
            <motion.button
              key={q}
              type="button"
              onClick={() => sendMessage(q)}
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full text-left px-4 py-2.5 text-sm leading-snug rounded-lg border border-primary-500/30 text-primary-400 hover:bg-primary-500/10 disabled:opacity-40 transition-colors"
            >
              {q}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-200/80 dark:border-slate-700/50 space-y-2.5">
        <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
          Rust canister on ICP · LLaMA 3.1 8B via OpenRouter · ~10–15s response time
        </p>
        <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400 flex items-start gap-2">
          <FiShield className="w-3.5 h-3.5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <span>No memory between messages · nothing stored on-chain</span>
        </p>
      </div>
    </div>
  );
};

AskMePanel.propTypes = {
  variant: PropTypes.oneOf(['default', 'dock']),
};

export default AskMePanel;
