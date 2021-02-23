import React from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { CREATE_CAMPAIGN_ACTIONS } from "../../../redux/actionTypes";
import "./CreatedStep.scss";
import { SUBSTEP_COMPLETED, _Substeps } from "./wizardConstants";

const CreatedStep = () => {
  const info = useSelector((state) => state.createCampaignStore);

  const dispatch = useDispatch();
  const gotoStep = (step) => {
    dispatch({ type: CREATE_CAMPAIGN_ACTIONS.UPDATE_STEP, data: step });
  };

  return (
    <div className="px-3">
      {info && (
        <>
          <div className="your-campaign">
            Your Campaign for <strong>{info.details.targetList.label}</strong>{" "}
            will begin on
          </div>
          <div className="date">{`${info.timeline.day.label}/${info.timeline.month.value}/${info.timeline.year.label}`}</div>
          <div className="time">{`${info.timeline.hour.label}${info.timeline.minute.label} ${info.timeline.am.label} MT`}</div>
          {_Substeps.map(
            (item, idx) =>
              info.outreach[item.step].status === SUBSTEP_COMPLETED && (
                <div className="item-summary" key={idx}>
                  <div className="item-title">{item.label}</div>
                  <div className="text-right">
                    <div className="price">
                      ${info.outreach[item.step].prospects * item.price}
                    </div>
                    <div className="counts">
                      (${item.price}x{info.outreach[item.step].prospects})
                    </div>
                  </div>
                </div>
              )
          )}
          {info.checkout.discount !== 0 && (
            <>
              <hr />
              <div className="item-summary">
                <div className="item-title">Discount</div>
                <div className="total-price">${info.checkout.discount}</div>
              </div>
            </>
          )}
          <hr />
          <div className="item-summary">
            <div className="item-title">Total</div>
            <div className="total-price">${info.checkout.total}</div>
          </div>
          <hr />
          <div className="item-summary mb-4">
            <div className="item-title">Payment Method</div>
            <div className="text-uppercase">
              {info.checkout.brand} ..... {info.checkout.last4}
            </div>
          </div>
          <div>
            You will receive a confirmation email at the email{" "}
            <strong>{info.checkout.email}</strong>
          </div>

          <Button
            variant="light"
            size="lg"
            className="w-100"
            onClick={() => gotoStep(3)}
          >
            PREVIOUS
          </Button>
        </>
      )}
    </div>
  );
};

export default CreatedStep;
