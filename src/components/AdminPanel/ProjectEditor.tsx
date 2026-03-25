import React, { useEffect, useState } from 'react';
import { Save, X, Eye, Upload, Github, ExternalLink } from 'lucide-react';
import { Project } from '../../types';

interface ProjectEditorProps {
  projectId?: string | null;
  onSave: () => void;
  onCancel: () => void;
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({ projectId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    imageUrl: '',
    githubUrl: '',
    liveUrl: '',
    autoPreview: true,
  });

  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (!projectId) {
      setFormData({
        title: '',
        description: '',
        technologies: '',
        imageUrl: '',
        githubUrl: '',
        liveUrl: '',
        autoPreview: true,
      });
      return;
    }

    const load = async () => {
      const res = await fetch(`/api/projects?id=${encodeURIComponent(projectId)}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data: unknown = await res.json().catch(() => null);
      const existing = (data as { project?: Project } | null)?.project;

      if (existing) {
        setFormData({
          title: existing.title,
          description: existing.description,
          technologies: existing.technologies.join(', '),
          imageUrl: existing.imageUrl || '',
          githubUrl: existing.githubUrl || '',
          liveUrl: existing.liveUrl || '',
          autoPreview: typeof existing.autoPreview === 'boolean' ? existing.autoPreview : true,
        });
      }
    };

    void load();
  }, [projectId]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 250 * 1024;
    if (file.size > maxSize) {
      alert('Image size should be less than 250KB (base64 storage limit)');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setFormData((prev) => ({ ...prev, imageUrl: dataUrl }));
      setIsUploadingImage(false);
    };
    reader.onerror = () => {
      alert('Error reading the image file');
      setIsUploadingImage(false);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in title and description');
      return;
    }

    const technologies = formData.technologies
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (technologies.length === 0) {
      alert('Please add at least one technology');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        id: projectId || undefined,
        title: formData.title.trim(),
        description: formData.description.trim(),
        technologies,
        imageUrl: formData.imageUrl.trim() || undefined,
        githubUrl: formData.githubUrl.trim() || undefined,
        liveUrl: formData.liveUrl.trim() || undefined,
        autoPreview: formData.autoPreview,
      };

      if (projectId) {
        const res = await fetch('/api/projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ ...payload, id: projectId }),
        });
        if (!res.ok) throw new Error('Update failed');
      } else {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Create failed');
      }

      if (!projectId) {
        setFormData({
          title: '',
          description: '',
          technologies: '',
          imageUrl: '',
          githubUrl: '',
          liveUrl: '',
          autoPreview: true,
        });
      }

      onSave();
    } catch (err) {
      console.error('Error saving project:', err);
      alert('Error saving project');
    } finally {
      setIsSaving(false);
    }
  };

  const renderPreview = () => (
    <div className="space-y-4">
      <div className="bg-slate-50 dark:bg-slate-900/30 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{formData.title || 'Untitled Project'}</h3>
        <p className="text-slate-700 dark:text-slate-300 mt-2">{formData.description || 'No description yet...'}</p>
      </div>

      {formData.imageUrl && (
        <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
          <img src={formData.imageUrl} alt="Preview" className="w-full h-64 object-cover" />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {formData.technologies
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
          .slice(0, 10)
          .map((t) => (
            <span
              key={t}
              className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-sm"
            >
              {t}
            </span>
          ))}
      </div>

      <div className="flex gap-4 items-center">
        {formData.githubUrl && (
          <span className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <Github size={14} />
            GitHub
          </span>
        )}
        {formData.liveUrl && (
          <span className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <ExternalLink size={14} />
            Live
          </span>
        )}
        <span className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <Eye size={14} />
          {formData.autoPreview ? 'Auto preview ON' : 'Auto preview OFF'}
        </span>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md">
      <div className="border-b border-slate-200 dark:border-slate-700 p-6">
        <div className="flex justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {projectId ? 'Edit Project' : 'Create New Project'}
            </h2>
            {projectId && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Editing: {formData.title || 'Untitled Project'}
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
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Project title..."
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Short project description..."
                rows={4}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Technologies *</label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) => handleInputChange('technologies', e.target.value)}
                placeholder="django, fastapi, react..."
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Featured Image</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  placeholder="https://example.com/image.jpg or upload an image"
                  className="flex-1 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="project-image-upload"
                />
                <label
                  htmlFor="project-image-upload"
                  className={`px-4 py-3 rounded-lg transition-colors cursor-pointer flex items-center ${
                    isUploadingImage
                      ? 'bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300'
                      : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                  }`}
                  title="Upload image from your computer"
                >
                  {isUploadingImage ? (
                    <div className="animate-spin rounded-full h-[18px] w-[18px] border-2 border-current border-t-transparent"></div>
                  ) : (
                    <Upload size={18} />
                  )}
                </label>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Max ~250KB if uploading (base64 storage limit).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">GitHub URL</label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                  placeholder="https://github.com/username/repo"
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Live URL</label>
                <input
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) => handleInputChange('liveUrl', e.target.value)}
                  placeholder="https://example.com"
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="autoPreview"
                type="checkbox"
                checked={formData.autoPreview}
                onChange={(e) => handleInputChange('autoPreview', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="autoPreview" className="text-sm text-slate-700 dark:text-slate-300">
                Auto preview (uses Link Preview) when live URL exists
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectEditor;

