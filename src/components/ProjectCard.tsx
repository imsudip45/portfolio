import React, { useState } from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="group relative bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {project.imageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{project.title}</h3>
        
        <p className="text-slate-700 dark:text-slate-300 mb-6">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-5">
          {project.technologies.map((tech) => (
            <span 
              key={tech} 
              className="px-3 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex gap-3">
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              aria-label={`GitHub repository for ${project.title}`}
            >
              <Github size={20} />
            </a>
          )}
          
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              aria-label={`Live demo for ${project.title}`}
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>
      
      <div className={`absolute inset-0 bg-gradient-to-t from-indigo-600/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 pointer-events-none`}>
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
          <div className="h-0.5 w-10 bg-white mb-3"></div>
          <p className="text-white/90 mb-4">{project.description}</p>
          <div className="flex gap-4">
            {project.githubUrl && (
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 transition-colors pointer-events-auto"
                aria-label={`GitHub repository for ${project.title}`}
              >
                <Github size={22} />
              </a>
            )}
            
            {project.liveUrl && (
              <a 
                href={project.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 transition-colors pointer-events-auto"
                aria-label={`Live demo for ${project.title}`}
              >
                <ExternalLink size={22} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;