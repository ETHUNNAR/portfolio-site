import { motion } from "framer-motion";
import { LanguageInfo } from "@/lib/types/portfolio.types";

interface LanguagesSectionProps {
  title: string;
  languages: LanguageInfo[];
}

export function LanguagesSection({ title, languages }: LanguagesSectionProps) {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-8 md:p-12"
        >
          <h2 className="text-3xl font-display font-bold text-white mb-8 text-center">
            {title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {languages.map((item) => (
              <div key={item.lang} className="text-center p-4">
                <span className="text-4xl mb-3 block">{item.flag}</span>
                <h3 className="text-xl font-display font-semibold text-white">
                  {item.lang}
                </h3>
                <p className="text-neutral-500 text-sm">{item.level}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
