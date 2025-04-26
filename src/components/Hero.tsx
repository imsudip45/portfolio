import React, { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  const textRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    const textElement = textRef.current;
    if (!textElement) return;
    
    const text = textElement.innerText;
    textElement.innerHTML = '';
    
    // Add each letter with a delay
    text.split('').forEach((char, index) => {
      const span = document.createElement('span');
      span.innerText = char;
      span.style.opacity = '0';
      span.style.transform = 'translateY(20px)';
      span.style.display = 'inline-block';
      span.style.transition = 'all 0.3s ease';
      span.style.transitionDelay = `${index * 0.05}s`;
      
      setTimeout(() => {
        span.style.opacity = '1';
        span.style.transform = 'translateY(0)';
      }, 100); // Small initial delay before animation starts
      
      textElement.appendChild(span);
    });
  }, []);
  
  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900 z-10"></div>
      <div className="container mx-auto px-4 md:px-6 z-20">
        <div className="text-center max-w-3xl mx-auto">
          <p className="mb-4 text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide">
            Hello, I am
          </p>
          <h1 ref={textRef} className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6">
            Sudip  Niroula
          </h1>
          <div className="h-0.5 w-20 bg-indigo-600 dark:bg-indigo-400 mx-auto my-8"></div>
          <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-8 max-w-xl mx-auto">
            A passionate Python Developer crafting elegant solutions to complex problems.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#projects"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors duration-300 shadow-sm"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="px-6 py-3 border border-slate-300 dark:border-slate-700 hover:border-indigo-600 dark:hover:border-indigo-400 text-slate-900 dark:text-white rounded-md transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Contact Me
            </a>
          </div>
        </div>
      </div>
      
      <a 
        href="#about" 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown className="text-slate-600 dark:text-slate-400" size={32} />
      </a>
    </section>
  );
};

export default Hero;