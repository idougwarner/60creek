import React, { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { CREATE_CAMPAIGN_ACTIONS } from "../../../../redux/actionTypes";
import { SUBSTEP_COMPLETED } from "../WizardConstants";
import InfoTooltip from "../../../controls/InfoTooltip";
import { v4 as uuidv4 } from "uuid";
import { Storage } from "aws-amplify";

const AutomatedPostCard = () => {
  const [prospects, setProspects] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef();

  const dispatch = useDispatch();
  const defaultProspects = useSelector(
    (state) => state.createCampaignStore.defaultProspects
  );
  const postcardInfo = useSelector(
    (state) => state.createCampaignStore.outreach.postcard
  );
  const cancelEdit = () => {
    dispatch({ type: CREATE_CAMPAIGN_ACTIONS.UPDATE_SUBSTEP, data: "" });
  };
  const addAutomatedPostCard = () => {
    dispatch({
      type: CREATE_CAMPAIGN_ACTIONS.UPDATE_OUTREACH_POST_CARD,
      data: {
        status: SUBSTEP_COMPLETED,
        prospects: prospects,
        file: file,
      },
    });
    dispatch({ type: CREATE_CAMPAIGN_ACTIONS.UPDATE_SUBSTEP, data: "" });
  };
  useEffect(() => {
    if (postcardInfo && defaultProspects) {
      setProspects(
        postcardInfo.status === SUBSTEP_COMPLETED
          ? postcardInfo.prospects
          : defaultProspects
      );
      setFile(postcardInfo.file);
    }
  }, [postcardInfo, defaultProspects]);

  const onChangeFile = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (event.target.files.length > 0) {
      try {
        setUploading(true);
        const fileInfo = event.target.files[0];
        if (file) {
          await Storage.remove(file);
        }
        const rtInfo = await Storage.put(
          uuidv4() + "-" + fileInfo.name,
          fileInfo
        );
        setFile(rtInfo.key);

        event.target.value = null;
      } catch (err) {
      } finally {
      }
      setUploading(false);
    }
  };

  const clearFile = async () => {
    if (file) {
      await Storage.remove(file);
    }
    setFile(null);
  };

  return (
    <div className="card w-100">
      <Form.Group>
        <Form.Label className="required">
          Active Prospects to Send a Postcard
        </Form.Label>
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
        <Form.Label className="required">
          Postcard Proof <InfoTooltip description="Postcard Proof" />
        </Form.Label>
        <Form.Text className="text-muted mb-2 d-flex align-items-center">
          {file ? file.substr(37) : "No file selected"}
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
          name="name"
          hidden
          accept=".mp3, .mp4"
          onChange={onChangeFile}
        />
        <Button
          variant="outline-primary"
          onClick={() => fileInputRef.current.click()}
          disabled={uploading}
        >
          {uploading ? "UPLOADING ..." : "UPLOAD"}
        </Button>
      </Form.Group>
      <div className="d-flex justify-content-end">
        <Button variant="light" size="lg" className="mr-3" onClick={cancelEdit}>
          CANCEL
        </Button>
        <Button
          variant="outline-primary"
          size="lg"
          disabled={!prospects || !file}
          onClick={addAutomatedPostCard}
        >
          {postcardInfo.status === SUBSTEP_COMPLETED
            ? "SAVE UPDATES"
            : "ADD AUTOMATED POSTCARD"}
        </Button>
      </div>
    </div>
  );
};

export default AutomatedPostCard;
