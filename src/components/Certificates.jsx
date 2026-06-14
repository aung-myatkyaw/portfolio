import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaAward, FaExternalLinkAlt } from 'react-icons/fa';

const GROUP_ORDER = ['Cloud Native', 'Cloud', 'DevSecOps', 'DevOps', 'Language'];

const categoryMeta = {
  'Cloud Native': { focus: 'Kubernetes security, RBAC, network policies' },
  Cloud: { focus: 'Multicloud operations and architecture' },
  DevSecOps: { focus: 'Security embedded in CI/CD pipelines' },
  DevOps: { focus: 'Pipeline design and deployment automation' },
  Language: { focus: 'Professional communication' },
};

const certColorMap = {
  blue: {
    border: 'border-blue-500/30 hover:border-blue-400/60',
    glow: 'from-blue-500/5',
    badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  },
  amber: {
    border: 'border-amber-500/30 hover:border-amber-400/60',
    glow: 'from-amber-500/5',
    badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  },
  green: {
    border: 'border-emerald-500/30 hover:border-emerald-400/60',
    glow: 'from-emerald-500/5',
    badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  },
  red: {
    border: 'border-red-500/30 hover:border-red-400/60',
    glow: 'from-red-500/5',
    badge: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  },
  orange: {
    border: 'border-orange-500/30 hover:border-orange-400/60',
    glow: 'from-orange-500/5',
    badge: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
  },
};

const certificates = [
  {
    title: 'Certified Kubernetes Security Specialist (CKS)',
    issuer: 'The Linux Foundation',
    link: 'https://bit.ly/3v2wEt0',
    category: 'Cloud Native',
    color: 'blue',
    status: 'Active',
    focus: 'Cluster hardening, supply chain security, runtime protection',
  },
  {
    title: 'Certified Kubernetes Administrator (CKA)',
    issuer: 'The Linux Foundation',
    link: 'https://bit.ly/48DAesj',
    category: 'Cloud Native',
    color: 'blue',
    status: 'Active',
    focus: 'Cluster administration, troubleshooting, networking',
  },
  {
    title: 'AWS Certified SysOps Administrator – Associate',
    issuer: 'Amazon Web Services',
    link: null,
    category: 'Cloud',
    color: 'amber',
    status: 'Active',
    focus: 'AWS operations, monitoring, and deployment',
  },
  {
    title: 'DevSecOps - Kubernetes DevOps & Security',
    issuer: 'KodeKloud',
    link: 'https://bit.ly/4d8QqV8',
    category: 'DevSecOps',
    color: 'red',
    status: 'Active',
    focus: 'Security gates in Kubernetes pipelines',
  },
  {
    title: 'GitLab CI/CD: Architecting, Deploying, and Optimizing Pipelines',
    issuer: 'KodeKloud',
    link: 'https://bit.ly/3xFN0ZQ',
    category: 'DevOps',
    color: 'orange',
    status: 'Active',
    focus: 'Pipeline architecture and optimization',
  },
  {
    title: 'Istio by Solo.io Certifications',
    issuer: 'Credly',
    link: 'https://bit.ly/3Y1CIej',
    category: 'Cloud Native',
    color: 'blue',
    status: 'Active',
    focus: 'Service mesh traffic management and security',
  },
  {
    title: 'EF SET English Certificate 74/100 (C2 Proficient)',
    issuer: 'EF SET',
    link: 'https://cert.efset.org/e9fFTA',
    category: 'Language',
    color: 'green',
    status: 'Active',
    focus: 'C2-level professional English communication',
  },
  {
    title: 'DevOps on AWS Specialization',
    issuer: 'Coursera',
    link: 'https://bit.ly/3qFbwna',
    category: 'Cloud',
    color: 'amber',
    status: 'Active',
    focus: 'AWS DevOps tooling and best practices',
  },
  {
    title: 'Google Cloud Skills Boost Achievements',
    issuer: 'Google Cloud',
    link: 'https://bit.ly/3tP5x1O',
    category: 'Cloud',
    color: 'amber',
    status: 'Active',
    focus: 'Hands-on GCP labs and certifications',
  },
  {
    title: 'Learn DevOps: Docker, Kubernetes, Terraform and Azure DevOps',
    issuer: 'Udemy',
    link: 'https://bit.ly/3a7L915',
    category: 'DevOps',
    color: 'orange',
    status: 'Active',
    focus: 'Full-stack DevOps toolchain fundamentals',
  },
  {
    title: 'Preparing for Google Cloud Certification: Cloud DevOps Engineer',
    issuer: 'Coursera',
    link: 'https://bit.ly/31JoVSa',
    category: 'Cloud',
    color: 'amber',
    status: 'Active',
    focus: 'GCP DevOps engineer preparation',
  },
];

const CredentialCard = ({ cert, variants }) => {
  const [flipped, setFlipped] = useState(false);
  const colors = certColorMap[cert.color] || certColorMap.blue;

  return (
    <motion.div
      className="group h-full [perspective:1000px]"
      variants={variants}
      whileHover={{ scale: 1.02 }}
    >
      <div
        className={`relative h-full min-h-[180px] transition-transform duration-500 [transform-style:preserve-3d] cursor-pointer ${
          flipped ? '[transform:rotateY(180deg)]' : ''
        }`}
        onClick={() => setFlipped(!flipped)}
        onKeyDown={(e) => e.key === 'Enter' && setFlipped(!flipped)}
        role="button"
        tabIndex={0}
        aria-label={`${cert.title}, click to ${flipped ? 'show front' : 'show focus areas'}`}
      >
        {/* Front */}
        <div className={`absolute inset-0 [backface-visibility:hidden] credential-card border ${colors.border} bg-gradient-to-br ${colors.glow} to-transparent`}>
          {cert.link && (
            <a
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-4 right-4 p-1.5 rounded-md text-gray-400 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
              aria-label={`Verify ${cert.title}`}
              onClick={(e) => e.stopPropagation()}
            >
              <FaExternalLinkAlt className="w-3 h-3" />
            </a>
          )}
          <div className="flex items-start gap-3 mb-3 pr-6">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
              <FaAward className="w-5 h-5 text-primary-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white leading-snug">{cert.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{cert.issuer}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="status-badge">
              <span className="status-badge-dot" />
              {cert.status}
            </span>
            <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full ${colors.badge}`}>
              {cert.category}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 font-mono mt-auto">
            {categoryMeta[cert.category]?.focus}
          </p>
        </div>

        {/* Back */}
        <div className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] credential-card border ${colors.border} bg-gradient-to-br ${colors.glow} to-transparent`}>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Focus Areas</h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{cert.focus}</p>
          <p className="text-[10px] font-mono text-gray-400 dark:text-gray-500 mt-auto pt-4">
            click to flip back
          </p>
        </div>
      </div>
    </motion.div>
  );
};

CredentialCard.propTypes = {
  cert: PropTypes.shape({
    title: PropTypes.string.isRequired,
    issuer: PropTypes.string.isRequired,
    link: PropTypes.string,
    category: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    focus: PropTypes.string.isRequired,
  }).isRequired,
  variants: PropTypes.object,
};

const Certificates = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const grouped = GROUP_ORDER.reduce((acc, group) => {
    const items = certificates.filter((c) => c.category === group);
    if (items.length) acc[group] = items;
    return acc;
  }, {});

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { y: 16, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      ref={ref}
      className="container mx-auto px-4 py-16"
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="text-center mb-12">
        <h2 className="section-title mb-2">Credential Vault</h2>
        <p className="text-gray-500 dark:text-gray-400 font-mono text-sm">
          {'// verified certifications — click a card to flip'}
        </p>
      </motion.div>

      {Object.entries(grouped).map(([group, certs]) => (
        <motion.section key={group} variants={itemVariants} className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{group}</h3>
            <span className="text-xs font-mono text-gray-400 dark:text-gray-500">
              {certs.length} credential{certs.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certs.map((cert) => (
              <CredentialCard key={cert.title} cert={cert} variants={itemVariants} />
            ))}
          </div>
        </motion.section>
      ))}
    </motion.div>
  );
};

export default Certificates;
