import { ReactNode } from "react";

interface WorkExperienceCardProps {
  label: string;
  title: string;
  position: string;
  points: string[];
}

function highlightNumbers(text: string): ReactNode[] {
  const parts = text.split(/(\d+%|\d+\+)/g);
  return parts.map((part, index) => {
    if (/^\d+%$|^\d+\+$/.test(part)) {
      return (
        <span key={index} className="text-white font-medium">
          {part}
        </span>
      );
    }
    return part;
  });
}

export function WorkExperienceCard({ label, title, position, points }: WorkExperienceCardProps) {
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
            <span>{highlightNumbers(point)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
