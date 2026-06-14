import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaGitlab } from 'react-icons/fa';
import { getHomeExperienceTagline } from '../lib/career';
import TerminalHero from './TerminalHero';
import ArchitectureShowcase from './ArchitectureShowcase';

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
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] dark:from-primary-900/20 dark:via-transparent dark:to-transparent pointer-events-none" />
      <div className="absolute inset-0 dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNDgsMTYzLDE4NCwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 lg:py-0 lg:min-h-screen lg:flex lg:items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          {/* Identity column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <h1 className="text-5xl sm:text-6xl font-bold mb-4">
                <span className="gradient-text">Aung Myat Kyaw</span>
              </h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-2">
                  Senior DevSecOps Engineer
                </p>
                <p className="metric-strip mb-4">
                  CKS &bull; CKA &bull; AWS SysOps &bull; {getHomeExperienceTagline()}
                </p>
              </motion.div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8"
            >
              I architect secure, scalable infrastructure for AI-native applications &mdash; from
              Kubernetes clusters and multicloud platforms to CI/CD pipelines that ship AI workloads
              safely to production.
            </motion.p>

            <motion.div
              className="flex justify-center lg:justify-start space-x-6 mb-8"
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
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.a
                href="/experiences"
                className="btn-primary text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Experience
              </motion.a>
              <motion.a
                href="/contact"
                className="btn-secondary text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Me
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Terminal column */}
          <div className="relative">
            <TerminalHero />
          </div>
        </div>
      </div>
      </div>
      <ArchitectureShowcase />
    </>
  );
};

export default Home;
