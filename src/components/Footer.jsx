import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-brand-bg-deep border-t border-brand-border/40 pt-20 pb-10 z-10 overflow-hidden">
      {/* Subtle animated gold gradient line at the top of the footer */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-accent-gold/40 to-transparent opacity-60 animate-[pulse_3s_infinite]" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
        {/* Column 1: Brand details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 flex items-center justify-center border border-brand-accent-gold/40 group-hover:border-brand-accent-gold transition-colors duration-300 rounded-md">
              <div className="w-4 h-4 bg-brand-accent-gold opacity-60 group-hover:opacity-100 transition-opacity duration-300 rounded-sm" />
            </div>
            <span className="font-display font-semibold text-xl tracking-wider text-brand-text-primary">
              DEVIN<span className="text-brand-accent-gold">EDGE</span>
            </span>
          </Link>
          <p className="text-brand-text-secondary text-sm leading-relaxed max-w-sm">
            We build the internet's finest websites. Premium digital experiences built with precision, speed, and elegant animation for ambitious businesses.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col gap-4">
          <h4 className="font-display text-sm tracking-widest uppercase text-brand-text-primary">Quick Links</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-brand-text-secondary">
            <li><Link to="/" className="hover:text-brand-accent-gold transition-colors duration-300">Home</Link></li>
            <li><Link to="/about" className="hover:text-brand-accent-gold transition-colors duration-300">About</Link></li>
            <li><Link to="/portfolio" className="hover:text-brand-accent-gold transition-colors duration-300">Our Work</Link></li>
            <li><Link to="/process" className="hover:text-brand-accent-gold transition-colors duration-300">Process</Link></li>
            <li><Link to="/pricing" className="hover:text-brand-accent-gold transition-colors duration-300">Pricing</Link></li>
          </ul>
        </div>

        {/* Column 3: Services */}
        <div className="flex flex-col gap-4">
          <h4 className="font-display text-sm tracking-widest uppercase text-brand-text-primary">Services</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-brand-text-secondary">
            <li><Link to="/services" className="hover:text-brand-accent-gold transition-colors duration-300">Custom Web Design</Link></li>
            <li><Link to="/services" className="hover:text-brand-accent-gold transition-colors duration-300">E-Commerce builds</Link></li>
            <li><Link to="/services" className="hover:text-brand-accent-gold transition-colors duration-300">SaaS Products</Link></li>
            <li><Link to="/services" className="hover:text-brand-accent-gold transition-colors duration-300">Landing Pages</Link></li>
            <li><Link to="/services" className="hover:text-brand-accent-gold transition-colors duration-300">Web Optimization</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact & Socials */}
        <div className="flex flex-col gap-4">
          <h4 className="font-display text-sm tracking-widest uppercase text-brand-text-primary">Connect</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-brand-text-secondary mb-4">
            <li><Link to="/contact" className="hover:text-brand-accent-gold transition-colors duration-300">Get in Touch</Link></li>
            <li><Link to="/careers" className="hover:text-brand-accent-gold transition-colors duration-300">Careers</Link></li>
            <li className="text-xs text-brand-text-secondary/60">hello@devinedge.com</li>
          </ul>
          
          {/* Socials row */}
          <div className="flex gap-4">
            {/* LinkedIn */}
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-brand-border/60 flex items-center justify-center text-brand-text-secondary hover:text-brand-accent-gold hover:border-brand-accent-gold hover:shadow-md hover:shadow-brand-accent-gold/5 transition-all duration-300" aria-label="LinkedIn">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-brand-border/60 flex items-center justify-center text-brand-text-secondary hover:text-brand-accent-gold hover:border-brand-accent-gold hover:shadow-md hover:shadow-brand-accent-gold/5 transition-all duration-300" aria-label="Instagram">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            {/* Twitter */}
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-brand-border/60 flex items-center justify-center text-brand-text-secondary hover:text-brand-accent-gold hover:border-brand-accent-gold hover:shadow-md hover:shadow-brand-accent-gold/5 transition-all duration-300" aria-label="Twitter">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            {/* GitHub */}
            <a href="https://github.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-brand-border/60 flex items-center justify-center text-brand-text-secondary hover:text-brand-accent-gold hover:border-brand-accent-gold hover:shadow-md hover:shadow-brand-accent-gold/5 transition-all duration-300" aria-label="GitHub">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 border-t border-brand-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-text-secondary/50">
        <span>© {currentYear} DevinEdge. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#privacy" className="hover:text-brand-accent-gold transition-colors duration-300">Privacy Policy</a>
          <a href="#terms" className="hover:text-brand-accent-gold transition-colors duration-300">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
