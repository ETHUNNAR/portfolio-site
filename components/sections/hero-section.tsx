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
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-[128px] animate-pulse-slow [animation-delay:2s]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center hero-stagger">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 hero-fade-in [animation-delay:0.2s]"
          >
            <MapPin className="w-4 h-4 text-accent" />
            <span className="text-sm text-neutral-400">{location}</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-display font-bold mb-6 tracking-tight hero-fade-in">
            <span className="text-white">Vi The</span>{" "}
            <span className="gradient-text">Ngo</span>
          </h1>

          <p className="text-xl md:text-2xl text-neutral-400 mb-8 font-light hero-fade-in [animation-delay:0.4s]">
            {title}
          </p>

          <p className="max-w-2xl mx-auto text-neutral-500 mb-12 leading-relaxed hero-fade-in [animation-delay:0.6s]">
            {bio}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 hero-fade-in [animation-delay:0.8s]">
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
          </div>

          <div className="flex items-center justify-center gap-6 mt-12 hero-fade-in [animation-delay:1s]">
            <a
              href="https://www.linkedin.com/in/vi-the-ngo/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="text-neutral-500 hover:text-accent transition-colors animated-underline"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:vithe.ngo@gmail.com"
              aria-label="Send email"
              className="text-neutral-500 hover:text-accent transition-colors animated-underline"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="text-neutral-500 hover:text-accent transition-colors animated-underline"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hero-fade-in [animation-delay:1.2s]">
        <div className="w-6 h-10 rounded-full border-2 border-neutral-700 flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-scroll-dot" />
        </div>
      </div>
    </section>
  );
}
