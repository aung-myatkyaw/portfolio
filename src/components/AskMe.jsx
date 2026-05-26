import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HttpAgent, Actor } from '@dfinity/agent';
import { FiSend, FiUser, FiCpu, FiAlertCircle, FiShield } from 'react-icons/fi';

// ---------------------------------------------------------------------------
// Canister config
// ---------------------------------------------------------------------------

const BACKEND_CANISTER_ID = import.meta.env.VITE_BACKEND_CANISTER_ID;

const idlFactory = ({ IDL }) => {
  const AskResult = IDL.Variant({ Ok: IDL.Text, Err: IDL.Text });
  return IDL.Service({
    ask_about_me: IDL.Func([IDL.Text], [AskResult], []),
  });
};

let actorCache = null;

// Runtime check — works regardless of how the bundle was built.
// Local ICP network serves from *.localhost or 127.0.0.1; mainnet never does.
const isLocal =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.endsWith('.localhost');

const getActor = async () => {
  if (actorCache) return actorCache;
  // HttpAgent.create() is the non-deprecated async factory (v3+).
  // It also calls fetchRootKey() automatically when shouldFetchRootKey is true.
  const agent = await HttpAgent.create({
    host: isLocal ? 'http://localhost:4943' : 'https://icp-api.io',
    shouldFetchRootKey: isLocal,
  });
  actorCache = Actor.createActor(idlFactory, {
    agent,
    canisterId: BACKEND_CANISTER_ID,
  });
  return actorCache;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// Short, factual prompts — simpler questions tend to produce shorter, more
// deterministic answers (helps ICP subnet consensus on HTTPS outcalls).
const SUGGESTED_QUESTIONS = [
  'What are his Kubernetes certifications?',
  'Where does he work now?',
  'How many years of experience?',
  'What is his email?',
];

const WELCOME_MESSAGE = {
  role: 'assistant',
  content:
    "Hi! Ask one question at a time about Aung's experience, skills, or certifications. Each answer is independent — I don't remember earlier messages in this chat.",
};

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const messageVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25 } },
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const TypingIndicator = () => (
  <motion.div
    variants={messageVariants}
    initial="hidden"
    animate="visible"
    className="flex items-start gap-3"
  >
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600/20 dark:bg-primary-500/20 flex items-center justify-center">
      <FiCpu className="w-4 h-4 text-primary-500" />
    </div>
    <div className="card px-4 py-3 max-w-xs">
      <div className="flex gap-1 items-center h-4">
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
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
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
        className={`card px-4 py-3 max-w-[75%] text-sm leading-relaxed ${
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

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const AskMe = () => {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const isConfigured = Boolean(BACKEND_CANISTER_ID);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (question) => {
    const q = question.trim();
    if (!q || isLoading) return;

    setMessages((prev) => [...prev, { role: 'user', content: q }]);
    setInput('');
    setIsLoading(true);
    setError(null);

    // Auto-retry once on consensus timeout — ICP requires 13 nodes to agree on the
    // LLM response. Occasionally a node diverges; a silent retry almost always succeeds.
    const MAX_ATTEMPTS = 2;
    let lastErr = '';

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const actor = await getActor();
        const result = await actor.ask_about_me(q);

        if ('Ok' in result) {
          setMessages((prev) => [...prev, { role: 'assistant', content: result.Ok }]);
          setIsLoading(false);
          inputRef.current?.focus();
          return;
        }

        lastErr = result.Err ?? '';
        const isTimeout = lastErr.toLowerCase().includes('timeout');

        // Only retry on timeouts — other errors (rate limit, validation) won't improve
        if (!isTimeout || attempt === MAX_ATTEMPTS - 1) break;

      } catch (err) {
        console.error(`[AskMe] attempt ${attempt + 1} failed:`, err);
        actorCache = null;
        lastErr = 'network';
        break;
      }
    }

    // All attempts exhausted — show appropriate message
    if (lastErr === 'network') {
      setError('Failed to reach the AI service. Please try again in a moment.');
    } else {
      const isTimeout = lastErr.toLowerCase().includes('timeout');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: isTimeout
            ? 'The AI is taking longer than usual — ICP enforces a 30s consensus limit. Please try again.'
            : `Sorry, I ran into an issue: ${lastErr}`,
        },
      ]);
    }

    setIsLoading(false);
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      {/* Not configured state */}
      {!isConfigured ? (
        <motion.div
          variants={itemVariants}
          className="py-6 text-center flex flex-col items-center gap-3"
        >
          <FiAlertCircle className="w-8 h-8 text-amber-400" />
          <p className="text-gray-600 dark:text-gray-300 font-medium text-sm">
            Backend canister not yet deployed
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-xs max-w-sm">
            Set <code className="text-primary-400 font-mono">VITE_BACKEND_CANISTER_ID</code> after deploying the Rust canister.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Chat window */}
          <motion.div
            variants={itemVariants}
            className="card p-4 mb-3 h-72 overflow-y-auto flex flex-col gap-4 scroll-smooth"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <Message key={i} msg={msg} />
              ))}
              {isLoading && <TypingIndicator key="typing" />}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </motion.div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-400 text-xs text-center mb-2 flex items-center justify-center gap-1"
              >
                <FiAlertCircle className="w-3 h-3" /> {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Input */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="flex gap-2 mb-3"
          >
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 300))}
                maxLength={300}
                placeholder="Ask something about Aung's experience…"
                disabled={isLoading}
                className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm disabled:opacity-50 transition-colors"
              />
              {input.length > 0 && (
                <span className={`absolute right-2 bottom-1 text-[10px] font-mono ${input.length >= 280 ? 'text-red-400' : 'text-gray-400 dark:text-gray-600'}`}>
                  {input.length}/300
                </span>
              )}
            </div>
            <motion.button
              type="submit"
              disabled={!input.trim() || isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-500 disabled:bg-gray-400 dark:disabled:bg-slate-700 text-white transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <FiSend className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </motion.button>
          </motion.form>

          {/* Suggested questions */}
          <motion.div variants={itemVariants}>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 font-mono">
              // not sure where to start?
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <motion.button
                  key={q}
                  onClick={() => sendMessage(q)}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-3 py-1.5 text-xs rounded-full border border-primary-500/30 text-primary-400 hover:bg-primary-500/10 disabled:opacity-40 transition-colors"
                >
                  {q}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Footer note */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between mt-3 gap-2 flex-wrap"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Rust canister on ICP · LLaMA 3.1 8B via OpenRouter · ~10–15s response time
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 flex-shrink-0">
              <FiShield className="w-3 h-3 text-green-500 dark:text-green-400" />
              No memory between messages · nothing stored on-chain
            </p>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default AskMe;
