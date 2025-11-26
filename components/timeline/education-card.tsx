interface EducationCardProps {
  label: string;
  title: string;
  institution: string;
  competencies: string[];
}

export function EducationCard({ label, title, institution, competencies }: EducationCardProps) {
  return (
    <div className="glass rounded-2xl p-6 project-card">
      <div className="flex items-center gap-3 mb-4">
        <span className="px-3 py-1 text-xs font-mono bg-green-500/20 text-green-400 rounded-full">
          {label}
        </span>
      </div>
      <h4 className="text-2xl font-display font-bold text-white mb-2">
        {title}
      </h4>
      <p className="text-accent text-sm mb-4">{institution}</p>
      <div className="flex flex-wrap gap-2">
        {competencies.map((comp) => (
          <span key={comp} className="px-3 py-1 text-xs bg-surface-lighter text-neutral-400 rounded-full">
            {comp}
          </span>
        ))}
      </div>
    </div>
  );
}
