import { motion } from 'framer-motion';
import { FaGraduationCap, FaAward, FaBrain, FaRocket } from 'react-icons/fa';
import { getExperiencePlusLabel } from '../lib/career';

const About = () => {
  const experienceLabel = getExperiencePlusLabel();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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

  const highlights = [
    {
      icon: <FaGraduationCap className="w-6 h-6" />,
      title: "Education",
      description: "Bachelor of Engineering in Computer Engineering and Information Technology (CEIT) from Yangon Technological University (2019)"
    },
    {
      icon: <FaAward className="w-6 h-6" />,
      title: "Certifications",
      description: `CKS, CKA, and AWS Certified SysOps Administrator with ${experienceLabel} years of hands-on industry experience across cloud platforms`
    },
    {
      icon: <FaBrain className="w-6 h-6" />,
      title: "Expertise",
      description: "Architecting secure multicloud infrastructure for AI applications, DevSecOps automation, Kubernetes orchestration, and building resilient CI/CD pipelines"
    },
    {
      icon: <FaRocket className="w-6 h-6" />,
      title: "Approach",
      description: "Security-first mindset with a passion for automating everything — from infrastructure provisioning to threat detection in AI-native environments"
    }
  ];

  const interests = ["AI Infrastructure", "Cloud Security", "Automation", "Open Source"];

  return (
    <motion.div 
      className="container mx-auto px-4 py-16"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h2 
        className="text-3xl font-bold text-gray-800 dark:text-white mb-12 text-center"
        variants={itemVariants}
      >
        About Me
      </motion.h2>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        variants={containerVariants}
      >
        {highlights.map((item) => (
          <motion.div
            key={item.title}
            className="card p-6 flex items-start space-x-4"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-primary-500 dark:text-primary-400">
              {item.icon}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants}>
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Interests
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {interests.map((interest) => (
              <motion.div
                key={interest}
                className="card p-4 text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-gray-600 dark:text-gray-300">
                  {interest}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Contact Details
          </h3>
          <motion.div 
            className="card p-6 space-y-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-gray-600 dark:text-gray-300">
              <p>Bangkok, Thailand</p>
              <p className="mt-4">
                <a 
                  href="mailto:aungmyatkyaw.kk@gmail.com"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  aungmyatkyaw.kk@gmail.com
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default About; 