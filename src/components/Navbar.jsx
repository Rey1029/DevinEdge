import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MagneticButton from './MagneticButton';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Process', path: '/process' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Contact', path: '/contact' },
    { name: 'Careers', path: '/careers' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-brand-bg-deep/80 backdrop-blur-xl border-b border-brand-border/40 py-3 shadow-lg' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group z-50" onClick={() => setMobileMenuOpen(false)}>
            {/* Geometric Gold Mark */}
            <div className="relative w-8 h-8 flex items-center justify-center border border-brand-accent-gold/40 group-hover:border-brand-accent-gold transition-colors duration-500 rounded-md">
              <div className="absolute w-4 h-4 bg-brand-accent-gold opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 rounded-sm" />
              <div className="absolute w-2 h-2 bg-brand-bg-deep rounded-sm" />
            </div>
            <span className="font-display font-semibold text-xl tracking-wider text-brand-text-primary">
              DEVIN<span className="text-brand-accent-gold group-hover:text-brand-accent-gold-light transition-colors duration-500">EDGE</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center lg:gap-4 xl:gap-6 2xl:gap-8 mx-6 lg:mx-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`text-xs tracking-widest uppercase font-medium transition-all duration-300 relative group/link py-1 ${
                  location.pathname === link.path 
                    ? 'text-brand-accent-gold' 
                    : 'text-brand-text-secondary hover:text-brand-text-primary'
                }`}
              >
                {link.name}
                {/* Gold line slide on hover */}
                <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-brand-accent-gold scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left ${
                  location.pathname === link.path ? 'scale-x-100' : ''
                }`} />
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden lg:block">
            <MagneticButton>
              <Link 
                to="/contact" 
                className="px-5 py-2 bg-brand-accent-gold text-brand-bg-deep text-[11px] uppercase tracking-widest font-semibold hover:bg-brand-accent-gold-light transition-all duration-300 block rounded shadow-lg shadow-brand-accent-gold/10 hover:shadow-brand-accent-gold/25"
              >
                Start a Project
              </Link>
            </MagneticButton>
          </div>

          {/* Mobile Hamburguer Toggle */}
          <button 
            className="block lg:hidden text-brand-text-primary p-2 z-50 transition-transform duration-300 hover:scale-105"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      {/* Full-Screen Mobile Navigation Overlay */}
      <div 
        className={`fixed inset-0 bg-brand-bg-deep/98 backdrop-blur-2xl z-40 flex flex-col justify-center items-center px-10 transition-all duration-500 ease-in-out ${
          mobileMenuOpen 
            ? 'opacity-100 pointer-events-auto visible' 
            : 'opacity-0 pointer-events-none invisible'
        }`}
      >
        {/* Subtle glows in background */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-brand-accent-gold/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-brand-accent-purple/5 rounded-full blur-[120px] pointer-events-none" />

        <nav className="flex flex-col gap-6 text-center z-10 w-full max-w-sm">
          {navLinks.map((link, index) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`font-display text-2xl uppercase tracking-widest transition-all duration-300 ${
                location.pathname === link.path 
                  ? 'text-brand-accent-gold scale-105' 
                  : 'text-brand-text-primary hover:text-brand-accent-gold'
              }`}
              onClick={() => setMobileMenuOpen(false)}
              style={{ 
                transitionDelay: mobileMenuOpen ? `${index * 40}ms` : '0ms',
                transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(15px)',
                opacity: mobileMenuOpen ? 1 : 0
              }}
            >
              {link.name}
            </Link>
          ))}
          
          <div 
            className="mt-6"
            style={{ 
              transitionDelay: mobileMenuOpen ? `${navLinks.length * 40}ms` : '0ms',
              transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(15px)',
              opacity: mobileMenuOpen ? 1 : 0
            }}
          >
            <Link 
              to="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3 bg-brand-accent-gold text-brand-bg-deep text-xs uppercase tracking-widest font-semibold block text-center hover:bg-brand-accent-gold-light transition-all duration-300 rounded shadow-md"
            >
              Start a Project
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
