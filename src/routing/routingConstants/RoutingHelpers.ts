export const getDefaultLanguage = (): string => {
  let lang = window.navigator.languages ? window.navigator.languages[0] : null;
  lang =
    lang ||
    window.navigator.language ||
    (window.navigator as any)?.browserLanguage || // Use type assertion here
    (window.navigator as any)?.userLanguage;

  let shortLang: string | null = lang ? lang : null;

  if (shortLang && shortLang.indexOf('-') !== -1) {
    shortLang = shortLang.split('-')[0];
  }

  if (shortLang && shortLang.indexOf('_') !== -1) {
    shortLang = shortLang.split('_')[0];
  }

  return shortLang || '';
};
