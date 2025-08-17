import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { Project } from '../types';
import LinkPreview from './LinkPreview';
import { PinContainer } from './ui/3d-pin';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="h-[30rem] w-full flex items-center justify-center">
      <PinContainer
        title={project.title}
        href={project.liveUrl}
        containerClassName="w-full max-w-sm"
      >
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 w-[20rem] h-[20rem]">
          {/* Background content */}
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            {project.autoPreview && project.liveUrl ? (
              <div className="w-full h-full">
                <LinkPreview url={project.liveUrl} className="!h-full !w-full rounded-lg" />
              </div>
            ) : project.imageUrl ? (
              <div className="w-full h-full">
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover object-center rounded-lg"
                />
              </div>
            ) : project.liveUrl ? (
              <div className="w-full h-full">
                <LinkPreview url={project.liveUrl} className="!h-full !w-full rounded-lg" />
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 rounded-lg"></div>
            )}
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/30 rounded-lg"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col h-full">
            <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
              {project.title}
            </h3>
            <div className="text-base !m-0 !p-0 font-normal mb-4">
              <span className="text-slate-300 text-sm line-clamp-3">
                {project.description}
              </span>
            </div>
            
            {/* Technologies */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.technologies.slice(0, 3).map((tech) => (
                <span 
                  key={tech} 
                  className="px-2 py-0.5 text-xs font-medium bg-white/20 text-white rounded-full backdrop-blur-sm"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="px-2 py-0.5 text-xs font-medium bg-white/20 text-white rounded-full backdrop-blur-sm">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-3 mt-auto">
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-white hover:text-indigo-200 transition-colors rounded-full bg-white/10 backdrop-blur-sm"
                  aria-label={`GitHub repository for ${project.title}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github size={16} />
                </a>
              )}
              
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-white hover:text-indigo-200 transition-colors rounded-full bg-white/10 backdrop-blur-sm"
                  aria-label={`Live demo for ${project.title}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </PinContainer>
    </div>
  );
};

export default ProjectCard;