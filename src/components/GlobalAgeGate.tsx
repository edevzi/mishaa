'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import AgeGateOverlay from './AgeGateOverlay';
import { readAgeVerification, persistAgeVerification } from '@/lib/age-verification';
import { translations, Lang } from '@/lib/translations';
import { readStorageItem } from '@/lib/browser-storage';

export default function GlobalAgeGate() {
  const [showGate, setShowGate] = useState(false);
  const [lang, setLang] = useState<Lang>('en');
  const pathname = usePathname();

  useEffect(() => {
    // Check for language
    const savedLang = readStorageItem('lang') as Lang;
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }

    const handleLang = (e: Event) => {
      const nextLang = (e as CustomEvent<Lang>).detail;
      if (translations[nextLang]) setLang(nextLang);
    };

    const handleTrigger = () => {
      const isVerified = readAgeVerification();
      if (!isVerified) {
        setShowGate(true);
      }
    };

    window.addEventListener('langChange', handleLang as EventListener);
    window.addEventListener('triggerAgeGate', handleTrigger);
    
    return () => {
      window.removeEventListener('langChange', handleLang as EventListener);
      window.removeEventListener('triggerAgeGate', handleTrigger);
    };
  }, []);

  const handleVerify = () => {
    persistAgeVerification();
    setShowGate(false);
  };

  const t = translations[lang]?.library || translations['en'].library;

  return (
    <AnimatePresence>
      {showGate && (
        <AgeGateOverlay
          title={t.restricted || "AGE RESTRICTED"}
          description={t.ageDesc || "YOU MUST BE AT LEAST 18 YEARS OLD TO ACCESS THIS CONTENT."}
          confirmLabel={t.verifyBtn || "I AM 18+"}
          cancelLabel={t.cancelBtn || "EXIT"}
          confirmAction={handleVerify}
          cancelAction={() => {
            window.location.href = 'https://www.google.com';
          }}
          zIndex={30000}
        />
      )}
    </AnimatePresence>
  );
}
