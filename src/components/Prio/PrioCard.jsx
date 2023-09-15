import React from "react";
import ContestantDialog from "../EvaluationList/ContestantDialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PrioDialog from "./PrioDialog";
import { useQueryClient } from "@tanstack/react-query";

const PrioCard = ({
  buttonText,
  translation,
  groupData,
  scale,
  isLoading,
  questionsTranslation,
}) => {
  const queryClient = useQueryClient();
  const [activeProfile, setActiveProfile] = useState(0);
  let [isOpen, setIsOpen] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <div className="parentGroup group flex   items-center justify-center    rounded-15px transition-all">
      <button
        onClick={openModal}
        className="childGroup flex min-w-[119px] items-center justify-center rounded-full border border-solid border-offwhite bg-offwhite py-1 px-8 text-center font-inter text-base font-semibold text-primary"
      >
        {buttonText}
      </button>
      <PrioDialog
        translation={translation}
        isOpen={isOpen}
        closeModal={closeModal}
        groupData={groupData}
        scale={scale}
        activeProfile={activeProfile}
        setActiveProfile={setActiveProfile}
        isLoading={isLoading}
        questionsTranslation={questionsTranslation}
      />
    </div>
  );
};

export default PrioCard;
