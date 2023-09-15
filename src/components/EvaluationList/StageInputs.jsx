import React from "react";
import LoadingIndicator from "../Shared/LoadingIndicator";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { getScores } from "../../../helpers/api";
import { useState } from "react";
import { useLayoutEffect } from "react";

const StageInputs = ({
  weights,
  translation,
  applicantData,
  on_submit,
  isSubmitError,
  isUpdateScoringError,
  isSubmitLoading,
  submitError,
}) => {
  // If stage === 0, it's on screening
  const { t, i18n } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    getFieldState,
    getValues,
    trigger,
    setFocus,
    formState,
  } = useForm();
  const [data, setData] = useState();
  const scores = data?.scores;

  const titles = Object.keys(weights);
  const questions = [];
  titles.forEach((title, i) => {
    questions.push(Object.keys(weights[title]));
  });

  useLayoutEffect(() => {
    if (applicantData?.score_id) {
      getScores({ id: applicantData?.score_id }).then((d) => {
        if (d?.scores) {
          const _scores = d.scores;
          const _comment = d.comment;
          const reset_values = {
            comment: _comment,
          };
          titles.forEach((title, i) => {
            reset_values[i] = [];
            questions[i].forEach((question, j) => {
              reset_values[i].push(_scores[title]?.[question]);
            });
          });
          reset(reset_values);
        }
        setData(d);
      });
    }
  }, []);

  if (!weights || applicantData.score_id === undefined) {
    return <section>no weights or applicant id</section>;
  }

  /** @param {Array<Array<number>>} obj */
  async function modify_on_submit(obj) {
    const arr = Object.keys(obj);
    const result = {};
    const meta = {};
    arr.forEach((title_i) => {
      const title = titles[title_i];
      if (!title) {
        meta[title_i] = obj[title_i];
      } else {
        const quetions_arr = questions[title_i];
        result[title] = {};
        obj[title_i].forEach((value, i) => {
          const question = quetions_arr[i];
          result[title][question] = value;
        });
      }
    });
    on_submit({ scores: result, meta });
  }
  let questions_count = 1;
  let form_keys = {};
  return (
    <form
      // onChange={handleSubmit(() => { })}
      onSubmit={handleSubmit(modify_on_submit)}
      className="flex flex-col w-full h-max space-y-10 mb-2 "
    >
      {titles.map((title, title_i) => {
        const title_questions = questions[title_i];
        return (
          <main
            key={`stage_inputs_in_array_form_${title_i}`}
            className=" flex flex-col capitalize !w-full !h-max "
          >
            <h3
              className={`w-full h-full
                flex flex-row !items-center !justify-between
                `}
            >
              <p className="!w-max !min-w-max ">
                {i18n.language === "en"
                  ? translation?.[title] || "unknown title"
                  : title || "عنوان غير معروف"}
              </p>
              <div className="w-[50%] !h-[0.1vh] bg-primary" />
            </h3>
            {/* <div className="" /> */}

            {title_questions.map((question, question_i) => {
              const form_key = `${title_i}.${question_i}`;
              const focus_index = questions_count++;
              // const focus_index = Number.parseInt(`${title_i}${question_i}`);
              const default_score = scores?.[title]?.[question]; //|| weights[title]?.[question];
              const max_score = weights[title][question];
              const error = formState.errors?.[title_i]?.[question_i];
              const qs = question.split("$$");
              const reg = register(form_key, {
                min: 0,
                max: max_score,
                required: true,
                onChange: async () => {
                  const no_errors = await trigger(form_key);
                  if (no_errors) {
                    const { isTouched } = getFieldState(form_key, formState);
                    if (isTouched && max_score < 10) {
                      // focus_set = focus_index + 1;
                      const next_focus = form_keys[focus_index + 1];
                      setFocus(next_focus, { shouldSelect: true }); // must set tabIndex={}
                    }
                  } else {
                    // console.log("trigger not");
                  }
                },
              });

              form_keys[focus_index] = form_key;
              // console.log("max is ", form_key, focus_index);
              return (
                <section
                  key={`stage_inputs_in_array_form_question_${question_i}`}
                  className={`flex flex-col !w-full !h-max
                    ${question_i > 0 ? "mt-10" : "mt-5"}
                    `}
                >
                  {/* question and value */}
                  <div className=" flex flex-col flex-[5] !w-full !h-max !items-center !justify-between gap-x-4">
                    {/* question */}
                    <p
                      className={`
                      flex flex-col text-justify font-normal text-primary 
                      w-full !h-max 
                      `}
                    >
                      {qs.map((q, i) => {
                        const v =
                          i18n.language === "en"
                            ? translation?.[q] || "unknown question"
                            : q || "سؤال غير معروف";
                        const non_primary_clazz = `border-accent first-letter:text-black ${
                          i18n.language === "en"
                            ? "border-l-2  pl-2"
                            : "border-r-2  pr-2"
                        }`;
                        return (
                          <span
                            key={i}
                            className={`first-letter:font-bold ${
                              i === 0
                                ? "first-letter:text-accent"
                                : non_primary_clazz
                            }`}
                          >
                            {v}
                          </span>
                        );
                      })}
                    </p>
                    {/* score */}
                    <div className="flex flex-row w-full h-max mt-1 gap-x-2 !self-end items-center justify-end">
                      <input
                        {...reg}
                        tabIndex={focus_index}
                        type="number"
                        defaultValue={default_score}
                        translate="yes"
                        className={`
                            !w-[70px]  rounded-[.5rem]  pt-1
                            !text-center font-normal outline-none 
                            !border-2 
                            ${
                              error
                                ? "!border-red-500 focus:!border-red-500 focus:!animate-none animate-ping "
                                : " focus:!border-accent "
                            }
                            `}
                      />
                      <span
                        className={`w-[8%]
                          flex flex-row items-center justify-between whitespace-nowrap pt-2 text-xl font-medium text-primary
                          ${error ? "animate-bounce text-red-500" : ""}
                          `}
                      >
                        <span>/</span>
                        <span className="!self-center w-[1vw]">
                          {max_score}
                        </span>
                      </span>
                    </div>
                  </div>
                </section>
              );
            })}
          </main>
        );
      })}
      <div className="flex flex-col w-full h-max space-y-2 !mb-5">
        <span>{t(`dialogInfo.comment`)}</span>
        <textarea
          {...register("comment", {
            required: false,
          })}
          className="w-full h-full font-normal min-h-[100%]"
          defaultValue={data?.comment || undefined}
        />
      </div>
      <button
        className="mx-auto flex h-max items-center  justify-center rounded-[25px] bg-accent px-6 pb-3 pt-4 text-center text-xl font-bold text-primary"
        type="submit"
      >
        {isSubmitLoading ? (
          <LoadingIndicator />
        ) : i18n.language === "en" ? (
          "Submit"
        ) : (
          "إرسال"
        )}
      </button>
    </form>
  );
};
export default StageInputs;
