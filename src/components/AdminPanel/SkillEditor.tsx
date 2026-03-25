import React, { useEffect, useState } from 'react';
import { Save, X, Eye } from 'lucide-react';
import { Skill } from '../../types';

interface SkillEditorProps {
  skillId?: string | null;
  onSave: () => void;
  onCancel: () => void;
}

const SkillEditor: React.FC<SkillEditorProps> = ({ skillId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    category: '',
  });

  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!skillId) {
      setFormData({ name: '', icon: '', category: '' });
      return;
    }

    const load = async () => {
      const res = await fetch(`/api/skills?id=${encodeURIComponent(skillId)}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data: unknown = await res.json().catch(() => null);
      const existing = (data as { skill?: Skill } | null)?.skill;

      if (existing) {
        setFormData({
          name: existing.name,
          icon: existing.icon,
          category: existing.category,
        });
      }
    };

    void load();
  }, [skillId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.icon.trim() || !formData.category.trim()) {
      alert('Please fill in name, icon URL, and category');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        id: skillId || undefined,
        name: formData.name.trim(),
        icon: formData.icon.trim(),
        category: formData.category.trim(),
      };

      if (skillId) {
        const res = await fetch('/api/skills', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ ...payload, id: skillId }),
        });
        if (!res.ok) throw new Error('Update failed');
      } else {
        const res = await fetch('/api/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Create failed');
      }

      if (!skillId) {
        setFormData({ name: '', icon: '', category: '' });
      }

      onSave();
    } catch (err) {
      console.error('Error saving skill:', err);
      alert('Error saving skill');
    } finally {
      setIsSaving(false);
    }
  };

  const renderPreview = () => (
    <div className="space-y-4">
      <div className="bg-slate-50 dark:bg-slate-900/30 rounded-lg p-4 border border-slate-200 dark:border-slate-700 flex items-center gap-4">
        <img src={formData.icon} alt={formData.name || 'Icon'} className="w-14 h-14 object-contain" />
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{formData.name || 'Untitled Skill'}</h3>
          <p className="text-slate-700 dark:text-slate-300 mt-1">{formData.category || 'Category'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md">
      <div className="border-b border-slate-200 dark:border-slate-700 p-6">
        <div className="flex justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {skillId ? 'Edit Skill' : 'Create New Skill'}
            </h2>
            {skillId && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Editing: {formData.name || 'Untitled Skill'}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Eye size={18} />
              {isPreview ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-400 dark:hover:bg-slate-700 transition-colors"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {isPreview ? (
          renderPreview()
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Skill name..."
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Icon URL *</label>
              <input
                type="url"
                value={formData.icon}
                onChange={(e) => handleInputChange('icon', e.target.value)}
                placeholder="https://.../icon.svg"
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category *</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="Languages / Frameworks / Tools..."
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillEditor;

