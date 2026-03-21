import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaGitlab } from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/aung-myat-kyaw/",
      icon: <FaLinkedin className="w-5 h-5" />,
      color: "hover:text-blue-600"
    },
    {
      name: "GitHub",
      url: "https://github.com/aung-myatkyaw",
      icon: <FaGithub className="w-5 h-5" />,
      color: "hover:text-gray-900 dark:hover:text-white"
    },
    {
      name: "GitLab",
      url: "https://gitlab.com/aungmyatkyaw",
      icon: <FaGitlab className="w-5 h-5" />,
      color: "hover:text-orange-600"
    }
  ];

  return (
    <footer className="bg-white dark:bg-slate-900 shadow-lg dark:shadow-slate-900/50 mt-auto dark:border-t dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-6">
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-gray-600 dark:text-gray-400 ${link.color} transition-colors`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.icon}
                <span className="sr-only">{link.name}</span>
              </motion.a>
            ))}
          </div>
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Aung Myat Kyaw. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 