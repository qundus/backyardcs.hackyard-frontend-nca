import CryptoJS from "crypto-js";
const TOKEN_KEY = "TOKEN_KEY";

async function encrypt(obj) {
  if (typeof obj !== "string") obj = JSON.stringify(obj);
  const secret = import.meta.env.VITE_ENCRYPTION_KEY;
  return CryptoJS.AES.encrypt(obj, secret).toString();
}
async function decrypt(cipher) {
  const secret = import.meta.env.VITE_ENCRYPTION_KEY;
  var bytes = CryptoJS.AES.decrypt(cipher, secret);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

const request = indexedDB.open("myDatabase", 1);
// Open or create an IndexedDB database
request.onupgradeneeded = function (event) {
  // console.log("on upgrade needed : ", event);
  const db = event.target.result;
  // Create an object store to store the access token
  db.createObjectStore("tokens", { keyPath: "id" });
};
let token = undefined;
export const db = {
  encrypt,
  decrypt,
  async init() {
    const _token = localStorage.getItem(TOKEN_KEY);
    console.log("inited db :: ", _token);
    if (_token && _token !== "undefined" && _token !== undefined) {
      token = JSON.parse(_token);
    }
    return Promise.resolve();
    // return new Promise((resolve, reject) => {
    //   console.log("inited db")
    //   request.onsuccess = async function (event) {
    //     // console.log("on success : ", event);
    //     const _db = event.target.result;
    //     // _db = db;
    //     // Create a new custom event
    //     // _tokenMatters(db, "sad", "get");
    //     // Generate or obtain the access token
    //     // const accessToken = "your-access-token";

    //     // Encrypt the access token
    //     // const encryptedToken = await encryptToken(accessToken);

    //     // Store the encrypted token in IndexedDB
    //     // const transaction = _db.transaction(["tokens"], "readwrite");
    //     // const tokenStore = transaction.objectStore("tokens");
    //     // const tokenData = { id: 1, token: encryptedToken };
    //     // objectStore.put(tokenData);
    //     // db.token = tokenStore;
    //     // db.tokens = _db
    //     //   .transaction(["tokens"], "readwrite")
    //     //   .objectStore("tokens");
    //     resolve();
    //   };

    //   request.onerror = function (event) {
    //     reject(new Error("Error opening database"));
    //   };
    // });
  },
  /** @returns {IDBObjectStore} */
  tokens() {
    // if (request.readyState === "pending") return undefined
    // else if (!request.result.objectStoreNames.contains("tokens")) {
    //   throw new Error("tokens db is not initialized")
    // }
    // return request.result
    //   .transaction(["tokens"], "readwrite")
    //   .objectStore("tokens");
    return {
      delete: () => {
        token = undefined;
        localStorage.removeItem(TOKEN_KEY);
      },
      put: (t) => {
        token = t;
        localStorage.setItem(TOKEN_KEY, JSON.stringify(t));
      },
      get() {
        return token;
      },
    };
  },
};
