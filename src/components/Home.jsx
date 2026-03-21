import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaGitlab } from 'react-icons/fa';

const Home = () => {
  const socialLinks = [
    {
      icon: <FaLinkedin className="w-6 h-6" />,
      url: "https://www.linkedin.com/in/aung-myat-kyaw/",
      label: "LinkedIn"
    },
    {
      icon: <FaGithub className="w-6 h-6" />,
      url: "https://github.com/aung-myatkyaw",
      label: "GitHub"
    },
    {
      icon: <FaGitlab className="w-6 h-6" />,
      url: "https://gitlab.com/aungmyatkyaw",
      label: "GitLab"
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-primary-900/20 dark:via-transparent dark:to-transparent pointer-events-none" />
      <div className="absolute inset-0 dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNDgsMTYzLDE4NCwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-60 pointer-events-none" />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-4 max-w-4xl relative z-10"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-6xl font-bold mb-4">
            <span className="gradient-text">Aung Myat Kyaw</span>
          </h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-2xl text-gray-600 dark:text-gray-300 mb-2">
              Senior DevSecOps Engineer
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
              CKS &bull; CKA &bull; AWS SysOps &bull; 5+ Years in Cloud & Security
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            I architect secure, scalable infrastructure for AI-native applications &mdash; from 
            Kubernetes clusters and multicloud platforms to CI/CD pipelines that ship AI workloads 
            safely to production.
          </p>
        </motion.div>

        <motion.div 
          className="flex justify-center space-x-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {socialLinks.map((link) => (
            <motion.a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {link.icon}
              <span className="sr-only">{link.label}</span>
            </motion.a>
          ))}
        </motion.div>

        <motion.div 
          className="flex justify-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.a 
            href="/experiences" 
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Experience
          </motion.a>
          <motion.a 
            href="/contact"
            className="btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Me
          </motion.a>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Home; 