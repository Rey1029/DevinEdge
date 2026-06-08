import { useState, useEffect, useRef, useCallback } from 'react';

const GLYPHS = '01X$%@#&*-=+?';

export default function TextScramble({ text, className = "", delay = 0 }) {
  const [displayText, setDisplayText] = useState(text);
  const frameRef = useRef(null);
  
  const scramble = useCallback(() => {
    let iteration = 0;
    cancelAnimationFrame(frameRef.current);
    
    const tick = () => {
      setDisplayText(() => 
        text.split("").map((char, index) => {
          if (char === " ") return " ";
          if (index < iteration) {
            return text[index];
          }
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }).join("")
      );
      
      if (iteration >= text.length) {
        cancelAnimationFrame(frameRef.current);
      } else {
        iteration += 0.35; // Controls the speed of letter resolution
        frameRef.current = requestAnimationFrame(tick);
      }
    };
    
    tick();
  }, [text]);

  useEffect(() => {
    const timer = setTimeout(() => {
      scramble();
    }, delay);
    
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frameRef.current);
    };
  }, [scramble, delay]);

  return (
    <span 
      className={`inline-block ${className}`}
      onMouseEnter={scramble}
    >
      {displayText}
    </span>
  );
}
