import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { split_text } from "../../../helpers/helper_functions";


const ContestantApplicationInfo = ({
  workOverview,
  participationTitle,
  participationFile,
  email,
  phoneNumber,
  gender,
  city,
  cv,
  inspiration,
  snapchat,
  instagram,
  linkedIn,
  twitter,
  youtube,
  additional_files,
  previousActivities,
  previousWorkLink,
  yearOfExecution,
  trackNameAr,
  trackNameEn,
  age,
  country,
  publishingStatus,
  workDocumentationNumber,
  dateOfApplicant,
  numberOfInternational,
  internationalParticipations,
  community,
  workDate,
  productionDate,
  numberOfSales,
  numberOfTranslationLanguages,
  translationLanguages,
  localAndInternational,
  workLanguage,
  hasTheCandidateWonAwards,
  numberOfLocalParticipations,
  localParticipations,
  havePersonalWorksInCinemas,
  haveBeenShownInFestivals,
  activityAndInfluence,
  ticketsSold,
  whatKindOfSupport,
  totalSupportReceived,
  translations,
  applicantData,
  brief,
  trackId
}) => {
  const { t, i18n } = useTranslation();

  const [activeFile, setActiveFile] = useState(undefined);
  const [activeIdx, setActiveIdx] = useState(undefined);
  const participation = applicantData.application_details?.["cultural participation file"];
  const socialImpact = applicantData?.application_details?.["social impact"];
  const profile = applicantData.profile;
  const is_company = profile.is_company === "yes";
  const name = applicantData?.profile?.user?.name || t(`g.unknown`);
  const track_name = applicantData?.track?.[i18n.resolvedLanguage === "ar" ? "name_ar" : "name_en"];

  // console.log("application data :: ", applicantData);
  const social_media = [
    { link: snapchat, icon: "fa:snapchat-square", tt: t("dialogInfo.snapchat") },
    { link: instagram, icon: "uil:instagram-alt", tt: t("dialogInfo.instagram") },
    { link: linkedIn, icon: "ri:linkedin-box-fill", tt: t("dialogInfo.linkedIn") },
    { link: twitter, icon: "ant-design:twitter-circle-filled", tt: t("dialogInfo.twitter") },
    { link: youtube, icon: "mingcute:youtube-fill", tt: t("dialogInfo.youtube") },
    { link: additional_files, icon: "dashicons:admin-site-alt3", tt: t("dialogInfo.additionalFiles") },
    // { link: additional_files, icon: "material-symbols:add-notes-rounded", tt: t("dialogInfo.additionalFiles") },
  ];

  /** @type {Array} */
  const works = [
    !is_company && { link: split_text(profile.practitioner_certificate), icon: "fluent:certificate-20-filled", tt: t("dialogInfo.practitioner_certificate") },
    !is_company && { link: split_text(profile.publishing_house_license), icon: "ph:read-cv-logo-bold", tt: t("dialogInfo.publishing_house_license") },
    !is_company && { link: split_text(profile.cv), icon: "mdi:drivers-license", tt: t("dialogInfo.cvLink") },
    // company
    is_company && { link: split_text(profile.company_profile), icon: "ri:profile-fill", tt: t("dialogInfo.company_profile") },
    is_company && { link: split_text(profile.trade_mark), icon: "openmoji:trade-mark", tt: t("dialogInfo.trade_mark") },
    is_company && { link: split_text(profile.cr), icon: "medical-icon:registration", tt: t("dialogInfo.cr") },
    is_company && { link: split_text(profile.company_license), icon: "tabler:license", tt: t("dialogInfo.comapny_license") },
  ];

  let part_file = "";
  let part_file_is_movie = trackId === "13" || trackId === "2";
  if (participation) {
    part_file = participation["participation file"];
    if (i18n.resolvedLanguage === "en" && participation["en participation file"])
      part_file = participation["en participation file"];
  }

  works.push(...[
    {
      link: split_text(part_file), icon: part_file_is_movie ? "mdi:movie-open" : "mdi:prize", tt: t(`dialogInfo.${part_file_is_movie ? "participationFileMovie" : "participationFile"}`)
    },
  ]);

  useEffect(() => {
    if (activeIdx) {
      setActiveFile(works[activeIdx].link);
    } else {
      setActiveFile(undefined);
      setActiveIdx(undefined);
    }
  }, [applicantData]);

  let merged_works = 0;
  return (
    <div
      className={`!box-border
        flex w-full h-full flex-[5] flex-col overflow-y-auto overflow-x-hidden
          px-3 pt-0 text-primary
        ${i18n.resolvedLanguage === "en" ? "border-r-2 border-r-accent" : "border-l-2 border-l-accent"} 
        `}>
      {/* top sticky section */}
      <div className="sticky top-0 flex flex-col bg-offwhite w-full text-3xl !pt-3 px-4">
        {/* name and award */}
        <div className="flex flex-row justify-between w-full h-max mb-2">
          <h1 className="   text-40px ">
            {split_text(name)}
          </h1>
          <span className="text-3xl capitalize">
            {i18n.resolvedLanguage == "en"
              ? `${track_name} award`
              : `جائزة ${track_name}`}
          </span>
        </div>
        {/* links */}
        <div className="flex flex-row py-4 w-full h-full pt-3">
          <div className="flex flex-row  !w-max whitespace-nowrap !justify-start !p-0 !m-0">
            {social_media.map((item, i) => {
              const show = !item.link || item.link.length <= 0 ? false : true;
              return (
                <a
                  key={`social_link_${i}`}
                  target={!show ? undefined : "_blank"}
                  href={!show ? "#" : item.link}
                  className={`
                    relative inline-block [&>span]:hover:!visible text-start w-max
                    mx-2
                    ${!show ? " cursor-not-allowed opacity-50" : ""}`}>
                  <Icon width={"2rem"} icon={item.icon} className={`mx-auto ${!show ? "" : "text-accent "}`} />
                  <span className={` w-max h-max  capitalize
                    ${i18n.resolvedLanguage === "ar" ? "text-[0.6rem]" : "text-[0.7rem]"}
                    `}>
                    {item.tt}
                  </span>
                </a>
              );
            })}
          </div>
          {/* divider */}
          <div className="w-full h-full p-auto !items-center !justify-center">
            <div className="w-[2px] h-[80%] bg-accent m-auto opacity-30" />
          </div>
          <div className="flex flex-row  !w-fit whitespace-nowrap !justify-start !p-0 !m-0">
            {works.map((item, i, { length }) => {
              if (!item) return null;
              const is_active = activeIdx === i;
              const show = !item.link || item.link.length <= 0 ? false : true;
              if (is_active) merged_works++;
              return (
                <button
                  // href={cv}
                  key={`document_link_${i}`}
                  disabled={!item.link || item.link.length <= 0}
                  className={`
                    relative flex flex-col !w-max !h-full p-auto
                    disabled:opacity-50 disabled:cursor-not-allowed
                    [&>span]:hover:!visible mx-2 !pb-0 pt-2 !self-center
                    transition-all duration-200 ease-in-out
                    ${i18n.resolvedLanguage === "ar" ? "text-[0.6rem]" : "text-[0.7rem]"}
                    ${is_active ? "bg-accent rounded-2xl px-2 !opacity-100 " : ""}
                    ${!show ? " cursor-not-allowed text-primary " : ""} `}
                  onClick={() => {
                    if (is_active) {
                      setActiveFile(undefined);
                      setActiveIdx(undefined);
                    } else {
                      let link = embed_link(item.link);
                      if (link) {
                        setActiveFile(link);
                        setActiveIdx(i);
                      }
                    }
                  }}
                >
                  {
                    is_active &&
                    <>
                      {
                        merged_works > 1 ?
                          <span
                            className={`rounded-[5px]  opacity-75 px-1 pb-2 pt-1
                            absolute flex top-0 w-max !h-[1rem] bg-accent 
                            font-serif tracking-wide
                            items-center self-center -translate-y-[140%] overflow-hidden 
                            ${i18n.resolvedLanguage === "ar" ? "text-[0.75rem]" : "text-[0.85rem]"}
                            `}>
                            {t("dialogInfo.merged")}
                          </span>
                          :
                          <a
                            href={item.link}
                            target="_blank"
                            className="h-max w-max absolute text-center text-base !text-[0.6rem] -translate-y-[180%]">
                            {/* {i18n.language === "en" ? "New Tab" : "نافذة جديدة"} */}
                            <Icon
                              width={"1.1rem"}
                              icon="icomoon-free:new-tab"
                              className={`mx-auto !self-center text-blue-500`} />
                          </a>
                      }
                    </>
                  }
                  <Icon width={"2rem"} icon={item.icon}
                    className={`mx-auto !self-center
                    ${!show ? "" : "text-accent "}
                    ${is_active ? "!text-primary" : ""}
                    `} />
                  <span className={`w-max h-max  capitalize`}>
                    {item.tt}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div
        className={`
          flex flex-col  rounded-2xl bg-gray px-5 py-5 font-inter text-xl
          ${activeFile ? "h-full" : "h-max"}
        `}>
        {
          !activeFile &&
          <>
            {/* profile */}
            <FieldSet
              title={t("dialogInfo.profile")}
              items={profile}
              include={["age", "brief", "inspiration_story"]}
              skip_links i18n={i18n}
              // translations={translations}
              t={(label, is_null) => t(is_null ? `g.unknown` : `dialogInfo.${label}`)}
              keep_null
              split_text={split_text}
            />

            {/* cultural participation file */}
            <FieldSet
              title={i18n.language === "en" ? "Cultural Participation File" : "ملف المشاركة الثقافي"}
              items={participation}
              ignore={["publishing status", "participation file", "en participation file"]}
              skip_links i18n={i18n} translations={translations}
              split_text={split_text}

            />

            {/* social impact */}
            <FieldSet
              title={t("dialogInfo.socialImpact")}
              items={socialImpact}
              // ignore={["publishing status"]}
              skip_links i18n={i18n} translations={translations}
              split_text={split_text}
            />
          </>
        }
        {activeFile && activeFile.startsWith("http") &&
          <div className="!w-full !min-w-full !h-full !min-h-full">
            <iframe
              src={activeFile}
              className="!w-full !min-w-full !h-full !min-h-full rounded-md rounded-[1rem]"
              title="video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
              allowFullScreen
            >
            </iframe>
          </div>
        }
      </div>

    </div>
  );
};

function FieldSet({ title, items, include, ignore, hidden, skip_links, translations, i18n, t, split_text, keep_null }) {
  if (hidden || !items || Object.keys(items)?.length <= 0 || items?.length <= 0) return null;
  let count_ignore = 0;
  if (ignore) {
    for (const key of ignore) {
      if (items[key]) count_ignore++;
    }
  }
  if (Object.keys(items)?.length <= count_ignore) return null;
  return (
    <fieldset className={`mt-4 rounded-30px border border-primary px-10 pb-3`}>
      <legend className=" px-2 pb-1 font-inter text-2xl capitalize">
        {title}
      </legend>
      <div className="  col-span-1 grid grid-cols-2 gap-4 px-10 py-4">
        {Object.entries(items)?.map((item, i) => {
          /** @type {string} */
          let content = item?.[1] || (keep_null ? t(null, true) : undefined);
          const enLabel = item?.[0];

          if (!content && keep_null) {
            content = t(null, true);
          }
          else if (typeof content !== "string") return null;

          content = content.trimStart(); // keep after string check
          if (ignore && ignore.length > 0 && ignore.includes(enLabel)) return null;
          else if (skip_links && content.startsWith("http")) return null;
          else if (include && include.length > 0) {
            if (!include.includes(enLabel)) return null;
          }

          return (
            <div
              key={`cultural_contest_info_item_${item[0]}_${i}`}
              className={`col-span-2 flex items-center gap-x-8 
               ${content ? "" : " hidden "}
               `}>
              <span className="text-base capitalize">
                {!translations ?
                  t(enLabel)
                  :
                  i18n.language === "en" ? enLabel : translations?.[enLabel]
                }
              </span>
              <span className="font-normal">{split_text ? split_text(content) : content}</span>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * 
 * @param {string} link 
 */
function embed_link(link) {
  link = link.trim();
  let id = undefined;
  if (link.startsWith("https://www.youtube.com") || link.startsWith("https://youtube.com")) {
    if (link.includes("/embed/")) {
      id = link.substring(link.lastIndexOf("/") + 1, link.length);
    }
    else if (link.includes("watch?v=")) {
      const start = link.indexOf("=") + 1;
      const end = link.includes("&") ? link.indexOf("&") : link.length;
      // console.log("start idx ::: ", start, "end idx ::: ", end);
      id = link.substring(start, end);
    }
    return `https://www.youtube.com/embed/${id}?autoplay=1`;
  } else if (link.startsWith("https://www.youtu.be") || link.startsWith("https://youtu.be")) {
    id = link.substring(link.lastIndexOf("/") + 1, link.length);
    return `https://www.youtube.com/embed/${id}?autoplay=1`;
  } else if (link.startsWith("https://drive.google")) {
    const [new_link] = link.split("/view");
    return new_link + "/preview";
  } else if (link.includes(".amazonaws.com")) {
    return link;
  } else if (link.startsWith("https://vimeo.com")) {
    // https://developer.vimeo.com/api/oembed/videos
    let split = link.split("vimeo.com/");
    split[0] += "player.vimeo.com/video/";
    if (split[1].includes("/")) {
      split[1] = split[1].replace("/", "?h=");
      split[1] += "&";
    } else {
      split[1] += "?";
    }
    return split.join("") + "autoplay=1";
  } else {
    window.open(link, "_blank");
    return undefined;
  }
};

export default ContestantApplicationInfo;
