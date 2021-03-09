import React, { useEffect, useState } from "react";
import { Button, Form, FormControl } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { CREATE_CAMPAIGN_ACTIONS } from "../../../../redux/actionTypes";
import { SUBSTEP_COMPLETED } from "../WizardConstants";
import InputMask from "react-input-mask";

const AutomatedText = () => {
  const [prospects, setProspects] = useState("");
  const [text, setText] = useState("");
  const [phone, setPhone] = useState("");

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
        phone: phone,
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
      setPhone(textInfo.phone);
    }
  }, [textInfo, defaultProspects]);

  const isValidPhone = () => {
    if (phone.indexOf("_") < 0) {
      return true;
    }
    return false;
  };
  return (
    <div className="card w-100">
      <Form.Group>
        <Form.Label className="required">Active Prospects to Text</Form.Label>
        <Form.Control
          type="number"
          min={1}
          placeholder="Defaults to number of prospects in list"
          value={prospects}
          className={prospects ? "completed" : ""}
          onChange={(e) => setProspects(e.target.value)}
          isInvalid={prospects > defaultProspects}
        />
        <FormControl.Feedback type="invalid">
          It should not be greater than the number of prospects
        </FormControl.Feedback>
      </Form.Group>

      <Form.Group>
        <Form.Label className="required">Phone Number</Form.Label>

        <InputMask
          mask="(999) 999 - 9999"
          value={phone}
          type="tel"
          placeholder="(555) 555 - 5555"
          onChange={(e) => setPhone(e.target.value)}
        >
          {(inputProps) => (
            <Form.Control
              {...inputProps}
              style={{ maxWidth: 320 }}
              className={phone ? "completed" : ""}
              isInvalid={phone && !isValidPhone()}
            />
          )}
        </InputMask>
      </Form.Group>

      <Form.Group>
        <Form.Label className="required">Text Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={10}
          placeholder="Please enter your Text Content here. Plain Text only."
          value={text}
          className={text ? "completed" : ""}
          style={{ padding: 16 }}
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
          disabled={
            !prospects ||
            !text ||
            !isValidPhone() ||
            !phone ||
            prospects > defaultProspects
          }
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
