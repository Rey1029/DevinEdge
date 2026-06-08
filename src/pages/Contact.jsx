import { useState, useEffect } from 'react';
import gsap from 'gsap';
import MagneticButton from '../components/MagneticButton';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: 'design',
    budget: '$5k - $10k',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    // Word-by-word reveal using class selection
    gsap.fromTo('.contact-title-word',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    );
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate 60 confetti particles with random vectors
    const particles = Array.from({ length: 60 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 220;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const rot = Math.random() * 360;
      const size = 6 + Math.random() * 12;
      
      // Cyber-obsidian accent colors (gold, purple, cyan)
      const colors = ['#d4af37', '#7c3aed', '#06b6d4'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      return {
        id: i,
        tx: `${tx}px`,
        ty: `${ty}px`,
        rot: `${rot}deg`,
        size: `${size}px`,
        color,
        delay: `${Math.random() * 0.2}s`
      };
    });

    setConfetti(particles);
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      service: 'design',
      budget: '$5k - $10k',
      message: ''
    });
    setSubmitted(false);
    setConfetti([]);
  };

  return (
    <div className="w-full bg-brand-bg-deep pt-32 pb-24 relative overflow-hidden z-10">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-16 text-left relative">
        <span className="text-xs uppercase tracking-widest text-brand-accent-gold font-semibold">GET IN TOUCH</span>
        <h1 className="font-display font-semibold text-5xl md:text-7xl xl:text-8xl tracking-tight leading-none text-brand-text-primary mt-4 flex flex-wrap select-none">
          {"LET'S BUILD SOMETHING GREAT.".split(' ').map((word, index) => (
            <span 
              key={index} 
              className="inline-block mr-4 md:mr-6 contact-title-word"
            >
              {word}
            </span>
          ))}
        </h1>
        <div className="h-[2px] bg-gradient-to-r from-brand-accent-gold to-transparent mt-6 w-32" />
      </section>

      {/* Main Split Layout */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 relative">
        {/* Left Form Column */}
        <div className="lg:col-span-7 glass-panel border border-brand-border/40 p-8 md:p-12 rounded text-left">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            {/* Input Name */}
            <div className="relative">
              <input 
                type="text" 
                name="name" 
                id="form-name"
                value={formData.name}
                onChange={handleChange}
                required
                className="peer w-full bg-transparent border-b border-brand-border/40 py-2.5 text-brand-text-primary focus:outline-none focus:border-brand-accent-gold transition-colors duration-300 placeholder-transparent"
                placeholder="Name"
              />
              <label 
                htmlFor="form-name"
                className="absolute left-0 top-2.5 text-xs text-brand-text-secondary/50 tracking-wider transition-all duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:top-2.5 peer-focus:top-[-16px] peer-focus:text-xs peer-focus:text-brand-accent-gold"
                style={{ top: formData.name ? '-16px' : undefined, fontSize: formData.name ? '0.75rem' : undefined }}
              >
                YOUR NAME *
              </label>
            </div>

            {/* Input Email */}
            <div className="relative">
              <input 
                type="email" 
                name="email" 
                id="form-email"
                value={formData.email}
                onChange={handleChange}
                required
                className="peer w-full bg-transparent border-b border-brand-border/40 py-2.5 text-brand-text-primary focus:outline-none focus:border-brand-accent-gold transition-colors duration-300 placeholder-transparent"
                placeholder="Email"
              />
              <label 
                htmlFor="form-email"
                className="absolute left-0 top-2.5 text-xs text-brand-text-secondary/50 tracking-wider transition-all duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:top-2.5 peer-focus:top-[-16px] peer-focus:text-xs peer-focus:text-brand-accent-gold"
                style={{ top: formData.email ? '-16px' : undefined, fontSize: formData.email ? '0.75rem' : undefined }}
              >
                EMAIL ADDRESS *
              </label>
            </div>

            {/* Input Company */}
            <div className="relative">
              <input 
                type="text" 
                name="company" 
                id="form-company"
                value={formData.company}
                onChange={handleChange}
                className="peer w-full bg-transparent border-b border-brand-border/40 py-2.5 text-brand-text-primary focus:outline-none focus:border-brand-accent-gold transition-colors duration-300 placeholder-transparent"
                placeholder="Company"
              />
              <label 
                htmlFor="form-company"
                className="absolute left-0 top-2.5 text-xs text-brand-text-secondary/50 tracking-wider transition-all duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:top-2.5 peer-focus:top-[-16px] peer-focus:text-xs peer-focus:text-brand-accent-gold"
                style={{ top: formData.company ? '-16px' : undefined, fontSize: formData.company ? '0.75rem' : undefined }}
              >
                COMPANY NAME (OPTIONAL)
              </label>
            </div>

            {/* Dropdown service */}
            <div className="flex flex-col gap-2 text-left">
              <label className="text-[10px] text-brand-text-secondary/50 tracking-widest uppercase">Project Type</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full bg-brand-bg-deep border border-brand-border/60 py-3 px-4 text-sm text-brand-text-primary focus:outline-none focus:border-brand-accent-gold transition-colors duration-300 rounded"
              >
                <option value="design" className="bg-brand-bg-deep text-brand-text-primary">Custom Website Design</option>
                <option value="ecommerce" className="bg-brand-bg-deep text-brand-text-primary">E-Commerce Development</option>
                <option value="saas" className="bg-brand-bg-deep text-brand-text-primary">SaaS Product Build</option>
                <option value="landing" className="bg-brand-bg-deep text-brand-text-primary">Landing Page Creation</option>
                <option value="redesign" className="bg-brand-bg-deep text-brand-text-primary">Website Redesign</option>
                <option value="seo" className="bg-brand-bg-deep text-brand-text-primary">SEO & Optimization</option>
              </select>
            </div>

            {/* Radio budget */}
            <div className="flex flex-col gap-3 text-left">
              <label className="text-[10px] text-brand-text-secondary/50 tracking-widest uppercase">Estimated Budget</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['<$5k', '$5k - $10k', '$10k - $25k', '$25k+'].map(tier => (
                  <label 
                    key={tier}
                    className={`py-3 text-center text-xs uppercase tracking-widest border rounded cursor-pointer transition-all duration-300 ${
                      formData.budget === tier
                        ? 'bg-brand-accent-gold border-brand-accent-gold text-brand-bg-deep shadow-md font-bold shadow-brand-accent-gold/20'
                        : 'bg-brand-bg-card border-brand-border/40 text-brand-text-secondary hover:border-brand-accent-gold'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="budget" 
                      value={tier}
                      checked={formData.budget === tier}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    {tier}
                  </label>
                ))}
              </div>
            </div>

            {/* Textarea message */}
            <div className="relative">
              <textarea 
                name="message" 
                id="form-message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                required
                className="peer w-full bg-transparent border-b border-brand-border/40 py-2.5 text-brand-text-primary focus:outline-none focus:border-brand-accent-gold transition-colors duration-300 placeholder-transparent resize-none"
                placeholder="Message"
              />
              <label 
                htmlFor="form-message"
                className="absolute left-0 top-2.5 text-xs text-brand-text-secondary/50 tracking-wider transition-all duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:top-2.5 peer-focus:top-[-16px] peer-focus:text-xs peer-focus:text-brand-accent-gold"
                style={{ top: formData.message ? '-16px' : undefined, fontSize: formData.message ? '0.75rem' : undefined }}
              >
                TELL US ABOUT THE PROJECT *
              </label>
            </div>

            <div className="mt-4">
              <MagneticButton className="w-full sm:w-auto">
                <button 
                  type="submit"
                  className="w-full px-8 py-4 bg-brand-accent-gold text-brand-bg-deep text-xs uppercase tracking-widest font-semibold hover:bg-brand-accent-gold-light transition-colors duration-300 cursor-pointer rounded shadow-lg shadow-brand-accent-gold/10 hover:shadow-brand-accent-gold/25"
                >
                  Send Message
                </button>
              </MagneticButton>
            </div>

          </form>
        </div>

        {/* Right Info Column */}
        <div className="lg:col-span-5 flex flex-col gap-10 text-left">
          {/* Particulars Card */}
          <div className="glass-panel border border-brand-border/40 p-8 rounded">
            <h3 className="font-display text-lg tracking-widest text-brand-text-primary uppercase mb-6">OFFICE DETAILS</h3>
            
            <div className="flex flex-col gap-5 text-sm text-brand-text-secondary">
              <div>
                <span className="text-[10px] text-brand-accent-gold tracking-wider uppercase font-bold block">EMAIL CONNECTION</span>
                <a href="mailto:devinedge99@gmail.com" className="text-brand-text-primary hover:text-brand-accent-gold transition-colors duration-305">devinedge99@gmail.com</a>
              </div>
              
              <div>
                <span className="text-[10px] text-brand-accent-gold tracking-wider uppercase font-bold block">DIRECT LINE</span>
                <span className="text-brand-text-primary">+91 77009 26265</span>
              </div>

              <div>
                <span className="text-[10px] text-brand-accent-gold tracking-wider uppercase font-bold block">HQ LOCATION</span>
                <span className="text-brand-text-primary">Mumbai, India</span>
              </div>
            </div>
          </div>

          {/* Stylized SVG Map with pin */}
          <div className="glass-panel border border-brand-border/40 p-6 rounded relative overflow-hidden aspect-[4/3] flex items-center justify-center">
            {/* Pulsing glow under location */}
            <div className="absolute top-1/2 left-[48%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-brand-accent-gold opacity-30 animate-ping pointer-events-none" />
            <div className="absolute top-1/2 left-[48%] -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-brand-accent-purple z-10 pointer-events-none border border-brand-bg-deep" />

            {/* Stylized grid-style world outline */}
            <svg viewBox="0 0 400 300" className="w-full h-full opacity-20 text-brand-text-secondary" fill="none" stroke="currentColor" strokeWidth="1">
              {/* Abstract land shapes representation */}
              <path d="M 20 80 Q 40 50 80 60 Q 120 70 140 40 Q 160 30 180 50 Q 200 70 230 75 Q 260 80 280 60 Q 320 50 360 80 Q 380 90 390 120 Q 350 150 310 130 Q 280 120 260 140 Q 240 160 210 150 Q 180 140 170 170 Q 140 180 120 160 Q 100 140 80 150 Q 50 160 30 120 Z" />
              <path d="M 120 220 Q 140 200 160 220 Q 180 240 210 230 Q 240 220 270 250 Q 260 280 230 275 Z" />
              {/* Radar waves from the pin */}
              <circle cx="192" cy="150" r="10" stroke="#d4af37" strokeWidth="0.5" className="animate-[ping_4s_infinite]" />
              <circle cx="192" cy="150" r="30" stroke="#d4af37" strokeWidth="0.5" className="animate-[ping_6s_infinite]" />
            </svg>
            <span className="absolute bottom-4 left-4 text-[9px] text-brand-text-secondary/40 uppercase tracking-widest font-bold">Mumbai HQ schematic map</span>
          </div>
        </div>
      </section>

      {/* FULL-SCREEN SUBMIT SUCCESS OVERLAY */}
      {submitted && (
        <div className="fixed inset-0 bg-brand-bg-deep/85 z-[999999] flex items-center justify-center p-6 backdrop-blur-md animate-[fade-in_0.5s_forwards]">
          {/* Confetti container */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {confetti.map((c) => (
              <div 
                key={c.id}
                className="absolute top-1/2 left-1/2 rounded-full opacity-0"
                style={{
                  width: c.size,
                  height: c.size,
                  backgroundColor: c.color,
                  animation: `explode 1.5s cubic-bezier(0.1, 0.8, 0.3, 1) ${c.delay} forwards`,
                  '--tx': c.tx,
                  '--ty': c.ty,
                  '--rot': c.rot,
                }}
              />
            ))}
          </div>

          {/* Style snippet to inject the confetti keyframes */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes explode {
              0% { transform: translate(-50%, -50%) translate(0, 0) rotate(0deg); opacity: 1; }
              100% { transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) rotate(var(--rot)); opacity: 0; }
            }
          `}} />

          {/* Dialog box */}
          <div className="glass-panel border border-brand-accent-gold/25 p-10 md:p-16 rounded max-w-lg w-full text-center flex flex-col items-center gap-6 shadow-2xl glow-gold relative z-10 animate-[pulse_4s_infinite]">
            <div className="w-16 h-16 rounded-full border border-brand-accent-gold bg-brand-accent-gold/10 flex items-center justify-center text-brand-accent-gold text-2xl mb-2">
              ✓
            </div>
            <h2 className="font-display font-semibold text-2xl md:text-3xl text-brand-text-primary tracking-widest uppercase">
              MESSAGE SENT
            </h2>
            <p className="text-brand-text-secondary text-sm leading-relaxed max-w-sm">
              We've received your project details. We'll be in touch within 24 hours to schedule our discovery call. 🚀
            </p>
            <div className="h-[1px] bg-brand-border/40 w-full my-2" />
            <button 
              onClick={handleReset}
              className="px-8 py-3 bg-brand-accent-gold text-brand-bg-deep hover:bg-brand-accent-gold-light text-xs uppercase tracking-widest font-semibold transition-all duration-300 interactive rounded shadow-md"
            >
              Back to Contact
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
