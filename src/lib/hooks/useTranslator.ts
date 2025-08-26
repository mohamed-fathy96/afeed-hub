import { useTranslation } from "react-i18next";

export const useTranslator = () => {
  const { t, i18n } = useTranslation();

  // Function to translate keys from JSON files
  const __T = (key: string) => (i18n.language === "en" ? key : t(key));

  // Function to translate backend fields based on current language
  const __TK = (fieldNameEn: string, fieldNameAr: string) => {
    // Check if the field with language suffix exists; if not, use the base field name
    return i18n.language === "en" ? fieldNameEn : fieldNameAr;
  };

  return { __T, __TK };
};
