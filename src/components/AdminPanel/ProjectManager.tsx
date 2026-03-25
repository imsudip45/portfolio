import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import { Project } from '../../types';

interface ProjectManagerProps {
  onEdit: (projectId: string) => void;
  onCreate: () => void;
  onStatsChange?: () => void;
}

const ProjectManager: React.FC<ProjectManagerProps> = ({ onEdit, onCreate, onStatsChange }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    void loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/projects', { method: 'GET', credentials: 'include' });
      const data: unknown = await res.json().catch(() => null);
      const loaded = (data as { projects?: Project[] } | null)?.projects || [];
      setProjects(loaded);
    } catch {
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.technologies.some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleDelete = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects?id=${encodeURIComponent(projectId)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Delete failed');

      await loadProjects();
      if (onStatsChange) onStatsChange();
    } catch {
      alert('Failed to delete project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Projects</h2>
          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} />
            New Project
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {isLoading && projects.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-12 shadow-md text-center">
          <p className="text-slate-600 dark:text-slate-400">Loading projects...</p>
        </div>
      )}

      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-12 shadow-md text-center">
            <Eye size={48} className="mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {projects.length === 0 ? 'No projects yet' : 'No projects match your search'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {projects.length === 0 ? 'Get started by creating your first project!' : 'Try a different keyword.'}
            </p>
            {projects.length === 0 && (
              <button
                onClick={onCreate}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Your First Project
              </button>
            )}
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white line-clamp-1">
                      {project.title}
                    </h3>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => onEdit(project.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 mt-2 line-clamp-3">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.technologies.slice(0, 5).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-xs"
                      >
                        {t}
                      </span>
                    ))}
                    {project.technologies.length > 5 && (
                      <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-xs">
                        +{project.technologies.length - 5}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectManager;

