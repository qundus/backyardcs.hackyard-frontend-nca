import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { submitPrioApplication, getTracks } from "../../../helpers/api";
import LoadingIndicator from "../Shared/LoadingIndicator";
import ContestantApplicationInfo from "../EvaluationList/ContestantApplicationInfo";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import PrioInputs from "./PrioInputs";
import { transformArray } from "../../../helpers/helper_functions";
import React from "react";
import PrioQuestions from "./PrioQuestions";
import Cookies from "js-cookie";
import { parseJwt } from "../../../helpers/helper_functions";

const PrioDialog = ({
  isOpen,
  closeModal,
  translation,
  groupData,
  scale,
  activeProfile,
  setActiveProfile,
  isLoading,
  questionsTranslation,
}) => {
  const queryClient = useQueryClient();
  const { id: trackId } = useParams();
  const urlParams = new URLSearchParams(location.search);

  const judgeType = urlParams.get("type");
  const { data } = useQuery(["tracks"], getTracks);

  let type = Cookies.get("cookieToken");
  type = parseJwt(type);
  type = type.user_type;
  const filteredTrack = data?.object?.find((i) => i.id == trackId);
  const { t, i18n } = useTranslation();


  const handleChangeProfile = (index) => {
    setActiveProfile(index);
  };

  const translationValues = Object.keys(translation);

  const {
    mutate,
    isLoading: isSubmitLoading,
    error: submitError,
    isError: isSubmitError,
  } = useMutation(submitPrioApplication, {
    onSuccess(d, v, c) {
      queryClient.invalidateQueries(["prio-track-applications"]);
      closeModal();
    },
    onError(error) {
      console.log(error);
    },
  });

  const onSubmit = (d) => {
    let newData = transformArray(d.object);
    newData = newData
      .map((i) => {
        return { ...i, score: i.score.value };
      })
      .sort((a, b) => b.score - a.score);

    newData = { object: newData };

    mutate(newData);
  };
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
            <div className="flex h-full min-h-full flex-col  items-center py-10  px-10">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="ml-auto h-full w-full transform overflow-hidden rounded-2xl bg-offwhite p-14 shadow-xl transition-all">
                  <Dialog.Title
                    as="button"
                    className="mb-1 block rounded-full bg-accent px-3 pb-1 pt-[6px] text-3xl text-primary"
                    onClick={closeModal}
                  >
                    x
                  </Dialog.Title>
                  {
                    <div className="flex h-full  pb-[3.5rem]">
                      <ContestantApplicationInfo
                        participationFileAr={translation[translationValues[11]]}
                        participationFileEn={translationValues[11]}
                        name={groupData?.[activeProfile]?.profile?.user?.name}
                        workOverview={
                          groupData?.[activeProfile]?.application_details[
                          "cultural pariticipation file"
                          ]?.["cultural brief"]
                        }
                        trackNameAr={groupData?.[activeProfile]?.track.name_ar}
                        trackNameEn={groupData?.[activeProfile]?.track.name_en}
                        participationTitle={
                          groupData?.[activeProfile]?.application_details[
                          "cultural pariticipation file"
                          ]?.["participation title"]
                        }
                        participationFile={
                          groupData?.[activeProfile]?.application_details[
                          "cultural pariticipation file"
                          ]?.["participation file"]
                        }
                        email={groupData?.[activeProfile]?.profile?.email}
                        phoneNumber={
                          groupData?.[activeProfile]?.profile?.mobile
                        }
                        gender={groupData?.[activeProfile]?.profile?.gender}
                        city={groupData?.[activeProfile]?.profile?.city}
                        cv={groupData?.[activeProfile]?.profile?.cv}
                        inspiration={
                          groupData?.[activeProfile]?.profile?.inspiration_story
                        }
                        instagram={
                          groupData?.[activeProfile]?.profile?.instagram
                        }
                        linkedIn={groupData?.[activeProfile]?.profile?.linkedin}
                        twitter={groupData?.[activeProfile]?.profile?.twitter}
                        snapchat={groupData?.[activeProfile]?.profile?.snapchat}
                        previousActivities={
                          groupData?.[activeProfile]?.application_details[
                          "social impact"
                          ]?.["work brief"]
                        }
                        previousWorkLink={
                          groupData?.[activeProfile]?.application_details[
                          "social impact"
                          ]?.["works"]
                        }
                        yearOfExecution={
                          groupData?.[activeProfile]?.application_details[
                          "social impact"
                          ]?.["work date"]
                        }
                        age={groupData?.[activeProfile]?.profile?.age}
                        country={groupData?.[activeProfile].profile?.country}
                        publishingStatus={
                          groupData?.[activeProfile]?.application_details[
                          "cultural pariticipation file"
                          ]?.["publishing status"]
                        }
                        workDocumentationNumber={
                          groupData?.[activeProfile]?.application_details?.[
                          "social impact"
                          ]?.["work documentation number"]
                        }
                        dateOfApplicant={
                          groupData?.[activeProfile]?.application_details?.[
                          "social impact"
                          ]?.["date of applicant won in the same track"]
                        }
                        numberOfInternational={
                          groupData?.[activeProfile]?.application_details?.[
                          "social impact"
                          ]?.["number of international participations"]
                        }
                        internationalParticipations={
                          groupData?.[activeProfile]?.application_details?.[
                          "social impact"
                          ]?.["international participations"]
                        }
                        community={
                          groupData?.[activeProfile]?.application_details?.[
                          "social impact"
                          ]?.["community and volunteer contributions"]
                        }
                        workDate={
                          groupData?.[activeProfile]?.application_details?.[
                          "social impact"
                          ]?.["work date"]
                        }
                        productionDate={
                          groupData?.[activeProfile]?.application_details?.[
                          "cultural participation file"
                          ]?.["production date"]
                        }
                        numberOfSales={
                          groupData?.[activeProfile]?.application_details?.[
                          "cultural participation file"
                          ]?.["Number of sales (copy)"]
                        }
                        numberOfTranslationLanguages={
                          groupData?.[activeProfile]?.application_details?.[
                          "cultural participation file"
                          ]?.["number of translation languages"]
                        }
                        translationLanguages={
                          groupData?.[activeProfile]?.application_details?.[
                          "cultural participation file"
                          ]?.["translation languages"]
                        }
                        localAndInternational={
                          groupData?.[activeProfile]?.application_details?.[
                          "cultural participation file"
                          ]?.["local and international literary influence"]
                        }
                        workLanguage={
                          groupData?.[activeProfile]?.application_details?.[
                          "social impact"
                          ]?.["work language"]
                        }
                        hasTheCandidateWonAwards={
                          groupData?.[activeProfile]?.application_details?.[
                          "social impact"
                          ]?.["Have the candidate won awards?"]
                        }
                        numberOfLocalParticipations={
                          groupData?.[activeProfile]?.application_details?.[
                          "social impact"
                          ]?.["number of local participations"]
                        }
                        localParticipations={
                          groupData?.[activeProfile]?.application_details?.[
                          "social impact"
                          ]?.["local participations"]
                        }
                        havePersonalWorksInCinemas={
                          groupData?.[activeProfile]?.application_details?.[
                          "social impact"
                          ]?.[
                          "Have personal works been shown in cinemas outside the Kingdom?"
                          ]
                        }
                        haveBeenShownInFestivals={
                          groupData?.[activeProfile]?.application_details?.[
                          "social impact"
                          ]?.["local participations"]
                        }
                        activityAndInfluence={
                          groupData?.[activeProfile]?.application_details?.[
                          "social impact"
                          ]?.[
                          "The activity and influence of the candidate on local programs and activities"
                          ]
                        }
                        ticketsSold={
                          groupData?.[activeProfile]?.application_details?.[
                          "cultural participation file"
                          ]?.["tickets sold"]
                        }
                        whatKindOfSupport={
                          groupData?.[activeProfile]?.application_details?.[
                          "cultural participation file"
                          ]?.[
                          "What kind of support is provided by private and non-profit organizations?"
                          ]
                        }
                        totalSupportReceived={
                          groupData?.[activeProfile]?.application_details?.[
                          "cultural participation file"
                          ]?.["total support received"]
                        }
                        applicantData={groupData?.[activeProfile]}
                        translations={translation}
                      />
                      <div className="ml-9 flex flex-[2] flex-col overflow-y-auto pt-2 ">
                        <h3 className="mb-4  text-end text-[40px]  font-bold">
                          {i18n.language === "en"
                            ? "Prioritization"
                            : "المفاضلة"}
                        </h3>
                        {isOpen && !isLoading && (
                          <div className="flex h-full flex-col overflow-y-auto rounded-2xl bg-gray px-6 pt-8 pb-4">
                            <PrioQuestions
                              questions={
                                type === 5
                                  ? filteredTrack?.prio_filtering_weights
                                  : filteredTrack?.prio_judging_weights
                              }
                              questionsTranslation={questionsTranslation}
                            />
                            <form
                              className=" flex h-full flex-col"
                              onSubmit={handleSubmit(onSubmit)}
                            >
                              <PrioInputs
                                scale={scale}
                                data={groupData}
                                handleChangeProfile={handleChangeProfile}
                                activeProfile={applicantData}
                                isLoading={isLoading}
                              />
                              {isSubmitError && (
                                <span
                                  className={` mb-1 ${i18n.language === "en"
                                      ? "text-left"
                                      : "text-right"
                                    }  text-red-500`}
                                >
                                  {i18n.language === "en"
                                    ? "Duplicate Scores Are Not Allowed"
                                    : "لا يمكن تكرار أي تقييم" ||
                                    submitError?.response?.data?.details}
                                </span>
                              )}
                              <button
                                className="mx-auto  mt-auto mb-8 rounded-[25px] bg-accent px-6 pb-3 pt-4 text-xl font-bold text-primary"
                                type="submit"
                              >
                                {isSubmitLoading ? (
                                  <LoadingIndicator />
                                ) : i18n.language === "en" ? (
                                  "Submit"
                                ) : (
                                  "ارسال"
                                )}
                              </button>
                            </form>
                          </div>
                        )}
                      </div>
                    </div>
                  }
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default PrioDialog;
