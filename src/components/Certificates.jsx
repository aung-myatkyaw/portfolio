import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaAward, FaExternalLinkAlt } from 'react-icons/fa';

const certColorMap = {
  blue: {
    iconBg: 'bg-blue-100 dark:bg-blue-900',
    iconText: 'text-blue-500 dark:text-blue-400',
    badge: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
  },
  amber: {
    iconBg: 'bg-amber-100 dark:bg-amber-900',
    iconText: 'text-amber-500 dark:text-amber-400',
    badge: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
  },
  green: {
    iconBg: 'bg-green-100 dark:bg-green-900',
    iconText: 'text-green-500 dark:text-green-400',
    badge: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
  },
  red: {
    iconBg: 'bg-red-100 dark:bg-red-900',
    iconText: 'text-red-500 dark:text-red-400',
    badge: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
  },
  orange: {
    iconBg: 'bg-orange-100 dark:bg-orange-900',
    iconText: 'text-orange-500 dark:text-orange-400',
    badge: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
  },
};

const Certificates = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const certificates = [
    {
      title: "Certified Kubernetes Security Specialist (CKS)",
      issuer: "The Linux Foundation",
      link: "https://bit.ly/3v2wEt0",
      category: "Cloud Native",
      color: "blue"
    },
    {
      title: "Certified Kubernetes Administrator (CKA)",
      issuer: "The Linux Foundation",
      link: "https://bit.ly/48DAesj",
      category: "Cloud Native",
      color: "blue"
    },
    {
      title: "AWS Certified SysOps Administrator \u2013 Associate",
      issuer: "Amazon Web Services",
      link: "#",
      category: "Cloud",
      color: "amber"
    },
    {
      title: "DevSecOps - Kubernetes DevOps & Security",
      issuer: "KodeKloud",
      link: "https://bit.ly/4d8QqV8",
      category: "DevSecOps",
      color: "red"
    },
    {
      title: "GitLab CI/CD: Architecting, Deploying, and Optimizing Pipelines",
      issuer: "KodeKloud",
      link: "https://bit.ly/3xFN0ZQ",
      category: "DevOps",
      color: "orange"
    },
    {
      title: "Istio by Solo.io Certifications",
      issuer: "Credly",
      link: "https://bit.ly/3Y1CIej",
      category: "Cloud Native",
      color: "blue"
    },
    {
      title: "EF SET English Certificate 74/100 (C2 Proficient)",
      issuer: "EF SET",
      link: "https://cert.efset.org/e9fFTA",
      category: "Language",
      color: "green"
    },
    {
      title: "DevOps on AWS Specialization",
      issuer: "Coursera",
      link: "https://bit.ly/3qFbwna",
      category: "Cloud",
      color: "amber"
    },
    {
      title: "Google Cloud Skills Boost Achievements",
      issuer: "Google Cloud",
      link: "https://bit.ly/3tP5x1O",
      category: "Cloud",
      color: "amber"
    },
    {
      title: "Learn DevOps: Docker, Kubernetes, Terraform and Azure DevOps",
      issuer: "Udemy",
      link: "https://bit.ly/3a7L915",
      category: "DevOps",
      color: "orange"
    },
    {
      title: "Preparing for Google Cloud Certification: Cloud DevOps Engineer",
      issuer: "Coursera",
      link: "https://bit.ly/31JoVSa",
      category: "Cloud",
      color: "amber"
    }
  ];

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
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      ref={ref}
      className="container mx-auto px-4 py-16"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <motion.div 
        className="text-center mb-12"
        variants={itemVariants}
      >
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Certifications & Achievements
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Professional certifications and continuous learning achievements
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        {certificates.map((cert) => (
          <motion.a
            key={cert.title}
            href={cert.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group card p-6 flex flex-col h-full"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start mb-4">
              <div className={`p-2 rounded-lg ${certColorMap[cert.color].iconBg} mr-4`}>
                <FaAward className={`w-6 h-6 ${certColorMap[cert.color].iconText}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {cert.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Issued by {cert.issuer}
                </p>
              </div>
            </div>
            <div className="mt-auto flex items-center justify-between">
              <span className={`px-3 py-1 text-sm rounded-full ${certColorMap[cert.color].badge}`}>
                {cert.category}
              </span>
              <FaExternalLinkAlt className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
            </div>
          </motion.a>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Certificates; 