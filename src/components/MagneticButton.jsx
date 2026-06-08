import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function MagneticButton({ children, className = "", strength = 25, range = 80, ...props }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Disable on touch screens for better performance
    const isTouch = window.matchMedia('(max-width: 1024px)').matches;
    if (isTouch) return;

    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      
      const distance = Math.hypot(distanceX, distanceY);
      
      if (distance < range) {
        // Calculate magnetic factor
        const ratio = (range - distance) / range; // 0 to 1
        const pullX = distanceX * (strength / range) * ratio * 2;
        const pullY = distanceY * (strength / range) * ratio * 2;
        
        gsap.to(el, {
          x: pullX,
          y: pullY,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        // Reset position
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.4)',
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (el) el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, range]);

  return (
    <div 
      ref={containerRef} 
      className={`inline-block ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
}
