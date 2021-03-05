import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { CREATE_CAMPAIGN_ACTIONS } from "../../../../redux/actionTypes";
import RichEditor from "../../../controls/RichEditor";
import { SUBSTEP_COMPLETED } from "../WizardConstants";

const AutomatedEmail = () => {
  const [prospects, setProspects] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const defaultProspects = useSelector(
    (state) => state.createCampaignStore.defaultProspects
  );
  const emailInfo = useSelector(
    (state) => state.createCampaignStore.outreach.email
  );
  const cancelEdit = () => {
    dispatch({ type: CREATE_CAMPAIGN_ACTIONS.UPDATE_SUBSTEP, data: "" });
  };
  const addAutomatedEmail = () => {
    dispatch({
      type: CREATE_CAMPAIGN_ACTIONS.UPDATE_OUTREACH_EMAIL,
      data: {
        status: SUBSTEP_COMPLETED,
        prospects: prospects,
        message: message,
      },
    });
    dispatch({ type: CREATE_CAMPAIGN_ACTIONS.UPDATE_SUBSTEP, data: "" });
  };
  useEffect(() => {
    if (emailInfo && defaultProspects) {
      setProspects(
        emailInfo.status === SUBSTEP_COMPLETED
          ? emailInfo.prospects
          : defaultProspects
      );
      setMessage(emailInfo.message);
    }
  }, [emailInfo, defaultProspects]);
  return (
    <div className="card w-100">
      <Form.Group>
        <Form.Label className="required">Active Prospects to Email</Form.Label>
        <Form.Control
          type="number"
          min={1}
          placeholder="Defaults to number of prospects in list"
          value={prospects}
          className={prospects ? "completed" : ""}
          onChange={(e) => setProspects(e.target.value)}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label className="required">Email Content</Form.Label>
        <RichEditor
          value={message}
          onChange={(event) => setMessage(event)}
          placeholder="Please enter your Email Content here. HTML or Plain Text is acceptable."
        />
      </Form.Group>
      <div className="d-flex justify-content-end">
        <Button variant="light" size="lg" className="mr-3" onClick={cancelEdit}>
          CANCEL
        </Button>
        <Button
          variant="outline-primary"
          size="lg"
          disabled={!prospects || !message}
          onClick={addAutomatedEmail}
        >
          {emailInfo.status === SUBSTEP_COMPLETED
            ? "SAVE UPDATES"
            : "ADD AUTOMATED EMAIL"}
        </Button>
      </div>
    </div>
  );
};

export default AutomatedEmail;
