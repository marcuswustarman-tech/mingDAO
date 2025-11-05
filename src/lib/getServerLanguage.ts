import { cookies, headers } from 'next/headers';

export type Language = 'zh' | 'en';

/**
 * Get language preference on server side (for Server Components)
 * Priority: URL param > Cookie > Header > Default (zh)
 */
export async function getServerLanguage(): Promise<Language> {
  // Check cookies first
  const cookieStore = await cookies();
  const langCookie = cookieStore.get('language')?.value as Language | undefined;

  if (langCookie === 'zh' || langCookie === 'en') {
    return langCookie;
  }

  // Check Accept-Language header
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language');

  if (acceptLanguage) {
    // Simple check for English preference
    if (acceptLanguage.toLowerCase().includes('en') && !acceptLanguage.toLowerCase().includes('zh')) {
      return 'en';
    }
  }

  // Default to Chinese
  return 'zh';
}

/**
 * Generate metadata for both languages
 */
export function generateBilingualMetadata(
  zhTitle: string,
  enTitle: string,
  zhDescription: string,
  enDescription: string,
  zhKeywords: string,
  enKeywords: string,
  language: Language
) {
  const title = language === 'zh' ? zhTitle : enTitle;
  const description = language === 'zh' ? zhDescription : enDescription;
  const keywords = language === 'zh' ? zhKeywords : enKeywords;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website' as const,
      locale: language === 'zh' ? 'zh_CN' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
    },
  };
}
