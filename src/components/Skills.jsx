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

const skillCategories = [
  {
    id: 'cloud',
    title: 'Cloud & Infrastructure',
    icon: FiCloud,
    chipClass: 'skill-chip-cloud',
    description: 'Multicloud IaC, EKS platform engineering, API Gateway, and Frappe ERPNext/HRMS on Kubernetes.',
    skills: [
      { name: 'Kubernetes', hint: 'EKS dev/prod, Karpenter, GPU nodes, Istio mesh' },
      { name: 'AWS', hint: 'EKS, IAM, multi-region VPCs, API Gateway' },
      { name: 'GCP', hint: 'GKE, Cloud Skills Boost' },
      { name: 'Azure', hint: 'AKS, Azure DevOps pipelines' },
      { name: 'DigitalOcean', hint: 'Droplets, managed Kubernetes, DNS' },
      { name: 'Docker', hint: 'Containerized microservices & AI apps' },
      { name: 'Terraform', hint: '50+ isolated projects, remote state, KMS secrets' },
      { name: 'Rancher', hint: 'Multi-cluster management' },
    ],
  },
  {
    id: 'cicd',
    title: 'DevOps & CI/CD',
    icon: FiGitBranch,
    chipClass: 'skill-chip-cicd',
    description: 'Automated pipelines with embedded security gates.',
    pipeline: ['commit', 'build', 'scan', 'deploy', 'monitor'],
    skills: [
      { name: 'GitLab CI/CD', hint: 'Banking microservices lifecycle' },
      { name: 'GitHub Actions', hint: 'Security scanning in CI at General Magic' },
      { name: 'Helm / ArgoCD', hint: 'Frappe ERPNext/HRMS Helm charts on EKS' },
      { name: 'Jenkins', hint: 'Legacy pipeline maintenance' },
    ],
  },
  {
    id: 'security',
    title: 'Security & Monitoring',
    icon: FiShield,
    chipClass: 'skill-chip-security',
    description: 'DevSecOps practices, mesh, and observability.',
    skills: [
      { name: 'DevSecOps', hint: 'Security-first automation' },
      { name: 'Istio / Service Mesh', hint: 'Gateway, VirtualService, mTLS on EKS' },
      { name: 'Prometheus & Grafana', hint: 'EKS monitoring stack, SLO dashboards' },
      { name: 'Loki & Jaeger', hint: 'Log aggregation and distributed tracing' },
      { name: 'Vulnerability Scanning' },
      { name: 'IAM & Network Security' },
    ],
  },
  {
    id: 'ai',
    title: 'AI & ML Infrastructure',
    icon: FiCpu,
    chipClass: 'skill-chip-ai',
    description: 'LiteLLM gateway, LLM observability, workflow orchestration, and GPU workloads on EKS.',
    skills: [
      { name: 'AI App Deployment (K8s)', hint: 'Multi-product workloads on shared EKS' },
      { name: 'GPU Workload Orchestration', hint: 'GPU nodes, KubeRay/Ray clusters' },
      { name: 'LLM Serving & Inference', hint: 'LiteLLM multi-provider gateway' },
      { name: 'MLOps Pipelines', hint: 'Hatchet and n8n workflow orchestration' },
      { name: 'AI Security (OWASP LLM)' },
    ],
  },
  {
    id: 'programming',
    title: 'Programming & Scripting',
    icon: FiCode,
    chipClass: 'skill-chip-code',
    description:
      'Many application stacks delivered to production — primary focus is CI/CD pipelines and DevOps, not feature development.',
    skills: [
      { name: 'Python', hint: 'Infra automation and pipeline tooling — GMT' },
      { name: 'Rust', hint: 'ICP canister and platform delivery — GMT; portfolio backend' },
      { name: 'Go', hint: 'Platform services delivered via CI/CD — GMT' },
      { name: 'Node.js / TypeScript', hint: 'Delivered Node apps — GMT, Karzo' },
      { name: 'Java', hint: 'Microservices delivery via GitLab CI/CD — Yoma Bank' },
      { name: 'Angular', hint: 'Pipeline delivery for Angular teams — Global Wave, Yoma' },
      { name: 'Vue.js', hint: 'Vue/Node release automation — Karzo Myanmar' },
      { name: 'C# / .NET', hint: 'Early dev background; later delivery focus — Global Wave' },
      { name: 'Motoko', hint: 'ICP canister deployment — GMT' },
      { name: 'Shell Scripting', hint: 'Pipeline and automation scripts across all roles' },
    ],
  },
  {
    id: 'sysadmin',
    title: 'System Administration',
    icon: FiMonitor,
    chipClass: 'skill-chip-ops',
    description: 'Linux ops, networking, and incident response.',
    skills: [
      { name: 'Linux/Unix' },
      { name: 'Incident Response' },
      { name: 'Network Engineering' },
      { name: 'Threat Assessment' },
    ],
  },
];

const SkillChips = ({ skills, chipClass }) => (
  <ul className="flex flex-wrap gap-2" role="list">
    {skills.map((skill) => (
      <li key={skill.name}>
        <span className={chipClass} title={skill.hint || undefined}>
          {skill.name}
        </span>
      </li>
    ))}
  </ul>
);

SkillChips.propTypes = {
  skills: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      hint: PropTypes.string,
    })
  ).isRequired,
  chipClass: PropTypes.string.isRequired,
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
      className="bento-tile h-full self-stretch w-full"
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

      <SkillChips skills={category.skills} chipClass={category.chipClass} />
    </motion.div>
  );
};

BentoTile.propTypes = {
  category: PropTypes.shape({
    title: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    chipClass: PropTypes.string.isRequired,
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
          {'// technologies in production — hover a chip for context'}
        </p>
      </motion.div>

      <div className="space-y-4">
        {/* Row 1 — largest categories */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch"
          variants={containerVariants}
        >
          {skillCategories.slice(0, 2).map((cat) => (
            <BentoTile key={cat.id} category={cat} variants={itemVariants} />
          ))}
        </motion.div>

        {/* Row 2 — security + AI (similar list depth) */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch"
          variants={containerVariants}
        >
          {skillCategories.slice(2, 4).map((cat) => (
            <BentoTile key={cat.id} category={cat} variants={itemVariants} />
          ))}
        </motion.div>

        {/* Row 3 — programming + sysadmin (equal skill count) */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch max-w-3xl mx-auto w-full"
          variants={containerVariants}
        >
          {skillCategories.slice(4).map((cat) => (
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
            { name: 'Burmese', detail: 'Native' },
            { name: 'English', detail: 'C2 Proficient (CEFR)' },
          ].map((lang) => (
            <motion.div key={lang.name} className="bento-tile" whileHover={{ scale: 1.01 }}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-300">{lang.name}</span>
                <span className="text-xs font-mono text-gray-400 dark:text-gray-500">{lang.detail}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Skills;
