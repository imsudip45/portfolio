type LinkPreviewData = {
  title: string;
  description: string;
  image: string;
  domain: string;
  favicon?: string;
};

// This function would ideally use a link preview API
// For a production application, you would use services like:
// - LinkPreview.net API
// - Microlink.io API
// - OpenGraph.io
// - Or a custom server endpoint that performs server-side scraping
export async function fetchLinkPreview(url: string): Promise<LinkPreviewData> {
  try {
    // For demo purposes, we're simulating the API call
    // In a real implementation, you would make an actual API call:
    // const response = await fetch(`https://api.linkpreview.net/?key=YOUR_API_KEY&q=${encodeURIComponent(url)}`);
    // const data = await response.json();
    
    // Extract domain from url
    const domain = new URL(url).hostname;
    
    // Use screenshot.guru to capture the website
    // This is a reliable free service that doesn't require an API key
    const image = `https://image.thum.io/get/width/1200/crop/630/maxAge/24/${encodeURIComponent(url)}`;
    
    // Alternate screenshot service options if the above doesn't work:
    // 1. urlbox.io (requires API key, used in previous implementation)
    // const image = `https://api.urlbox.io/v1/FLKOLT5QTH2upKxh/png?url=${encodeURIComponent(url)}&width=1200&height=630`;
    // 2. WordPress mShots (free)
    // const image = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1200&h=630`;
    // 3. Screenshotapi.net (requires API key)
    // const image = `https://screenshotapi.net/api/v1/screenshot?url=${encodeURIComponent(url)}&width=1200&height=630&output=image&ttl=1`;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return simulated data
    return {
      title: domain,
      description: `Visit ${domain} to learn more about this project`,
      image,
      domain,
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    };
  } catch (error) {
    console.error('Error fetching link preview:', error);
    throw error;
  }
}

// In a real implementation, you might also add caching:
const previewCache = new Map<string, LinkPreviewData>();

export async function getCachedLinkPreview(url: string): Promise<LinkPreviewData> {
  // Check cache first
  if (previewCache.has(url)) {
    return previewCache.get(url)!;
  }
  
  // Fetch new data
  const data = await fetchLinkPreview(url);
  
  // Store in cache
  previewCache.set(url, data);
  
  return data;
} 