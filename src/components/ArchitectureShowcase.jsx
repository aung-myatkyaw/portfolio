import { useState } from 'react';
import { PORTFOLIO_REPO_URL } from '../lib/icp';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const NODE = { w: 72, h: 28, rx: 4 };

const DiagramNode = ({ x, y, label, active = false, visible = true, ariaLabel, onActivate, onDeactivate }) => (
  <g
    transform={`translate(${x}, ${y})`}
    onMouseEnter={onActivate}
    onMouseLeave={onDeactivate}
    onFocus={onActivate}
    onBlur={onDeactivate}
    tabIndex={0}
    role="button"
    aria-label={ariaLabel}
    className="cursor-pointer outline-none"
  >
    <motion.g
      initial={{ opacity: 0 }}
      animate={visible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <rect
        width={NODE.w}
        height={NODE.h}
        rx={NODE.rx}
        className={active ? 'fill-primary-500/20 stroke-primary-500' : 'fill-slate-800/80 stroke-slate-600'}
        strokeWidth="1"
      />
      <text
        x={NODE.w / 2}
        y={NODE.h / 2 + 4}
        textAnchor="middle"
        className="fill-slate-300 text-[9px] font-mono pointer-events-none"
      >
        {label}
      </text>
    </motion.g>
  </g>
);

DiagramNode.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool,
  visible: PropTypes.bool,
  onActivate: PropTypes.func,
  onDeactivate: PropTypes.func,
  ariaLabel: PropTypes.string,
};

const AnimatedEdge = ({ x1, y1, x2, y2, markerId, visible, delay = 0 }) => {
  const length = Math.hypot(x2 - x1, y2 - y1);
  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      className="stroke-primary-500/60"
      strokeWidth="1.5"
      markerEnd={`url(#${markerId})`}
      initial={{ strokeDasharray: length, strokeDashoffset: length }}
      animate={visible ? { strokeDashoffset: 0 } : { strokeDashoffset: length }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    />
  );
};

AnimatedEdge.propTypes = {
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired,
  markerId: PropTypes.string.isRequired,
  visible: PropTypes.bool,
  delay: PropTypes.number,
};

const diagrams = [
  {
    id: 'ai-k8s',
    title: 'AI Workload on Kubernetes',
    description: 'Multi-provider LLM gateway behind Istio mesh with GPU inference and full observability.',
    nodes: [
      { id: 'ingress', label: 'Ingress', x: 10, y: 20 },
      { id: 'istio', label: 'Istio', x: 100, y: 20 },
      { id: 'litellm', label: 'LiteLLM', x: 190, y: 20, active: true },
      { id: 'hatchet', label: 'Hatchet', x: 280, y: 20 },
      { id: 'gpu', label: 'GPU Nodes', x: 100, y: 80 },
      { id: 'jaeger', label: 'Jaeger', x: 190, y: 80 },
      { id: 'prom', label: 'Prometheus', x: 280, y: 80 },
    ],
    edges: [
      [82, 34, 100, 34],
      [172, 34, 190, 34],
      [262, 34, 280, 34],
      [136, 48, 136, 80],
      [226, 48, 226, 80],
      [262, 94, 280, 94],
    ],
    tooltips: {
      ingress: 'TLS termination and routing at the edge',
      istio: 'mTLS, traffic policies, and mesh observability',
      litellm: 'Multi-provider LLM proxy with rate limiting',
      hatchet: 'Workflow orchestration for AI and agent pipelines',
      gpu: 'GPU workload orchestration via Karpenter on EKS',
      jaeger: 'Distributed tracing across AI pipeline services',
      prom: 'Metrics, alerts, and SLO dashboards',
    },
  },
  {
    id: 'erpnext',
    title: 'ERPNext on Kubernetes',
    description: 'Frappe ERPNext with HRMS — custom Helm deployment behind Istio with workers and MariaDB.',
    nodes: [
      { id: 'istio', label: 'Istio', x: 10, y: 20 },
      { id: 'nginx', label: 'Nginx', x: 100, y: 20 },
      { id: 'erp', label: 'ERPNext', x: 190, y: 20, active: true },
      { id: 'hrms', label: 'HRMS', x: 280, y: 20 },
      { id: 'worker', label: 'Workers', x: 100, y: 80 },
      { id: 'db', label: 'MariaDB', x: 190, y: 80 },
      { id: 'redis', label: 'Redis', x: 280, y: 80 },
    ],
    edges: [
      [82, 34, 100, 34],
      [172, 34, 190, 34],
      [262, 34, 280, 34],
      [136, 48, 136, 80],
      [226, 48, 226, 80],
      [262, 94, 280, 94],
    ],
    tooltips: {
      istio: 'TLS termination and routing via service mesh gateway',
      nginx: 'Static assets and reverse proxy to app tier',
      erp: 'Gunicorn app servers with HPA and custom bench apps',
      hrms: 'HRMS module and custom Frappe extensions deployed on EKS',
      worker: 'Background job workers for queues and scheduled tasks',
      db: 'MariaDB with persistent volumes and SSL',
      redis: 'Cache, sessions, and Socket.IO pub/sub',
    },
  },
  {
    id: 'icp',
    title: 'This Portfolio on ICP',
    description: 'Static frontend on ICP asset canister with Rust backend making HTTPS outcalls.',
    repoUrl: PORTFOLIO_REPO_URL,
    nodes: [
      { id: 'browser', label: 'Browser', x: 10, y: 50 },
      { id: 'asset', label: 'Asset Canister', x: 100, y: 50 },
      { id: 'rust', label: 'Rust Canister', x: 190, y: 50, active: true },
      { id: 'llm', label: 'OpenRouter', x: 280, y: 50 },
    ],
    edges: [
      [82, 64, 100, 64],
      [172, 64, 190, 64],
      [262, 64, 280, 64],
    ],
    tooltips: {
      browser: 'React SPA served from ICP',
      asset: 'Brotli-compressed static assets',
      rust: 'Rate-limited AI agent with prompt guard',
      llm: 'HTTPS outcall to OpenRouter LLM',
    },
  },
];

const ArchitectureDiagram = ({ diagram }) => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [activeNode, setActiveNode] = useState(null);
  const tooltip = activeNode ? diagram.tooltips[activeNode] : diagram.description;
  const markerId = `arrowhead-${diagram.id}`;

  return (
    <div ref={ref} className="bento-tile h-full">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">{diagram.title}</h3>
      <p className="text-[11px] font-mono text-gray-400 dark:text-gray-500 mb-3 min-h-[2rem]">
        {tooltip}
      </p>
      <svg
        viewBox="0 0 360 150"
        className="w-full h-auto"
        role="img"
        aria-label={diagram.title}
      >
        <defs>
          <marker
            id={markerId}
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 6 3, 0 6" className="fill-primary-500/60" />
          </marker>
        </defs>
        {diagram.edges.map(([x1, y1, x2, y2], i) => (
          <AnimatedEdge
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            markerId={markerId}
            visible={inView}
            delay={i * 0.12}
          />
        ))}
        {diagram.nodes.map((node) => (
          <DiagramNode
            key={node.id}
            x={node.x}
            y={node.y}
            label={node.label}
            active={node.active || activeNode === node.id}
            visible={inView}
            onActivate={() => setActiveNode(node.id)}
            onDeactivate={() => setActiveNode(null)}
            ariaLabel={diagram.tooltips[node.id]}
          />
        ))}
      </svg>
      {diagram.repoUrl && (
        <a
          href={diagram.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-3 text-[11px] font-mono text-primary-600 dark:text-primary-400 hover:underline"
        >
          View source on GitHub ↗
        </a>
      )}
    </div>
  );
};

ArchitectureDiagram.propTypes = {
  diagram: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    nodes: PropTypes.array.isRequired,
    edges: PropTypes.array.isRequired,
    tooltips: PropTypes.object.isRequired,
    repoUrl: PropTypes.string,
  }).isRequired,
};

const ArchitectureShowcase = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  };

  return (
    <motion.section
      ref={ref}
      className="relative z-10 max-w-7xl mx-auto px-4 py-20 border-t border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-b from-transparent to-slate-100/50 dark:to-slate-900/30"
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="text-center mb-10">
        <h2 className="section-title mb-2">How I Build</h2>
        <p className="text-gray-500 dark:text-gray-400 font-mono text-sm max-w-xl mx-auto">
          {'// architecture patterns from production — hover nodes for details'}
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
      >
        {diagrams.map((d) => (
          <motion.div key={d.id} variants={itemVariants}>
            <ArchitectureDiagram diagram={d} />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default ArchitectureShowcase;
