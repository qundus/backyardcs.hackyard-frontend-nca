import Sidebar from "./Sidebar";
import { useTranslation } from "react-i18next";

const lngs = {
  en: { nativeName: "English" },
  ar: { nativeName: "Arabic" },
};

const Layout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const show_stamp = !window.location.origin.includes(import.meta.env.VITE_ORIGIN);
  return (
    <div className="flex h-screen w-full flex-col bg-primary bg-cover bg-no-repeat overflow-hidden">
      <div
        className={`
        container my-auto flex flex-row h-[calc(100vh-7.375rem)] font-inter
        ${show_stamp ? "pt-10" : ""}
        ${i18n.resolvedLanguage === "en" ? "flex-row-reverse" : ""}
        `}>
        {children}
        <Sidebar />
      </div>
      {
        show_stamp &&
        <div
          className={`
          re-edited-box-icon flex flex-row  !w-[96.5%]  !items-center mb-5 mt-2
          ${i18n.resolvedLanguage === "en" ? "!justify-start !self-end" : "!justify-end !self-start"}
          `}>
          <div className="!min-w-[300px] !w-[300px] !max-w-[300px]  !self-start">
            <a
              href='http://raqmi.dga.gov.sa/platforms/DigitalStamp/ShowCertificate/7971'
            >
              <img src='/light-signature.jpg' className="w-full h-full" />
            </a>
          </div>
        </div>
      }
    </div>
  );
};

export default Layout;
