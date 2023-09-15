import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  submitCandidateApplication,
  submitPrioApplication,
  updateCandidateApplication,
} from "../../../helpers/api";
import { store } from "../../store/store";
import ContestantApplicationInfo from "./ContestantApplicationInfo";
import StageInputs from "./StageInputs";
import PrioInputs from "../Prio/PrioInputs";

export default function ContestantDialog({
  closeModal,
  rated,
  item,
  title,
  track_id,
  translations,
  scale,
  scoring_translation,
  update_id,
}) {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const user_level = store.user_do.get_level();
  const user_type = store.user_do.get_type();
  const [applicantData, setApplicantData] = useState(
    user_level === "TOP" ? item : item.applications[0]
  );
  const {
    mutate,
    isLoading: isSubmitLoading,
    error: submitError,
    isError: isSubmitError,
  } = useMutation(submitCandidateApplication, {
    onSuccess(d, v, c) {
      queryClient.invalidateQueries({
        queryKey: ["track-applications"],
      });
      // console.log("submitted :: ", d, v, c);
      update_id(applicantData.id, d);
      closeModal();
    },
    onError(error) {},
  });

  const {
    mutate: mutateUpdateScoring,
    isLoading: isUpdateScoringLoading,
    isError: isUpdateScoringError,
    error: scoringError,
  } = useMutation(updateCandidateApplication, {
    onSuccess(d, v, c) {
      queryClient.invalidateQueries({
        queryKey: ["track-applications"],
      });
      update_id(applicantData.id, d);
      // console.log("update :: ", d, v, c);
      closeModal();
    },
  });

  const {
    mutate: mutatePrio,
    isLoading: isSubmitPrioLoading,
    error: submitPrioError,
    isError: isSubmitPrioError,
  } = useMutation(submitPrioApplication, {
    onSuccess(d, v, c) {
      queryClient.invalidateQueries(["prio-track-applications"]);
      update_id(undefined, v);
      closeModal();
    },
    onError(error) {
      // console.log(error);
    },
  });

  const side_title_entry =
    user_level === "TOP"
      ? user_type === "JUDGE|4"
        ? "judge"
        : "filterer"
      : "prioritizer";
  const side_title = t(`${store.user_do.get_i18n_key()}.${side_title_entry}`);
  // console.log("applicant data :: ", applicantData);
  const translationValues = Object.keys(translations);

  const onSubmit = ({ scores, meta }) => {
    Object.keys(scores).forEach(function (el) {
      Object.keys(scores[el]).forEach(function (l) {
        scores[el][l] = parseInt(scores[el][l]);
      });
    });
    let data = {
      scores,
      ...meta,
    };
    if (!rated) {
      data.application = applicantData.id;
      mutate(data);
    } else {
      mutateUpdateScoring({ data, id: applicantData.score_id });
    }
  };

  const onSubmitPrio = (title, d) => {
    const object = [];
    const meta = {};
    for (const id in d) {
      const score = d[id]?.value;
      if (score === undefined) {
        meta[id] = d[id];
      } else {
        const obj = {
          application: Number.parseInt(id),
          score,
          track: track_id,
        };
        object.push(obj);
      }
    }
    // console.log("dd :: ", object, meta);
    mutatePrio({ group: title, object, ...meta });
  };

  const change_profile = (idx) => {
    if (user_level === "PRIO") {
      setApplicantData(item.applications[idx]);
    }
  };

  return (
    <>
      <Transition appear show={true} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 flex flex-col"
          dir={i18n.resolvedLanguage === "ar" ? "rtl" : "auto"}
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto font-inter font-black text-primary">
            <div className="flex h-full min-h-full flex-col  items-center py-5  px-10">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`flex flex-col
                  h-full w-full transform overflow-hidden
                  rounded-2xl bg-offwhite px-6 pb-14 pt-2 shadow-xl transition-all
                  `}
                >
                  <Dialog.Title
                    as="button"
                    className="z-10 flex !self-end rounded-full bg-accent px-3 pb-1 pt-[6px] text-3xl text-primary translate-y-[30%]"
                    onClick={closeModal}
                  >
                    x
                  </Dialog.Title>
                  {/* {isLoading && <LargeLoadingIndicator />} */}
                  {applicantData && (
                    <div className="flex h-full pt-1 pb-3">
                      {/* <div className="w-3/5"> info</div> */}
                      <ContestantApplicationInfo
                        trackId={track_id}
                        brief={applicantData?.profile?.brief}
                        applicantData={applicantData}
                        translations={translations}
                        participationFileAr={
                          translations[translationValues[11]]
                        }
                        participationFileEn={translationValues[11]}
                        name={applicantData?.profile?.user?.name}
                        workOverview={
                          applicantData?.application_details?.[
                            "cultural pariticipation file"
                          ]?.["cultural brief"]
                        }
                        trackNameAr={applicantData?.track.name_ar}
                        trackNameEn={applicantData?.track.name_en}
                        participationTitle={
                          applicantData?.application_details?.[
                            "cultural participation file"
                          ]?.["participation title"]
                        }
                        participationFile={
                          applicantData?.application_details?.[
                            "cultural participation file"
                          ]?.["participation file"]
                        }
                        email={applicantData?.profile?.email}
                        phoneNumber={applicantData?.profile?.mobile}
                        gender={applicantData?.profile?.gender}
                        city={applicantData?.profile?.city}
                        cv={applicantData?.profile?.cv}
                        inspiration={applicantData?.profile?.inspiration_story}
                        instagram={applicantData?.profile.instagram}
                        linkedIn={applicantData?.profile.linkedin}
                        twitter={applicantData?.profile.twitter}
                        youtube={applicantData?.profile.youtube}
                        snapchat={applicantData?.profile.snapchat}
                        additional_files={
                          applicantData?.profile.additional_files
                        }
                        previousActivities={
                          applicantData?.application_details?.[
                            "social impact"
                          ]?.["work brief"]
                        }
                        previousWorkLink={
                          applicantData?.application_details?.[
                            "social impact"
                          ]?.["works"]
                        }
                        yearOfExecution={
                          applicantData?.application_details?.[
                            "cultural participation file"
                          ]?.["production date"]
                        }
                        age={applicantData?.profile?.age}
                        country={applicantData?.profile?.country}
                        publishingStatus={
                          applicantData?.application_details?.[
                            "cultural participation file"
                          ]?.["publishing status"]
                        }
                        workDocumentationNumber={
                          applicantData?.application_details?.[
                            "social impact"
                          ]?.["work documentation number"]
                        }
                        dateOfApplicant={
                          applicantData?.application_details?.[
                            "social impact"
                          ]?.["date of applicant won in the same track"]
                        }
                        numberOfInternational={
                          applicantData?.application_details?.[
                            "social impact"
                          ]?.["number of international participations"]
                        }
                        internationalParticipations={
                          applicantData?.application_details?.[
                            "social impact"
                          ]?.["international participations"]
                        }
                        community={
                          applicantData?.application_details?.[
                            "social impact"
                          ]?.["community and volunteer contributions"]
                        }
                        workDate={
                          applicantData?.application_details?.[
                            "social impact"
                          ]?.["work date"]
                        }
                        workLanguage={
                          applicantData?.application_details?.[
                            "social impact"
                          ]?.["work language"]
                        }
                        productionDate={
                          applicantData?.application_details?.[
                            "cultural participation file"
                          ]?.["production date"]
                        }
                        numberOfSales={
                          applicantData?.application_details?.[
                            "cultural participation file"
                          ]?.["Number of sales (copy)"]
                        }
                        numberOfTranslationLanguages={
                          applicantData?.application_details?.[
                            "cultural participation file"
                          ]?.["number of translation languages"]
                        }
                        translationLanguages={
                          applicantData?.application_details?.[
                            "cultural participation file"
                          ]?.["translation languages"]
                        }
                        localAndInternational={
                          applicantData?.application_details?.[
                            "cultural participation file"
                          ]?.["local and international literary influence"]
                        }
                        hasTheCandidateWonAwards={
                          applicantData?.application_details?.[
                            "social impact"
                          ]?.["Have the candidate won awards?"]
                        }
                        numberOfLocalParticipations={
                          applicantData?.application_details?.[
                            "social impact"
                          ]?.["number of local participations"]
                        }
                        localParticipations={
                          applicantData?.application_details?.[
                            "social impact"
                          ]?.["local participations"]
                        }
                        havePersonalWorksInCinemas={
                          applicantData?.application_details?.[
                            "social impact"
                          ]?.[
                            "Have personal works been shown in cinemas outside the Kingdom?"
                          ]
                        }
                        haveBeenShownInFestivals={
                          applicantData?.application_details?.[
                            "social impact"
                          ]?.["local participations"]
                        }
                        activityAndInfluence={
                          applicantData?.application_details?.[
                            "social impact"
                          ]?.[
                            "The activity and influence of the candidate on local programs and activities"
                          ]
                        }
                        ticketsSold={
                          applicantData?.application_details?.[
                            "cultural participation file"
                          ]?.["tickets sold"]
                        }
                        whatKindOfSupport={
                          applicantData?.application_details?.[
                            "cultural participation file"
                          ]?.[
                            "What kind of support is provided by private and non-profit organizations?"
                          ]
                        }
                        totalSupportReceived={
                          applicantData?.application_details?.[
                            "cultural participation file"
                          ]?.["total support received"]
                        }
                      />
                      <div className="px-2 flex flex-[2] flex-col h-full pb-2 ">
                        <h3
                          className={`sticky top-0 mb-4 bg-offwhite text-[40px] font-bold text-start flex flex-col`}
                        >
                          <span className="capitalize">{side_title}</span>
                          {(user_level === "PRIO" ||
                            user_type === "ADMIN|1") && (
                            <div className="w-full h-max px-2 flex flex-row capitalize !justify-between items-center text-center text-[1.2rem] bg-offwhite">
                              <p className="flex flex-row gap-x-2">
                                <span>
                                  {t(`${store.user_do.get_i18n_key()}.score`)}
                                </span>
                                <span>
                                  {user_type === "ADMIN|1"
                                    ? `${applicantData.filtering_score} | ${applicantData.judging_score}`
                                    : user_level === "PRIO"
                                    ? (user_type === "PRIO_FILTERER|5"
                                        ? applicantData.filtering_score
                                        : applicantData.judging_score) || 0
                                    : "unauthorized"}
                                </span>
                              </p>
                              <p>{title}</p>
                            </div>
                          )}
                        </h3>
                        <div className="flex w-full h-full  flex-col rounded-2xl bg-gray px-6 pt-8 !pb-5 overflow-y-auto">
                          {user_level === "TOP" ? (
                            <StageInputs
                              on_submit={onSubmit}
                              isSubmitError={isSubmitError}
                              isSubmitLoading={isSubmitLoading}
                              isUpdateScoringError={isUpdateScoringError}
                              submitError={submitError}
                              applicantData={applicantData}
                              stage={0}
                              weights={applicantData.track?.filtering_weights}
                              translation={scoring_translation?.filtering}
                            />
                          ) : (
                            <PrioInputs
                              scale={scale}
                              applications={item.applications}
                              title={title}
                              item={item}
                              scoring_translation={scoring_translation}
                              handleChangeProfile={change_profile}
                              activeProfile={applicantData}
                              track_id={track_id}
                              onSubmit={onSubmitPrio}
                              isSubmitError={isSubmitPrioError}
                              submitError={submitPrioError}
                              isSubmitLoading={isSubmitPrioLoading}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
