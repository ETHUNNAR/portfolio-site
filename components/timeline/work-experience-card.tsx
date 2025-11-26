interface WorkExperienceCardProps {
  label: string;
  title: string;
  position: string;
  points: string[];
}

export function WorkExperienceCard({ label, title, position, points }: WorkExperienceCardProps) {
  const highlightNumbers = (text: string) =>
    text.replace(/(\d+%|\d+\+)/g, '<span class="text-white font-medium">$1</span>');

  return (
    <div className="glass rounded-2xl p-6 project-card">
      <div className="flex items-center gap-3 mb-4">
        <span className="px-3 py-1 text-xs font-mono bg-accent/20 text-accent rounded-full">
          {label}
        </span>
      </div>
      <h4 className="text-2xl font-display font-bold text-white mb-2">
        {title}
      </h4>
      <p className="text-accent text-sm mb-4">{position}</p>
      <ul className="space-y-3 text-neutral-300 text-sm">
        {points.map((point, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-accent mt-1">▹</span>
            <span dangerouslySetInnerHTML={{ __html: highlightNumbers(point) }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
