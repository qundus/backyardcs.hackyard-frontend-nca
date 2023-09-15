import { Icon } from "@iconify/react";

const icons = {
   1: "solar:pen-bold-duotone",
   2: "mdi:movie-play",
   3: "file-icons:microsoft-publisher",
   4: "dashicons:translation",
   5: "file-icons:stylelint",
   6: "fluent-emoji-high-contrast:artist",
   7: "game-icons:player-base",
   8: "ph:hoodie-fill",
   9: "majesticons:music",
   10: "ic:twotone-architecture",
   11: "healthicons:young-people",
   12: "game-icons:profit",
   19: "fluent-mdl2:nonprofit-logo-32",
   13: "maki:theatre",
   14: "fa-solid:business-time",
   15: "fa6-solid:people-robbery",
   16: "material-symbols:cooking",
   17: "fluent:premium-person-16-regular"
};

export function SharedIcons({ award_id, clazz }) {
   if (award_id) {
      award_id = icons[Number.parseInt(award_id)];
   }
   return <Icon icon={award_id || undefined} className={clazz} />;
}