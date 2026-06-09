import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import MagneticButton from '../components/MagneticButton';

const API_BASE = import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:5000/api`;

export default function Contact() {
  const [searchParams] = useSearchParams();
  const userCountry = localStorage.getItem('user-country') || 'US';
  const defaultBudget = userCountry === 'IN' ? '₹15k - ₹30k' : '$5k - $10k';
  const budgetOptions = userCountry === 'IN'
    ? ['<₹15k', '₹15k - ₹30k', '₹30k - ₹60k', '₹60k+']
    : ['<$5k', '$5k - $10k', '$10k - $25k', '$25k+'];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: 'design',
    budget: defaultBudget,
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authFormData, setAuthFormData] = useState({ name: '', email: '', password: '' });
  const [pendingSubmit, setPendingSubmit] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const stored = localStorage.getItem('user');
      setUser(stored ? JSON.parse(stored) : null);
    };
    checkAuth();
    window.addEventListener('auth-change', checkAuth);
    return () => window.removeEventListener('auth-change', checkAuth);
  }, []);

  useEffect(() => {
    // Word-by-word reveal using class selection
    gsap.fromTo('.contact-title-word',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    );
  }, []);

  useEffect(() => {
    const pkg = searchParams.get('package');
    if (pkg) {
      let serviceVal = 'design';
      let budgetVal = defaultBudget;

      if (pkg === 'starter') {
        serviceVal = 'landing';
        budgetVal = userCountry === 'IN' ? '<₹15k' : '<$5k';
      } else if (pkg === 'growth') {
        serviceVal = 'design';
        budgetVal = userCountry === 'IN' ? '₹15k - ₹30k' : '$5k - $10k';
      } else if (pkg === 'elite') {
        serviceVal = 'saas';
        budgetVal = userCountry === 'IN' ? '₹60k+' : '$25k+';
      }

      setFormData(prev => ({
        ...prev,
        service: serviceVal,
        budget: budgetVal
      }));
    }
  }, [searchParams, defaultBudget, userCountry]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      setPendingSubmit(true);
      return;
    }
    submitInquiry();
  };

  const submitInquiry = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          service: formData.service,
          budget: formData.budget,
          message: formData.message,
          clientCompany: formData.company
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

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
    } catch (err) {
      console.error('Submit error:', err.message);
      alert(`Submission failed: ${err.message}`);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const url = isSignUp 
        ? `${API_BASE}/auth/signup` 
        : `${API_BASE}/auth/login`;
        
      const payload = isSignUp 
        ? { name: authFormData.name, email: authFormData.email, password: authFormData.password }
        : { email: authFormData.email, password: authFormData.password };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('auth-change'));
      
      setShowAuthModal(false);
      if (pendingSubmit) {
        setPendingSubmit(false);
        setTimeout(() => {
          submitInquiry();
        }, 100);
      }
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleGoogleMockLogin = async () => {
    setAuthError('');
    try {
      const mockName = 'Google User';
      const mockEmail = 'google.user@gmail.com';
      const mockGoogleId = 'g-' + Math.random().toString(36).substring(2, 11);

      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: mockName, email: mockEmail, googleId: mockGoogleId })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Google Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('auth-change'));

      setShowAuthModal(false);
      if (pendingSubmit) {
        setPendingSubmit(false);
        setTimeout(() => {
          submitInquiry();
        }, 100);
      }
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleAuthChange = (e) => {
    setAuthFormData({ ...authFormData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      service: 'design',
      budget: defaultBudget,
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
                {budgetOptions.map(tier => (
                  <label 
                    key={tier}
                    className={`py-3 text-center text-xs uppercase tracking-widest border rounded cursor-pointer transition-all duration-305 ${
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
              className="px-8 py-3 bg-brand-accent-gold text-brand-bg-deep hover:bg-brand-accent-gold-light text-xs uppercase tracking-widest font-semibold transition-all duration-305 interactive rounded shadow-md"
            >
              Back to Contact
            </button>
          </div>
        </div>
      )}

      {/* AUTHENTICATION INTERCEPTOR MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-brand-bg-deep/90 z-[99999] flex items-center justify-center p-6 backdrop-blur-md animate-[fade-in_0.3s_forwards]">
          <div className="glass-panel border border-brand-accent-gold/25 p-8 md:p-10 rounded max-w-md w-full text-center flex flex-col gap-6 shadow-2xl relative z-10">
            {/* Close Button */}
            <button 
              onClick={() => { setShowAuthModal(false); setPendingSubmit(false); }}
              className="absolute top-4 right-4 text-brand-text-secondary hover:text-brand-accent-gold transition-colors duration-300 text-sm cursor-pointer"
            >
              ✕
            </button>

            <h2 className="font-display font-semibold text-xl md:text-2xl text-brand-text-primary tracking-widest uppercase">
              {isSignUp ? 'CREATE CLIENT ACCOUNT' : 'CLIENT SIGN IN'}
            </h2>
            <p className="text-brand-text-secondary text-xs leading-relaxed max-w-xs mx-auto">
              Please sign in or create an account to securely submit your project inquiry and track your project timeline.
            </p>

            {authError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs py-2.5 px-4 rounded text-left">
                {authError}
              </div>
            )}

            {/* Simulated Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleMockLogin}
              className="w-full py-3.5 border border-brand-border hover:border-brand-accent-gold/50 bg-brand-bg-card text-brand-text-primary text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-3 rounded transition-all duration-300 interactive cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            <div className="relative flex items-center justify-center my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-border/40"></div>
              </div>
              <span className="relative px-3 text-[10px] text-brand-text-secondary/50 uppercase tracking-widest bg-brand-bg-deep">OR</span>
            </div>

            {/* Email/Password Auth Form */}
            <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4 text-left">
              {isSignUp && (
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    required
                    value={authFormData.name}
                    onChange={handleAuthChange}
                    className="peer w-full bg-brand-bg-card border border-brand-border/60 py-2.5 px-3 text-sm text-brand-text-primary focus:outline-none focus:border-brand-accent-gold transition-colors duration-300 rounded"
                    placeholder="Full Name"
                  />
                </div>
              )}

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  value={authFormData.email}
                  onChange={handleAuthChange}
                  className="peer w-full bg-brand-bg-card border border-brand-border/60 py-2.5 px-3 text-sm text-brand-text-primary focus:outline-none focus:border-brand-accent-gold transition-colors duration-300 rounded"
                  placeholder="Email Address"
                />
              </div>

              <div className="relative">
                <input
                  type="password"
                  name="password"
                  required
                  value={authFormData.password}
                  onChange={handleAuthChange}
                  className="peer w-full bg-brand-bg-card border border-brand-border/60 py-2.5 px-3 text-sm text-brand-text-primary focus:outline-none focus:border-brand-accent-gold transition-colors duration-300 rounded"
                  placeholder="Password"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-brand-accent-gold text-brand-bg-deep text-xs uppercase tracking-widest font-bold hover:bg-brand-accent-gold-light transition-all duration-300 rounded shadow-md cursor-pointer mt-2"
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="text-center mt-2">
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setAuthError(''); }}
                className="text-[10px] text-brand-accent-gold tracking-widest uppercase hover:underline transition-all duration-300 cursor-pointer"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
