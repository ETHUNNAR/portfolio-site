import { motion } from "framer-motion";
import { Mail, Linkedin, MapPin, Github } from "lucide-react";

interface HeroSectionProps {
  location: string;
  name: string;
  title: string;
  bio: string;
  viewMyWorkText: string;
  getInTouchText: string;
}

export function HeroSection({
  location,
  name,
  title,
  bio,
  viewMyWorkText,
  getInTouchText
}: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/20 rounded-full blur-[128px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-[128px] animate-pulse-slow" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <MapPin className="w-4 h-4 text-accent" />
            <span className="text-sm text-neutral-400">{location}</span>
          </motion.div>

          <h1 className="text-5xl md:text-8xl font-display font-bold mb-6 tracking-tight">
            <span className="text-white">Vi The</span>{" "}
            <span className="gradient-text">Ngo</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-neutral-400 mb-8 font-light"
          >
            {title}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="max-w-2xl mx-auto text-neutral-500 mb-12 leading-relaxed"
          >
            {bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#experience"
              className="px-8 py-4 bg-accent hover:bg-accent-light text-white rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-accent/25"
            >
              {viewMyWorkText}
            </a>
            <a
              href="#contact"
              className="px-8 py-4 glass hover:bg-surface-lighter text-white rounded-full font-medium transition-all duration-300"
            >
              {getInTouchText}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex items-center justify-center gap-6 mt-12"
          >
            <a
              href="https://www.linkedin.com/in/vi-the-ngo/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-accent transition-colors animated-underline"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:vithe.ngo@gmail.com"
              className="text-neutral-500 hover:text-accent transition-colors animated-underline"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-accent transition-colors animated-underline"
            >
              <Github className="w-5 h-5" />
            </a>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-neutral-700 flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 bg-accent rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
