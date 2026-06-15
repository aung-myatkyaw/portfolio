import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaBriefcase, FaCode, FaTools, FaServer, FaChevronDown } from 'react-icons/fa';

const FILTERS = ['All', 'Cloud', 'Security', 'AI/ML', 'Banking'];

const tagClassMap = {
  cloud: 'tag-cloud',
  security: 'tag-security',
  ai: 'tag-ai',
  cicd: 'tag-cicd',
  banking: 'tag-banking',
};

const colorMap = {
  blue: { dot: 'bg-blue-500 dark:bg-blue-400', line: 'border-blue-500/40' },
  green: { dot: 'bg-green-500 dark:bg-green-400', line: 'border-green-500/40' },
  purple: { dot: 'bg-purple-500 dark:bg-purple-400', line: 'border-purple-500/40' },
  indigo: { dot: 'bg-indigo-500 dark:bg-indigo-400', line: 'border-indigo-500/40' },
};

const projects = [
  {
    id: 'gmi',
    title: 'Senior DevSecOps Engineer',
    company: 'General Magic (Thailand) Co., Ltd.',
    period: 'May 2024 – Present',
    icon: <FaServer className="w-4 h-4" />,
    description:
      'Sole platform engineer for organization-wide IaC and Kubernetes — 50+ Terraform projects, dev/prod EKS clusters, and shared platform services for AI-native workloads. Deployed LiteLLM multi-provider AI gateway, Istio service mesh, and full observability (Prometheus, Grafana, Loki, Jaeger). Built production Frappe ERPNext with HRMS on EKS — custom Helm charts, pre-built bench images, site provisioning jobs, and custom module deployment. Provision infrastructure for AI apps, HR platforms, real-time messaging, and identity services on a unified K8s platform.',
    stages: ['Plan', 'Build', 'Scan', 'Deploy', 'Observe', 'Migrate'],
    technologies: [
      { name: 'AWS / EKS', tag: 'cloud' },
      { name: 'Terraform', tag: 'cloud' },
      { name: 'Istio', tag: 'security' },
      { name: 'Karpenter', tag: 'cloud' },
      { name: 'LiteLLM', tag: 'ai' },
      { name: 'ERPNext / HRMS', tag: 'cloud' },
      { name: 'Frappe', tag: 'cloud' },
      { name: 'Prometheus', tag: 'cicd' },
      { name: 'Jaeger', tag: 'cicd' },
      { name: 'Loki', tag: 'cicd' },
      { name: 'Cloudflare', tag: 'cloud' },
      { name: 'GitHub Actions', tag: 'cicd' },
    ],
    filters: ['Cloud', 'Security', 'AI/ML'],
    color: 'blue',
    current: true,
  },
  {
    id: 'yoma',
    title: 'DevOps Engineer',
    company: 'Yoma Bank',
    period: 'Nov 2022 – Feb 2024',
    icon: <FaBriefcase className="w-4 h-4" />,
    description:
      "Built and maintained GitLab CI/CD pipelines automating the full lifecycle of microservices for one of Myanmar's largest banks. Improved deployment velocity and cross-team collaboration between development scrum teams and IT operations.",
    stages: ['Commit', 'Build', 'Test', 'Deploy', 'Verify'],
    technologies: [
      { name: 'GitLab CI/CD', tag: 'cicd' },
      { name: 'Kubernetes', tag: 'cloud' },
      { name: 'Microservices', tag: 'cloud' },
      { name: 'IaC', tag: 'cloud' },
      { name: 'Monitoring', tag: 'cicd' },
    ],
    filters: ['Cloud', 'Banking', 'Security'],
    color: 'green',
    current: false,
  },
  {
    id: 'karzo',
    title: 'DevOps Engineer',
    company: 'Karzo Myanmar Co., Ltd.',
    period: 'Mar 2022 – Nov 2022',
    icon: <FaTools className="w-4 h-4" />,
    description:
      'Owned the end-to-end DevOps toolchain for a logistics startup — managing code releases, production deployments, VM/database provisioning, and system integration testing to streamline delivery cycles.',
    stages: ['Release', 'Provision', 'Deploy', 'SIT', 'Ship'],
    technologies: [
      { name: 'CI/CD', tag: 'cicd' },
      { name: 'VM Management', tag: 'cloud' },
      { name: 'System Integration', tag: 'cicd' },
      { name: 'Performance Testing', tag: 'cicd' },
    ],
    filters: ['Cloud'],
    color: 'purple',
    current: false,
  },
  {
    id: 'gwt',
    title: 'Junior DevOps Engineer / Developer',
    company: 'Global Wave Technology',
    period: 'May 2020 – Feb 2022',
    icon: <FaCode className="w-4 h-4" />,
    description:
      'Started as a full-stack developer building cross-platform mobile and web applications, then transitioned into DevOps — gaining foundational experience in infrastructure automation and deployment workflows.',
    stages: ['Develop', 'Containerize', 'Automate', 'Deploy'],
    technologies: [
      { name: 'Docker', tag: 'cloud' },
      { name: 'TypeScript', tag: 'cicd' },
      { name: 'Angular', tag: 'cicd' },
      { name: '.NET Core', tag: 'cicd' },
    ],
    filters: ['Cloud'],
    color: 'indigo',
    current: false,
  },
];

const PipelineStages = ({ stages, color, active = true }) => (
  <div className="flex items-center gap-0 overflow-x-auto pb-1 mt-4">
    {stages.map((stage, i) => (
      <div key={stage} className="flex items-center flex-shrink-0">
        <div
          className={`px-2.5 py-1 rounded text-[10px] font-mono border ${
            active && i < stages.length
              ? 'border-primary-500/50 bg-primary-500/10 text-primary-600 dark:text-primary-400'
              : 'border-slate-300 dark:border-slate-600 text-gray-500 dark:text-gray-400'
          }`}
        >
          {stage}
        </div>
        {i < stages.length - 1 && (
          <div className={`w-4 h-px mx-0.5 ${colorMap[color]?.line ? '' : ''} bg-slate-300 dark:bg-slate-600`} />
        )}
      </div>
    ))}
    {active && (
      <span className="ml-2 status-badge flex-shrink-0">
        <span className="status-badge-dot" />
        passed
      </span>
    )}
  </div>
);

PipelineStages.propTypes = {
  stages: PropTypes.arrayOf(PropTypes.string).isRequired,
  color: PropTypes.string.isRequired,
  active: PropTypes.bool,
};

const ExperienceCard = ({ project, variants }) => {
  const [expanded, setExpanded] = useState(project.current);
  const colors = colorMap[project.color];

  return (
    <motion.div variants={variants} className="relative">
      <div className={`card p-6 border-l-4 ${colors.line}`}>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left flex items-start justify-between gap-4"
          aria-expanded={expanded}
        >
          <div className="flex items-start gap-4 min-w-0">
            <div className={`w-10 h-10 rounded-full ${colors.dot} flex items-center justify-center text-white flex-shrink-0`}>
              {project.icon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{project.title}</h3>
                {project.current && (
                  <span className="status-badge">
                    <span className="status-badge-dot" />
                    current
                  </span>
                )}
              </div>
              <p className="text-sm font-mono text-gray-500 dark:text-gray-400 mt-0.5">
                {project.company} · {project.period}
              </p>
            </div>
          </div>
          <FaChevronDown
            className={`w-4 h-4 text-gray-400 flex-shrink-0 mt-1 transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm leading-relaxed">
                {project.description}
              </p>
              <PipelineStages stages={project.stages} color={project.color} active={project.current} />
              <div className="flex flex-wrap gap-2 mt-4">
                {project.technologies.map((tech) => (
                  <span
                    key={tech.name}
                    className={`px-2.5 py-1 rounded-full text-xs ${tagClassMap[tech.tag] || 'tag-cloud'}`}
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

ExperienceCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    period: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    description: PropTypes.string.isRequired,
    stages: PropTypes.arrayOf(PropTypes.string).isRequired,
    technologies: PropTypes.arrayOf(
      PropTypes.shape({ name: PropTypes.string.isRequired, tag: PropTypes.string.isRequired })
    ).isRequired,
    filters: PropTypes.arrayOf(PropTypes.string).isRequired,
    color: PropTypes.string.isRequired,
    current: PropTypes.bool,
  }).isRequired,
  variants: PropTypes.object,
};

const Projects = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered =
    activeFilter === 'All'
      ? projects
      : projects.filter((p) => p.filters.includes(activeFilter));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
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
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h2 className="section-title mb-2">Work Experience</h2>
        <p className="text-gray-500 dark:text-gray-400 font-mono text-sm">
          {'// pipeline runs across cloud, security, and AI domains'}
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2 mb-10">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`filter-chip ${
              activeFilter === filter ? 'filter-chip-active' : 'filter-chip-inactive'
            }`}
          >
            {filter}
          </button>
        ))}
      </motion.div>

      <div className="max-w-3xl mx-auto space-y-6">
        {filtered.map((project) => (
          <ExperienceCard key={project.id} project={project} variants={itemVariants} />
        ))}
      </div>
    </motion.div>
  );
};

export default Projects;
