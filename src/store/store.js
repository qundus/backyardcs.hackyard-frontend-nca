import { hookstate } from "@hookstate/core";
import { parseJwt } from "../../helpers/helper_functions";
import Cookies from "js-cookie";
import { db } from "./db.store";

// stores
const app_state = hookstate("init");
const tracks = hookstate({
  object: undefined,
  history: undefined,
});

const token = hookstate({
  access: undefined,
  refresh: undefined,
});

const user = hookstate(undefined);
const settings = hookstate(undefined);

// methods
const remove_token = () => {
  token.set({ access: undefined, refresh: undefined });
  user.set(undefined);
  try {
    const tokens = db.tokens();
    tokens.delete();
  } catch (e) {
    console.error("tokens db is not initialized, cannot delete token");
  }
};

const set_token = async (data) => {
  const { access, refresh } = data;
  const encObj = await db.encrypt(data);
  token.set({ access, refresh });
  user.set(parseJwt(access));

  try {
    const tokens = db.tokens();
    // tokens.put({ id: 1, token: encObj });
    tokens.put(encObj);
  } catch (e) {
    console.error("tokens db is not initialized, cannot store token");
  }

  return { access, refresh };
};

const get_token = () => {
  const tok = token.ornull?.get({ noproxy: true });
  if (!tok?.access) return { access: undefined, refresh: undefined };
  return { access: tok?.access, refresh: tok?.refresh };
};

const init_token = async () => {
  const _token = db.tokens().get();
  if (_token) {
    const { access, refresh } = await db.decrypt(_token);
    token.set({ access, refresh });
    user.set(parseJwt(access));
  }
  return Promise.resolve();
  // return new Promise((resolve, reject) => {
  //   const tokens = db.tokens();
  //   if (!tokens) {
  //     reject(new Error("A problem occured, token doesn't exist in db"))
  //     return undefined
  //   }
  //   const dbToken = tokens.get();
  //   dbToken.onsuccess = async (event) => {
  //     const result = event.target.result;
  //     if (!result) {
  //       resolve();
  //       return;
  //     }
  //     const { access, refresh } = await db.decrypt(result.token);
  //     token.set({ access, refresh });
  //     user.set(parseJwt(access));
  //     console.warn("token initialized");
  //     resolve();
  //   };
  //   dbToken.onerror = (event) => {
  //     // console.log("event error :: ", event);
  //     reject();
  //   };
  // });
};

const get_user_type = () => {
  const type = user.ornull?.get({ noproxy: true })?.user_type;
  if (!type) return "undefined";
  else if (type === 1) return "ADMIN|1";
  else if (type === 2) return "APPLICANT|2";
  else if (type === 3) return "FILTERER|3";
  else if (type === 4) return "JUDGE|4";
  else if (type === 5) return "PRIO_FILTERER|5";
  else if (type === 6) return "PRIO_JUDGE|6";
  else {
    return "unknown";
  }
};

const get_user_level = () => {
  const user_type = get_user_type();
  if (user_type?.toLowerCase().startsWith("prio")) return "PRIO";
  return "TOP";
};

const get_user_tracks = () => {
  /** @type {Array<{id: 5,name_ar: string,name_en: string}>} */
  const _tracks = tracks?.ornull?.get({ noproxy: true }).object;
  if (!tracks) {
    console.error("FATAL: tracks not found");
  }
  return _tracks;
};

const get_user_i18n_key = () => {
  const user_level = get_user_level();
  let i18n_key = "";
  if (user_level === "TOP") {
    i18n_key = "evaluationList";
  } else {
    i18n_key = "prioList";
  }
  return i18n_key;
};

const get_track_apps_order = (id) => {
  return get_track_details(id)?.apps_order;
};

const get_track_details = (id) => {
  id = Number.parseInt(id);
  return tracks.ornull
    ?.get({ noproxy: true })
    ?.object?.find((track) => track.id === id);
};

const route_to_default_track = () => {
  // const lvl = get_user_level() === "TOP" ? "/" : "/prio/";
  const tracks = get_user_tracks();
  return `/${tracks?.[0]?.id || 1}`;
};

const route_to_not_found = () => {
  return `/error/page_not_found`;
};

const clear = () => {
  console.log("clearing db");
  remove_token(); // token and user
  tracks.set({ object: undefined, history: undefined });
  settings.set(undefined);

  app_state.set("login");
};

async function init() {
  try {
    await db.init();
    await init_token();
    app_state.set("run");
  } catch (e) {
    console.error(e);
    clear();
  }
}

export const store = {
  clear,
  app_state,
  app_state_do: {
    init: init,
  },
  tracks,
  tracks_do: {
    get: () => tracks.get({ noproxy: true }),
    get_apps_order: get_track_apps_order,
    get_details: get_track_details,
  },
  token,
  token_do: {
    set: set_token,
    get: get_token,
    rm: remove_token,
  },
  user,
  user_do: {
    get_type: get_user_type,
    get_level: get_user_level,
    get_i18n_key: get_user_i18n_key,
    get_first_login: () =>
      user.ornull?.get({ noproxy: true })?.first_login || false,
    get: () => user.ornull?.get({ noproxy: true }),
  },
  settings,
  settings_do: {
    get: () => settings.get({ noproxy: true }),
  },
  route_do: {
    get_default_track: route_to_default_track,
    get_not_found: route_to_not_found,
  },
};
