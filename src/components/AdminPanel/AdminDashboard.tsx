import React, { useState, useEffect } from 'react';
import { PlusCircle, FileText, Settings, BarChart3 } from 'lucide-react';
import BlogEditor from './BlogEditor';
import BlogManager from './BlogManager';
import { BlogPost } from '../../types';

type AdminView = 'dashboard' | 'create-blog' | 'manage-blogs' | 'settings';

const AdminDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [editingBlog, setEditingBlog] = useState<string | null>(null);
  const [blogStats, setBlogStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalTags: 0,
    averageReadTime: 0,
    recentPosts: [] as BlogPost[]
  });

  useEffect(() => {
    loadBlogStats();
  }, [currentView]); // Refresh stats when view changes

  const loadBlogStats = () => {
    const savedBlogs: BlogPost[] = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    
    // Calculate unique tags
    const allTags = savedBlogs.flatMap(blog => blog.tags);
    const uniqueTags = [...new Set(allTags)];
    
    // Calculate average read time
    const totalReadTime = savedBlogs.reduce((acc, blog) => {
      const readTimeNumber = parseInt(blog.readTime.replace(/\D/g, '')) || 0;
      return acc + readTimeNumber;
    }, 0);
    const averageReadTime = savedBlogs.length > 0 ? Math.round(totalReadTime / savedBlogs.length) : 0;
    
    // Get recent posts (last 3)
    const sortedBlogs = savedBlogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const recentPosts = sortedBlogs.slice(0, 3);
    
    setBlogStats({
      totalPosts: savedBlogs.length,
      publishedPosts: savedBlogs.length, // All saved posts are considered published for now
      draftPosts: 0, // We'll implement drafts later
      totalTags: uniqueTags.length,
      averageReadTime,
      recentPosts
    });
  };

  const renderContent = () => {
    switch (currentView) {
      case 'create-blog':
        return (
          <BlogEditor
            blogId={editingBlog}
            onSave={() => {
              setCurrentView('manage-blogs');
              setEditingBlog(null);
              loadBlogStats(); // Refresh stats after saving
            }}
            onCancel={() => {
              setCurrentView('dashboard');
              setEditingBlog(null);
            }}
          />
        );
      case 'manage-blogs':
        return (
          <BlogManager
            onEdit={(blogId) => {
              setEditingBlog(blogId);
              setCurrentView('create-blog');
            }}
            onCreate={() => setCurrentView('create-blog')}
            onStatsChange={loadBlogStats} // Refresh stats when blogs are deleted
          />
        );
      case 'settings':
        return (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Settings</h2>
            <p className="text-slate-600 dark:text-slate-400">Settings panel coming soon...</p>
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setCurrentView('create-blog')}
                  className="w-full flex items-center gap-3 p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <PlusCircle size={20} />
                  Create New Blog Post
                </button>
                <button
                  onClick={() => setCurrentView('manage-blogs')}
                  className="w-full flex items-center gap-3 p-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <FileText size={20} />
                  Manage Blog Posts
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Blog Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Total Posts</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{blogStats.totalPosts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Published</span>
                  <span className="font-semibold text-green-600">{blogStats.publishedPosts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Drafts</span>
                  <span className="font-semibold text-yellow-600">{blogStats.draftPosts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Unique Tags</span>
                  <span className="font-semibold text-blue-600">{blogStats.totalTags}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Avg. Read Time</span>
                  <span className="font-semibold text-purple-600">{blogStats.averageReadTime} min</span>
                </div>
              </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Posts</h3>
              {blogStats.recentPosts.length > 0 ? (
                <div className="space-y-3">
                  {blogStats.recentPosts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {post.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(post.date).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setEditingBlog(post.id);
                          setCurrentView('create-blog');
                        }}
                        className="ml-3 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                      >
                        <FileText size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText size={48} className="mx-auto text-slate-400 mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">No blog posts yet</p>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Panel</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 dark:text-slate-400">Welcome back, Sudip!</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentView === 'dashboard'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <BarChart3 size={20} className="inline mr-3" />
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView('create-blog')}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentView === 'create-blog'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <PlusCircle size={20} className="inline mr-3" />
                    Create Blog
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView('manage-blogs')}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentView === 'manage-blogs'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <FileText size={20} className="inline mr-3" />
                    Manage Blogs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView('settings')}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentView === 'settings'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Settings size={20} className="inline mr-3" />
                    Settings
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
