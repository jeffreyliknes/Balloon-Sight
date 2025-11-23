import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://balloonsight.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/payment/', '/api/'], // Don't index payment success pages or API routes
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

