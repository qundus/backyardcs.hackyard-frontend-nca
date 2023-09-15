import axios from "axios";
import { store } from "../src/store/store";
const endpoints = {
  auth: {
    PARENT: "auth",
    login: "auth/token/",
    refresh: "auth/token/refresh/",
  },
  account: {
    reset: "account/password-update/",
  },
  track: {
    list: "track/list/",
  },
};

let lock_refresh = false;
const instance = axios.create({
  baseURL: import.meta.env.VITE_API,
  // withCredentials: true,
  headers: {
    // "accept": "*/*",
    // 'Referrer-Policy': 'no-referrer',
    // 'Access-Control-Allow-Origin': '**/*',
    // 'Access-Control-Allow-Methods': 'GET, POST,- PUT',
    // 'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    // 'Access-Control-Expose-Headers': 'Authorization',
    // "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json",
    // "Cross-Origin-Opener-Policy": "same-origin",
    // "X-Content-Type-Options": "nosniff"
  },
});

instance.interceptors.request.use(
  (config) => {
    // if (!config.url.endsWith("/")) config.url += "/";
    // config.timeout = 8000;
    config.headers["Content-Type"] = "application/json"; // 'application/x-www-form-urlencoded; charset=UTF-8'
    // config.headers["Access-Control-Allow-Origin"] = String(import.meta.env.VITE_API).replace("/api/", ""); // update with your domain
    // config.headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept";

    if (config.url.startsWith("auth/")) return config;
    else if (config.url.startsWith("statistics")) return config;
    if (!store.token_do.get().access)
      throw new axios.Cancel("token is undefiend or maybe unintialized");

    const token = store.token_do.get()?.access;
    config.headers["Authorization"] = "Bearer " + token; // for Spring Boot back-end
    // config.headers["x-access-token"] = token; // for Node.js Express back-end

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    if (!err?.config) return Promise.reject(err);

    const config = err.config;
    if (
      !config.url.startsWith(endpoints.auth.PARENT) &&
      err.response &&
      !lock_refresh
    ) {
      // Access Token was expired
      if (err.response.status === 401 && !config._retry && !lock_refresh) {
        console.log("should logout :: ");
        store.clear();
        return Promise.reject(err);
        lock_refresh = true;
        config._retry = true;

        try {
          await refresh_token().finally(() => {
            lock_refresh = false;
          });
          return instance(config);
        } catch (_error) {
          console.error("cannot refresh access token, logging out");
          return Promise.reject(err);
        }
      }
    }
    return Promise.reject(err);
  }
);

export const refresh_token = async () => {
  const refresh_token = store.token_do.get().refresh;
  if (!refresh_token)
    return Promise.reject("token is undefiend or maybe unintialized");
  console.log("access token expired, refreshing.. ");
  return instance
    .post(endpoints.auth.refresh, { refresh: refresh_token })
    .then(async (res) => {
      await store.token_do.set(res.data);
      console.log("access token refreshed!");
      return res.data;
    })
    .catch((err) => {
      // console.log("error refreshing token :: ", err);
      return Promise.reject(err);
    });
};

export const login = async (data, reset_pass) => {
  return (
    !reset_pass
      ? instance.post(endpoints.auth.login, data)
      : instance.put(endpoints.account.reset, data)
  ).then(async (response) => {
    if (!reset_pass) {
      await store.token_do.set(response.data);
      // console.log("response data :: ", response.data);
    }
    const user = store.user_do.get();

    if (reset_pass) user.first_login = false;
    if (!user.first_login) {
      await getTracks();
      await getSettings();
    }
    return user;
  });
};

export const testToken = async () => {
  return getTracks(true);
};

export const getTracks = async (testing) => {
  return instance.get(endpoints.track.list).then(async (response) => {
    /** @type {Array<{id}>} */
    const tracks = response.data.object;
    if (tracks && tracks.length > 0) {
      const sorted_tracks = tracks.sort((a, b) => a.id - b.id);
      response.data.object = sorted_tracks;
    }
    store.tracks.set(response.data);
    if (testing) {
      await getSettings();
    }
    return response.data;
  });
};
/**
 *
 * @param {"filtering" | "judging"} sub_endpoint
 * @returns
 */
export const getStatistics = async (sub_endpoint) => {
  const res = await instance.get(`statistics/${sub_endpoint}/`);
  return res.data;
};

export const getSettings = async () => {
  const response = await instance.get(`setting/list/`);
  store.settings.set(response.data);
  return response.data;
};

export const getScores = async ({ id }) => {
  const response = await instance.get(`scoring/details/${id}`);
  return response.data;
};

export const getTrackApplications = async (id) => {
  const response = await instance.get(`track/details/${id}/`);
  // response.data.object = order_apps(response);
  return response.data;
};

export const getCandidateProfile = async (id) => {
  const response = await instance.get(`profile/details/${id}/`);
  return response.data;
};

export const getCandidateApplication = async (id) => {
  const response = await instance.get(`profile/details/${id}/`);
  return response.data;
};

export const submitCandidateApplication = async (data) => {
  const response = await instance.post(`scoring/list/`, data);
  return response.data;
};

export const updateCandidateApplication = async ({ data, id }) => {
  const response = await instance.put(`scoring/details/${id}/`, data);
  return response.data;
};

function order_apps(id, response) {
  const apps_order = store.tracks_do.get_apps_order(id);

  if (!apps_order) return response.data.object;

  /** @type {Array<{id: string}>} */
  const apps = response.data.object;
  let pos = 0;
  Object.keys(apps_order).forEach((key, i) => {
    const order = apps_order[key];
    order?.forEach((id) => {
      const idx = apps.findIndex((x) => x.id === id);
      if (idx >= 0) {
        const temp = apps[pos];
        apps[pos] = apps[idx];
        apps[idx] = temp;
        pos++;
      } else {
        console.log("cannot find id to order :: ", id);
      }
    });
  });
  return apps;
}

export const getApplications = async ({ id, search }) => {
  let response = undefined;
  const user_level = store.user_do.get_level();
  search = !search ? "" : `&search=${search}`;
  if (user_level === "TOP") {
    response = await instance.get(`application/list/?track=${id}${search}`);
    response.data.object = order_apps(id, response);
  } else {
    response = await instance.get(`scoring/prio/list/?track=${id}${search}`);
    // console.log("got prio applications :: ", response.data);
  }

  return response?.data;
};

export const getTrackDetails = async (id) => {
  const response = await instance.get(`track/details/${id}/`);
  return response.data;
};

export const getPrioApplications = async ({ id, search }) => {
  search = !search ? "" : `&search=${search}`;
  const response = await instance.get(
    `scoring/prio/list/?track=${id}${search}`
  );
  // console.log("got prio applications :: ", response.data);
  return response.data;
};

export const getPrioDetails = async (id) => {
  const response = await instance.get(`scoring/prio/details/${id}/`);
  return response.data;
};

export const submitPrioApplication = async (data) => {
  const response = await instance.post(`scoring/prio/group/scoring/`, data);
  return response.data;
};

export const updatePrioApplication = async ({ data: data, id: id }) => {
  const response = await instance.put(`scoring/prio/details/${id}/`, {
    prio_filtering_score: data,
  });
  return response.data;
};

export const getPrioScore = async (id) => {
  const response = await instance.get(`scoring/prio/details/${id}/`);
  return response.data;
};
