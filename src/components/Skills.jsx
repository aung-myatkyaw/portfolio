import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Skills = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const skillCategories = [
    {
      title: "Cloud & Infrastructure",
      icon: "☁️",
      skills: [
        { name: "Kubernetes", level: 5 },
        { name: "AWS", level: 5 },
        { name: "Google Cloud Platform (GCP)", level: 4 },
        { name: "Microsoft Azure", level: 4 },
        { name: "Docker", level: 5 },
        { name: "Terraform", level: 4 },
        { name: "Rancher", level: 4 }
      ]
    },
    {
      title: "DevOps & CI/CD",
      icon: "🔄",
      skills: [
        { name: "GitLab CI/CD", level: 5 },
        { name: "GitHub Actions", level: 5 },
        { name: "Jenkins", level: 4 },
        { name: "Azure DevOps", level: 4 },
        { name: "Helm Charts", level: 4 },
        { name: "ArgoCD", level: 4 }
      ]
    },
    {
      title: "Security & Monitoring",
      icon: "🔒",
      skills: [
        { name: "DevSecOps", level: 5 },
        { name: "Istio / Service Mesh", level: 4 },
        { name: "Prometheus & Grafana", level: 4 },
        { name: "Vulnerability Scanning", level: 4 },
        { name: "IAM & Network Security", level: 4 },
        { name: "Cloudflare / API Gateways", level: 4 }
      ]
    },
    {
      title: "AI & ML Infrastructure",
      icon: "🤖",
      skills: [
        { name: "AI App Deployment (K8s)", level: 4 },
        { name: "GPU Workload Orchestration", level: 3 },
        { name: "LLM Serving & Inference", level: 3 },
        { name: "MLOps Pipelines", level: 3 },
        { name: "AI Security (OWASP LLM)", level: 3 },
        { name: "Vector DB Infrastructure", level: 3 }
      ]
    },
    {
      title: "Programming & Scripting",
      icon: "💻",
      skills: [
        { name: "Shell Scripting", level: 4 },
        { name: "Python", level: 4 },
        { name: "Node.js", level: 3 },
        { name: "C#/.NET", level: 3 },
        { name: "Java", level: 3 },
        { name: "TypeScript / Angular", level: 3 }
      ]
    },
    {
      title: "System Administration",
      icon: "🖥️",
      skills: [
        { name: "Linux/Unix", level: 5 },
        { name: "Incident Response", level: 4 },
        { name: "Network Engineering", level: 4 },
        { name: "System Optimization", level: 4 },
        { name: "Threat Assessment", level: 4 }
      ]
    }
  ];

  const renderSkillLevel = (level) => {
    return (
      <div className="flex space-x-1">
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`w-3 h-3 rounded-full ${
              index < level 
                ? 'bg-primary-500 dark:bg-primary-400' 
                : 'bg-gray-200 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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
        variants={itemVariants}
        className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12"
      >
        Professional Skills
      </motion.h2>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
      >
        {skillCategories.map((category) => (
          <motion.div 
            key={category.title} 
            className="card p-6"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">{category.icon}</span>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                {category.title}
              </h3>
            </div>
            <ul className="space-y-4">
              {category.skills.map((skill) => (
                <motion.li 
                  key={skill.name} 
                  className="group"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {skill.name}
                    </span>
                    {renderSkillLevel(skill.level)}
                  </div>
                  <motion.div 
                    className="h-[2px] bg-primary-500/20 mt-2"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: skill.level / 5 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        className="mt-12"
      >
        <h3 className="text-xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
          Languages
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <motion.div 
            className="card p-6"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Burmese</span>
              <span className="text-primary-600 dark:text-primary-400 font-semibold">Native</span>
            </div>
          </motion.div>
          <motion.div 
            className="card p-6"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">English</span>
              <span className="text-primary-600 dark:text-primary-400 font-semibold">C2-Proficient (CEFR)</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Skills; 