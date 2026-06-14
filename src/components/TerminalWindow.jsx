import PropTypes from 'prop-types';

const TerminalWindow = ({ title, children, className = '', headerRight = null, bodyClassName = 'p-4' }) => (
  <div className={`terminal-window ${className}`}>
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200/80 dark:border-slate-700/50 bg-gray-50/80 dark:bg-slate-900/60">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
        <span className="text-xs font-mono text-gray-500 dark:text-slate-400 truncate">
          {title}
        </span>
      </div>
      {headerRight && (
        <div className="flex-shrink-0 ml-2">{headerRight}</div>
      )}
    </div>
    <div className={bodyClassName}>{children}</div>
  </div>
);

TerminalWindow.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  headerRight: PropTypes.node,
  bodyClassName: PropTypes.string,
};

export default TerminalWindow;
