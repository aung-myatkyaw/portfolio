import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useInView } from 'react-intersection-observer';
import {
  FiCloud,
  FiGitBranch,
  FiShield,
  FiCpu,
  FiCode,
  FiMonitor,
} from 'react-icons/fi';

const levelToProficiency = (level) => {
  if (level >= 5) return { label: 'Expert', className: 'proficiency-expert' };
  if (level >= 4) return { label: 'Advanced', className: 'proficiency-advanced' };
  return { label: 'Working', className: 'proficiency-working' };
};

const skillCategories = [
  {
    id: 'cloud',
    title: 'Cloud & Infrastructure',
    icon: FiCloud,
    span: 'lg:col-span-2',
    description: 'Multicloud IaC, Kubernetes orchestration, and container platforms for AI workloads.',
    skills: [
      { name: 'Kubernetes', level: 5, hint: 'Production clusters, RBAC, GPU scheduling' },
      { name: 'AWS', level: 5, hint: 'EKS, IAM, SysOps-certified ops' },
      { name: 'GCP', level: 4, hint: 'GKE, Cloud Skills Boost' },
      { name: 'Azure', level: 4, hint: 'AKS, Azure DevOps pipelines' },
      { name: 'Docker', level: 5, hint: 'Containerized microservices & AI apps' },
      { name: 'Terraform', level: 4, hint: 'Multicloud IaC at General Magic' },
      { name: 'Rancher', level: 4, hint: 'Multi-cluster management' },
    ],
  },
  {
    id: 'cicd',
    title: 'DevOps & CI/CD',
    icon: FiGitBranch,
    span: 'lg:col-span-2',
    description: 'Automated pipelines with embedded security gates.',
    pipeline: ['commit', 'build', 'scan', 'deploy', 'monitor'],
    skills: [
      { name: 'GitLab CI/CD', level: 5, hint: 'Banking microservices lifecycle' },
      { name: 'GitHub Actions', level: 5, hint: 'Security scanning in CI at General Magic' },
      { name: 'Jenkins', level: 4 },
      { name: 'Helm / ArgoCD', level: 4 },
    ],
  },
  {
    id: 'security',
    title: 'Security & Monitoring',
    icon: FiShield,
    description: 'DevSecOps practices, mesh, and observability.',
    skills: [
      { name: 'DevSecOps', level: 5, hint: 'Security-first automation' },
      { name: 'Istio / Service Mesh', level: 4 },
      { name: 'Prometheus & Grafana', level: 4 },
      { name: 'Vulnerability Scanning', level: 4 },
      { name: 'IAM & Network Security', level: 4 },
    ],
  },
  {
    id: 'ai',
    title: 'AI & ML Infrastructure',
    icon: FiCpu,
    description: 'Serving AI workloads safely on Kubernetes.',
    skills: [
      { name: 'AI App Deployment (K8s)', level: 4 },
      { name: 'GPU Workload Orchestration', level: 3 },
      { name: 'LLM Serving & Inference', level: 3 },
      { name: 'MLOps Pipelines', level: 3 },
      { name: 'AI Security (OWASP LLM)', level: 3 },
    ],
  },
  {
    id: 'programming',
    title: 'Programming & Scripting',
    icon: FiCode,
    description: 'Automation scripts and tooling for infrastructure workflows.',
    skills: [
      { name: 'Shell Scripting', level: 4 },
      { name: 'Python', level: 4 },
      { name: 'TypeScript / Node.js', level: 3 },
      { name: 'C# / .NET', level: 3 },
    ],
  },
  {
    id: 'sysadmin',
    title: 'System Administration',
    icon: FiMonitor,
    description: 'Linux ops, networking, and incident response.',
    skills: [
      { name: 'Linux/Unix', level: 5 },
      { name: 'Incident Response', level: 4 },
      { name: 'Network Engineering', level: 4 },
      { name: 'Threat Assessment', level: 4 },
    ],
  },
];

const SkillRow = ({ skill }) => {
  const prof = levelToProficiency(skill.level);
  return (
    <li
      className="flex items-center justify-between gap-3 py-2 border-b border-slate-200/70 dark:border-slate-700/45 last:border-b-0"
      title={skill.hint || undefined}
    >
      <span className="text-sm text-gray-700 dark:text-gray-300">{skill.name}</span>
      <span className={`${prof.className} flex-shrink-0`}>{prof.label}</span>
    </li>
  );
};

SkillRow.propTypes = {
  skill: PropTypes.shape({
    name: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
    hint: PropTypes.string,
  }).isRequired,
};

const MiniPipeline = ({ stages }) => (
  <div className="flex items-center gap-1 py-2 mb-1 overflow-x-auto">
    {stages.map((stage, i) => (
      <div key={stage} className="flex items-center flex-shrink-0">
        <div className={`pipeline-node ${i <= 3 ? 'pipeline-node-active' : ''}`}>
          {stage[0].toUpperCase()}
        </div>
        {i < stages.length - 1 && <div className="pipeline-connector" />}
      </div>
    ))}
  </div>
);

MiniPipeline.propTypes = {
  stages: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const BentoTile = ({ category, variants }) => {
  const Icon = category.icon;

  return (
    <motion.div
      className={`bento-tile h-full self-stretch ${category.span || ''}`}
      variants={variants}
      whileHover={{ scale: 1.005 }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 flex-shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white leading-snug">
            {category.title}
          </h3>
          {category.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {category.pipeline && <MiniPipeline stages={category.pipeline} />}

      <ul>
        {category.skills.map((skill) => (
          <SkillRow key={skill.name} skill={skill} />
        ))}
      </ul>
    </motion.div>
  );
};

BentoTile.propTypes = {
  category: PropTypes.shape({
    title: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    span: PropTypes.string,
    description: PropTypes.string,
    pipeline: PropTypes.arrayOf(PropTypes.string),
    skills: PropTypes.array.isRequired,
  }).isRequired,
  variants: PropTypes.object,
};

const Skills = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 12, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.35 } },
  };

  return (
    <motion.div
      ref={ref}
      className="container mx-auto px-4 py-16 max-w-6xl"
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="text-center mb-10">
        <h2 className="section-title mb-2">Capability Matrix</h2>
        <p className="text-gray-500 dark:text-gray-400 font-mono text-sm">
          {'// proficiency across the DevSecOps stack'}
        </p>
      </motion.div>

      <div className="space-y-4">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch"
          variants={containerVariants}
        >
          {skillCategories.slice(0, 2).map((cat) => (
            <BentoTile key={cat.id} category={cat} variants={itemVariants} />
          ))}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch"
          variants={containerVariants}
        >
          {skillCategories.slice(2).map((cat) => (
            <BentoTile key={cat.id} category={cat} variants={itemVariants} />
          ))}
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="mt-10">
        <h3 className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-white">
          Languages
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          {[
            { name: 'Burmese', level: 'Native' },
            { name: 'English', level: 'C2 Proficient (CEFR)' },
          ].map((lang) => (
            <motion.div key={lang.name} className="bento-tile" whileHover={{ scale: 1.01 }}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-300">{lang.name}</span>
                <span className="proficiency-expert">{lang.level}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Skills;
