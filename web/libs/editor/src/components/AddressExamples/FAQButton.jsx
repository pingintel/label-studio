import React from "react";
import FancyQuestionMarkIcon from "./FancyQuestionMarkIcon";
import "./FAQButton.css";

const FAQButton = () => {
  return (
    <div className="faq-button-container">
      <FancyQuestionMarkIcon width={32} height={32} />
      <span>FAQ</span>
    </div>
  );
};

export default FAQButton;
