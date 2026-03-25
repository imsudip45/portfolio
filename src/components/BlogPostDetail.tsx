import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { BlogPost } from '../types';

const BlogPostDetail: React.FC = () => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // App is not using a router; parse the id from the URL.
  const id = window.location.pathname.split('/').filter(Boolean).pop() || '';

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        if (!id) {
          setPost(null);
          return;
        }

        const res = await fetch(`/api/blog-posts?id=${encodeURIComponent(id)}`, {
          method: 'GET',
          credentials: 'include',
        });

        const data: unknown = await res.json().catch(() => null);
        if (!res.ok) {
          setPost(null);
          return;
        }

        const loadedPost = (data as { post?: BlogPost } | null)?.post || null;
        setPost(loadedPost);
      } catch {
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [id]);

  if (isLoading) {
    return (
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <p className="text-slate-700 dark:text-slate-300">Loading post...</p>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <ArrowLeft size={16} />
            Back
          </a>
          <div className="mt-6 bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
            <p className="text-slate-700 dark:text-slate-300">Post not found.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Home
        </a>

        <article className="mt-8 bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-6">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              {new Date(post.date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              {post.readTime}
            </div>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-xs"
                >
                  <Tag size={12} />
                  {t}
                </span>
              ))}
            </div>
          )}

          {post.imageUrl && (
            <div className="mb-6">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="prose prose-slate dark:prose-invert max-w-none whitespace-pre-wrap">
            {post.content}
          </div>
        </article>
      </div>
    </section>
  );
};

export default BlogPostDetail;

