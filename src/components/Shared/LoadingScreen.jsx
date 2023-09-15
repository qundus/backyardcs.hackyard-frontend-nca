import Logo from "../../assets/logo.png";
import { useTranslation } from "react-i18next";

export default function () {
  const { t } = useTranslation();
  return (
    <section className="flex w-screen h-screen bg-primary items-center justify-center text-offwhite text-center">
      <div className="w-max h-max space-y-4">
        <img src={Logo} />
        <p>{t("g.loading_platform")}</p>
      </div>
    </section>
  );
}
