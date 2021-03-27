import React from "react";
import { useSelector } from "react-redux";
import "./CreateCampaignWizard.scss";
import CheckoutStep from "./Wizard/CheckoutStep";
import CreatedStep from "./Wizard/CreatedStep";
import StepIndicator from "./Wizard/StepIndicator";
import TimelineStep from "./Wizard/TimelineStep";
import WizardDetailsStep from "./Wizard/WizardDetailsStep";
import WizardOutreachStep from "./Wizard/WizardOutreachStep";

const CreateCampaignWizard = () => {
  const step = useSelector((state) => state.createCampaignStore.step);
  return (
    <>
      <div className="card campaign-wizard">
        <div className="wizard-header">
          <h4 className="text-center">
            {step > 3 ? "Campaign Created" : "Create Campaign"}
          </h4>
          {step < 4 && <StepIndicator />}
        </div>
        {step === 0 && <WizardDetailsStep />}
        {step === 1 && <WizardOutreachStep />}
        {step === 2 && <TimelineStep />}
        {step === 3 && <CheckoutStep />}
        {step === 4 && <CreatedStep />}
      </div>
    </>
  );
};

export default CreateCampaignWizard;
