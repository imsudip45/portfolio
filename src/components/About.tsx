import React from 'react';
import { Code, Server, Database } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">About Me</h2>
          <div className="h-0.5 w-16 bg-indigo-600 dark:bg-indigo-400 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-slate-700 dark:text-slate-300">
              I'm a Python Developer with a passion for building efficient, scalable, and 
              maintainable software solutions. With expertise in data processing, API development, 
              and automation, I strive to create code that not only works well but is also elegant 
              and readable.
            </p>
            <p className="text-lg text-slate-700 dark:text-slate-300">
              My journey in software development has led me to work on diverse projects, from 
              data analysis pipelines to web APIs and cloud infrastructure. I believe in the power 
              of clean code and thoughtful architecture to solve complex problems.
            </p>
            <p className="text-lg text-slate-700 dark:text-slate-300">
              When I'm not coding, you'll find me exploring new technologies, contributing to 
              open-source projects, or thinking about how to optimize the systems I work with.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg transform transition-transform hover:scale-105">
              <Code className="text-indigo-600 dark:text-indigo-400 mb-4" size={32} />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Clean Code</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Writing maintainable, documented, and efficient code is my primary focus.
              </p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg transform transition-transform hover:scale-105">
              <Server className="text-indigo-600 dark:text-indigo-400 mb-4" size={32} />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Backend Systems</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Designing robust APIs and services that power modern applications.
              </p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg transform transition-transform hover:scale-105">
              <Database className="text-indigo-600 dark:text-indigo-400 mb-4" size={32} />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Data Processing</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Transforming raw data into valuable insights through analysis and visualization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;