import { createContext, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  getActor,
  resetActorCache,
  WELCOME_MESSAGE,
} from '../lib/askMeActor';

export const AskMeContext = createContext(null);

export const AskMeProvider = ({ children }) => {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const sendMessage = useCallback(async (question) => {
    const q = question.trim();
    if (!q || isLoading) return;

    setMessages((prev) => [...prev, { role: 'user', content: q }]);
    setInput('');
    setIsLoading(true);
    setError(null);

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

        if (!isTimeout || attempt === MAX_ATTEMPTS - 1) break;
      } catch (err) {
        console.error(`[AskMe] attempt ${attempt + 1} failed:`, err);
        resetActorCache();
        lastErr = 'network';
        break;
      }
    }

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
  }, [isLoading]);

  const lastAssistantMessage = messages
    .filter((m) => m.role === 'assistant')
    .slice(-1)[0]?.content;

  const value = {
    messages,
    input,
    setInput,
    isLoading,
    error,
    isOpen,
    open,
    close,
    toggle,
    sendMessage,
    inputRef,
    lastAssistantMessage,
  };

  return (
    <AskMeContext.Provider value={value}>
      {children}
    </AskMeContext.Provider>
  );
};

AskMeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
