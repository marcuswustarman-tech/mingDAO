"use client";

import React, { useState } from 'react';
import EmailContactModal from '@/components/custom/EmailContactModal';
import { useLanguage } from '@/contexts/LanguageContext';
import ShineButton from '@/components/custom/ShineButton';

export default function ResumePage() {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const { t, language } = useLanguage();

  const handleSubmitResume = () => {
    setIsEmailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white border-b-2 border-gray-800 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="inline-block px-6 py-2 bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
            <span className="text-sm font-semibold tracking-wider">{t('resume.hero.badge')}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="font-black">{t('resume.title')}</span>
          </h1>
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('resume.subtitle')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-20 space-y-16">
        {/* Description */}
        <section className="text-center">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            {t('resume.description')}
          </p>
        </section>

        {/* Requirements */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-1 h-16 bg-black dark:bg-white"></div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white">{t('resume.requirements.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 border-2 border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('resume.requirements.education')}</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {t('resume.requirements.education.desc')}
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 border-2 border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('resume.requirements.age')}</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {t('resume.requirements.age.desc')}
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 border-2 border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('resume.requirements.qualities')}</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {t('resume.requirements.qualities.desc')}
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 border-2 border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('resume.requirements.character')}</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {t('resume.requirements.character.desc')}
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-12 border-2 border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{t('resume.cta.title')}</h2>
          <ShineButton
            onClick={handleSubmitResume}
            className="px-10 py-4 bg-black dark:bg-white text-white dark:text-black font-bold text-lg border-2 border-black dark:border-white hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all hover:shadow-lg"
          >
            {t('resume.cta.button')}
          </ShineButton>
        </section>
      </div>

      {/* Email Contact Modal */}
      <EmailContactModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        title={language === 'zh' ? '简历接收' : 'Resume Submission'}
      />
    </div>
  );
}
