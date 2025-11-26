interface MetricCardProps {
  value: string;
  label: string;
}

function MetricCard({ value, label }: MetricCardProps) {
  return (
    <div className="bg-surface-light rounded-xl p-4 text-center">
      <p className="text-3xl font-display font-bold gradient-text">{value}</p>
      <p className="text-xs text-neutral-500 mt-1">{label}</p>
    </div>
  );
}

interface ThesisCardProps {
  thesisLabel: string;
  deployedLabel: string;
  title: string;
  description: string;
  metrics: Array<{ value: string; label: string }>;
  points: string[];
}

export function ThesisCard({
  thesisLabel,
  deployedLabel,
  title,
  description,
  metrics,
  points
}: ThesisCardProps) {
  return (
    <div className="glass rounded-2xl p-6 project-card border border-accent/20">
      <div className="flex items-center gap-3 mb-4">
        <span className="px-3 py-1 text-xs font-mono bg-accent/20 text-accent rounded-full">
          {thesisLabel}
        </span>
        <span className="px-3 py-1 text-xs font-mono bg-purple-500/20 text-purple-400 rounded-full">
          {deployedLabel}
        </span>
      </div>
      <h4 className="text-2xl font-display font-bold text-white mb-2">
        {title}
      </h4>
      <p className="text-neutral-300 text-sm mb-4">{description}</p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {metrics.map((metric, idx) => (
          <MetricCard key={idx} value={metric.value} label={metric.label} />
        ))}
      </div>
      <ul className="space-y-2 text-neutral-400 text-sm">
        {points.map((point, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-accent mt-1">▹</span>
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}
