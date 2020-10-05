import he from './1km-he-IL.json';
import i18n from 'i18n-js';

/**
 * How to add new translation:
 *
 * Create a new JSON file in this directory with new translations.
 * Import it in this file, and add it to the translations map below
 */

i18n.translations = {
  'he': he
};

i18n.defaultLocale = 'he';
i18n.fallbacks = true;
i18n.missingBehaviour = 'guess';

i18n.missingTranslation = (scope) => {
  console.warn('No translation found for "' + scope + '" in ' + i18n.locale);
  return '';
};