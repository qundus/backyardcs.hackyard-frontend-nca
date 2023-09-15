import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { testToken } from "../../../helpers/api";
import { store } from "../../store/store";
import LoadingScreen from "./LoadingScreen";
export function Protected({ children }) {
  const [check_token, set_check_token] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!store.token_do.get()?.access) {
      navigate("/login", { replace: true });
      set_check_token(true);
    } else {
      testToken()
        .then(() => {
          if (store.user_do.get_first_login()) {
            navigate("/login", { replace: true });
          } else if (location.pathname.startsWith("/login")) {
            navigate(store.route_do.get_default_track());
          }
        })
        .catch((err) => {
          store.clear();
        })
        .finally(() => {
          set_check_token(true);
          // if (location.pathname.includes("login")) {
          //   console.log("dasd", store.route_do.to_track(1));
          //   navigate(store.route_do.to_track(1));
          // }
        });
    }
  }, []);

  // clean up url
  if (window.location.href.includes("?")) {
    window.location.href = window.location.href.split("?")[0];
  }

  return !check_token ? <LoadingScreen /> : children;
}
export default Protected;
