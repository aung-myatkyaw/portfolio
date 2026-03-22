import { motion } from 'framer-motion';
import { useState, useCallback, useRef } from 'react';
import { FaLinkedin, FaGithub, FaGitlab, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { FiCpu } from 'react-icons/fi';
import emailjs from '@emailjs/browser';
import { Turnstile } from '@marsidev/react-turnstile';
import AskMe from './AskMe';

const COOLDOWN_MS = 120_000;

const Contact = () => {
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

  const socialLinks = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/aung-myat-kyaw/",
      icon: <FaLinkedin className="w-8 h-8" />,
      color: "hover:text-blue-600"
    },
    {
      name: "GitHub",
      url: "https://github.com/aung-myatkyaw",
      icon: <FaGithub className="w-8 h-8" />,
      color: "hover:text-gray-900 dark:hover:text-white"
    },
    {
      name: "GitLab",
      url: "https://gitlab.com/aungmyatkyaw",
      icon: <FaGitlab className="w-8 h-8" />,
      color: "hover:text-orange-600"
    }
  ];

  const contactInfo = [
    {
      label: "Email",
      value: "aungmyatkyaw.kk@gmail.com",
      icon: <FaEnvelope className="w-5 h-5" />,
      action: "mailto:aungmyatkyaw.kk@gmail.com"
    },
    {
      label: "Location",
      value: "Bangkok, Thailand",
      icon: <FaMapMarkerAlt className="w-5 h-5" />,
      action: "https://maps.google.com/?q=Bangkok+Thailand"
    }
  ];

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
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
      setErrors(prev => ({ ...prev, turnstile: 'Please complete the security check.' }));
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
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-16"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h2 
        className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12"
        variants={itemVariants}
      >
        Get in Touch
      </motion.h2>

      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="flex justify-center space-x-8 mb-12"
          variants={itemVariants}
        >
          {socialLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-gray-600 dark:text-gray-300 ${link.color} transition-colors`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {link.icon}
              <span className="sr-only">{link.name}</span>
            </motion.a>
          ))}
        </motion.div>

        {/* AI Agent section */}
        <motion.div variants={itemVariants} className="mb-10">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary-600/20 dark:bg-primary-500/20 flex items-center justify-center">
                <FiCpu className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white leading-tight">
                  Ask the AI Agent
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                  <span className="text-xs font-mono text-primary-400">ICP Backend Canister · OpenRouter</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Have questions before reaching out? This AI agent knows Aung's background — ask about his skills, experience, or certifications.
            </p>
            <AskMe />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div variants={containerVariants}>
            <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
              Contact Information
            </h3>
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <motion.a
                  key={info.label}
                  href={info.action}
                  target={info.label === "Address" ? "_blank" : undefined}
                  rel={info.label === "Address" ? "noopener noreferrer" : undefined}
                  className="card p-4 flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-primary-500 dark:text-primary-400 mt-1">
                    {info.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">
                      {info.label}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {info.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={containerVariants}>
            <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
              Send a Message
            </h3>
            <motion.form 
              className="card p-6 space-y-6"
              onSubmit={handleSubmit}
              variants={itemVariants}
            >
              {/* Honeypot — invisible to humans, bots auto-fill it */}
              <input
                type="text"
                name="website"
                id="website"
                value={formData.website}
                onChange={handleInputChange}
                autoComplete="off"
                aria-hidden="true"
                tabIndex={-1}
                style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
              />
              <div>
                <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.email 
                      ? 'border-red-500 dark:border-red-400' 
                      : 'border-gray-300 dark:border-slate-600'
                  } dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-100`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.message 
                      ? 'border-red-500 dark:border-red-400' 
                      : 'border-gray-300 dark:border-slate-600'
                  } dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-100`}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
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
                  <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                    {errors.turnstile}
                  </p>
                )}
              </div>
              <motion.button
                type="submit"
                className={`w-full btn ${getButtonStyle()} text-white`}
                whileHover={{ scale: formStatus === 'sending' ? 1 : 1.02 }}
                whileTap={{ scale: formStatus === 'sending' ? 1 : 0.98 }}
                disabled={formStatus === 'sending' || isOnCooldown() || !turnstileToken}
              >
                {getButtonText()}
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact; 