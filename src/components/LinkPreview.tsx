import React, { useState, useEffect } from 'react';
import { getCachedLinkPreview } from '../utils/linkPreview';
import { Globe, ExternalLink } from 'lucide-react';

interface LinkPreviewProps {
  url: string;
  className?: string;
}

// Define a series of fallback services to try if the primary one fails
const FALLBACK_SCREENSHOT_SERVICES = [
  // WordPress mShots
  (url: string) => `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1200&h=630`,
  // URLBox (requires API key)
  (url: string) => `https://api.urlbox.io/v1/FLKOLT5QTH2upKxh/png?url=${encodeURIComponent(url)}&width=1200&height=630`,
  // Placeholders as last resort
  (url: string) => {
    const domain = new URL(url).hostname;
    return `https://via.placeholder.com/1200x630/3b82f6/ffffff?text=${encodeURIComponent(domain)}`;
  }
];

// Fallback image when preview fails
const DEFAULT_IMAGE = 'https://via.placeholder.com/160x160/1e293b/f8fafc?text=No+Preview';

const LinkPreview: React.FC<LinkPreviewProps> = ({ url, className }) => {
  const [previewData, setPreviewData] = useState<{
    title: string;
    description: string;
    image: string;
    domain: string;
    favicon?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  // Determine if this is a full-width, full-height preview
  const isFullSize = className?.includes('!h-full') || className?.includes('!w-full');

  useEffect(() => {
    const fetchPreview = async () => {
      if (!url) return;
      
      try {
        setLoading(true);
        setError(false);
        
        // Use our utility to fetch preview data
        const data = await getCachedLinkPreview(url);
        setPreviewData(data);
      } catch (err) {
        console.error('Error fetching link preview:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [url]);

  // Handle image load errors by trying fallback services
  const handleImageError = () => {
    if (previewData && imageIndex < FALLBACK_SCREENSHOT_SERVICES.length) {
      const nextIndex = imageIndex + 1;
      setImageIndex(nextIndex);
      
      const updatedData = {
        ...previewData,
        image: FALLBACK_SCREENSHOT_SERVICES[imageIndex](url)
      };
      
      setPreviewData(updatedData);
    }
  };

  // Base classes for container
  const containerClasses = isFullSize 
    ? `w-full h-full rounded-none ${className}` 
    : `h-40 w-40 rounded-lg ${className || ''}`;

  // While loading
  if (loading) {
    return (
      <div className={`${containerClasses} bg-slate-200 dark:bg-slate-700 flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If error or no data
  if (error || !previewData) {
    return (
      <div className={`${containerClasses} bg-slate-200 dark:bg-slate-700 flex flex-col items-center justify-center`}>
        <Globe size={24} className="text-slate-400 dark:text-slate-500 mb-2" />
        <div className="text-xs text-slate-600 dark:text-slate-300 truncate px-2 text-center">
          {new URL(url).hostname}
        </div>
        <a 
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <span>Visit</span>
          <ExternalLink size={12} />
        </a>
      </div>
    );
  }

  // Render preview
  return (
    <div className={`${containerClasses} overflow-hidden relative group`}>
      <img 
        src={previewData.image} 
        alt={previewData.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        onError={handleImageError}
      />
      
      {/* Only show the domain badge if not full size (to avoid duplication with card content) */}
      {!isFullSize && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 flex items-center gap-2">
          {previewData.favicon ? (
            <img 
              src={previewData.favicon} 
              alt="Site icon" 
              className="w-4 h-4" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <Globe size={14} className="text-white" />
          )}
          <p className="text-white text-xs font-medium truncate">{previewData.domain}</p>
        </div>
      )}
    </div>
  );
};

export default LinkPreview; 