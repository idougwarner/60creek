import React from "react";
import { useSelector } from "react-redux";
import "./CreateCampaignWizard.scss";
import StepIndicator from "./Wizard/StepIndicator";
import WizardDetailsStep from "./Wizard/WizardDetailsStep";
import WizardOutreachStep from "./Wizard/WizardOutreachStep";

const CreateCampaignWizard = () => {
  const step = useSelector((state) => state.createCampaignStore.step);
  return (
    <>
      <div className="card campaign-wizard">
        <div className="wizard-header">
          <h4 className="text-center">Create Campaign</h4>
          <StepIndicator />
        </div>
        {step === 0 && <WizardDetailsStep />}
        {step === 1 && <WizardOutreachStep />}
      </div>
    </>
  );
};

export default CreateCampaignWizard;
