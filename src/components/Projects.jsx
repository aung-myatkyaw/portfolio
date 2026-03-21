import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaBriefcase, FaCode, FaTools, FaServer } from 'react-icons/fa';

const colorMap = {
  blue: {
    dot: 'bg-blue-500 dark:bg-blue-400',
    badge: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800',
  },
  green: {
    dot: 'bg-green-500 dark:bg-green-400',
    badge: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800',
  },
  purple: {
    dot: 'bg-purple-500 dark:bg-purple-400',
    badge: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 hover:bg-purple-200 dark:hover:bg-purple-800',
  },
  indigo: {
    dot: 'bg-indigo-500 dark:bg-indigo-400',
    badge: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-100 hover:bg-indigo-200 dark:hover:bg-indigo-800',
  },
};

const Projects = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const projects = [
    {
      title: "Senior DevSecOps Engineer",
      company: "General Magick Industries | May 2024 - Present",
      icon: <FaServer className="w-6 h-6" />,
      description: "Architecting secure multicloud infrastructure for scalable AI applications. Automated CI/CD pipelines with embedded security scanning, deployed containerized AI workloads on Kubernetes, and drove adoption of security-first practices across the engineering org.",
      technologies: ["AWS", "Kubernetes", "GitHub Actions", "Terraform", "AI Infrastructure", "Prometheus", "Grafana"],
      color: "blue"
    },
    {
      title: "DevOps Engineer",
      company: "Yoma Bank | Nov 2022 - Feb 2024",
      icon: <FaBriefcase className="w-6 h-6" />,
      description: "Built and maintained GitLab CI/CD pipelines automating the full lifecycle of microservices for one of Myanmar's largest banks. Improved deployment velocity and cross-team collaboration between development scrum teams and IT operations.",
      technologies: ["GitLab CI/CD", "Kubernetes", "Microservices", "IaC", "Monitoring"],
      color: "green"
    },
    {
      title: "DevOps Engineer",
      company: "Karzo Myanmar Co., Ltd. | Mar 2022 - Nov 2022",
      icon: <FaTools className="w-6 h-6" />,
      description: "Owned the end-to-end DevOps toolchain for a logistics startup — managing code releases, production deployments, VM/database provisioning, and system integration testing to streamline delivery cycles.",
      technologies: ["CI/CD", "VM Management", "System Integration", "Performance Testing", "SaaS Tools"],
      color: "purple"
    },
    {
      title: "Junior DevOps Engineer / Developer",
      company: "Global Wave Technology | May 2020 - Feb 2022",
      icon: <FaCode className="w-6 h-6" />,
      description: "Started as a full-stack developer building cross-platform mobile and web applications, then transitioned into DevOps — gaining foundational experience in infrastructure automation and deployment workflows.",
      technologies: ["Xamarin", "TypeScript", "Angular", ".NET Core", "MySQL", "Docker"],
      color: "indigo"
    }
  ];

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
      <motion.h2 
        className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12"
        variants={itemVariants}
      >
        Work Experience
      </motion.h2>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>

        <div className="space-y-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              variants={itemVariants}
              className="relative"
            >
              <motion.div 
                className="md:ml-24 relative"
                whileHover={{ scale: 1.02 }}
              >
                {/* Timeline dot */}
                <div className="absolute left-[-3.5rem] top-6 hidden md:block">
                  <motion.div 
                    className={`w-6 h-6 rounded-full ${colorMap[project.color].dot} flex items-center justify-center text-white`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    {project.icon}
                  </motion.div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center mb-4">
                    <div className="md:hidden mr-4">
                      <div className={`w-10 h-10 rounded-full ${colorMap[project.color].dot} flex items-center justify-center text-white`}>
                        {project.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {project.title}
                      </h3>
                      <p className="text-md text-gray-600 dark:text-gray-400">
                        {project.company}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {project.description}
                  </p>
                  <motion.div 
                    className="flex flex-wrap gap-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {project.technologies.map((tech) => (
                      <motion.span
                        key={tech}
                        className={`px-3 py-1 rounded-full text-sm transition-colors cursor-default ${colorMap[project.color].badge}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Projects; 