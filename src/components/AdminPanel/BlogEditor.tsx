import React, { useState, useEffect } from 'react';
import { Save, X, Eye, Upload, Hash } from 'lucide-react';
import { BlogPost } from '../../types';

interface BlogEditorProps {
  blogId?: string | null;
  onSave: () => void;
  onCancel: () => void;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ blogId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: '',
    imageUrl: '',
    date: '',
  });
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (blogId) {
      // Load existing blog for editing
      const load = async () => {
        const res = await fetch(`/api/blog-posts?id=${encodeURIComponent(blogId)}`, { method: 'GET', credentials: 'include' });
        const data: unknown = await res.json().catch(() => null);
        const existingBlog = ((data as { post?: BlogPost } | null)?.post as BlogPost | undefined);

        if (existingBlog) {
          setFormData({
            title: existingBlog.title,
            excerpt: existingBlog.excerpt,
            content: existingBlog.content,
            tags: existingBlog.tags.join(', '),
            imageUrl: existingBlog.imageUrl || '',
            date: existingBlog.date,
          });
        }
      };
      void load();
    } else {
      // Reset form for new blog
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        tags: '',
        imageUrl: '',
        date: '',
      });
    }
  }, [blogId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (limit to ~250KB)
    // Note: base64 images can quickly exceed typical serverless payload/storage limits.
    const maxSize = 250 * 1024;
    if (file.size > maxSize) {
      alert('Image size should be less than 250KB (base64 storage limit)');
      return;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    setIsUploadingImage(true);

    // Convert to base64 data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setFormData(prev => ({
        ...prev,
        imageUrl: dataUrl
      }));
      setIsUploadingImage(false);
    };
    reader.onerror = () => {
      alert('Error reading the image file');
      setIsUploadingImage(false);
    };
    reader.readAsDataURL(file);

    // Reset the input value so the same file can be selected again
    event.target.value = '';
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    setIsSaving(true);

    try {
      const tags = formData.tags.split(',').map((tag) => tag.trim()).filter((tag) => tag.length > 0);
      const excerpt = formData.excerpt.trim() || formData.content.substring(0, 150) + (formData.content.length > 150 ? '...' : '');
      const date = blogId ? (formData.date || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0];
      const readTime = calculateReadTime(formData.content);
      const imageUrl = formData.imageUrl.trim() || undefined;

      const basePayload = {
        id: blogId || undefined,
        title: formData.title.trim(),
        excerpt,
        content: formData.content.trim(),
        date,
        readTime,
        tags,
        imageUrl,
      };

      const endpoint = '/api/blog-posts';
      if (blogId) {
        const res = await fetch(endpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ ...basePayload, id: blogId }),
        });
        if (!res.ok) throw new Error('Update failed');
      } else {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ ...basePayload, id: undefined }),
        });
        if (!res.ok) throw new Error('Create failed');
      }

      // Only reset form when creating new blog, not when editing
      if (!blogId) {
        setFormData({
          title: '',
          excerpt: '',
          content: '',
          tags: '',
          imageUrl: '',
          date: '',
        });
      }

      onSave();
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Error saving blog post');
    } finally {
      setIsSaving(false);
    }
  };

  const renderPreview = () => (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <h1>{formData.title || 'Untitled Post'}</h1>
      {formData.imageUrl && (
        <img 
          src={formData.imageUrl} 
          alt={formData.title} 
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}
      <p className="text-lg text-slate-600 dark:text-slate-400 italic">
        {formData.excerpt || 'No excerpt provided'}
      </p>
      <div className="whitespace-pre-wrap">{formData.content || 'No content yet...'}</div>
      {formData.tags && (
        <div className="flex flex-wrap gap-2 mt-6">
          {formData.tags.split(',').map((tag, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm"
            >
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {blogId ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h2>
            {blogId && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Editing: {formData.title || 'Untitled Post'}
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
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter blog post title..."
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Featured Image
              </label>
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
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
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
              {formData.imageUrl && (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-32 h-20 object-cover rounded-lg border border-slate-300 dark:border-slate-600"
                    onError={() => {
                      // Handle broken image URLs
                      setFormData(prev => ({ ...prev, imageUrl: '' }));
                    }}
                  />
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                    className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                You can either paste an image URL or upload an image from your computer (max ~250KB base64)
              </p>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                placeholder="Brief description of your blog post..."
                rows={3}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Write your blog post content here..."
                rows={20}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Tags
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Hash size={18} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="react, javascript, tutorial (comma-separated)"
                    className="w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Separate tags with commas
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogEditor;
