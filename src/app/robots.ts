import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://fxkiller.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '*',
      },
      // 针对百度爬虫的特殊规则
      {
        userAgent: 'Baiduspider',
        allow: '*',
      },
      // 针对Google爬虫的特殊规则
      {
        userAgent: 'Googlebot',
        allow: '*',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
