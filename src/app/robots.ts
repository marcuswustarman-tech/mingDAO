import { MetadataRoute } from 'next'

import { Metadata } from 'next'

export const dynamic = 'force-static'
// 或者
export const revalidate = 3600 // 1小时重新验证

export async function GET() {
  // 你的 robots.txt 生成逻辑
  return new Response(`User-agent: *\nAllow: /`, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}



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
