import { changeLanguage } from "i18next";
import { useTranslation } from "react-i18next";
import { nanoid } from "nanoid";
import { useState, useEffect, useRef } from "react";
const mounted = [];

// https://stackoverflow.com/questions/50298201/react-js-google-translate-not-working
// https://www.w3schools.com/howto/tryit.asp?filename=tryhow_google_translate_dropdown
// https://stackoverflow.com/questions/11174558/need-help-styling-google-translate-button
// https://www.w3.org/International/questions/qa-translate-flag
/**
 * https://copyprogramming.com/howto/how-to-use-and-customize-google-translate-translateelement-part-of-page
 * 
 * you can translate part of page with this (not tested)
 * 
 * google.language.translate("Hello world", "en", "es", function(result) {
  if (!result.error) {
    var container = document.getElementById("translation");
    container.innerHTML = result.translation;
  }
});
*/
function translate_text(ref) {
   // Get the content to translate
   //   var content = document.getElementById('translate-me').textContent;

   // Use the Google Translate API to translate the content
   var translation = google.translate.TranslateElement.translateText(ref, 'en', 'fr');

   // Replace the original content with the translated content
   ref.current.textContent = translation;
}

export function Translate({ text, clazz, hide_style }) {
   const { t, i18n } = useTranslation();
   const [key_id] = useState(nanoid());
   const ref = useRef(null);
   useEffect(() => {
      let gt = undefined;
      function googleTranslateElementInit() {
         gt = new window.google.translate.TranslateElement({
            defaultLanguage: "ar",
            // layout: google.translate.TranslateElement.FloatPosition.TOP_LEFT, // The layout of the translation dropdown
            layout: google.translate.TranslateElement.InlineLayout.BUBBLE,
            pageLanguage: i18n.resolvedLanguage, // The language of the page
            // includedLanguages: 'ar,en', // A comma-separated list of languages to include in the dropdown (e.g. "fr,es")
            autoDisplay: true, // Whether to automatically display the translation dropdown on load
            multilanguagePage: true, // Whether this is a multilingual page (true/false) // also controls auto translation, use in combination with disableAutoTranslation
            disableAutoTranslation: i18n.resolvedLanguage === "ar" ? true : false, // Whether to disable automatic translation (true/false)
            gaTrack: false, // Whether to track usage with Google Analytics
            gaId: null, // The Google Analytics tracking ID to use (null by default)
            jsTrigger: false, // Whether to trigger the translation manually using JavaScript
            // translateFunction: null, // Optional function to modify the translation result
            // floatContainerClass: 'google_translate_element', // Class to add to the translation dropdown
            // floatCssClass: 'google_translate_element', // Class to add to the frame containing the translation dropdown
            iframe: false, // Whether to use an <iframe> to contain the translation dropdown
            // manual: false, // Whether to force manual translation mode (true/false)
            // contentsChanged: false, // Whether the content of the page has changed (true/false)
            mainContainerId: key_id, // The ID of the main container element for the translation dropdown
         },
            key_id);
         // "google-translate-element");
      };
      console.log("id :: ", key_id);
      var el = document.getElementById(key_id);
      var script_tag = document.createElement('script');
      script_tag.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
      el.appendChild(script_tag);
      window.googleTranslateElementInit = googleTranslateElementInit;

      return () => {
         if (gt) gt.dispose();
         if (script_tag) el.removeChild(script_tag);
      };
   }, []);

   return (
      <div ref={ref} key={key_id} id={key_id} className={`${clazz} self-start text-justify flex flex-col ${hide_style ? " translate_hide " : " translate_show "}`} lang={i18n.resolvedLanguage} translate="yes">
         <p dir="auto">{text || ""}</p>
      </div>
   );
}