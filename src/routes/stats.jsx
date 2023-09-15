import { useEffect, useState } from "react";
import { getStatistics } from "../../helpers/api";
import LoadingIndicator from "../components/Shared/LargeLoadingIndicator";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SharedIcons } from "../components/Shared/icons";
import LanguageSwitch from "../components/Shared/LanguageSwitch";

export function StatsPage() {
   /** @type {["filtering" | "judging"]} */
   const [sub_endpoint, set_sub_endpoint] = useState("filtering");
   /** @type {[[key: string, value: {name: string, done: number, total: number, evaluations_status: string}][]]} */
   const [data, setData] = useState();
   const judging_key = useState(data?.keys?.[0]);
   const { t, i18n } = useTranslation();
   const navigate = useNavigate();
   const per_row = 4;
   const timer_max = 15;
   const [timer, setTimer] = useState(timer_max);

   async function getData() {
      return getStatistics(sub_endpoint)
         .then((data) => setData(sub_endpoint === "filtering" ? Object.entries(data) : { keys: Object.keys(data), data }))
         .catch((err) => console.log("error: couldn't fetch statistics", err));
   }
   useEffect(() => {
      setTimeout(async () => {
         // === 0 to prevent timer fluctuations under 0 in timeouts
         if (data === undefined) {
            // request api every 2seconds to update page since no sockets
            await getData();
            setTimer(s => s - 1);
         } else if (timer === 0) {
            getData();
            setTimer(timer_max);
         } else {
            if (timer > 0)
               setTimer(s => s - 1);
         }
      }, 1000);
   }, [timer]);
   return (
      <main dir="rtl" className="flex flex-col w-full h-full px-3 py-5 items-center justify-center">
         <div className="absolute top-5 !self-start right-[125px]">
            <LanguageSwitch />
         </div>
         {/* top */}
         <section className="flex flex-col justify-center items-center w-full h-max space-y-5">
            <img src="/logo.png" alt="nca_logo" className="w-[14%]" />
            <h1 className="text-3xl font-bold text-accent">{t(`stats.title`)}</h1>
            <div
               className="relative flex flex-row items-center gap-x-6 bg-offwhite !w-max !min-w-max h-max rounded-[15px] px-3 py-1"
            >
               {["filtering", `judging`].map((text, i) => {
                  return (
                     <p
                        key={i}
                        onClick={() => { set_sub_endpoint(text); setData(undefined); }}
                        className={`
                        transition-all duration-300 ease-in-out
                        bg-gray text-primary text-[1.2rem] text-center !self-center px-4 py-1
                        font-bold !min-w-[6rem] !w-[6rem] !h-max !min-h-max rounded-[20px]
                        ${text === sub_endpoint ? "cursor-none !bg-accent" : "cursor-pointer"}
                        `}
                     >
                        {t(`stats.${text}`)}
                     </p>
                  );
               })}
            </div>
         </section>
         {/* awards cards */}
         <section className="flex flex-row flex-wrap w-[90%] h-full items-center justify-between !px-[1.7rem] py-4 my-5 bg-offwhite rounded-30px gap-y-10 gap-x-2 overflow-y-auto">
            {
               data === undefined ?
                  <LoadingIndicator /> :
                  sub_endpoint === "filtering" ?
                     display_filtering({ data, navigate }) :
                     display_judging({ data, navigate, judging_key, i18n, t })
            }
         </section>
         <div
            className={`
            text-white w-max h-max flex flex-row items-center justify-center gap-x-3 capitalize
            ${i18n.resolvedLanguage === "en" ? "flex-row-reverse" : ""}
            `}>
            <span>{t(`stats.auto_update`)}</span>
            <span>{timer}</span>
         </div>
      </main>
   );
}

function display_judging({ data, navigate, judging_key, i18n, t }) {
   const [activeKey, setActiveKey] = judging_key;
   if (activeKey === undefined) {
      console.log("resetting active key :: ");
      setActiveKey(data.keys[0]);
      return null;
   }
   const keys = data.keys;
   const users = activeKey === undefined ? undefined : Object.entries(data.data[activeKey]);
   const clazzes = [
      "w-full whitespace-nowrap",
      "w-[5rem]",
      "w-[5rem]",
      "w-[5rem]",

   ];
   const indicators_base_clazz = "!w-[10rem] !min-w-fit !h-max  h-max rounded-[18px] px-4 py-1 text-center ";
   const indicators_green = "!bg-green-500";
   const indicators_yellow = "!bg-cyan-500";
   const indicators_red = "!bg-red-500";
   return (
      <section className={`flex flex-row w-full h-full gap-x-4 overflow-hidden
      ${i18n.resolvedLanguage === "en" ? "flex-row-reverse" : ""}
      `}>
         <div
            className="flex flex-col !w-fit !min-w-fit h-full gap-y-2 overflow-y-auto px-2"
         >
            {keys.map((key, i) => {
               return (
                  <p
                     key={i}
                     onClick={() => { setActiveKey(key); }}
                     className={`
                        transition-all duration-300 ease-in-out 
                        bg-gray text-primary text-[1.2rem] text-start px-4 py-1 whitespace-nowrap
                        font-bold !w-full !h-max !min-h-max rounded-[20px]
                        ${key === activeKey ? "cursor-none !bg-accent" : "cursor-pointer"}
                        `}>
                     {key}
                  </p>
               );
            })}
         </div>
         <div className="flex flex-col w-full h-full gap-y-2 text-start">
            <div
               className={`
               flex flex-row w-[99%] h-max !bg-gray !z-100 !opacity-100 capitalize items-center gap-x-5 px-5 py-1 rounded-[10px] text-[1.2rem] 
               ${i18n.resolvedLanguage === "en" ? "!flex-row-reverse text-end" : "text-start"}
               `}>
               <span className={clazzes[0]}>{t(`stats.user`)}</span>
               <span className={clazzes[1]} >{t(`stats.total`)}</span>
               <span className={clazzes[2]} >{t(`stats.done`)}</span>
               <span className={clazzes[3]} >{t(`stats.percent`)}</span>
            </div>
            <div
               className={`
               flex flex-col w-[99%] h-max overflow-y-auto items-center gap-y-2 text-[1.2rem]
               ${i18n.resolvedLanguage === "en" ? "text-end" : "text-start"}
               `}>
               {users?.map(([user, d], i) => {
                  const name = `${activeKey}_${i}`;
                  const percent = d.total === 0 ? 0 : ((Number.parseInt(d.done) / Number.parseInt(d.total))?.toFixed(1) || 0) * 100;
                  let percent_clazz = "bg-accent";
                  if (percent > 0) {
                     if (percent < 50) percent_clazz = indicators_red;
                     else if (percent < 100) percent_clazz = indicators_yellow;
                     else percent_clazz = indicators_green;
                  }
                  return (
                     <div
                        key={name}
                        className={`
                        flex flex-row !w-full items-center gap-x-5 px-5 py-1 rounded-[10px] text-[1.2rem] text-start
                        hover:!bg-gray
                        ${percent_clazz}
                        ${i18n.resolvedLanguage === "en" ? "flex-row-reverse text-end" : "text-start"}
                        `}>
                        <span className={clazzes[0]}>{user}</span>
                        <span className={clazzes[1]}>{d.total}</span>
                        <span className={clazzes[2]}>{d.done}</span>
                        <span className={clazzes[3]}>{percent}%</span>
                     </div>
                  );
               })}
            </div>
            <div
               className={`capitalize
               flex flex-row w-[99%] h-max !bg-gray !items-center justify-center gap-x-5 px-5 py-1 rounded-[10px] text-[1.2rem] text-start
               ${i18n.resolvedLanguage === "en" ? "flex-row-reverse text-end" : "text-start"}
               `}>
               <span className={`${indicators_base_clazz} ${indicators_green}`}>100% {t(`stats.done`)} </span>
               <span className={`${indicators_base_clazz} ${indicators_yellow}`}>{">"}50% {t(`stats.half_done`)} </span>
               <span className={`${indicators_base_clazz} ${indicators_red}`}>{"<"}50% {t(`stats.less_than_half_done`)} </span>
               <span className={`${indicators_base_clazz} bg-accent`}>0% {t(`stats.not_started`)} </span>
            </div>
         </div>
      </section>
   );
}

function display_filtering({ data, navigate }) {
   return data?.map(([key, value], i) => {
      let percentage = (((value.done / value.total) || 0) * 100).toFixed(2);
      const style = `
      text-[1.2rem] font-bold before:ml-5
      text-white 
      `;
      const style2 = `before:content-[':'] before:mx-2 before:text-white font-bold whitespace-nowrap`;
      return (
         <div
            key={`award_card_${i}`}
            onClick={() => navigate("/" + key)}
            className={`
            flex flex-col
            w-[19vw] h-[19vw] min-h-[50%] !overflow-hidden rounded-30px bg-accent shadow-primary 
            transition-all duration-422 ease-in-out cursor-pointer
            border-2 border-primary
            hover:!shadow-[0_4px_14px_rgba(0,0,0,0.5)] hover:scale-105 hover:border-accent
            drop-shadow-[0_14px_5px_rgba(0,0,0,0.2)]
            text-center items-center text-primary pt-8 pb-9 px-2 justify-between
            `}>
            <div className="flex flex-col w-full h-max items-center justify-between !text-base gap-y-8">
               <SharedIcons award_id={key} clazz={"w-[5vw] h-[5vw]"} />
               <h1 className={`w-full h-max text-[1.6rem]`}>{value.name}</h1>
            </div>
            <div className=" w-full h-max flex flex-col  text-start  grid grid-cols-[max-content,1fr] ">
               <span className={style}>النسبة</span><span className={style2}>{`${percentage} %`}</span>
               <span className={style}>انتهى</span><span className={style2}>{value.done}</span>
               <span className={style}>المجموع</span><span className={style2}>{value.total}</span>
               {/* <span className={style}>الحالة</span><span className={style2}>{value.evaluations_status}</span> */}
            </div>
         </div>
      );
   });
}