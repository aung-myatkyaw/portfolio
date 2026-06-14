import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useInView } from 'react-intersection-observer';
import {
  FiBook,
  FiAward,
  FiCpu,
  FiShield,
  FiMapPin,
  FiMail,
  FiBriefcase,
} from 'react-icons/fi';
import { getExperiencePlusLabel, getCareerRangeLabel } from '../lib/career';

const highlights = [
  {
    icon: FiBook,
    title: 'Education',
    tag: 'academic',
    description:
      'Bachelor of Engineering in Computer Engineering and Information Technology (CEIT), Yangon Technological University, 2019',
  },
  {
    icon: FiAward,
    title: 'Certifications',
    tag: 'security',
    description: null, // filled dynamically
  },
  {
    icon: FiCpu,
    title: 'Expertise',
    tag: 'ai',
    description:
      'Architecting secure multicloud infrastructure for AI applications, DevSecOps automation, Kubernetes orchestration, and resilient CI/CD pipelines',
  },
  {
    icon: FiShield,
    title: 'Approach',
    tag: 'security',
    description:
      'Security-first mindset with a passion for automating everything — from infrastructure provisioning to threat detection in AI-native environments',
  },
];

const interests = [
  { name: 'AI Infrastructure', tag: 'tag-ai' },
  { name: 'Cloud Security', tag: 'tag-security' },
  { name: 'Automation', tag: 'tag-cicd' },
  { name: 'Open Source', tag: 'tag-cloud' },
];

const tagClass = {
  academic: 'tag-cloud',
  security: 'tag-security',
  ai: 'tag-ai',
  cicd: 'tag-cicd',
};

const HighlightTile = ({ item, description, variants }) => {
  const Icon = item.icon;
  return (
    <motion.div className="bento-tile" variants={variants} whileHover={{ scale: 1.01 }}>
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{item.title}</h3>
            <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full ${tagClass[item.tag]}`}>
              {item.tag}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

HighlightTile.propTypes = {
  item: PropTypes.shape({
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
  }).isRequired,
  description: PropTypes.string.isRequired,
  variants: PropTypes.object,
};

const About = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const experienceLabel = getExperiencePlusLabel();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { y: 16, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  };

  const certDescription = `CKS, CKA, and AWS Certified SysOps Administrator with ${experienceLabel} years of hands-on industry experience across cloud platforms`;

  const metrics = [
    { label: 'Experience', value: `${experienceLabel} yrs`, mono: getCareerRangeLabel() },
    { label: 'Location', value: 'Bangkok, TH', mono: 'UTC+7' },
    { label: 'Open to', value: 'Senior roles', mono: 'DevSecOps · Platform · AI Infra' },
  ];

  return (
    <motion.div
      ref={ref}
      className="container mx-auto px-4 py-16"
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="text-center mb-10">
        <h2 className="section-title mb-2">About Me</h2>
        <p className="text-gray-500 dark:text-gray-400 font-mono text-sm">
          {'// security-first platform engineer — Bangkok, Thailand'}
        </p>
      </motion.div>

      {/* Metrics strip */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-4xl mx-auto"
      >
        {metrics.map((m) => (
          <div key={m.label} className="bento-tile text-center sm:text-left">
            <p className="text-[10px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
              {m.label}
            </p>
            <p className="text-xl font-semibold text-gray-800 dark:text-white">{m.value}</p>
            <p className="text-xs font-mono text-primary-600 dark:text-primary-400 mt-1">{m.mono}</p>
          </div>
        ))}
      </motion.div>

      {/* Highlights bento */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-5xl mx-auto"
        variants={containerVariants}
      >
        {highlights.map((item) => (
          <HighlightTile
            key={item.title}
            item={item}
            description={item.title === 'Certifications' ? certDescription : item.description}
            variants={itemVariants}
          />
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
            Interests
            <span className="text-xs font-mono text-gray-400 dark:text-gray-500 font-normal">
              {'// focus areas'}
            </span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {interests.map((interest) => (
              <motion.div
                key={interest.name}
                className="bento-tile text-center py-4"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={`px-3 py-1 text-xs font-mono rounded-full ${interest.tag}`}>
                  {interest.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
            Contact Details
            <span className="status-badge ml-auto">
              <span className="status-badge-dot" />
              reachable
            </span>
          </h3>
          <div className="bento-tile space-y-4">
            <div className="flex items-start gap-3">
              <FiMapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white">Bangkok, Thailand</p>
                <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mt-0.5">Open to remote / hybrid</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiMail className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <a
                href="mailto:aungmyatkyaw.kk@gmail.com"
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-mono break-all"
              >
                aungmyatkyaw.kk@gmail.com
              </a>
            </div>
            <div className="flex items-start gap-3">
              <FiBriefcase className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Senior DevSecOps, AI Infrastructure, or Platform Engineering at AI-first companies
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default About;
