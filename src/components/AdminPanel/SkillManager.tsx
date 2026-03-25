import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import { Skill } from '../../types';

interface SkillManagerProps {
  onEdit: (skillId: string) => void;
  onCreate: () => void;
  onStatsChange?: () => void;
}

const SkillManager: React.FC<SkillManagerProps> = ({ onEdit, onCreate, onStatsChange }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    void loadSkills();
  }, []);

  const loadSkills = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/skills', { method: 'GET', credentials: 'include' });
      const data: unknown = await res.json().catch(() => null);
      const loaded = (data as { skills?: Skill[] } | null)?.skills || [];
      setSkills(loaded);
    } catch {
      setSkills([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSkills = skills.filter((s) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
  });

  const handleDelete = async (skillId: string) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/skills?id=${encodeURIComponent(skillId)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Delete failed');

      await loadSkills();
      if (onStatsChange) onStatsChange();
    } catch {
      alert('Failed to delete skill');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Skills</h2>
          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} />
            New Skill
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {isLoading && skills.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-12 shadow-md text-center">
          <p className="text-slate-600 dark:text-slate-400">Loading skills...</p>
        </div>
      )}

      <div className="space-y-4">
        {filteredSkills.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-12 shadow-md text-center">
            <Eye size={48} className="mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {skills.length === 0 ? 'No skills yet' : 'No skills match your search'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {skills.length === 0 ? 'Get started by creating your first skill!' : 'Try a different keyword.'}
            </p>
            {skills.length === 0 && (
              <button
                onClick={onCreate}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Your First Skill
              </button>
            )}
          </div>
        ) : (
          filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{skill.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{skill.category}</p>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => onEdit(skill.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
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

export default SkillManager;

