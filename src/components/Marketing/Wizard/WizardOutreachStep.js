import React from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { CREATE_CAMPAIGN_ACTIONS } from "../../../redux/actionTypes";
import InfoTooltip from "../../controls/InfoTooltip";
import { SUBSTEP_COMPLETED } from "./WizardConstants";

import "./WizardOutreachStep.scss";
const substep = [
  {
    step: "email",
    label: "Automated Email",
    price: 0.25,
    other: "An Automated Email sent to your prospects",
    items: "",
  },
  {
    step: "text",
    label: "Automated Text",
    price: 0.25,
    other: "An Automated Text sent to your prospects",
    items: "",
  },
  {
    step: "ringlessVoicemail",
    label: "Automated Ringless Voicemail",
    price: 0.25,
    other: "An automated voicemail sent to your prospects",
    items: "",
  },
  {
    step: "postCard",
    label: "Automated Post Card",
    price: 1.25,
    other: "",
    items: "4x6 ",
  },
  {
    step: "socialPost",
    label: "Automated Facebook/Instagram Post",
    price: 0.5,
    other: "",
    items: "",
  },
];

const WizardOutreachStep = () => {
  const dispatch = useDispatch();
  const outreach = useSelector((state) => state.createCampaignStore.outreach);
  const currentStep = useSelector((state) => state.createCampaignStore.substep);
  const gotoStep = (step) => {
    dispatch({ type: CREATE_CAMPAIGN_ACTIONS.UPDATE_STEP, data: step });
  };
  const selectSubstep = (step) => {
    dispatch({ type: CREATE_CAMPAIGN_ACTIONS.UPDATE_SUBSTEP, data: step });
  };
  const getIcon = (step) => {
    const status = outreach[step].status;
    if (step === currentStep) {
      if (status === SUBSTEP_COMPLETED) {
        return "close-outlined-red";
      } else {
        return "close-outlined";
      }
    } else {
      if (status === SUBSTEP_COMPLETED) {
        return "completed-blue-fill";
      } else {
        return "plus-outlined";
      }
    }
  };
  return (
    <div className="outreach-step-container">
      <div className="outreach-steps">
        {substep.map((item, idx) => (
          <div key={idx} className="outreach-step">
            <img
              src={"/assets/icons/" + getIcon(item.step) + ".svg"}
              className="clickable"
              alt="plus"
              onClick={() => {
                if (outreach[item.step].status !== SUBSTEP_COMPLETED) {
                  selectSubstep(item.step);
                }
              }}
            />
            <div className="flex-grow-1">
              <div className="substep-title">
                {item.label}{" "}
                <InfoTooltip description={item.other || item.label} />
              </div>
              <div className="d-flex justify-content-between align-items-center w-100 pr-3">
                <div className="substep-price">
                  {item.items}${item.price}/prospect
                </div>
                {outreach[item.step].status === SUBSTEP_COMPLETED && (
                  <div
                    className="edit-btn"
                    onClick={() => selectSubstep(item.step)}
                  >
                    EDIT
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="step-description">Select outreach method first</div>
      <Button
        size="lg"
        variant="primary"
        className="w-100 mb-3"
        onClick={() => gotoStep(2)}
      >
        NEXT
      </Button>
      <Button
        size="lg"
        variant="light"
        className="w-100"
        onClick={() => gotoStep(0)}
      >
        PREVIOUS
      </Button>
    </div>
  );
};

export default WizardOutreachStep;
