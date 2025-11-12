import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// 强制动态渲染，因为使用了 cookies
export const dynamic = 'force-dynamic';

export default async function RootPage() {
  // Get language preference from cookie, default to 'zh'
  const cookieStore = await cookies();
  const language = cookieStore.get('language')?.value || 'zh';

  // Redirect to locale-specific home page
  // For 'zh', redirect to root (no prefix)
  // For 'en', redirect to /en
  if (language === 'en') {
    redirect('/en');
  } else {
    redirect('/zh');
  }
}
