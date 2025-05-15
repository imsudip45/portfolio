import React, { useState } from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { Project } from '../types';
import LinkPreview from './LinkPreview';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="group relative bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl aspect-square"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background image that fills the entire card */}
      <div className="absolute inset-0 z-0">
        {project.autoPreview && project.liveUrl ? (
          <div className="w-full h-full">
            <LinkPreview url={project.liveUrl} className="!h-full !w-full" />
          </div>
        ) : project.imageUrl ? (
          <div className="w-full h-full">
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className={`w-full h-full object-cover object-center transition-transform duration-700 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
            />
          </div>
        ) : project.liveUrl ? (
          <div className="w-full h-full">
            <LinkPreview url={project.liveUrl} className="!h-full !w-full" />
          </div>
        ) : (
          <div className="w-full h-full bg-slate-200 dark:bg-slate-700"></div>
        )}
      </div>
      
      {/* Overlay that's always visible to ensure content is readable */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      
      {/* Content with a transparent background */}
      <div className={`relative z-20 p-5 transition-opacity duration-300 h-full flex flex-col ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
        <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
        
        <p className="text-white/90 mb-4 text-sm line-clamp-3">{project.description}</p>
        
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.map((tech) => (
            <span 
              key={tech} 
              className="px-2 py-0.5 text-xs font-medium bg-white/20 text-white rounded-full backdrop-blur-sm"
            >
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex gap-3 mt-auto">
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-white hover:text-indigo-200 transition-colors"
              aria-label={`GitHub repository for ${project.title}`}
            >
              <Github size={18} />
            </a>
          )}
          
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-white hover:text-indigo-200 transition-colors"
              aria-label={`Live demo for ${project.title}`}
            >
              <ExternalLink size={18} />
            </a>
          )}
        </div>
      </div>
      
      <div className={`absolute inset-0 bg-gradient-to-t from-indigo-600/90 to-indigo-900/80 transition-opacity duration-300 flex flex-col justify-end p-5 z-20 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
          <div className="h-0.5 w-8 bg-white mb-3"></div>
          <p className="text-white/90 mb-4 text-sm">{project.description}</p>
          <div className="flex gap-4">
            {project.githubUrl && (
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 transition-colors pointer-events-auto"
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
                className="text-white hover:text-white/80 transition-colors pointer-events-auto"
                aria-label={`Live demo for ${project.title}`}
              >
                <ExternalLink size={20} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;