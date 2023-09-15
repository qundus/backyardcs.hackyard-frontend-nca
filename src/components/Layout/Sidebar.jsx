import Logo from "../../assets/logo.png";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { store } from "../../store/store";
import { SharedIcons } from "../Shared/icons";

const Sidebar = () => {
  const [is_open, set_is_open] = useState(true);
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  // console.log("params id is :: ", typeof id);
  if (!is_open)
    return (
      <div className={`pt-3 ${pathname === "/login" ? " !hidden " : ""}`}>
        <button onClick={() => set_is_open(true)}>
          <GiHamburgerMenu className=" h-8 w-8 text-white " />
        </button>
      </div>
    );

  if (is_open)
    return (

      <div
        className={`
        flex h-full max-w-[280px]  flex-col overflow-hidden  rounded-31px 
        border border-solid border-offwhite bg-primary px-8 pt-12 pb-6 
        font-inter text-offwhite  desktop:min-w-[345px] 
        ${pathname === "/login" ? " !hidden " : ""}
        `}>
        <div className="mb-4 flex flex-col items-start justify-between space-y-6 z-1 bg-primary">
          <button className={`${i18n.resolvedLanguage === "en" ? "self-end" : "self-start"}`} onClick={() => set_is_open(false)}>
            <AiOutlineClose className="ml-auto h-8 w-8" />
          </button>
          <img src={Logo} />
        </div>
        <div className="overflow-y-auto flex flex-col text-end items-end px-3 space-y-6 rounded-30px py-3">
          {
            store.tracks?.ornull && store.tracks?.ornull?.object?.ornull?.get({ noproxy: true }).map((item, i) => {
              // console.log("item id :: ", item.id, String(item.id) === id);
              const is_active = String(item.id) === id;
              return (
                <Link
                  ref={(el => {
                    if (el) {
                      if (is_active) {
                        el.focus();
                      }
                    }
                  })}
                  key={`route_${item.id}_${i}`}
                  to={`/${item.id}`}
                  tabIndex={i}
                  className={`w-full  flex flex-row gap-x-2 items-center text-center text-primary
                  text-2xl border-b-2 capitalize rounded-[10px] bg-offwhite px-2 py-1
                  hover:scale-105 transition-text ease-in-out duration-150 
                  ${i18n.language === "en" ? "" : "flex-row-reverse"}
                  ${is_active ? " font-inter font-bold capitalize !text-accent text-[1.5rem] " : "text-[1.3rem]"}
                  `}>
                  <SharedIcons award_id={item.id} clazz={`w-[20%] h-[60%]`} />
                  {i18n.language === "en" ? item.name_en : item.name_ar}
                </Link>
              );
            })
          }
        </div>
      </div>
    );
};
export default Sidebar;
