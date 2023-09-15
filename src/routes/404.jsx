import { useEffect } from "react";
import Logo from "../assets/logo.png";
import { useNavigate, useLocation } from "react-router";
import { store } from "../store/store";
import { useTranslation } from "react-i18next";
export function RouteNotFound() {
   const { t } = useTranslation();
   const navigate = useNavigate();
   const location = useLocation();
   const is_404 = location.pathname !== "/";
   // console.log("location state :: ", location);
   function redirect() {
      if (!store.token.access.ornull?.value) {
         navigate("/login");
      } else {
         navigate(store.route_do.get_default_track());
      }
   }

   useEffect(() => {
      if (!is_404) {
         redirect();
      } else {
         setTimeout(() => {
            redirect();
         }, 2750);
      }
   }, []);

   if (!is_404) {
      return null;
   }
   return (
      <section className="flex flex-col items-center justify-center w-screen h-screen bg-primary text-offwhite ">
         <img className="pb-20" src={Logo} alt="logo" />
         <p className="text-[2rem] text-accent">{t(`g.error_page`)}</p>
      </section>
   );
}