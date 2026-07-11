import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const STACK = [
  { name: 'Next.js', tag: 'cicd' },
  { name: 'FastAPI', tag: 'cicd' },
  { name: 'PostgreSQL', tag: 'cloud' },
  { name: 'AWS Lightsail', tag: 'cloud' },
  { name: 'S3 / CloudFront', tag: 'cloud' },
  { name: 'GitHub Actions', tag: 'cicd' },
  { name: 'NOWPayments', tag: 'security' },
  { name: 'EN / MY i18n', tag: 'cicd' },
];

const tagClassMap = {
  cloud: 'tag-cloud',
  security: 'tag-security',
  cicd: 'tag-cicd',
};

const HIGHLIGHTS = [
  'Multi-server Outline orchestration with capacity caps and least-loaded key assignment',
  'Credits wallet, pricing tiers, crypto top-ups via IPN webhooks, and referral bonuses',
  'JWT / Google OAuth, admin ops (users, servers, keys, audit logs), and key lifecycle jobs',
  'Production CI/CD — API on Lightsail/ECR, portal on S3/CloudFront, Trivy in the pipeline',
];

const SelectedWork = () => {
  const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true });

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
      className="relative z-10 max-w-7xl mx-auto px-4 py-20 border-t border-slate-200/50 dark:border-slate-800/50"
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="text-center mb-10">
        <h2 className="section-title mb-2">Selected Work</h2>
        <p className="text-gray-500 dark:text-gray-400 font-mono text-sm max-w-xl mx-auto">
          {'// production products I designed, built, and operate'}
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,11rem)_1fr] gap-8 md:gap-10 items-start"
      >
        <div className="flex md:flex-col items-center md:items-start gap-4">
          <img
            src="/projects/matrixlink.png"
            alt="MatrixLink"
            width={128}
            height={128}
            className="w-24 h-24 md:w-28 md:h-28 object-contain"
          />
          <div className="md:hidden">
            <p className="text-[10px] font-mono uppercase tracking-wider text-primary-500 mb-1">
              founder · full-stack
            </p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">MatrixLink</h3>
          </div>
        </div>

        <div>
          <div className="hidden md:block mb-3">
            <p className="text-[10px] font-mono uppercase tracking-wider text-primary-500 mb-1">
              founder · full-stack · Mar 2026 – Present
            </p>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">MatrixLink</h3>
          </div>
          <p className="md:hidden text-[10px] font-mono text-gray-500 dark:text-gray-400 mb-2">
            Mar 2026 – Present
          </p>

          <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-4">
            Credit-prepaid Outline VPN marketplace and multi-server control plane — purchase plans,
            provision access keys, track usage, and operate capacity across a fleet.
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            Operators need fleet capacity, billing, and self-serve keys in one place. MatrixLink
            is the SaaS control plane for that: portal + API + Postgres, with Outline servers and
            crypto payment webhooks at the edge — not a web3 product; crypto is payment rails only.
          </p>

          <ul className="space-y-2 mb-6">
            {HIGHLIGHTS.map((item) => (
              <li
                key={item}
                className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed pl-4 border-l-2 border-primary-500/40"
              >
                {item}
              </li>
            ))}
          </ul>

          <p className="text-sm font-mono text-gray-500 dark:text-gray-400 mb-5">
            Role: designed, built, deployed, and operate end-to-end.
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {STACK.map((tech) => (
              <span
                key={tech.name}
                className={`px-2.5 py-1 rounded-full text-xs ${tagClassMap[tech.tag] || 'tag-cloud'}`}
              >
                {tech.name}
              </span>
            ))}
          </div>

          <a
            href="https://portal.matrixlink.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-mono text-primary-600 dark:text-primary-400 hover:underline"
          >
            portal.matrixlink.in ↗
          </a>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default SelectedWork;
