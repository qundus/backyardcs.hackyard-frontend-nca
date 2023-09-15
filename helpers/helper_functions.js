export function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export function transformArray(arr) {
  // Loop through each object in the array
  for (let i = 0; i < arr.length; i++) {
    const obj = arr[i];
    // Loop through each property in the object
    for (const prop in obj) {
      // If the property value is an empty string, set it to null
      // if (obj[prop] === "") {
      //   obj[prop] = null;
      // }
      // If the property value is a non-empty string, parse it to an integer
      if (typeof obj[prop] === "string" && obj[prop].trim() !== "") {
        const intValue = parseInt(obj[prop], 10);
        if (!isNaN(intValue)) {
          obj[prop] = intValue;
        }
      }
    }
  }
  return arr;
}

export function findNumberIndex(arr, num) {
  const sortedArr = arr.slice().sort((a, b) => b - a); // create a copy of the array, sort it in descending order
  return sortedArr.indexOf(num) + 1; // find index of num in sorted array and return its position in the original array
}

export function getVideoIdFromUrl(url) {
  // Extract the video ID from the URL using a regular expression
  const videoIdRegex = /(?:\?v=|&v=|youtu\.be\/)(.*?)(?:\?|$)/;
  const match = url.match(videoIdRegex);

  // If there's a match, return the video ID, otherwise return null
  return match ? match[1] : null;
}
import i18n from "../i18n";
/**
 * 
 * @param {string} text 
 */
export function split_text(text) {
  if (!text || text?.length <= 0) return text;
  let result = undefined;
  if (text.startsWith("$$")) {
    const split = text.split("$$");
    // console.log("splits :: ", split);
    if (i18n.resolvedLanguage === "ar") result = split[1];
    else result = split[2];
  }

  if (!result || result.length <= 0) return text;
  return result;
}