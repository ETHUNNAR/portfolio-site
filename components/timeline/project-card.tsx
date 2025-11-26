interface ProjectCardProps {
  label: string;
  secondaryLabel?: string;
  title: string;
  description: string;
  technologies: string[];
  points?: string[];
  metricValue?: string;
  metricLabel?: string;
}

export function ProjectCard({
  label,
  secondaryLabel,
  title,
  description,
  technologies,
  points,
  metricValue,
  metricLabel
}: ProjectCardProps) {
  return (
    <div className="glass rounded-2xl p-6 project-card">
      <div className="flex items-center gap-3 mb-4">
        <span className="px-3 py-1 text-xs font-mono bg-pink-500/20 text-pink-400 rounded-full">
          {label}
        </span>
        {secondaryLabel && (
          <span className="px-3 py-1 text-xs font-mono bg-surface-lighter text-neutral-400 rounded-full">
            {secondaryLabel}
          </span>
        )}
      </div>
      <h4 className="text-2xl font-display font-bold text-white mb-2">
        {title}
      </h4>
      <p className="text-neutral-300 text-sm mb-4">{description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {technologies.map((tech) => (
          <span key={tech} className="skill-badge px-3 py-1 text-xs bg-surface-light border border-neutral-800 text-neutral-300 rounded-full">
            {tech}
          </span>
        ))}
      </div>
      {points && (
        <ul className="space-y-2 text-neutral-400 text-sm">
          {points.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-accent mt-1">▹</span>
              {point}
            </li>
          ))}
        </ul>
      )}
      {metricValue && metricLabel && (
        <div className="bg-surface-light rounded-xl p-4 inline-block mt-4">
          <p className="text-2xl font-display font-bold gradient-text">{metricValue}</p>
          <p className="text-xs text-neutral-500 mt-1">{metricLabel}</p>
        </div>
      )}
    </div>
  );
}
