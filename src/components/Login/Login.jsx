import React, { useEffect } from "react";
import Logo from "../../assets/logo.png";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { login } from "../../../helpers/api";
import LoadingIndicator from "../Shared/LoadingIndicator";
import { useTranslation } from "react-i18next";
import { store } from "../../store/store";
import { useHookstate } from "@hookstate/core";
import LanguageSwitch from "../Shared/LanguageSwitch";
import { Icon } from "@iconify/react";

const Login = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    reset,
    trigger,
    setError,
    formState: { errors },
  } = useForm();
  const q_state = useHookstate(undefined);
  const totp = useHookstate(false);
  const totp_secret = useHookstate(undefined);
  const form_keys = useHookstate(
    !store.user_do.get_first_login()
      ? ["username", "password"]
      : ["password", "password2"]
  );
  const reset_pass = form_keys.value[0] !== "username";
  const show_pass = useHookstate(false);
  const clazz_focus =
    "border-solid shadow outline-none border-1 border-primary focus:!border-blue";
  const onSubmit = async (ev) => {
    if (q_state.promised) return;
    ev.preventDefault();
    const valid = await trigger(null, { shouldFocus: true });
    const data = { ...getValues(), totp_secret: totp_secret.value };
    // console.log("q_state :: ", q_state.ornull?.value);
    if (data.totp_code && q_state.ornull?.value.totp_code === data.totp_code) {
      setError("totp_code", { message: t(`login.error.same_totp`) });
      return;
    }
    if (!valid) return;
    q_state.set(
      login(data, reset_pass)
        .then(async (data) => {
          if (data?.first_login) {
            form_keys.set(["password", "password2"]);
            reset({
              password: undefined,
              password2: undefined,
            });
            if (totp.ornull?.value) totp.set(false);
          } else {
            navigate(store.route_do.get_default_track());
          }
          return undefined;
        })
        .catch((err) => {
          reset(data);
          // console.log("err :: ", err);
          const message =
            err?.response?.data?.details || err?.response?.data?.detail;
          const status = err?.response?.data?.status;
          if (status) {
            // data.totp_secret = totp_secret.value;
            if (status >= 100 && status < 200) {
              // console.log("set totp to ", err?.response?.data);
              totp_secret.set(err?.response?.data?.totp_secret);
              totp.set(true);
              if (status !== 100) {
                setError("totp_code", { message: t(`login.error.wrong_totp`) });
              }
              if (status === 105) {
                setError("totp_code", { message: t(`login.error.new_totp`) });
              }
            }
            return { totp_code: data.totp_code };
          } else {
            setError("g", { message });
          }
          return undefined;
        })
    );
  };

  const on_show_password = () => {
    show_pass.set(!show_pass.value);
  };

  return (
    <div className="mx-auto flex flex-col w-full h-full !items-center !justify-center">
      <div className="absolute top-5 right-[150px]">
        <LanguageSwitch />
      </div>
      <div className="!self-center mx-5 flex w-[600px]  flex-col items-center justify-center rounded-15px border border-offwhite  py-28 px-20 font-inter text-offwhite">
        <div className="flex items-center justify-center w-full bg-primary py-5 !rounded-30px">
          <img src={Logo} className=" " />
        </div>
        <span className="mb-16 text-center text-4xl font-medium">
          {t(`login.${!reset_pass ? "header" : "headerReset"}`)}
        </span>

        <form className="w-full ">
          <div className="w-full h-[30%] !max-h-[10vh] flex flex-col justify-end">
            {errors[form_keys.value[0]] && (
              <p className="pb-2 text-right font-inter text-xl text-red-500">
                {errors[form_keys.value[0]]?.message?.toString()}
              </p>
            )}
            <input
              {...register(form_keys.value[0], {
                required: t(
                  `login.error.${
                    !reset_pass ? "username_required" : "password_required"
                  }`
                ),
              })}
              type={
                !reset_pass ? "email" : show_pass.value ? "text" : "password"
              }
              placeholder={t(
                `login.${
                  !reset_pass ? "usernamePlaceholder" : "passwordPlaceholder"
                }`
              )}
              name={form_keys.value[0]}
              id={form_keys.value[0]}
              defaultValue={
                import.meta.env.DEV && !reset_pass
                  ? // testing
                    // "filtration@hackyard.io"
                  "filterer@hackyard.io"
                    // "prio.filterer@hackyard.io"
                    // "kawthar@hackyard.io"
                    // "literature@hackyard.io"
                    // "admin@gmail.com"
                    // "prio.filterer@hackyard.io"
                    // "judge@hackyard.io"
                    // "prio.judge@hackyard.io"
                    : undefined
              }
              className={`
              border-1 mb-6 max-h-[44px] w-full rounded-lg py-3 px-4 
              font-inter text-primary 
              ${clazz_focus}
              ${i18n.resolvedLanguage === "en" ? "text-left" : "text-right"}
            `}
            />
          </div>
          <div className=" w-full h-[50%] !max-h-[10vh] flex flex-col justify-end">
            {errors[form_keys.value[1]] && (
              <p className="pb-2 text-right font-inter text-xl text-red-500">
                {errors[form_keys.value[1]]?.message?.toString()}
              </p>
            )}
            <input
              {...register(form_keys.value[1], {
                required: t(
                  `login.error.${
                    !reset_pass
                      ? "password_required"
                      : "password_confirm_required"
                  }`
                ),
                validate: (val) => {
                  if (reset_pass && watch(form_keys.value[0]) !== val) {
                    return t(`login.error.password_mismatch`);
                  }
                },
              })}
              placeholder={t(
                `login.${
                  !reset_pass
                    ? "passwordPlaceholder"
                    : "passwordConfirmPlaceholder"
                }`
              )}
              name={form_keys.value[1]}
              id={form_keys.value[1]}
              type={show_pass.value ? "text" : "password"}
              defaultValue={
                import.meta.env.DEV & !reset_pass
                  ? // testing
                    "vision_123"
                  : // "sadsad"
                    // "kaHack_4045"
                    // "hF&dsE_7$ersf"
                    // "hackyard_123"
                    // "Sultan1234"
                    undefined
              }
              className={`
              mb-6 max-h-[44px] w-full rounded-lg py-3 px-4 
              font-inter text-primary
              ${clazz_focus}
              ${i18n.resolvedLanguage === "en" ? "text-left" : "text-right"}  
              `}
            />
            {/* show pass */}
            <Icon
              className="cursor-pointer  !self-start text-[1.5rem]"
              onClick={on_show_password}
              icon={show_pass.value ? "bi:eye-fill" : "bi:eye-slash-fill"}
            />
          </div>
          {totp.get() && (
            <div className=" w-full h-[50%] !max-h-[10vh] flex flex-col justify-end">
              {errors["totp_code"] && (
                <p className="pb-2 text-right font-inter text-xl text-red-500">
                  {errors["totp_code"]?.message?.toString()}
                </p>
              )}
              <input
                {...register("totp_code", {
                  validate(val) {
                    const length = 6;
                    if (!val || val.length <= 0) {
                      return i18n.resolvedLanguage === "en"
                        ? "TOTP is required"
                        : "كود توقيتي مطلوب";
                    } else if (val.length < length || val.length > length) {
                      return i18n.resolvedLanguage === "en"
                        ? "TOTP is exactly 6 numbers"
                        : "كود توقيتي يتكون من 6 ارقام";
                    }
                  },
                })}
                placeholder={"TOTP Code"}
                name="totp_code"
                id="totp_code"
                type="text"
                className={`
                border-1 mb-6 max-h-[44px] w-full rounded-lg py-3 px-4 
                font-inter text-primary 
                ${clazz_focus}
                ${i18n.resolvedLanguage === "en" ? "text-left" : "text-right"}
                `}
              />
            </div>
          )}
          {errors["g"] && (
            <p className="mb-4 !mt-6 text-right font-inter text-xl text-red-500">
              {errors["g"]?.message?.toString()}
            </p>
          )}
          <button
            onClick={onSubmit}
            disabled={q_state.promised}
            className="mt-8 w-full rounded-15px border border-offwhite bg-primary py-4 text-base font-bold text-offwhite transition-all hover:opacity-80"
          >
            {q_state.promised ? (
              <LoadingIndicator />
            ) : (
              t(`login.${!reset_pass ? "button" : "buttonReset"}`)
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
