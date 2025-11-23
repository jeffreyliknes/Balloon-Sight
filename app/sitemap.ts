import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://balloonsight.com';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // Add success page but with lower priority or exclude it via robots.txt usually
    // For now, we just list the main landing page as it's a single-page app structure mostly.
  ];
}

