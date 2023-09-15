import { useTranslation } from "react-i18next";

const PrioQuestions = ({ questions, questionsTranslation }) => {
  const { t, i18n } = useTranslation();

  return (
    <div
      className={`mb-8 flex flex-col gap-y-5 ${
        i18n.language === "en" ? "text-left" : "text-right"
      }  text-base text-primary`}
    >
      <span className="font-bold ">
        {i18n.language === "en" ? "Prioritization Questions" : "أسئلة التفاضل"}
      </span>
      {i18n.language === "ar" &&
        Object.values(questions).map((question) => {
          return <span className="font-normal">{question}</span>;
        })}
      {i18n.language === "en" &&
        Object.values(questionsTranslation).map((question) => {
          return <span className="font-normal">{question}</span>;
        })}
    </div>
  );
};

export default PrioQuestions;
