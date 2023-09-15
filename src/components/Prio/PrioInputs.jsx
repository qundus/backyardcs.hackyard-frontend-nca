import { useEffect, useState } from "react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { findNumberIndex, split_text } from "../../../helpers/helper_functions";
import LoadingIndicator from "../Shared/LoadingIndicator";
import { store } from "../../store/store";

const PrioInputs = ({
  item,
  applications,
  scale,
  scoring_translation,
  handleChangeProfile,
  activeProfile,
  track_id,
  onSubmit,
  title,
  isSubmitError,
  submitError,
  isSubmitLoading,
}) => {
  const { t, i18n } = useTranslation();
  const [options, setOptions] = useState([{ value: -1, label: t("prioList.unordered") }]);
  const { register, resetField, trigger, getValues, handleSubmit, control, formState: { errors } } = useForm();
  const user_type = store.user_do.get_type();
  const track_details = store.tracks_do.get_details(track_id);
  let questions = undefined;
  const meta = {
    comment: item.comment
  };
  if (i18n.language === "ar") {
    questions = user_type === "PRIO_FILTERER|5" ? track_details?.prio_filtering_weights : track_details?.prio_judging_weights;
  } else {
    questions = user_type === "PRIO_FILTERER|5" ? scoring_translation?.prio_filtering : scoring_translation?.prio_judging;
  }

  useEffect(() => {
    let stuff = [options[0]];

    if (applications?.[0].reviewer_score === null) {
      scale.map((item) =>
        stuff.push({ value: item, label: findNumberIndex(scale, item) })
      );
    }
    // else {
    //   await getScores({ id: activeProfile?.score_id })
    //     .then((d) => {
    //       console.log("d :: ", d);
    //       setMeta(d);
    //     });
    // }

    setOptions(stuff);
  }, []);
  const modify_submit = (d) => {
    onSubmit(title, d);
  };
  return (
    <div className="!flex !flex-col justify-between w-full h-full !overflow-y-auto">
      <form
        // onChange={handleSubmit(() => { })}
        className={`
        flex flex-col w-full !h-max  mb-2  
        ${i18n.resolvedLanguage === "ar" ? "text-right" : "text-left"}
        `}>
        {/* questions */}
        <div
          className={`h-max mb-5
          flex flex-col gap-y-5 text-base text-primary
          ${i18n.language === "en" ? "text-left" : "text-right"}  
          `}>
          <p className="font-bold ">
            <span>{i18n.language === "en" ? "Prioritization Questions" : "أسئلة التفاضل"}</span>
          </p>
          {!questions || Object.keys(questions)?.length <= 0 ?
            <span className="capitalize font-normal">
              {t(`prioList.order_hint.no_qs`)}
            </span>
            : Object.values(questions).map((question, i) => {
              return (
                <span key={i} className="font-normal">
                  {question}
                </span>
              );
            })}
        </div>
        <div className="w-full h-max text-accent capitalize">
          {t("prioList.order_hint.high")}
          <span className="mx-3">1</span>
          {t("prioList.order_hint.low")}
          <span className="mx-3">{scale.length}</span>
        </div>
        <div
          className={`gap-x-7
          flex text-right flex-row rounded-[5px] px-2 py-2 items-center
          sticky top-0 border-primary border-[1.5px]  w-full h-max text-primary bg-offwhite !z-10
          ${i18n.language === "en" ? "!text-left" : ""}
          `}>
          <span className="flex-[5] w-full overflow-x-hidden capitalize">
            {t(`evaluationList.projectName`)}
          </span>
          <span className="flex-[2] w-full capitalize">
            {t(`prioList.order`)}
          </span>
        </div>
        {applications.sort((a, b) => getValues(String(b.id))?.value - getValues(String(a.id))?.value).map((a, i) => {
          const form_id = String(a.id);
          const value = getValues(form_id);
          const is_active = a.id === activeProfile.id;
          const is_ordered = value?.value !== -1;
          const error = errors[form_id];
          return (
            <div key={form_id} className="w-full h-max flex flex-row px-1 pt-3 gap-x-3">
              <div className="flex-[5] overflow-x-hidden ">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChangeProfile(i);
                  }}
                  className={`font-break truncate
                  text-right w-[100%]
                  font-normal text-lg font-bold rounded-15px px-2 py-1
                  translate-all duration-300 ease-in-out
                  ${i18n.resolvedLanguage === "en" && "!text-left"}
                  ${is_active ? " bg-accent " : " bg-primary opacity-70 text-offwhite"} 
                  `}>
                  {split_text(a.profile?.user?.name)}
                </button>
              </div>
              <div
                className={`
                w-full h-full flex-[2]
                `}>
                <Controller
                  name={form_id}
                  control={control}
                  rules={{
                    required: true,
                    validate: (value, all) => {
                      // console.log("value :: ", value, all);
                      if (value.value === -1) return false;
                      setOptions(s => {
                        const idx = s.findIndex(x => x?.label === value?.label);
                        delete s[idx];
                        // s[idx] = undefined;
                        // console.log("new options :: ", s);
                        return s;
                      });
                      return true;
                    },
                    onChange: (ev) => {
                      trigger(form_id);
                      // console.log("on change :: ", ev.target.value);
                    }
                  }}
                  defaultValue={
                    a?.reviewer_score || a?.reviewer_score == 0
                      ? {
                        label: findNumberIndex(scale, a?.reviewer_score),
                        value: a?.reviewer_score,
                      }
                      : options[0]
                  }
                  render={({ field: { onChange, value } }) => !is_ordered ?
                    <Select
                      options={options}
                      placeholder="Select"
                      className={`
                      w-full capitalize
                      ${error ? "border-2 border-red-500 focus:!animate-none animate-bounce " : ""}
                      `}
                      onChange={(newValue) => {
                        onChange(newValue);
                      }}
                      defaultValue={
                        a?.reviewer_score || a?.reviewer_score == 0
                          ? {
                            label: findNumberIndex(scale, a?.reviewer_score),
                            value: a?.reviewer_score,
                          }
                          : options[0]
                      }
                    /> :
                    <div
                      className="flex flex-row justify-between text-center w-full h-full items-center">
                      <span className="text-xl px-2 ">
                        {value.label}
                      </span>
                      <Icon
                        onClick={(e) => {
                          e.stopPropagation();
                          setOptions(s => {
                            const idx = scale.length - value?.label;
                            s.splice(idx + 1, 0, value);
                            // console.log("new options :: ", s);
                            return s;
                          });
                          a.reviewer_score = undefined;
                          resetField(form_id, { defaultValue: options[0], keepTouched: true });
                        }}
                        icon="solar:reorder-bold-duotone"
                        width={"1.7rem"}
                        className="text-red-500 pb-1 mx-3 !self-center cursor-pointer"
                      />

                    </div>
                  }
                />
              </div>
            </div>
          );
        })}
      </form>
      <div className="flex flex-col w-full h-max space-y-2 !my-5">
        <span className="capitalize">{t(`dialogInfo.comment`)}</span>
        <textarea
          {...register("comment", {
            required: false
          })}
          className="w-[98%] h-full font-normal min-h-[100%]"
          defaultValue={meta?.comment || undefined}
        />
      </div>
      <button
        onClick={handleSubmit(modify_submit)}
        className="mx-auto h-max my-5 rounded-[25px] bg-accent px-6 pb-3 pt-4 text-xl font-bold text-primary"
      >
        {isSubmitLoading ?
          <LoadingIndicator />
          : i18n.language === "en" ? "Submit" : "ارسال"
        }
      </button>
    </div>
  );
};

export default PrioInputs;
