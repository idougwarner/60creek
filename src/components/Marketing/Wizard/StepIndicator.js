import React from "react";
import { useSelector } from "react-redux";
import "./StepIndicator.scss";

const steps = ["DETAILS", "OUTREACH", "TIMELINE", "CHECKOUT"];
const StepIndicator = () => {
  const step = useSelector((state) => state.createCampaignStore.step) || 0;
  return (
    <>
      <div className="wizard-steps">
        {steps.map((item, idx) => (
          <div
            key={idx}
            className={
              "wizard-step" +
              (idx === step ? " current" : "") +
              (idx < step ? " completed" : "")
            }
          >
            {item}
          </div>
        ))}
      </div>
    </>
  );
};

export default StepIndicator;
