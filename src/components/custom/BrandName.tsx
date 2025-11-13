"use client";

import { useLanguage } from '@/contexts/LanguageContext';

export default function BrandName() {
  const { language } = useLanguage();

  if (language === 'zh') {
    return (
      <>
        <span className="font-black">明</span>
        <span className="font-normal text-gray-600 dark:text-gray-400">DAO</span>
      </>
    );
  }

  return (
    <>
      <span className="font-black">Ming</span>
      <span className="font-normal text-gray-600 dark:text-gray-400">DAO</span>
    </>
  );
}
