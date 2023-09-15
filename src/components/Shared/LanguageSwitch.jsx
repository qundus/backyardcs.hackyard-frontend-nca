import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitch = () => {
  const [lang, setLang] = useState("");
  const { t, i18n } = useTranslation();
  const [enabled, setEnabled] = useState(false);

  document.documentElement.setAttribute("lang", i18n.resolvedLanguage);

  useEffect(() => {
    if (i18n.language === "ar") {
      setEnabled(false);
    } else {
      setEnabled(true);
    }
  });

  const changeLanguage = () => {
    setEnabled(!enabled);

    if (i18n.language === "ar") {
      i18n.changeLanguage("en");
    } else {
      i18n.changeLanguage("ar");
    }
  };

  return (
    <div className="flex items-center">
      <label className="relative  inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={enabled}
          readOnly
        />
        <div
          onClick={changeLanguage}
          className="after:border-gray-300 peer h-7 w-14 rounded-full border border-offwhite  after:absolute after:top-0.5 after:left-[4px] after:h-6 after:w-6 after:rounded-full after:border after:bg-offwhite after:transition-all after:content-['']  peer-checked:after:translate-x-full peer-checked:after:border-offwhite peer-focus:border-offwhite peer-focus:outline-none  dark:border-offwhite"
        ></div>
      </label>
      {<span className="text-white text-[1.2rem] mx-2 !text-center">{i18n.language === "en" ? "العربية" : "English"}</span>}
    </div>
  );
};

export default LanguageSwitch;
