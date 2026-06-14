import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import TerminalWindow from './TerminalWindow';

const SESSION_KEY = 'hero-terminal-seen';

const TERMINAL_BLOCKS = [
  { command: 'whoami', output: 'aung-myat-kyaw' },
  { command: 'cat role.txt', output: 'Senior DevSecOps Engineer · Bangkok, TH' },
  { command: 'kubectl get certs', output: 'CKS (valid)  CKA (valid)  AWS-SysOps (valid)' },
  {
    command: 'echo $FOCUS',
    output:
      'Architecting secure infrastructure for AI-native apps — K8s, multicloud, CI/CD.',
  },
];

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
};

const TerminalHero = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const skipAnimation =
    prefersReducedMotion || sessionStorage.getItem(SESSION_KEY) === '1';

  const flatLines = useMemo(
    () =>
      TERMINAL_BLOCKS.flatMap((block) => [
        { type: 'command', text: block.command },
        { type: 'output', text: block.output },
      ]),
    []
  );

  const [visibleCount, setVisibleCount] = useState(skipAnimation ? flatLines.length : 0);
  const [typedChars, setTypedChars] = useState(
    skipAnimation ? flatLines[flatLines.length - 1]?.text.length ?? 0 : 0
  );

  useEffect(() => {
    if (skipAnimation) return;

    if (visibleCount >= flatLines.length) {
      sessionStorage.setItem(SESSION_KEY, '1');
      return;
    }

    const line = flatLines[visibleCount];
    const isCommand = line.type === 'command';
    const delay = isCommand ? 300 : 500;

    const timer = setTimeout(() => {
      if (isCommand) {
        setVisibleCount((c) => c + 1);
        setTypedChars(0);
      } else {
        const target = line.text.length;
        if (typedChars < target) {
          setTypedChars((c) => c + 1);
        } else {
          setVisibleCount((c) => c + 1);
          setTypedChars(0);
        }
      }
    }, typedChars === 0 && !isCommand ? delay : 18);

    return () => clearTimeout(timer);
  }, [visibleCount, typedChars, flatLines, skipAnimation]);

  const renderLine = (line, index) => {
    const isVisible = index < visibleCount;
    const isCurrent = index === visibleCount;
    const isCommand = line.type === 'command';

    if (!isVisible && !isCurrent) return null;

    if (isCommand) {
      const text = isVisible ? line.text : '';
      return (
        <div key={index} className="terminal-line mb-1">
          <span className="terminal-prompt">$ </span>
          <span>{text}</span>
          {isCurrent && (
            <span className="inline-block w-2 h-4 ml-0.5 bg-primary-400 animate-blink-cursor align-middle" />
          )}
        </div>
      );
    }

    const text = isVisible
      ? line.text
      : line.text.slice(0, typedChars);

    return (
      <div key={index} className="terminal-output mb-3">
        {text}
        {isCurrent && typedChars < line.text.length && (
          <span className="inline-block w-2 h-4 ml-0.5 bg-primary-400 animate-blink-cursor align-middle" />
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto"
    >
      <div className="absolute inset-0 dark:bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] dark:from-primary-900/15 dark:via-transparent dark:to-transparent pointer-events-none rounded-lg" />
      <TerminalWindow
        title="aung@portfolio ~"
        headerRight={
          <span className="status-badge">
            <span className="status-badge-dot" />
            online
          </span>
        }
        className="relative shadow-2xl dark:shadow-cyan-900/10"
      >
        <div className="min-h-[220px]">
          {flatLines.map((line, i) => renderLine(line, i))}
        </div>
      </TerminalWindow>
    </motion.div>
  );
};

export default TerminalHero;
