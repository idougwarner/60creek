import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import usdCurrencyFormat from "../../../helpers/currencyFormat";
import { CREATE_CAMPAIGN_ACTIONS } from "../../../redux/actionTypes";
import InfoTooltip from "../../controls/InfoTooltip";
import { SUBSTEP_COMPLETED, _Prices, _Substeps } from "./WizardConstants";

import "./WizardOutreachStep.scss";

const WizardOutreachStep = () => {
  const dispatch = useDispatch();
  const outreach = useSelector((state) => state.createCampaignStore.outreach);
  const currentStep = useSelector((state) => state.createCampaignStore.substep);
  const [isEnableNext, setIsEnableNext] = useState(false);

  const gotoStep = (step) => {
    dispatch({ type: CREATE_CAMPAIGN_ACTIONS.UPDATE_STEP, data: step });
    dispatch({ type: CREATE_CAMPAIGN_ACTIONS.UPDATE_SUBSTEP, data: "" });
  };
  const selectSubstep = (step) => {
    dispatch({ type: CREATE_CAMPAIGN_ACTIONS.UPDATE_SUBSTEP, data: step });
  };
  useEffect(() => {
    if (outreach.email.status === SUBSTEP_COMPLETED) {
      setIsEnableNext(true);
    } else if (outreach.text.status === SUBSTEP_COMPLETED) {
      setIsEnableNext(true);
    } else if (outreach.ringlessVoicemail.status === SUBSTEP_COMPLETED) {
      setIsEnableNext(true);
    } else if (outreach.postcard.status === SUBSTEP_COMPLETED) {
      setIsEnableNext(true);
    } else if (outreach.socialPost.status === SUBSTEP_COMPLETED) {
      setIsEnableNext(true);
    } else {
      setIsEnableNext(false);
    }
  }, [outreach]);
  const getClassName = (step) => {
    const status = outreach[step].status;
    if (step === currentStep) {
      return "close-outlined";
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
        {_Substeps.map((item, idx) => (
          <div key={idx} className="outreach-step">
            <div
              className={"outreach-indicator " + getClassName(item.step)}
              onClick={() => {
                if (outreach[item.step].status !== SUBSTEP_COMPLETED) {
                  selectSubstep(item.step);
                }
              }}
            ></div>
            <div className="flex-grow-1">
              <div className="substep-title">
                {item.label}{" "}
                <InfoTooltip description={item.other || item.label} />
              </div>
              <div className="d-flex justify-content-between align-items-center w-100 pr-3">
                <div className="substep-price">
                  {outreach[item.step].status === SUBSTEP_COMPLETED
                    ? `${usdCurrencyFormat(
                        _Prices[item.step] * outreach[item.step].prospects
                      )} (${usdCurrencyFormat(_Prices[item.step])}/prospect x ${
                        outreach[item.step].prospects
                      })`
                    : `${usdCurrencyFormat(_Prices[item.step])}/prospect`}
                </div>
                {getClassName(item.step) === "completed-blue-fill" && (
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
        disabled={!isEnableNext}
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
