import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import Lenis from 'lenis';

// Global Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';

// Page Components
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Process from './pages/Process';
import Pricing from './pages/Pricing';
import Testimonials from './pages/Testimonials';
import Contact from './pages/Contact';
import Careers from './pages/Careers';

export default function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Scroll to top on standard load / fallback
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 1. Preloader Screen setup (1.5s duration)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Smooth fade-out of the pre-loader overlay
      gsap.to('.preloader-container', {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          setLoading(false);
        }
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // 2. Lenis Smooth Scroll Initialization
  useEffect(() => {
    // Skip lenis initialization on mobile screens for scrolling performance
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    if (isMobile) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    // Keep Lenis updated when React Router changes locations
    lenis.scrollTo(0, { immediate: true });

    return () => {
      lenis.destroy();
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-brand-bg-deep text-brand-text-primary relative antialiased selection:bg-brand-accent-gold selection:text-brand-bg-deep">
      {/* 1. Pre-loader overlay */}
      {loading && (
        <div className="preloader-container fixed inset-0 bg-brand-bg-deep z-[999999] flex flex-col items-center justify-center">
          {/* Logo assembly particle placeholder drawing */}
          <svg className="w-24 h-24 mb-6 animate-[pulse_2s_infinite]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
            <path 
              className="draw-path" 
              d="M20 20 L80 20 L80 80 L20 80 Z M20 50 L80 50 M50 20 L50 80" 
              stroke="#d4af37" 
              strokeWidth="2" 
            />
          </svg>
          <div className="font-display text-2xl tracking-widest text-brand-text-primary uppercase">
            DEVIN<span className="text-brand-accent-gold animate-pulse">EDGE</span>
          </div>
          <span className="text-[10px] text-brand-text-secondary tracking-widest uppercase mt-4 opacity-60">Preparing Premium Experience</span>
        </div>
      )}

      {/* 2. Global header navbar navigation */}
      <Navbar />

      {/* 3. Routable viewport with curtain transitions */}
      <PageTransition>
        <main className="w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/process" element={<Process />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="*" element={<Home />} /> {/* Fallback route redirection */}
          </Routes>
        </main>
      </PageTransition>

      {/* 4. Global footer columns */}
      <Footer />
    </div>
  );
}
