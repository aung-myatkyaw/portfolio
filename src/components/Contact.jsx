import { motion } from 'framer-motion';
import { useState, useCallback, useRef } from 'react';
import { FaLinkedin, FaGithub, FaGitlab } from 'react-icons/fa';
import { FiCpu, FiMessageCircle, FiMail, FiMapPin, FiSend } from 'react-icons/fi';
import { useInView } from 'react-intersection-observer';
import emailjs from '@emailjs/browser';
import { Turnstile } from '@marsidev/react-turnstile';
import { useAskMe } from '../hooks/useAskMe';
import { isAskMeConfigured } from '../lib/askMeActor';

const COOLDOWN_MS = 120_000;

const socialLinks = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/aung-myat-kyaw/',
    icon: FaLinkedin,
    color: 'hover:text-blue-500 dark:hover:text-blue-400',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/aung-myatkyaw',
    icon: FaGithub,
    color: 'hover:text-gray-900 dark:hover:text-white',
  },
  {
    name: 'GitLab',
    url: 'https://gitlab.com/aungmyatkyaw',
    icon: FaGitlab,
    color: 'hover:text-orange-500 dark:hover:text-orange-400',
  },
];

const contactInfo = [
  {
    label: 'Email',
    value: 'aungmyatkyaw.kk@gmail.com',
    href: 'mailto:aungmyatkyaw.kk@gmail.com',
    external: false,
  },
  {
    label: 'Location',
    value: 'Bangkok, Thailand',
    sub: 'Open to remote / hybrid',
    href: 'https://maps.google.com/?q=Bangkok+Thailand',
    external: true,
  },
];

const Contact = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const { open, lastAssistantMessage, messages } = useAskMe();
  const hasConversation = messages.length > 1;
  const [formStatus, setFormStatus] = useState('idle');
  const [formData, setFormData] = useState({
    email: '',
    message: '',
    website: '',
  });
  const [errors, setErrors] = useState({});
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const turnstileRef = useRef(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.message) {
      newErrors.message = 'Message is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isOnCooldown = useCallback(() => Date.now() < cooldownUntil, [cooldownUntil]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.website) return;

    if (isOnCooldown()) {
      setFormStatus('cooldown');
      return;
    }

    if (!validateForm()) return;

    if (!turnstileToken) {
      setErrors((prev) => ({ ...prev, turnstile: 'Please complete the security check.' }));
      return;
    }

    setFormStatus('sending');

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_email: formData.email,
          message: formData.message,
          to_name: 'Aung Myat Kyaw',
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setFormStatus('success');
      setFormData({ email: '', message: '', website: '' });
      setTurnstileToken(null);
      turnstileRef.current?.reset();
      setCooldownUntil(Date.now() + COOLDOWN_MS);
      setTimeout(() => setFormStatus('idle'), 3000);
    } catch (error) {
      console.error('Error sending email:', error);
      setFormStatus('error');
      setTurnstileToken(null);
      turnstileRef.current?.reset();
      setTimeout(() => setFormStatus('idle'), 3000);
    }
  };

  const getButtonText = () => {
    switch (formStatus) {
      case 'sending':
        return 'Sending...';
      case 'success':
        return 'Message Sent!';
      case 'error':
        return 'Failed to Send';
      case 'cooldown':
        return 'Please wait before sending again';
      default:
        return isOnCooldown() ? 'Please wait before sending again' : 'Send Message';
    }
  };

  const getButtonStyle = () => {
    if (isOnCooldown() && formStatus !== 'success') {
      return 'bg-gray-500 cursor-not-allowed';
    }
    switch (formStatus) {
      case 'sending':
        return 'bg-gray-400 cursor-wait';
      case 'success':
        return 'bg-accent-600 hover:bg-accent-500';
      case 'error':
        return 'bg-red-600 hover:bg-red-500';
      default:
        return 'bg-primary-600 hover:bg-primary-500 shadow-md hover:shadow-primary-500/30';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { y: 16, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-lg border font-mono text-sm ${
      errors[field]
        ? 'border-red-500 dark:border-red-400'
        : 'border-gray-300 dark:border-slate-600'
    } dark:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-100`;

  return (
    <motion.div
      ref={ref}
      className="container mx-auto px-4 py-16 max-w-5xl"
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="text-center mb-10">
        <h2 className="section-title mb-2">Get in Touch</h2>
        <p className="text-gray-500 dark:text-gray-400 font-mono text-sm">
          {'// direct message · AI agent · social channels'}
        </p>
      </motion.div>

      {/* Social channels */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 max-w-lg mx-auto"
      >
        {socialLinks.map((link) => {
          const Icon = link.icon;
          return (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`bento-tile items-center text-center py-4 text-gray-500 dark:text-gray-400 ${link.color} transition-colors`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Icon className="w-7 h-7 mx-auto mb-2" />
              <span className="text-xs font-mono">{link.name}</span>
            </motion.a>
          );
        })}
      </motion.div>

      <div className="space-y-4">
        {/* AI Agent */}
        <motion.div variants={itemVariants} className="bento-tile">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 flex-shrink-0">
              <FiCpu className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white">
                  Ask the AI Agent
                </h3>
                <span className="status-badge">
                  <span className="status-badge-dot" />
                  ICP · OpenRouter
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                Questions before reaching out? This agent knows Aung&apos;s background — skills,
                experience, certifications. Use the floating{' '}
                <span className="font-mono text-primary-400">Ask AI</span> button on any page.
              </p>
            </div>
          </div>

          {hasConversation && lastAssistantMessage && (
            <div className="panel p-4 mb-4 border-l-2 border-primary-500/50">
              <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mb-1">
                {'// last response'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                {lastAssistantMessage}
              </p>
            </div>
          )}

          <motion.button
            type="button"
            onClick={open}
            disabled={!isAskMeConfigured()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg
                       bg-primary-600 hover:bg-primary-500 disabled:bg-gray-400 dark:disabled:bg-slate-700
                       text-white text-sm font-medium transition-colors"
          >
            <FiMessageCircle className="w-4 h-4" />
            Open AI Agent
          </motion.button>

          {!isAskMeConfigured() && (
            <p className="mt-3 text-xs font-mono text-gray-500 dark:text-gray-400">
              {'// agent unavailable — backend canister not configured'}
            </p>
          )}
        </motion.div>

        {/* Contact info + form */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="bento-tile h-full self-stretch">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 flex-shrink-0">
                <FiMail className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-semibold text-gray-800 dark:text-white">
                    Contact Information
                  </h3>
                  <span className="status-badge ml-auto">
                    <span className="status-badge-dot" />
                    reachable
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Direct channels for roles and collaboration
                </p>
              </div>
            </div>

            <ul className="space-y-0">
              {contactInfo.map((info) => (
                <li
                  key={info.label}
                  className="border-b border-slate-200/70 dark:border-slate-700/45 last:border-b-0"
                >
                  <a
                    href={info.href}
                    target={info.external ? '_blank' : undefined}
                    rel={info.external ? 'noopener noreferrer' : undefined}
                    className="flex items-start gap-3 py-3 group"
                  >
                    <div className="mt-0.5 text-primary-500 dark:text-primary-400 flex-shrink-0">
                      {info.label === 'Email' ? (
                        <FiMail className="w-4 h-4" />
                      ) : (
                        <FiMapPin className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        {info.label}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors break-all">
                        {info.value}
                      </p>
                      {info.sub && (
                        <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mt-0.5">
                          {info.sub}
                        </p>
                      )}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="bento-tile h-full self-stretch">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 flex-shrink-0">
                <FiSend className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-white">
                  Send a Message
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Secured with Cloudflare Turnstile
                </p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="website"
                id="website"
                value={formData.website}
                onChange={handleInputChange}
                autoComplete="off"
                aria-hidden="true"
                tabIndex={-1}
                style={{
                  position: 'absolute',
                  left: '-9999px',
                  width: '1px',
                  height: '1px',
                  overflow: 'hidden',
                }}
              />
              <div>
                <label
                  htmlFor="email"
                  className="block text-[10px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={inputClass('email')}
                />
                {errors.email && (
                  <p className="mt-1 text-xs font-mono text-red-500 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-[10px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={inputClass('message')}
                />
                {errors.message && (
                  <p className="mt-1 text-xs font-mono text-red-500 dark:text-red-400">
                    {errors.message}
                  </p>
                )}
              </div>
              <div>
                <Turnstile
                  ref={turnstileRef}
                  siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                  onSuccess={setTurnstileToken}
                  onExpire={() => setTurnstileToken(null)}
                  onError={() => setTurnstileToken(null)}
                  options={{ theme: 'auto', size: 'flexible' }}
                />
                {errors.turnstile && (
                  <p className="mt-2 text-xs font-mono text-red-500 dark:text-red-400">
                    {errors.turnstile}
                  </p>
                )}
              </div>
              <motion.button
                type="submit"
                className={`w-full btn ${getButtonStyle()} text-white text-sm`}
                whileHover={{ scale: formStatus === 'sending' ? 1 : 1.02 }}
                whileTap={{ scale: formStatus === 'sending' ? 1 : 0.98 }}
                disabled={formStatus === 'sending' || isOnCooldown() || !turnstileToken}
              >
                {getButtonText()}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Contact;
