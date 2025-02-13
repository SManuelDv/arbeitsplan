import React from 'react'
import { useTranslation } from 'react-i18next'
import { Menu, Transition } from '@headlessui/react'
import { IoLanguage } from 'react-icons/io5'

type SupportedLanguage = 'pt' | 'de' | 'en'

const languageInfo: Record<SupportedLanguage, { name: string; flag: string }> = {
  pt: { name: 'Português', flag: '🇵🇹' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  en: { name: 'English', flag: '🇬🇧' }
}

const supportedLanguages: SupportedLanguage[] = ['pt', 'de', 'en']

export function LanguageSelector() {
  const { i18n, t } = useTranslation()

  const handleLanguageChange = async (language: SupportedLanguage) => {
    try {
      await i18n.changeLanguage(language)
      console.log('Language changed successfully to:', language)
    } catch (error) {
      console.error('Error changing language:', error)
    }
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className="flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:text-primary-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-gray-700 transition-colors"
          title={t('common.selectLanguage')}
        >
          <IoLanguage className="w-5 h-5" />
        </Menu.Button>
      </div>

      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute z-50 right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {supportedLanguages.map((lang) => (
              <Menu.Item key={lang}>
                {({ active }) => (
                  <button
                    onClick={() => handleLanguageChange(lang)}
                    className={`${
                      active
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300'
                    } ${
                      i18n.language === lang
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : ''
                    } group flex w-full items-center px-4 py-2 text-sm`}
                  >
                    <span className="mr-3 text-lg">{languageInfo[lang].flag}</span>
                    <span>{languageInfo[lang].name}</span>
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
} 