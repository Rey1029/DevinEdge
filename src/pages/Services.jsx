import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutTemplate, ShoppingBag, Cpu, MousePointerClick, RefreshCw, Gauge } from 'lucide-react';

export default function Services() {
  const servicesList = [
    {
      icon: <LayoutTemplate className="w-8 h-8 text-brand-accent-gold group-hover:scale-110 transition-transform duration-350" />,
      title: 'Custom Website Design',
      desc: 'Thoughtful layout design built from scratch. No templates, no builders — just pure visual storytelling and software craftsmanship.',
      link: '/contact?service=design'
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-brand-accent-gold group-hover:scale-110 transition-transform duration-350" />,
      title: 'E-Commerce Development',
      desc: 'Seamless, high-performance checkout flows and bespoke shopping experiences tailored to turn visitors into buyers.',
      link: '/contact?service=ecommerce'
    },
    {
      icon: <Cpu className="w-8 h-8 text-brand-accent-gold group-hover:scale-110 transition-transform duration-350" />,
      title: 'SaaS Product Builds',
      desc: 'Custom frontend architectures, responsive admin panels, and real-time dashboard interfaces optimized for user activation.',
      link: '/contact?service=saas'
    },
    {
      icon: <MousePointerClick className="w-8 h-8 text-brand-accent-gold group-hover:scale-110 transition-transform duration-350" />,
      title: 'Landing Page Creation',
      desc: 'High-converting promo pages featuring interactive 3D elements and immersive storytelling to capture your product value.',
      link: '/contact?service=landing'
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-brand-accent-gold group-hover:scale-110 transition-transform duration-350" />,
      title: 'Website Redesigns',
      desc: 'Transforming legacy corporate websites into luxury digital assets that load instantly and leave a lasting impression.',
      link: '/contact?service=redesign'
    },
    {
      icon: <Gauge className="w-8 h-8 text-brand-accent-gold group-hover:scale-110 transition-transform duration-350" />,
      title: 'SEO & Performance Opt.',
      desc: 'Optimizing codebases for speed, loading states, schema indexing, accessibility, and high search engine ranking.',
      link: '/contact?service=seo'
    }
  ];

  const technologies = [
    'React', 'Next.js', 'Three.js', 'WebGL', 'GSAP', 'Node.js', 
    'Figma', 'TailwindCSS', 'GraphQL', 'TypeScript', 'Vite'
  ];

  return (
    <div className="w-full bg-brand-bg-deep pt-32 pb-24 relative overflow-hidden z-10">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-24">
        <span className="text-xs uppercase tracking-widest text-brand-accent-gold font-semibold">OUR SPECIALIZATIONS</span>
        <h1 className="font-display font-semibold text-5xl md:text-7xl tracking-tight text-brand-text-primary mt-4 flex flex-col gap-2">
          <span>WHAT WE</span>
          <span className="text-brand-accent-gold">BUILD</span>
        </h1>
        <div className="h-[2px] bg-gradient-to-r from-brand-accent-gold via-brand-accent-gold-light to-transparent mt-6 w-1/3" />
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service, i) => (
            <Link 
              key={i} 
              to={service.link}
              className="group relative p-10 glass-panel border border-brand-border/40 rounded hover:border-brand-accent-gold/40 hover:glow-gold transition-all duration-350 flex flex-col justify-between min-h-[320px] interactive"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-accent-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350 rounded pointer-events-none" />

              <div className="flex flex-col gap-6 relative z-10 text-left">
                <div className="w-14 h-14 rounded bg-brand-bg-card border border-brand-border/40 flex items-center justify-center group-hover:border-brand-accent-gold/45 transition-colors duration-300">
                  {service.icon}
                </div>
                <h3 className="font-display text-xl tracking-wide text-brand-text-primary group-hover:text-brand-accent-gold transition-colors duration-350">
                  {service.title}
                </h3>
                <p className="text-sm text-brand-text-secondary leading-relaxed">
                  {service.desc}
                </p>
              </div>

              <div className="mt-8 flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-brand-accent-gold group-hover:text-brand-accent-gold-light transition-colors duration-350 justify-end relative z-10">
                <span>Inquire</span>
                <span className="text-sm group-hover:translate-x-1.5 transition-transform duration-300">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Full-Width Banner with Grid Pattern */}
      <section className="relative w-full py-20 bg-brand-bg-card border-y border-brand-border/40 overflow-hidden mb-32 animate-[pulse_6s_infinite]">
        <div className="absolute inset-0 bg-brand-accent-gold/[0.005] bg-[linear-gradient(rgba(212,175,55,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <blockquote className="font-syne font-semibold text-xl md:text-2xl text-brand-text-primary italic tracking-wide">
            "Every pixel. Every interaction. Intentional."
          </blockquote>
          <p className="text-[10px] uppercase tracking-widest text-brand-accent-purple font-semibold mt-4">THE DEVINEDGE STANDARD</p>
        </div>
      </section>

      {/* Tech Stack Horizontal Logo Wall */}
      <section className="mb-12">
        <span className="text-xs uppercase tracking-widest text-brand-accent-gold font-semibold block text-center mb-8">OUR TECHNOLOGICAL ARMAMENT</span>
        
        <div className="relative py-6 bg-brand-bg-card border-y border-brand-border/40 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap text-xl font-display uppercase tracking-widest text-brand-text-secondary/30 flex items-center">
            {[...Array(4)].map((_, i) => (
              <span key={i} className="inline-flex items-center">
                {technologies.map((tech) => (
                  <React.Fragment key={tech}>
                    <span className="hover:text-brand-accent-gold transition-colors duration-300 font-semibold mx-8">{tech}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent-purple" />
                  </React.Fragment>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
