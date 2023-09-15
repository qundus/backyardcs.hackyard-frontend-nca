import { useEffect } from "react";
import { useHookstate } from "@hookstate/core";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login";
import Layout from "./components/Layout/Layout";
import Protected from "./components/Shared/Protected";
import { store } from "./store/store";
import EvaluationList from "./components/EvaluationList/EvaluationList";
import { RouteNotFound } from "./routes/404";
import { StatsPage } from "./routes/stats";
import LoadingScreen from "./components/Shared/LoadingScreen";
import { useLocation, useNavigate } from "react-router-dom";
import "./app.css";
import "./index.css";
import "../i18n";
export function App() {
  const app_state = useHookstate(store.app_state);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // refresh_token() // test only
  }, []);

  // console.log("run  main :: ", app_state.get({ noproxy: true }));

  if (app_state.get() === "init") {
    store.app_state_do.init();
    return <LoadingScreen />;
  } else if (app_state.get() === "login" && location.pathname !== "/login") {
    navigate("/login", { replace: true });
    store.app_state.set("run");
  }

  return (
    <Routes>
      <Route element={<RouteNotFound />} />
      <Route
        path="/:id"
        element={
          <Protected>
            <Layout>
              <EvaluationList />
            </Layout>
          </Protected>
        }
      />
      <Route path="/stats" element={<StatsPage />} />

      <Route
        path="/login"
        element={
          <Protected>
            <Login />
          </Protected>
        }
      />
    </Routes>
  );
}
