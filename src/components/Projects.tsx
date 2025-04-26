import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import { projects } from '../data/projects';

const Projects: React.FC = () => {
  const [filter, setFilter] = useState<string | null>(null);
  
  // Extract unique technologies from all projects
  const allTechnologies = [...new Set(projects.flatMap(project => project.technologies))];
  
  // Filter projects based on selected technology
  const filteredProjects = filter 
    ? projects.filter(project => project.technologies.includes(filter))
    : projects;
  
  return (
    <section id="projects" className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">My Projects</h2>
          <div className="h-0.5 w-16 bg-indigo-600 dark:bg-indigo-400 mx-auto mb-6"></div>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            A selection of projects I've worked on that showcase my skills and experience.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            className={`px-4 py-2 text-sm rounded-full transition-colors ${
              filter === null
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            onClick={() => setFilter(null)}
          >
            All
          </button>
          
          {allTechnologies.map((tech) => (
            <button
              key={tech}
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                filter === tech
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              onClick={() => setFilter(tech)}
            >
              {tech}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;