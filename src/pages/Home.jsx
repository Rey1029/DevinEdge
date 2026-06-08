import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import ThreeGlobe from '../components/ThreeGlobe';
import MagneticButton from '../components/MagneticButton';

// Reusable CountUp component
function CountUp({ end, duration = 1500, suffix = "" }) {
  const [count, setCount] = React.useState(0);
  const elementRef = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        let startTimestamp = null;
        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          setCount(Math.floor(progress * end));
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
      }
    }, { threshold: 0.1 });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={elementRef}>{count}{suffix}</span>;
}

export default function Home() {
  const title1Ref = useRef(null);
  const title2Ref = useRef(null);
  const title3Ref = useRef(null);
  const subheadRef = useRef(null);
  const ctasRef = useRef(null);
  const quoteRef = useRef(null);

  useEffect(() => {
    // GSAP Intro animations
    const tl = gsap.timeline();
    
    const targets = [title1Ref.current, title2Ref.current, title3Ref.current].filter(Boolean);
    if (targets.length > 0) {
      tl.fromTo(targets, 
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
      );
    }

    if (subheadRef.current) {
      tl.fromTo(subheadRef.current, 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      );
    }

    if (ctasRef.current) {
      tl.fromTo(ctasRef.current, 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      );
    }

    // Scroll trigger for italic quote underline
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.to('.quote-underline', { width: '100%', duration: 1, ease: 'power2.out' });
        }
      });
    }, { threshold: 0.5 });

    if (quoteRef.current) {
      observer.observe(quoteRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full bg-brand-bg-deep pt-20">
      {/* Ambient background decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-[linear-gradient(rgba(212,175,55,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-0 opacity-40" />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          {/* Left Hero Texts */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <h1 className="font-display font-semibold text-5xl md:text-7xl xl:text-8xl tracking-tight leading-none text-brand-text-primary flex flex-col gap-1">
              <span className="overflow-hidden block">
                <span ref={title1Ref} className="block">WE BUILD</span>
              </span>
              <span className="overflow-hidden block text-brand-accent-gold">
                <span ref={title2Ref} className="block">THE INTERNET'S</span>
              </span>
              <span className="overflow-hidden block">
                <span ref={title3Ref} className="block">FINEST WEBSITES.</span>
              </span>
            </h1>
            
            <p ref={subheadRef} className="mt-8 text-brand-text-secondary text-base md:text-lg font-light max-w-lg leading-relaxed opacity-0">
              Premium custom-crafted web experiences for ambitious brands. Engineered with high-end aesthetics, smooth 3D visuals, and flawless responsiveness.
            </p>

            <div ref={ctasRef} className="mt-10 flex flex-wrap gap-6 items-center opacity-0">
              <MagneticButton>
                <Link 
                  to="/contact" 
                  className="px-8 py-4 bg-brand-accent-gold text-brand-bg-deep text-xs uppercase tracking-widest font-semibold hover:bg-brand-accent-gold-light hover:shadow-lg hover:shadow-brand-accent-gold/20 transition-all duration-300 block rounded"
                >
                  Start Your Project →
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link 
                  to="/portfolio" 
                  className="px-8 py-4 border border-brand-border text-brand-text-primary text-xs uppercase tracking-widest font-semibold hover:border-brand-accent-gold hover:text-brand-accent-gold transition-all duration-300 block rounded"
                >
                  View Our Work
                </Link>
              </MagneticButton>
            </div>
          </div>

          {/* Right Hero Three.js Globe */}
          <div className="lg:col-span-5 h-[350px] md:h-[500px] w-full flex items-center justify-center relative">
            <div className="absolute inset-0 bg-brand-accent-gold/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 bg-brand-accent-purple/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <ThreeGlobe />
          </div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <section className="py-6 bg-brand-bg-card border-y border-brand-border/40 overflow-hidden z-10 relative">
        <div className="animate-marquee whitespace-nowrap text-xl md:text-2xl font-display uppercase tracking-widest text-brand-text-secondary/60">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="inline-block mr-4">
              WEB DESIGN <span className="text-brand-accent-gold mx-3">·</span> BRANDING <span className="text-brand-accent-gold mx-3">·</span> DEVELOPMENT <span className="text-brand-accent-gold mx-3">·</span> 3D EXPERIENCES <span className="text-brand-accent-gold mx-3">·</span> E-COMMERCE <span className="text-brand-accent-gold mx-3">·</span> SAAS PRODUCTS <span className="text-brand-accent-gold mx-3">·</span> PERFORMANCE <span className="text-brand-accent-gold mx-3">·</span>
            </span>
          ))}
        </div>
      </section>

      {/* Stats row */}
      <section className="py-20 max-w-7xl mx-auto px-6 md:px-12 z-10 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
          <div className="flex flex-col gap-2 p-6 glass-panel rounded border border-brand-border/20 glow-gold">
            <h3 className="text-4xl md:text-5xl font-display font-semibold text-brand-accent-gold">
              <CountUp end={120} suffix="+" />
            </h3>
            <span className="text-[10px] uppercase tracking-widest text-brand-text-secondary font-medium">Projects Delivered</span>
          </div>
          <div className="flex flex-col gap-2 p-6 glass-panel rounded border border-brand-border/20">
            <h3 className="text-4xl md:text-5xl font-display font-semibold text-brand-text-primary">
              <CountUp end={98} suffix="%" />
            </h3>
            <span className="text-[10px] uppercase tracking-widest text-brand-text-secondary font-medium">Client Satisfaction</span>
          </div>
          <div className="flex flex-col gap-2 p-6 glass-panel rounded border border-brand-border/20 glow-purple">
            <h3 className="text-4xl md:text-5xl font-display font-semibold text-brand-accent-purple">
              <CountUp end={7} />
            </h3>
            <span className="text-[10px] uppercase tracking-widest text-brand-text-secondary font-medium">Countries Served</span>
          </div>
          <div className="flex flex-col gap-2 p-6 glass-panel rounded border border-brand-border/20">
            <h3 className="text-4xl md:text-5xl font-display font-semibold text-brand-text-primary">
              <CountUp end={4} suffix="-Wk" />
            </h3>
            <span className="text-[10px] uppercase tracking-widest text-brand-text-secondary font-medium">Average Delivery</span>
          </div>
        </div>
      </section>

      {/* Featured work preview */}
      <section className="py-24 border-t border-brand-border/40 bg-brand-bg-deep relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-brand-accent-gold font-semibold">SELECTED CREATIONS</span>
              <h2 className="font-display font-semibold text-4xl md:text-5xl tracking-tight text-brand-text-primary mt-2">FEATURED WORK</h2>
            </div>
            <Link to="/portfolio" className="group text-xs uppercase tracking-widest font-semibold text-brand-text-primary hover:text-brand-accent-gold flex items-center gap-2 transition-colors duration-300">
              VIEW ALL WORK <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Staggered project cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <a 
              href="https://eatlikepunjabi.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative glass-panel border border-brand-border/40 p-5 overflow-hidden rounded transition-all duration-500 hover:border-brand-accent-gold/40 hover:glow-gold flex flex-col md:translate-y-8 cursor-pointer"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-brand-accent-purple/5 to-brand-bg-card border border-brand-border/40 flex items-center justify-center relative overflow-hidden rounded">
                <div className="absolute inset-0 bg-brand-bg-deep/40 group-hover:bg-transparent transition-all duration-500" />
                <span className="font-display text-5xl md:text-6xl text-brand-text-secondary/5 select-none font-extrabold group-hover:text-brand-accent-purple/10 transition-all duration-500">PUNJABI</span>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <div>
                  <h4 className="font-display text-lg tracking-wide text-brand-text-primary group-hover:text-brand-accent-gold transition-colors duration-300">Eat Like Punjabi</h4>
                  <span className="text-xs text-brand-text-secondary uppercase tracking-wider">Restaurant · WebApp</span>
                </div>
                <div className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-brand-text-secondary group-hover:text-brand-accent-gold group-hover:border-brand-accent-gold transition-colors duration-300">
                  →
                </div>
              </div>
            </a>

            {/* Card 2 */}
            <a 
              href="https://tothecorefitnessgym.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative glass-panel border border-brand-border/40 p-5 overflow-hidden rounded transition-all duration-500 hover:border-brand-accent-gold/40 hover:glow-gold flex flex-col cursor-pointer"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-brand-accent-gold/5 to-brand-bg-card border border-brand-border/40 flex items-center justify-center relative overflow-hidden rounded">
                <div className="absolute inset-0 bg-brand-bg-deep/40 group-hover:bg-transparent transition-all duration-500" />
                <span className="font-display text-5xl md:text-6xl text-brand-text-secondary/5 select-none font-extrabold group-hover:text-brand-accent-gold/10 transition-all duration-500">CORE GYM</span>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <div>
                  <h4 className="font-display text-lg tracking-wide text-brand-text-primary group-hover:text-brand-accent-gold transition-colors duration-300">To The Core Fitness Gym</h4>
                  <span className="text-xs text-brand-text-secondary uppercase tracking-wider">Fitness · Design</span>
                </div>
                <div className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-brand-text-secondary group-hover:text-brand-accent-gold group-hover:border-brand-accent-gold transition-colors duration-300">
                  →
                </div>
              </div>
            </a>

            {/* Card 3 */}
            <a 
              href="https://neonsnakeio.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative glass-panel border border-brand-border/40 p-5 overflow-hidden rounded transition-all duration-500 hover:border-brand-accent-gold/40 hover:glow-gold flex flex-col md:translate-y-16 cursor-pointer"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-brand-accent-cyan/5 to-brand-bg-card border border-brand-border/40 flex items-center justify-center relative overflow-hidden rounded">
                <div className="absolute inset-0 bg-brand-bg-deep/40 group-hover:bg-transparent transition-all duration-500" />
                <span className="font-display text-5xl md:text-6xl text-brand-text-secondary/5 select-none font-extrabold group-hover:text-brand-accent-cyan/10 transition-all duration-500">SNAKE IO</span>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <div>
                  <h4 className="font-display text-lg tracking-wide text-brand-text-primary group-hover:text-brand-accent-gold transition-colors duration-300">Neon Snake IO</h4>
                  <span className="text-xs text-brand-text-secondary uppercase tracking-wider">3D Game · Development</span>
                </div>
                <div className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-brand-text-secondary group-hover:text-brand-accent-gold group-hover:border-brand-accent-gold transition-colors duration-300">
                  →
                </div>
              </div>
            </a>
          </div>
      </section>

      {/* Large Bold Quote Section */}
      <section ref={quoteRef} className="py-36 bg-brand-bg-card border-t border-brand-border/40 overflow-hidden relative z-10">
        <div className="max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
          <span className="text-5xl text-brand-accent-gold font-serif">“</span>
          <blockquote className="font-syne font-semibold text-2xl md:text-4xl tracking-tight leading-tight text-brand-text-primary max-w-4xl italic">
            Built for brands that refuse to blend in. We challenge standard templates to create custom digital art.
          </blockquote>
          {/* Gold underline accent */}
          <div className="quote-underline mt-8 h-[2px] bg-gradient-to-r from-brand-accent-gold to-brand-accent-gold-light w-0 transition-all duration-1000" />
        </div>
      </section>
    </div>
  );
}
