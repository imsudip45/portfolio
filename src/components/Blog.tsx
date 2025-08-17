import React, { useState, useEffect } from 'react';
import { Clock, Tag, ChevronRight } from 'lucide-react';
import { BlogPost } from '../types';

const Blog: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Load blog posts from localStorage
    const savedBlogs = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    setBlogPosts(savedBlogs);
  }, []);
  
  // Get unique tags from all blog posts
  const allTags = [...new Set(blogPosts.flatMap(post => post.tags))];
  
  // Filter posts based on selected tag
  const filteredPosts = selectedTag
    ? blogPosts.filter(post => post.tags.includes(selectedTag))
    : blogPosts;
  
  return (
    <section id="blog" className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Blog</h2>
          <div className="h-0.5 w-16 bg-indigo-600 dark:bg-indigo-400 mx-auto mb-6"></div>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            Thoughts, tutorials and insights about Python development and technology.
          </p>
        </div>
        
        {/* Tags filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                selectedTag === null
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              onClick={() => setSelectedTag(null)}
            >
              All Posts
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
                  selectedTag === tag
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
        
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                {post.imageUrl && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-700 dark:text-slate-300 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      {post.readTime}
                    </div>
                    <span>{post.date}</span>
                  </div>
                  
                  <a
                    href={`/blog/${post.id}`}
                    className="mt-4 inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    Read More
                    <ChevronRight size={16} className="ml-1" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-700 dark:text-slate-300">
            {selectedTag ? (
              <p>No posts found with the selected tag: {selectedTag}</p>
            ) : (
              <p>No blog posts available yet. Check back soon!</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;