import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { CREATE_CAMPAIGN_ACTIONS } from "../../../../redux/actionTypes";
import { SUBSTEP_COMPLETED } from "../wizardConstants";

const AutomatedText = () => {
  const [prospects, setProspects] = useState("");
  const [text, setText] = useState("");

  const dispatch = useDispatch();
  const defaultProspects = useSelector(
    (state) => state.createCampaignStore.defaultProspects
  );
  const textInfo = useSelector(
    (state) => state.createCampaignStore.outreach.text
  );
  const cancelEdit = () => {
    dispatch({ type: CREATE_CAMPAIGN_ACTIONS.UPDATE_SUBSTEP, data: "" });
  };
  const addAutomatedText = () => {
    dispatch({
      type: CREATE_CAMPAIGN_ACTIONS.UPDATE_OUTREACH_TEXT,
      data: {
        status: SUBSTEP_COMPLETED,
        prospects: prospects,
        text: text,
      },
    });
    dispatch({ type: CREATE_CAMPAIGN_ACTIONS.UPDATE_SUBSTEP, data: "" });
  };
  useEffect(() => {
    if (textInfo && defaultProspects) {
      setProspects(
        textInfo.status === SUBSTEP_COMPLETED
          ? textInfo.prospects
          : defaultProspects
      );
      setText(textInfo.text);
    }
  }, [textInfo, defaultProspects]);
  return (
    <div className="card w-100">
      <Form.Group>
        <Form.Label className="required">Active Prospects to Text</Form.Label>
        <Form.Control
          type="number"
          max={defaultProspects}
          min={1}
          placeholder="Defaults to number of prospects in list"
          value={prospects}
          className={prospects ? "completed" : ""}
          onChange={(e) => setProspects(e.target.value)}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label className="required">Text Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={10}
          placeholder="Please enter your Text Content here. Plain Text only"
          value={text}
          className={text ? "completed" : ""}
          onChange={(e) => setText(e.target.value)}
        />
      </Form.Group>
      <div className="d-flex justify-content-end">
        <Button variant="light" size="lg" className="mr-3" onClick={cancelEdit}>
          CANCEL
        </Button>
        <Button
          variant="outline-primary"
          size="lg"
          disabled={!prospects || !text}
          onClick={addAutomatedText}
        >
          {textInfo.status === SUBSTEP_COMPLETED
            ? "SAVE UPDATES"
            : "ADD AUTOMATED TEXT"}
        </Button>
      </div>
    </div>
  );
};

export default AutomatedText;
