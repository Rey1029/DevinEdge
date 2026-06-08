import { useRef, useState } from 'react';
import { Star, Quote, Play } from 'lucide-react';

export default function Testimonials() {
  const carouselRef = useRef(null);
  const dragRef = useRef({ isDown: false, startX: 0, scrollLeft: 0 });
  const [activeVideo, setActiveVideo] = useState(null);

  const handleMouseDown = (e) => {
    const drag = dragRef.current;
    drag.isDown = true;
    drag.startX = e.pageX - carouselRef.current.offsetLeft;
    drag.scrollLeft = carouselRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    dragRef.current.isDown = false;
  };

  const handleMouseUp = () => {
    dragRef.current.isDown = false;
  };

  const handleMouseMove = (e) => {
    const drag = dragRef.current;
    if (!drag.isDown) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - drag.startX) * 1.5;
    carouselRef.current.scrollLeft = drag.scrollLeft - walk;
  };

  const reviews = [
    {
      name: 'Sarah Jenkins',
      role: 'Director of Growth',
      company: 'Apex Analytics',
      rating: 5,
      quote: 'DevinEdge completely redefined our web product. The custom animations and speed performance doubled our conversion rate in the first month. Incredible attention to details.'
    },
    {
      name: 'Oliver Lindqvist',
      role: 'Founder',
      company: 'Aura Living',
      rating: 5,
      quote: 'Working with Xavier and his team was like commissioning a custom gallery piece. They translated our physical furniture textures into an interactive WebGL canvas that wowed our customers.'
    },
    {
      name: 'Jean-Pierre Dubois',
      role: 'Head of Marketing',
      company: 'Chrono AG',
      rating: 5,
      quote: 'The horology site redesign was a massive success. Our pages load instantly and score 100 on mobile performance. DevinEdge is the gold standard of elegant developers.'
    },
    {
      name: 'Emily Zhao',
      role: 'Partner',
      company: 'Nexus VC',
      rating: 5,
      quote: 'Exceptional creative design. They did not just code files, they built a brand identity. The mouse trailing shaders and typographical layouts perfectly represent our elegant VC fund.'
    }
  ];

  const featuredQuotes = [
    {
      quote: 'We wanted a premium digital asset that was as clean as our physical products. DevinEdge delivered a refined landing page that commands attention.',
      author: 'CEO, Nova Aerospace'
    },
    {
      quote: 'Zero template shortcuts, zero bugs. Absolute precision engineering. They have become our permanent development partners for all product launches.',
      author: 'CTO, Pulse Health'
    }
  ];

  const logos = ['Apex Analytics', 'Aura Living', 'Chrono AG', 'Nexus VC', 'Nova Space', 'Pulse Health', 'Vance Capital'];

  const videos = [
    { id: 1, title: 'Interview with Sarah Jenkins', length: '2:15 Min', desc: 'How Apex dashboard solved scaling latency.' },
    { id: 2, title: 'Horology design with Chrono AG', length: '1:45 Min', desc: 'Developing fluid physical watches in React.' },
    { id: 3, title: 'VC rebranding with Nexus', length: '3:10 Min', desc: 'Crafting premium typographical brand assets.' }
  ];

  return (
    <div className="w-full bg-brand-bg-deep pt-32 pb-24 relative overflow-hidden z-10">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-16 text-center flex flex-col items-center">
        <span className="text-xs uppercase tracking-widest text-brand-accent-gold font-semibold">FEEDBACK</span>
        <h1 className="font-display font-semibold text-5xl md:text-7xl tracking-wider text-brand-text-primary mt-4 uppercase">
          CLIENTS <span className="text-brand-accent-gold">DON'T LIE.</span>
        </h1>
        <div className="h-[2px] bg-gradient-to-r from-brand-accent-gold to-transparent mt-6 w-32" />
      </section>

      {/* Draggable Testimonials Carousel */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-28">
        <p className="text-xs text-brand-text-secondary uppercase tracking-widest text-left mb-6 font-semibold">
          (Click and drag to scroll client cards)
        </p>

        <div 
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex gap-8 overflow-x-hidden pb-12 cursor-grab active:cursor-grabbing select-none w-full"
        >
          {reviews.map((r, i) => (
            <div 
              key={i} 
              className="flex-shrink-0 w-[300px] md:w-[420px] glass-panel border border-brand-border/40 p-8 md:p-10 rounded relative flex flex-col justify-between hover:border-brand-accent-gold/40 hover:glow-gold transition-all duration-300 text-left"
            >
              {/* Star Rating */}
              <div className="flex gap-1.5 mb-6 text-brand-accent-gold">
                {[...Array(r.rating)].map((_, idx) => (
                  <Star key={idx} size={16} fill="currentColor" />
                ))}
              </div>

              <blockquote className="text-base text-brand-text-primary font-medium leading-relaxed italic mb-8">
                "{r.quote}"
              </blockquote>

              <div className="border-t border-brand-border/40 pt-4">
                <h4 className="font-display text-lg tracking-wider text-brand-text-primary uppercase">{r.name}</h4>
                <p className="text-xs text-brand-text-secondary uppercase tracking-widest mt-0.5">{r.role} at <span className="text-brand-accent-gold">{r.company}</span></p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Large Featured Pull Quotes */}
      <section className="bg-brand-bg-card border-y border-brand-border/40 py-24 mb-32 relative">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 text-left">
          {featuredQuotes.map((q, i) => (
            <div key={i} className="flex flex-col gap-4 relative">
              <Quote className="text-brand-accent-gold w-12 h-12 opacity-15 absolute top-[-20px] left-[-15px]" />
              <blockquote className="font-syne font-semibold text-xl md:text-2xl text-brand-text-primary italic leading-relaxed pl-6 relative z-10">
                "{q.quote}"
              </blockquote>
              <span className="text-xs uppercase tracking-widest text-brand-accent-purple font-bold pl-6 mt-2">
                - {q.author}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Logo Wall */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-36">
        <span className="text-xs uppercase tracking-widest text-brand-accent-gold font-semibold block text-center mb-8">TRUSTED BY AMBITIOUS TEAMS IN 7 COUNTRIES</span>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {logos.map((logo, i) => (
            <div 
              key={i} 
              className="py-6 glass-panel border border-brand-border/40 rounded text-center font-display tracking-widest uppercase text-sm text-brand-text-secondary/60 hover:text-brand-accent-gold hover:border-brand-accent-gold/45 transition-all duration-300 select-none interactive"
            >
              {logo}
            </div>
          ))}
        </div>
      </section>

      {/* Video Review Placeholders */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-brand-accent-purple font-semibold">VIDEO FEEDBACK</span>
          <h2 className="font-display font-semibold text-3xl md:text-5xl text-brand-text-primary tracking-widest uppercase mt-2">WATCH THEIR STORIES</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {videos.map((v) => (
            <div 
              key={v.id}
              onClick={() => setActiveVideo(v)}
              className="group glass-panel border border-brand-border/40 p-6 rounded overflow-hidden flex flex-col justify-between aspect-[1.5] relative hover:border-brand-accent-gold/40 hover:glow-purple transition-all duration-500 cursor-pointer interactive text-left"
            >
              <div className="absolute inset-0 bg-brand-accent-gold/5 opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
              
              {/* Play Button Icon */}
              <div className="w-12 h-12 rounded-full border border-brand-border/40 flex items-center justify-center bg-brand-bg-card text-brand-text-primary group-hover:text-brand-accent-gold group-hover:border-brand-accent-gold group-hover:scale-105 transition-all duration-305 z-10 shadow-lg shadow-brand-accent-gold/5">
                <Play size={18} fill="currentColor" className="ml-0.5" />
              </div>

              <div className="z-10 mt-12">
                <h4 className="font-display text-lg tracking-wider text-brand-text-primary uppercase group-hover:text-brand-accent-gold transition-colors duration-300">{v.title}</h4>
                <p className="text-xs text-brand-text-secondary mt-1 leading-relaxed">{v.desc}</p>
              </div>

              <div className="mt-4 border-t border-brand-border/40 pt-3 flex justify-between items-center text-[10px] text-brand-text-secondary/50 uppercase tracking-widest z-10 font-bold">
                <span>Case study clip</span>
                <span>{v.length}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Video Modal Popup */}
      {activeVideo && (
        <div className="fixed inset-0 bg-brand-bg-deep/80 z-[99999] flex items-center justify-center p-6 backdrop-blur-md">
          <div className="glass-panel border border-brand-accent-gold/20 p-10 rounded glow-gold max-w-lg w-full relative z-10 text-left flex flex-col gap-6 shadow-2xl animate-[pulse_4s_infinite]">
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-6 right-6 text-brand-text-primary hover:text-brand-accent-gold font-semibold text-lg interactive"
            >
              ✕
            </button>

            <div>
              <span className="text-xs uppercase tracking-widest text-brand-accent-purple font-semibold">Video Playback Simulator</span>
              <h3 className="font-display text-2xl text-brand-text-primary mt-1 uppercase">{activeVideo.title}</h3>
            </div>

            {/* Video Mock Screen */}
            <div className="w-full aspect-video bg-brand-bg-deep border border-brand-border/40 rounded flex flex-col items-center justify-center relative overflow-hidden group">
              {/* Pulsing indicator */}
              <div className="absolute inset-0 bg-brand-accent-gold/5 flex items-center justify-center animate-pulse">
                <div className="w-16 h-16 rounded-full border border-brand-accent-gold flex items-center justify-center text-brand-accent-gold font-bold text-xs">
                  BUFFER
                </div>
              </div>
              <span className="text-[10px] text-brand-text-secondary/60 uppercase tracking-widest z-10 mt-20">Simulation connection online</span>
            </div>

            <p className="text-xs text-brand-text-secondary leading-relaxed">
              * Note: Video playback is represented as an interactive WebGL texture layout inside DevinEdge frameworks. In real client environments, this plays high-definition video formats natively.
            </p>

            <button 
              onClick={() => setActiveVideo(null)}
              className="mt-2 w-full py-3 bg-brand-accent-gold text-brand-bg-deep hover:bg-brand-accent-gold-light text-xs uppercase tracking-widest font-semibold transition-colors duration-300 interactive rounded"
            >
              Close Simulator
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
