'use client'

import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu';
import { useLanguage } from './LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-transparent hover:bg-green-50 hover:text-green-700 transition-colors duration-200 rounded-lg border-0 cursor-pointer">
          <Globe className="w-4 h-4" />
          <span>{currentLanguage?.native}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as 'en' | 'hi')}
            className={`flex items-center justify-between cursor-pointer ${
              language === lang.code ? 'bg-green-50 text-green-700' : ''
            }`}
          >
            <span>{lang.native}</span>
            {language === lang.code && (
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}