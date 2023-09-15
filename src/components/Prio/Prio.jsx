import React from "react";
import { useParams } from "react-router";
import ContestantCard from "../EvaluationList/ContestantCard";
import {
  getApplications,
  getTrackDetails,
  getPrioApplications,
  getPrioScore,
} from "../../../helpers/api";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "../Shared/LanguageSwitch";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import LoadingIndicator from "../Shared/LoadingIndicator";
import { useState } from "react";
import LargeLoadingIndicator from "../Shared/LargeLoadingIndicator";
import { parseJwt } from "../../../helpers/helper_functions";
import PrioCard from "./PrioCard";

const Prio = () => {
  const [ratedState, setRatedState] = useState(false);
  const [unratedState, setUnratedState] = useState(false);
  const { id } = useParams();
  const [searchValue, setSearchValue] = useState();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(location.search);
  const judgeType = urlParams.get("type");
  let type = Cookies.get("cookieToken");
  type = parseJwt(type);
  type = type.user_type;

  const { data, isLoading, isError, error, isSuccess } = useQuery(
    ["prio-track-applications", id, searchValue],
    () => getPrioApplications({ id: id, search: searchValue }),
    {
      enabled: judgeType === "prio" ? true : false,
    }
  );

  const searchHandler = (e) => {
    setSearchValue(e.target.value);
  };

  const handleRated = () => {
    setRatedState((oldState) => !oldState);
    setUnratedState(false);
  };
  const handleUnrated = () => {
    setUnratedState((oldState) => !oldState);
    setRatedState(false);
  };

  const ratedCandidatesCount = data?.history?.length;
  const unratedCandidatesCount =
    isSuccess && Object.keys(data?.object).length - ratedCandidatesCount;

  if (isLoading && judgeType === "prio") return <LoadingIndicator />;
  return (
    <>
      {isSuccess && (
        <div
          className={`flex min-w-0 flex-1 flex-col  pt-2 text-end font-bold text-offwhite ${judgeType === "prio" ? "" : "hidden"
            }`}
        >
          {/* {
            <div className="mb-4 flex gap-x-2 font-inter text-base font-semibold">
              <div
                className={`flex w-[190px] ${
                  i18n.language === "en" ? "" : "flex-row-reverse"
                } justify-between gap-x-4 rounded-31px bg-offwhite py-6  px-4 text-primary`}
              >
                <span
                  className={`${i18n.language === "en" ? "text-left" : ""}`}
                >
                  {t("prioList.total")}
                </span>
                {isLoading ? (
                  <LoadingIndicator />
                ) : (
                  <span>{ratedCandidatesCount + unratedCandidatesCount}</span>
                )}
              </div>
              <button
                onClick={handleRated}
                className={`flex w-[190px] ${
                  i18n.language === "en" ? "text-left" : "flex-row-reverse"
                } justify-between gap-x-4 rounded-31px  ${
                  ratedState ? "bg-accent" : "bg-offwhite"
                } py-6  px-4 text-primary`}
              >
                <span
                  className={`${i18n.language === "en" ? "text-left" : ""}`}
                >
                  {t("prioList.rated")}
                </span>
                {isLoading ? (
                  <LoadingIndicator />
                ) : (
                  <span>{ratedCandidatesCount}</span>
                )}
              </button>
              <button
                onClick={handleUnrated}
                className={`flex w-[190px] ${
                  i18n.language === "en" ? "" : "flex-row-reverse"
                } justify-between gap-x-4 rounded-31px ${
                  unratedState ? "bg-accent" : "bg-offwhite"
                } py-6  px-4 text-primary`}
              >
                <span
                  className={`${i18n.language === "en" ? "text-left" : ""}`}
                >
                  {t("prioList.unrated")}
                </span>
                {isLoading ? (
                  <LoadingIndicator />
                ) : (
                  <span>{unratedCandidatesCount}</span>
                )}
              </button>
              <input
                onChange={searchHandler}
                className={`${
                  i18n.language === "en" ? "" : "rtl"
                }  min-w-0  flex-1 rounded-31px border-2   border-offwhite bg-transparent px-6 text-2xl text-offwhite opacity-60 outline-none active:outline-none`}
                placeholder={`${i18n.language === "en" ? "Search" : "البحث"}`}
              />
            </div>
          } */}
          <div className={`relative ${isLoading ? "" : "overflow-y-auto"} `}>
            {isLoading ? (
              <LargeLoadingIndicator padding="pt-[30px]" />
            ) : (
              <table
                className={`text-gray-500  ${i18n.language === "en" ? "" : "rtl"
                  }   w-full text-center font-inter text-base font-semibold`}
              >
                <tr
                  className={`  sticky top-0   text-base  text-primary ${i18n.language === "en" ? "english-td" : "arabic-td"
                    }`}
                >
                  <td scope="col" className="bg-offwhite px-4 py-6">
                    {t("prioList.ID")}
                  </td>
                  <td scope="col" className="bg-offwhite px-4 py-6">
                    {t("prioList.score")}
                  </td>
                  {/* <td scope="col" className="bg-offwhite px-4 py-6">
                    {t("prioList.state")}
                  </td> */}
                  <td scope="col" className="bg-offwhite px-4 py-6">
                    {t("prioList.date")}
                  </td>
                  <td scope="col" className="bg-offwhite px-4 py-6">
                    {t("prioList.change")}
                  </td>
                </tr>
                <tbody className="text-offwhite">
                  {isSuccess &&
                    Object.keys(data?.object).map((item) => {
                      return (
                        <>
                          <tr className="spacer"></tr>
                          <tr
                            className={` ${i18n.language === "en"
                              ? "english-td"
                              : "arabic-td"
                              } border border-offwhite bg-transparent`}
                          >
                            <td className="px-2 py-4 font-medium ">{item}</td>
                            <td className="px-2 py-4">
                              {/* {data[item]?.object[0]?.filtering_score} */}
                            </td>
                            {/* <td className="px-4 py-4">
                              {rated
                                ? t("evaluationList.rated")
                                : t("evaluationList.unrated")}
                            </td> */}
                            <td className="px-2 py-4">-</td>
                            <td className=" flex items-center justify-center  py-4">
                              <PrioCard
                                questionsTranslation={data?.scoring_translation?.prio_filtering}
                                scale={data.object[item].scale}
                                translation={data?.translation}
                                isLoading={isLoading}
                                buttonText={
                                  i18n.language === "en"
                                    ? "Prioritization"
                                    : "المفاضلة"
                                }
                                groupData={data.object[item].applications}
                              />
                            </td>
                          </tr>
                        </>
                      );
                    })}
                </tbody>
              </table>
            )}
            {isSuccess && Object.keys(data?.object).length === 0 && (
              <div className="mt-8 flex items-center justify-center">
                <span className="mx-auto text-center text-3xl">
                  {t("evaluationList.nocandidates")}
                </span>
              </div>
            )}
            {isLoading && (type === 5 || type === 6) && (
              <LargeLoadingIndicator />
            )}
          </div>
        </div>
      )}
      {isError && (type === 5 || type === 6) && (
        <span>{error.response.data.details}</span>
      )}
    </>
  );
};

export default Prio;
