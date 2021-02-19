import React, { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { CREATE_CAMPAIGN_ACTIONS } from "../../../../redux/actionTypes";
import { SUBSTEP_COMPLETED } from "../WizardConstants";
import InputMask from "react-input-mask";
import InfoTooltip from "../../../controls/InfoTooltip";

const AutomatedRinglessVoicemail = () => {
  const [prospects, setProspects] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState(null);

  const fileInputRef = useRef();

  const dispatch = useDispatch();
  const ringlessVoicemailInfo = useSelector(
    (state) => state.createCampaignStore.outreach.ringlessVoicemail
  );
  const cancelEdit = () => {
    dispatch({ type: CREATE_CAMPAIGN_ACTIONS.UPDATE_SUBSTEP, data: "" });
  };
  const addAutomatedRinglessVoicemail = () => {
    dispatch({
      type: CREATE_CAMPAIGN_ACTIONS.UPDATE_OUTREACH_RINGLESS_VOICEMAIL,
      data: {
        status: SUBSTEP_COMPLETED,
        prospects: prospects,
        phone: phone,
        file: file,
      },
    });
    dispatch({ type: CREATE_CAMPAIGN_ACTIONS.UPDATE_SUBSTEP, data: "" });
  };
  useEffect(() => {
    if (ringlessVoicemailInfo) {
      setProspects(ringlessVoicemailInfo.prospects);
      setPhone(ringlessVoicemailInfo.phone);
      setFile(ringlessVoicemailInfo.file);
    }
  }, [ringlessVoicemailInfo]);

  const onChangeFile = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (event.target.files.length > 0) {
      try {
        console.log(event.target.files[0]);
        setFile(event.target.files[0]);
        event.target.value = null;
      } catch (err) {
      } finally {
      }
    }
  };

  const clearFile = () => {
    setFile(null);
  };

  const isValidPhone = () => {
    if (phone.indexOf("_") < 0) {
      return true;
    }
    return false;
  };
  return (
    <div className="card w-100">
      <Form.Group>
        <Form.Label className="required">
          Active Prospects to Send a Voicemail
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Defaults to number of prospects in list"
          value={prospects}
          className={prospects ? "completed" : ""}
          onChange={(e) => setProspects(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label className="required">
          Voicemail File <InfoTooltip description="Voicemail File" />
        </Form.Label>
        <Form.Text className="text-muted mb-2 d-flex align-items-center">
          {file ? file.name : "No file selected"}
          {file && (
            <Button
              variant="link"
              className="text-muted ml-4"
              onClick={clearFile}
            >
              <img
                src="/assets/icons/close-small.svg"
                className="mr-1"
                alt="close-small"
              />
              CLEAR
            </Button>
          )}
        </Form.Text>
        <input
          ref={fileInputRef}
          type="file"
          accept=".mp3, .mp4"
          name="name"
          hidden
          onChange={onChangeFile}
        />
        <Button
          variant="outline-primary"
          onClick={() => fileInputRef.current.click()}
        >
          {"UPLOAD"}
        </Button>
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
      <div className="d-flex justify-content-end">
        <Button variant="light" size="lg" className="mr-3" onClick={cancelEdit}>
          CANCEL
        </Button>
        <Button
          variant="outline-primary"
          size="lg"
          disabled={!prospects || !phone || !file || !isValidPhone()}
          onClick={addAutomatedRinglessVoicemail}
        >
          {ringlessVoicemailInfo.status === SUBSTEP_COMPLETED
            ? "SAVE UPDATES"
            : "ADD RINGLESS VOICEMAIL"}
        </Button>
      </div>
    </div>
  );
};

export default AutomatedRinglessVoicemail;
