import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const curtainTealRef = useRef(null);
  const curtainCreamRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Skip on initial load
    if (location.pathname === '/' && displayChildren === children) {
      return;
    }

    // Set transitioning asynchronously to prevent ESLint warning on cascading renders
    const rAnim = requestAnimationFrame(() => {
      setIsTransitioning(true);
    });

    const tl = gsap.timeline({
      onComplete: () => {
        setIsTransitioning(false);
      }
    });

    // 1. Reset curtains off-screen left
    gsap.set(curtainTealRef.current, { x: '-100%' });
    gsap.set(curtainCreamRef.current, { x: '-100%' });

    // 2. Animate purple curtain in
    tl.to(curtainTealRef.current, {
      x: '0%',
      duration: 0.5,
      ease: 'power3.in',
    });

    // 3. Animate deep obsidian curtain in, slightly staggered
    tl.to(curtainCreamRef.current, {
      x: '0%',
      duration: 0.5,
      ease: 'power3.in',
    }, '-=0.4');

    // 4. Midway: Swap the children (update the route content) while fully covered
    tl.add(() => {
      setDisplayChildren(children);
      window.scrollTo(0, 0);
    });

    // 5. Slide purple curtain out to the right
    tl.to(curtainTealRef.current, {
      x: '100%',
      duration: 0.5,
      ease: 'power3.out',
    });

    // 6. Slide deep obsidian curtain out to the right
    tl.to(curtainCreamRef.current, {
      x: '100%',
      duration: 0.5,
      ease: 'power3.out',
    }, '-=0.4');

    return () => {
      cancelAnimationFrame(rAnim);
    };

  }, [location.pathname, children, displayChildren]);

  // Keep displayChildren in sync
  useEffect(() => {
    if (!isTransitioning) {
      const rAnim = requestAnimationFrame(() => {
        setDisplayChildren(children);
      });
      return () => cancelAnimationFrame(rAnim);
    }
  }, [children, isTransitioning]);

  return (
    <div className="relative min-h-screen w-full">
      {/* Purple curtain overlay */}
      <div 
        ref={curtainTealRef} 
        className="fixed inset-0 bg-brand-accent-purple z-[99990] pointer-events-none"
        style={{ transform: 'translateX(-100%)' }}
      />

      {/* Deep obsidian curtain overlay with gold stripe */}
      <div 
        ref={curtainCreamRef} 
        className="fixed inset-0 bg-brand-bg-deep border-l-2 border-brand-accent-gold z-[99991] pointer-events-none flex items-center justify-center"
        style={{ transform: 'translateX(-100%)' }}
      >
        <div className="font-display text-4xl text-brand-accent-gold tracking-widest uppercase opacity-20 animate-pulse">
          DEVINEDGE
        </div>
      </div>

      {/* Render current page */}
      <div className="w-full">
        {displayChildren}
      </div>
    </div>
  );
}
