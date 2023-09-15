import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import LanguageSwitch from "../Shared/LanguageSwitch";
import Filtering from "../Filtering/Filtering";
import { store } from "../../store/store";

const EvaluationList = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const track = store.tracks_do.get_details(id);

  // consts
  const user = store.user_do.get();
  const user_type = store.user_do.get_type();
  const settings = store.settings_do.get();
  const isTrackActive = settings?.object
    .filter((item) => item?.num_value === user.user_type)
    .map((item) => item?.active)?.[0];

  let i18n_key = "filterer";
  if (user_type === "JUDGE|4" || user_type === "PRIO_JUDGE|6") {
    i18n_key = "judge";
  }

  const handleLogout = () => {
    store.clear();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    if (Number.isNaN(Number.parseInt(id))) {
      navigate(store.route_do.get_not_found());
    }
  }, [id]);

  return (
    <div
      className={`flex flex-1 flex-col pt-2 min-w-0 text-end font-bold text-offwhite
      ${i18n.resolvedLanguage === "en" ? "px-5 desktop:pr-[80px]" : " px-5 desktop:pl-[80px]"}
      `}>
      <div
        className={`mb-16 flex items-center justify-between 
        ${i18n.resolvedLanguage === "en" ? "flex-row-reverse" : ""}
        `}>
        <div
          className={`flex items-center justify-center gap-x-5
          ${i18n.resolvedLanguage === "en" ? "flex-row-reverse" : ""}
          `}>

          <button
            onClick={handleLogout}
            className="h-max w-max rounded-2xl bg-offwhite px-4 py-2 !text-center text-15px text-primary"
          >
            {t("evaluation.signout")}
          </button>
          {/* <div
            onClick={() => navigate("/stats")}
            className="cursor-pointer h-max w-max rounded-2xl bg-accent px-4 py-2 !text-center text-15px text-primary">
            {t(`g.stats`)}
          </div> */}
          <span className="w-max h-max  text-23px text-white">
            {user?.name ? user.name : ""}
          </span>
          <LanguageSwitch />
        </div>
        <h3
          className={`text-[40px] capitalize text-accent 
          ${i18n.resolvedLanguage === "en" ? "text-left ml-5" : "mr-5"}
          `}>
          {
            track &&
            t(`${store.user_do.get_i18n_key()}.${i18n_key}`) +
            ` | ${i18n.resolvedLanguage === "en"
              ? ` ${track?.name_en} award `
              : ` جائزة  ${track?.name_ar}`
            } `
          }
        </h3>
      </div>

      {!track || user_type === "APPLICANT|2" ?
        <h1
          className={`
          mt-8 text-[2rem]
          ${i18n.resolvedLanguage === "en" ? "text-left" : ""}
          `}>
          {i18n.language === "en"
            ? "You are not allowed to view this"
            : "هذا الحساب غير مسموح له دخول هذه الصفحة"}
        </h1>
        :
        !isTrackActive ?
          <h1 className="mt-8 text-center text-2xl">
            {i18n.language === "en"
              ? "This track is not active!"
              : "لم يتم تفعيل هذه المرحلة"}
          </h1>
          :
          <Filtering settings={settings?.object} />
      }
    </div>
  );
};

export default EvaluationList;
