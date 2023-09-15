import { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { useHookstate } from "@hookstate/core";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import LargeLoadingIndicator from "../Shared/LargeLoadingIndicator";
import LoadingIndicator from "../Shared/LoadingIndicator";
import ContestantCard from "../EvaluationList/ContestantCard";
import { getApplications } from "../../../helpers/api";
import { split_text } from "../../../helpers/helper_functions";
import { store } from "../../store/store";

const Filtering = () => {
  const [searchValue, setSearchValue] = useState();
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [filter_state, setFilterState] = useState(undefined);
  const $apps = useHookstate(undefined);
  const i18n_key = store.user_do.get_i18n_key();
  const user_level = store.user_do.get_level();
  const user_type = store.user_do.get_type();
  const history = $apps.promised || !$apps.ornull ? undefined : $apps.ornull?.get({ noproxy: true }).history;
  const applications = $apps.promised || !$apps.ornull ? undefined : $apps.object;
  const translations = $apps.promised || !$apps.ornull ? undefined : $apps.ornull?.get({ noproxy: true }).translation;
  const ratedCandidatesCount = $apps.promised || !$apps.ornull ? 0 : history?.length;
  const unratedCandidatesCount = $apps.promised || !$apps.ornull ? 0 : (user_level === "TOP" ? applications.ornull?.length : applications.keys.length) - ratedCandidatesCount;
  let no_candidates_on_screen = $apps.promised || !$apps.ornull ? true : applications.keys?.length <= 0;

  useEffect(() => {
    $apps.set(getApplications({ id: id, search: null }));
  }, [id]);

  /**
   * @param {"rated" | "unrated" | undefined} state 
  */
  const handleFilterParticipants = (state) => {
    setFilterState(state);
  };

  const searchHandler = (e) => {
    setSearchValue(e.target.value);
  };

  const update_id = (id, obj) => {
    if (user_level === "TOP") {
      const score = obj.total;
      const app = $apps.object.find(x => x.id.value === id);
      app.merge({ score_id: obj.id });
      if (user_type === "FILTERER|3") app.merge({ filtering_score: score });
      else app.merge({ judging_score: score });
      if (!history.includes(id)) $apps.history.merge([id]);
    } else {
      const group = applications.nested(obj.group);
      const scores = obj.object;

      group.applications.set(s => {
        s.forEach(app => {
          // console.log("apps :: ", app);
          const score = scores.find(x => x.application === app.id).score;
          app.reviewer_score = score;
        });
        return s;
      });
    }
  };

  // if (!$apps.promised)
  //   console.log("applications :: ", $apps.ornull?.get({ noproxy: true }));
  return (
    <section className="flex flex-col w-full h-full overflow-auto">
      <div
        className={`
          mb-4 flex gap-x-2 font-inter text-base font-semibold w-full h-max
          ${i18n.resolvedLanguage === "en" ? "flex-row-reverse" : ""}
          ${user_level === "TOP" ? "" : "hidden"} 
          `}>
        {/* total */}
        <div
          className={`
          flex w-[190px] h-max justify-between gap-x-4 
          rounded-30px bg-offwhite py-3 px-4 text-primary
          ${i18n.language === "en" ? "" : "flex-row-reverse"}
          `}>
          <span className={`${i18n.language === "en" ? "text-left" : ""}`}>
            {t(`${i18n_key}.total`)}
          </span>
          {
            $apps.promised ?
              <LoadingIndicator /> :
              <span>{ratedCandidatesCount + unratedCandidatesCount}</span>
          }
        </div>

        {/* evaluated */}
        <button
          onClick={() => handleFilterParticipants(filter_state !== "rated" ? "rated" : undefined)}
          className={`flex w-[190px] h-max justify-between gap-x-4 rounded-30px
          py-3 px-4 text-primary shadow-lg shadow-primary/40
          ${i18n.language === "en" ? "text-left" : "flex-row-reverse"} 
          ${filter_state === "rated" ? "bg-accent" : "border-2 border-accent !text-accent"}
          `}>
          <span className={`${i18n.language === "en" ? "text-left" : ""}`}>
            {t(`${i18n_key}.rated`)}
          </span>
          {$apps.promised ?
            <LoadingIndicator /> :
            <span>{ratedCandidatesCount}</span>
          }
        </button>

        {/* not evaluated */}
        <button
          onClick={() => handleFilterParticipants(filter_state !== "unrated" ? "unrated" : undefined)}
          className={`flex w-[190px] h-max justify-between gap-x-4 rounded-30px
          py-3 px-4 text-primary shadow-lg shadow-primary/40
          ${i18n.language === "en" ? "text-left" : "flex-row-reverse"} 
          ${filter_state === "unrated" ? "bg-accent" : "border-2 border-accent !text-accent"}
          `}>
          <span className={`${i18n.language === "en" ? "text-left" : ""}`}>
            {t(`${i18n_key}.unrated`)}
          </span>
          {$apps.promised ?
            <LoadingIndicator /> :
            <span>{unratedCandidatesCount}</span>
          }
        </button>

        {/* search */}
        <input
          placeholder={`${i18n.language === "en" ? "Search" : "البحث"}`}
          onChange={searchHandler}
          className={`
          min-w-0 flex-1 rounded-30px 
          border-2  border-offwhite bg-transparent px-6 text-2xl 
          text-offwhite opacity-60 outline-none active:outline-none
          ${i18n.language === "en" ? "" : "rtl"}  
          `} />
      </div>

      {/* applications */}
      <div
        className={`pr-3 relative !min-w-full !w-full !flex !flex-col 
        ${$apps.promised ? "" : "overflow-y-auto"} 
        ${user_level === "TOP" ? "" : "hidden"} 
        `}>
        {$apps.promised ?
          <LargeLoadingIndicator padding="pt-[30px]" />
          :
          $apps.error ?
            $apps.error.toString() :
            <table
              id="eval_table"
              className={`text-gray-500  text-center font-inter text-base font-semibold
                ${i18n.language === "en" ? "" : "rtl"}   
                `}>
              <thead className="!bg-primary !z-1">
                <tr
                  className={`sticky top-0  w-full mb-4 text-base  text-primary text-start 
                    ${i18n.language === "en" ? "english-td" : "arabic-td"}
                    `}>
                  <td scope="col" className={`bg-offwhite px-6 py-3`}>
                    {t(`${i18n_key}.ID`)}
                  </td>
                  {user_level === "TOP" &&
                    <td scope="col" className={`bg-offwhite`}>
                      {t(`${i18n_key}.projectName`)}
                    </td>
                  }
                  <td scope="col" className={`bg-offwhite capitalize`}>
                    {t(`${i18n_key}.state`)}
                  </td>
                  <td scope="col" className={`bg-offwhite capitalize`}>
                    {t(`${i18n_key}.score`)}
                  </td>
                  {
                    user_level === "PRIO" &&
                    <td className={`bg-offwhite capitalize`}>
                      {t(`prioList.num_of_apps`)}
                    </td>
                  }
                  {/* <td scope="col" className={`bg-offwhite`}>
                  {t(`${i18n_key}.source`)}
                </td> */}
                  {/* <td scope="col" className={`bg-offwhite px-2 py-3`}>
                  {t(`${i18n_key}.date")}
                </td> */}
                  <td scope="col" className={`bg-offwhite px-10 capitalize`}>
                    {t(`${i18n_key}.change`)}
                  </td>
                </tr>
              </thead>
              <tbody className="whitespace-nowrap text-start w-full h-full text-offwhite">
                {
                  no_candidates_on_screen ?
                    <tr className="w-full items-center justify-center">
                      <td className=" text-center text-3xl border-none">
                        {t(`${i18n_key}.nocandidates`)}
                      </td>
                    </tr>
                    :
                    (user_level === "TOP" ? applications.ornull : applications.ornull?.keys)?.map((kvp, i) => {
                      const item = user_level === "TOP" ? kvp.get({ noproxy: true }) : applications.nested(kvp).ornull?.get({ noproxy: true });
                      const title = String(user_level === "TOP" ? item.profile?.user?.name : kvp);
                      if (searchValue && !title.includes(searchValue)) return null;
                      // console.log("items :: ", item);
                      let rated = user_level === "TOP" ? history?.includes(item.id) : item?.applications[0]?.reviewer_score !== null;
                      const first_reviewer = !item.applications ? undefined : item.scale[0];
                      const last_reviewer = !item.applications ? undefined : item.scale[item.scale.length - 1];
                      if (filter_state === "rated" && !rated) return null;
                      else if (filter_state === "unrated" && rated) return null;

                      // console.log("application :: ", title, item);
                      return (
                        <tr
                          key={`all_${title}`}
                          className={`border border-offwhite bg-transparent 
                        ${i18n.language === "en" ? "english-td" : "arabic-td"}
                        `}>
                          {user_level === "TOP" &&
                            <td className={`px-8 py-2 font-medium capitalize`}>
                              {item.id}
                            </td>
                          }
                          <td className={user_level === "TOP" ? `px-8 py-2` : `px-6 py-2`}>
                            {/* <Translate text={item?.profile?.user?.name} hide_style={true} /> */}
                            {user_level === "TOP" ? split_text(title) : title}
                            {/* {item?.profile?.user?.name} */}
                          </td>
                          <td className={`px-6`}>
                            {rated ?
                              <AiOutlineCheck className="h-5 w-5 text-green-500" /> :
                              <RxCross2 className="h-5 w-5 text-red-500" />
                            }
                          </td>
                          <td className="capitalize">
                            {user_level == "TOP" ?
                              rated ? user_type === "FILTERER|3" ? item.filtering_score : item.judging_score
                                : t(`${i18n_key}.unrated`)
                              :
                              `${first_reviewer.toFixed()} -> ${last_reviewer.toFixed()}`
                            }
                          </td>
                          {
                            user_level === "PRIO" &&
                            <td>
                              {item?.applications?.length || 0}
                            </td>
                          }
                          {/* <td>{item?.source}</td> */}
                          {/* <td className={`px-2 py-2`}>
                          {item.profile.founding_date}
                        </td> */}
                          <td className={` flex `}>
                            <ContestantCard
                              key={item.id}
                              id={item.id}
                              update_id={update_id}
                              item={item}
                              title={title}
                              track_id={id}
                              scale={item.scale}
                              scoring_translation={$apps.ornull?.value?.scoring_translation}
                              translations={translations}
                              rated={rated}
                              name={item.participation_title}
                            />
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
        }
      </div >
    </section>
  );
};

export default Filtering;
