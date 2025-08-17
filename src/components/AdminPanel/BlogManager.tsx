import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Calendar, Clock, Tag, Plus } from 'lucide-react';
import { BlogPost } from '../../types';

interface BlogManagerProps {
  onEdit: (blogId: string) => void;
  onCreate: () => void;
  onStatsChange?: () => void;
}

const BlogManager: React.FC<BlogManagerProps> = ({ onEdit, onCreate, onStatsChange }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = () => {
    const savedBlogs = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    setBlogs(savedBlogs);
  };

  const handleDelete = (blogId: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      const updatedBlogs = blogs.filter(blog => blog.id !== blogId);
      setBlogs(updatedBlogs);
      localStorage.setItem('blogPosts', JSON.stringify(updatedBlogs));
      
      // Notify parent component to refresh stats
      if (onStatsChange) {
        onStatsChange();
      }
    }
  };

  const getAllTags = () => {
    const allTags = blogs.flatMap(blog => blog.tags);
    return [...new Set(allTags)].sort();
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTag = selectedTag === '' || blog.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Blog Posts</h2>
          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} />
            New Post
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full sm:w-48 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Tags</option>
              {getAllTags().map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Blog List */}
      <div className="space-y-4">
        {filteredBlogs.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-12 shadow-md text-center">
            <Eye size={48} className="mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {blogs.length === 0 ? 'No blog posts yet' : 'No posts match your filters'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {blogs.length === 0 
                ? 'Get started by creating your first blog post!' 
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
            {blogs.length === 0 && (
              <button
                onClick={onCreate}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Your First Post
              </button>
            )}
          </div>
        ) : (
          filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Blog Image */}
                {blog.imageUrl && (
                  <div className="lg:w-48 flex-shrink-0">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-32 lg:h-24 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Blog Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-3">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white line-clamp-2">
                      {blog.title}
                    </h3>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => onEdit(blog.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {blog.excerpt}
                  </p>

                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      {formatDate(blog.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      {blog.readTime}
                    </div>
                  </div>

                  {/* Tags */}
                  {blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-xs"
                        >
                          <Tag size={12} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      {blogs.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{blogs.length}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{blogs.length}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Published</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{getAllTags().length}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Unique Tags</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(blogs.reduce((acc, blog) => acc + parseInt(blog.readTime), 0) / blogs.length) || 0}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Avg. Read Time</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManager;
