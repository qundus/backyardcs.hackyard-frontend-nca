import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ContestantDialog from "./ContestantDialog";
import { store } from "../../store/store";

const ContestantCard = ({
  rated,
  item,
  title,
  track_id,
  header,
  translations,
  scale,
  scoring_translation,
  update_id
}) => {
  let [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const i18n_key = store.user_do.get_i18n_key();
  const user_level = store.user_do.get_level();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    if (!item) return;
    setIsOpen(true);
  }

  return (
    <div className="parentGroup group flex   items-center justify-center    rounded-15px transition-all">
      <button
        onClick={openModal}
        className="childGroup flex min-w-[119px] items-center justify-center rounded-full border border-solid border-offwhite bg-offwhite py-1 px-8 text-center font-inter text-base font-semibold text-primary"
      >
        {user_level === "TOP" ?
          t(`${i18n_key}.${rated ? "update" : "rate"}`) :
          i18n.language === "en"
            ? "Prioritize"
            : "ترتيب المشاركين"
        }
      </button>
      {isOpen &&
        <ContestantDialog
          rated={rated}
          update_id={update_id}
          item={item}
          title={title}
          track_id={track_id}
          closeModal={closeModal}
          header={header}
          translations={translations}
          scale={scale}
          scoring_translation={scoring_translation}
        />
      }
    </div>
  );
};

export default ContestantCard;