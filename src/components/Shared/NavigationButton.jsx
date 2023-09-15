import React from "react";
import { Link } from "react-router-dom";

const NavigationButton = ({ image, text, route, styles, onclick }) => {

  return (
    <Link to={`/${route}`} className="w-fit" onclick={() => onclick()}>
      <div
        className={` mx-2 flex w-fit min-w-[200px] items-center justify-start rounded-22px border border-solid border-offwhite px-6 py-4 text-end transition-all hover:bg-offwhite hover:text-primary ${styles}`}
      >
        <span className={` text-3xl font-bold  `}>{text}</span>
      </div>
    </Link>
  );
};

export default NavigationButton;
