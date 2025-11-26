import { motion } from "framer-motion";
import { Timeline } from "@/components/ui/timeline";
import { TimelineItem } from "@/lib/types/portfolio.types";

interface ExperienceSectionProps {
  title: string;
  subtitle: string;
  timelineData: TimelineItem[];
}

export function ExperienceSection({ title, subtitle, timelineData }: ExperienceSectionProps) {
  return (
    <section id="experience" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-neutral-500 max-w-xl mx-auto">
            {subtitle}
          </p>
        </motion.div>
      </div>

      <Timeline data={timelineData} />
    </section>
  );
}
