import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import MagneticButton from '../components/MagneticButton';

const projectsData = [
  {
    id: 'apex',
    title: 'Apex Dashboard',
    client: 'Apex Analytics',
    category: 'SaaS',
    tags: ['React', 'Next.js', 'TailwindCSS'],
    description: 'An enterprise-scale financial analytics dashboard built to visualize complex market trends in real-time. Features fluid charts, fully customized drag grids, and zero-latency loading pipelines.',
    color: 'from-brand-accent-purple/15 to-brand-bg-card',
    metric: '40% increase in user retention'
  },
  {
    id: 'aura',
    title: 'Aura Premium Shop',
    client: 'Aura Living',
    category: 'E-Commerce',
    tags: ['WebGL', 'Shopify API', 'TailwindCSS'],
    description: 'Bespoke high-fashion e-commerce platform featuring a custom 3D web configurator that lets customers inspect material textures in close-up detail under dynamic studio lights.',
    color: 'from-brand-accent-gold/15 to-brand-bg-card',
    metric: '18% average order value boost'
  },
  {
    id: 'nova',
    title: 'Nova Launchpad',
    client: 'Nova Aerospace',
    category: 'Landing Pages',
    tags: ['Three.js', 'GSAP', 'Vite'],
    description: 'An interactive cinematic landing page for an orbital satellite enterprise. Features scrolling space vectors and slow-orbiting wireframe particle models of satellites.',
    color: 'from-brand-accent-cyan/15 to-brand-bg-card',
    metric: '1.2M page visits on launch week'
  },
  {
    id: 'chrono',
    title: 'Chrono Timepieces',
    client: 'Chrono AG',
    category: 'Redesigns',
    tags: ['Framer Motion', 'React', 'TailwindCSS'],
    description: 'A website overhaul for a Swiss horology house. Translates physical weight and mechanical escapements into digital fluid physics, complete with a virtual watch assembly game.',
    color: 'from-brand-accent-gold/15 to-brand-accent-purple/15',
    metric: '100 Speed index score on mobile'
  },
  {
    id: 'nexus',
    title: 'Nexus Hub',
    client: 'Nexus VC',
    category: 'Branding',
    tags: ['Logo Design', 'Aesthetics', 'HTML'],
    description: 'Complete digital rebrand for a Silicon Valley venture firm. Outlines clean, architectural typographic lines, dark editorial layouts, and subtle ambient mouse trailing shaders.',
    color: 'from-brand-accent-purple/15 to-brand-bg-card',
    metric: 'Doubled qualified lead conversions'
  },
  {
    id: 'pulse',
    title: 'Pulse WebApp',
    client: 'Pulse Health',
    category: 'SaaS',
    tags: ['TypeScript', 'GraphQL', 'Next.js'],
    description: 'Telemetry dashboard displaying patient diagnostics in high frequency. Features customized real-time soundscapes, accessible color-blind settings, and WebSockets sync.',
    color: 'from-brand-accent-cyan/15 to-brand-bg-card',
    metric: '0.04s database refresh index'
  }
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [sliderPos, setSliderPos] = useState(50); // Before/After slider position (%)
  const underlineRef = useRef(null);
  const sliderContainerRef = useRef(null);

  useEffect(() => {
    // Animate header underline drawing
    gsap.fromTo(underlineRef.current,
      { width: '0%' },
      { width: '150px', duration: 1.2, ease: 'power2.out', delay: 0.2 }
    );
  }, []);

  const handleSliderMove = (clientX) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleTouchMove = (e) => {
    handleSliderMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (e.buttons === 1) { // Check if left click is held
      handleSliderMove(e.clientX);
    }
  };

  const filteredProjects = activeCategory === 'All' 
    ? projectsData 
    : projectsData.filter(p => p.category === activeCategory);

  const categories = ['All', 'Branding', 'E-Commerce', 'SaaS', 'Landing Pages', 'Redesigns'];

  return (
    <div className="w-full bg-brand-bg-deep pt-32 pb-24 relative overflow-hidden z-10">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <span className="text-xs uppercase tracking-widest text-brand-accent-gold font-semibold">PORTFOLIO</span>
        <h1 className="font-display font-semibold text-5xl md:text-7xl tracking-tight text-brand-text-primary mt-4 relative">
          OUR WORK
        </h1>
        <div ref={underlineRef} className="h-[3px] bg-brand-accent-gold mt-4 w-0" />
      </section>

      {/* BEFORE/AFTER FEATURED WORK SLIDER */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-24">
        <span className="text-xs uppercase tracking-widest text-brand-accent-purple font-semibold block mb-4">FEATURED CASE STUDY: BEFORE / AFTER REDESIGN</span>
        
        {/* Interactive Slider Container */}
        <div 
          ref={sliderContainerRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseDown={(e) => handleSliderMove(e.clientX)}
          className="relative w-full aspect-[21/9] min-h-[300px] border border-brand-border/40 rounded overflow-hidden select-none cursor-ew-resize glow-gold"
        >
          {/* BEFORE: Legacy Website Representation */}
          <div className="absolute inset-0 bg-brand-bg-card flex flex-col justify-center px-12 md:px-24 text-left">
            <span className="text-xs uppercase tracking-widest text-brand-text-secondary/40 font-bold">THE LEGACY VERSION (BEFORE)</span>
            <h2 className="font-sans font-bold text-3xl md:text-5xl text-brand-text-secondary/20 mt-2 line-through">Standard Template Grid</h2>
            <p className="text-sm text-brand-text-secondary/20 mt-4 max-w-md">Generic themes, slow loading, low conversions, uninspired visual hierarchy.</p>
            {/* Visual template boxes mockup in wireframe style */}
            <div className="mt-8 flex gap-4 opacity-5">
              <div className="w-16 h-16 border border-brand-text-primary" />
              <div className="w-16 h-16 border border-brand-text-primary" />
              <div className="w-16 h-16 border border-brand-text-primary" />
            </div>
          </div>

          {/* AFTER: New DevinEdge Website Representation */}
          <div 
            className="absolute inset-0 bg-brand-bg-deep flex flex-col justify-center px-12 md:px-24 text-left overflow-hidden border-r border-brand-accent-gold"
            style={{ width: `${sliderPos}%` }}
          >
            {/* Lock width container so texts don't compress on slide */}
            <div className="w-[100vw] h-full flex flex-col justify-center text-left">
              <span className="text-xs uppercase tracking-widest text-brand-accent-gold font-bold">THE DEVINEDGE VERSION (AFTER)</span>
              <h2 className="font-display font-semibold text-3xl md:text-5xl text-brand-text-primary mt-2 leading-none">
                CHRONO <span className="text-brand-accent-gold">TIMEPIECES</span>
              </h2>
              <p className="text-sm text-brand-text-secondary mt-4 max-w-md">Cinematic WebGL canvas, interactive particle clocks, custom GSAP magnetic buttons.</p>
              
              <div className="mt-8 flex gap-4 relative">
                <div className="w-14 h-14 border border-brand-accent-gold bg-brand-accent-gold/5 flex items-center justify-center text-brand-accent-gold text-[10px] font-bold font-display rounded">3D</div>
                <div className="w-14 h-14 border border-brand-accent-gold bg-brand-accent-gold/5 flex items-center justify-center text-brand-accent-gold text-[10px] font-bold font-display rounded">GSAP</div>
                <div className="w-14 h-14 border border-brand-accent-gold bg-brand-accent-gold/5 flex items-center justify-center text-brand-accent-gold text-[10px] font-bold font-display rounded">UX</div>
              </div>
            </div>
          </div>

          {/* DRAG HANDLE BAR */}
          <div 
            className="absolute top-0 bottom-0 w-[1px] bg-brand-accent-gold z-10 flex items-center justify-center"
            style={{ left: `${sliderPos}%` }}
          >
            {/* Gold Handle Node */}
            <div className="w-8 h-8 rounded-full bg-brand-bg-deep border border-brand-accent-gold flex items-center justify-center text-brand-accent-gold font-bold text-xs shadow-lg">
              ↔
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
        <div className="flex flex-wrap gap-4 border-b border-brand-border/40 pb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded border transition-all duration-305 interactive ${
                activeCategory === cat
                  ? 'bg-brand-accent-gold border-brand-accent-gold text-brand-bg-deep shadow-md shadow-brand-accent-gold/15'
                  : 'glass-panel border-brand-border/40 text-brand-text-secondary hover:border-brand-accent-gold hover:text-brand-accent-gold'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-36">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((p) => (
            <div 
              key={p.id}
              onClick={() => setSelectedProject(p)}
              className="group glass-panel border border-brand-border/40 p-6 rounded overflow-hidden flex flex-col justify-between aspect-[1.4] relative hover:border-brand-accent-gold/40 hover:glow-gold transition-all duration-500 cursor-pointer interactive"
            >
              {/* Dynamic luxury card background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />

              <div className="flex justify-between items-start z-10 text-left">
                <span className="text-[10px] uppercase tracking-widest text-brand-accent-gold bg-brand-accent-gold/10 px-3 py-1 rounded border border-brand-accent-gold/15 font-semibold">
                  {p.category}
                </span>
                <span className="text-xs text-brand-accent-purple font-semibold uppercase tracking-widest">{p.client}</span>
              </div>

              {/* Title & Tags */}
              <div className="z-10 text-left mt-16">
                <h3 className="font-display text-2xl md:text-3xl font-semibold tracking-wider text-brand-text-primary group-hover:text-brand-accent-gold transition-colors duration-300">
                  {p.title}
                </h3>
                <div className="flex flex-wrap gap-2.5 mt-3">
                  {p.tags.map(t => (
                    <span key={t} className="text-[9px] uppercase tracking-widest text-brand-text-secondary border border-brand-border px-2 py-0.5 rounded bg-brand-bg-deep/50">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metric & Click Prompt */}
              <div className="mt-8 flex justify-between items-center border-t border-brand-border/40 pt-4 z-10 text-left">
                <span className="text-xs text-brand-text-secondary font-medium italic">{p.metric}</span>
                <span className="text-xs text-brand-accent-gold font-semibold uppercase tracking-widest group-hover:translate-x-1.5 transition-transform duration-300">
                  View Study →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Case Study Details Modal Overlay */}
      {selectedProject && (
        <div className="fixed inset-0 bg-brand-bg-deep/80 z-[99999] flex items-center justify-center p-6 backdrop-blur-md">
          {/* Modal Box */}
          <div className="glass-panel border border-brand-accent-gold/20 p-8 md:p-12 rounded max-w-2xl w-full relative z-10 flex flex-col gap-6 text-left shadow-2xl glow-gold animate-[pulse_4s_infinite]">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 text-brand-text-primary hover:text-brand-accent-gold font-semibold text-lg interactive transition-colors"
            >
              ✕
            </button>

            <div>
              <span className="text-xs uppercase tracking-widest text-brand-accent-purple font-semibold">{selectedProject.category} Case Study</span>
              <h2 className="font-display font-semibold text-3xl md:text-4xl text-brand-text-primary tracking-wide mt-2 uppercase">{selectedProject.title}</h2>
              <span className="text-xs text-brand-accent-gold uppercase tracking-widest font-semibold block mt-1">Client: {selectedProject.client}</span>
            </div>

            <div className="h-[1px] bg-brand-border/40 w-full" />

            <div>
              <h4 className="text-xs uppercase tracking-widest text-brand-text-primary font-bold mb-2">PROJECT OVERVIEW</h4>
              <p className="text-sm text-brand-text-secondary leading-relaxed">{selectedProject.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 bg-brand-bg-card border border-brand-border/40 p-4 rounded">
              <div>
                <h4 className="text-[9px] uppercase tracking-widest text-brand-accent-gold font-bold mb-1">KEY PERFORMANCE</h4>
                <p className="text-xs md:text-sm text-brand-text-primary font-medium">{selectedProject.metric}</p>
              </div>
              <div>
                <h4 className="text-[9px] uppercase tracking-widest text-brand-accent-purple font-bold mb-1">TECH STACK</h4>
                <p className="text-xs text-brand-text-primary">{selectedProject.tags.join(', ')}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-4 justify-end">
              <button 
                onClick={() => setSelectedProject(null)}
                className="px-6 py-2.5 border border-brand-border text-brand-text-primary hover:border-brand-accent-gold hover:text-brand-accent-gold text-xs uppercase tracking-widest font-semibold transition-colors duration-300 interactive rounded"
              >
                Close
              </button>
              <Link 
                to="/contact" 
                onClick={() => setSelectedProject(null)}
                className="px-6 py-2.5 bg-brand-accent-gold text-brand-bg-deep hover:bg-brand-accent-gold-light text-xs uppercase tracking-widest font-semibold transition-all duration-300 interactive rounded"
              >
                Inquire Project
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <section className="border-t border-brand-border/40 pt-24 pb-16 bg-brand-bg-card">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6">
          <h2 className="font-display font-semibold text-3xl md:text-5xl text-brand-text-primary tracking-widest uppercase">
            HAVE A PROJECT IN MIND?
          </h2>
          <p className="text-brand-text-secondary text-base max-w-lg mb-4">
            Let's collaborate to build an extraordinary premium digital experience that accelerates your brand visibility.
          </p>
          <MagneticButton>
            <Link 
              to="/contact" 
              className="px-8 py-4 bg-brand-accent-gold text-brand-bg-deep text-sm uppercase tracking-widest font-bold hover:bg-brand-accent-gold-light hover:shadow-lg transition-all duration-300 block rounded"
            >
              Start a Project
            </Link>
          </MagneticButton>
        </div>
      </section>
    </div>
  );
}
