import { motion } from "framer-motion";
import { Mail, Phone, Linkedin, ExternalLink } from "lucide-react";

interface ContactSectionProps {
  title: string;
  subtitle: string;
}

export function ContactSection({ title, subtitle }: ContactSectionProps) {
  return (
    <section id="contact" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-neutral-500 max-w-xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <a
            href="mailto:vithe.ngo@gmail.com"
            className="flex items-center gap-3 px-6 py-4 glass rounded-2xl hover:border-accent/30 transition-all duration-300 group"
          >
            <Mail className="w-5 h-5 text-accent" />
            <span className="text-neutral-300 group-hover:text-white transition-colors">
              vithe.ngo@gmail.com
            </span>
          </a>

          <a
            href="tel:+4551901737"
            className="flex items-center gap-3 px-6 py-4 glass rounded-2xl hover:border-accent/30 transition-all duration-300 group"
          >
            <Phone className="w-5 h-5 text-accent" />
            <span className="text-neutral-300 group-hover:text-white transition-colors">
              +45 51 90 17 37
            </span>
          </a>

          <a
            href="https://www.linkedin.com/in/vi-the-ngo/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-4 glass rounded-2xl hover:border-accent/30 transition-all duration-300 group"
          >
            <Linkedin className="w-5 h-5 text-accent" />
            <span className="text-neutral-300 group-hover:text-white transition-colors">
              LinkedIn
            </span>
            <ExternalLink className="w-4 h-4 text-neutral-500" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
