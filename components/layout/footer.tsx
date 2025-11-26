interface FooterProps {
  footerText: string;
}

export function Footer({ footerText }: FooterProps) {
  return (
    <footer className="py-8 px-6 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-neutral-600 text-sm">
          © {new Date().getFullYear()} Vi The Ngo. {footerText}
        </p>
      </div>
    </footer>
  );
}
