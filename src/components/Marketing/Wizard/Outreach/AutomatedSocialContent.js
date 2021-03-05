import React, { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { CREATE_CAMPAIGN_ACTIONS } from "../../../../redux/actionTypes";
import { SUBSTEP_COMPLETED } from "../WizardConstants";
import InfoTooltip from "../../../controls/InfoTooltip";
import { v4 as uuidv4 } from "uuid";
import { Storage } from "aws-amplify";
import RichEditor from "../../../controls/RichEditor";

const AutomatedSocialContent = () => {
  const [prospects, setProspects] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef();

  const dispatch = useDispatch();
  const defaultProspects = useSelector(
    (state) => state.createCampaignStore.defaultProspects
  );
  const socialPostInfo = useSelector(
    (state) => state.createCampaignStore.outreach.socialPost
  );
  const cancelEdit = () => {
    dispatch({ type: CREATE_CAMPAIGN_ACTIONS.UPDATE_SUBSTEP, data: "" });
  };
  const addAutomatedSocialPost = () => {
    dispatch({
      type: CREATE_CAMPAIGN_ACTIONS.UPDATE_OUTREACH_SOCIAL_POST,
      data: {
        status: SUBSTEP_COMPLETED,
        prospects: prospects,
        image: image,
        content: content,
      },
    });
    dispatch({ type: CREATE_CAMPAIGN_ACTIONS.UPDATE_SUBSTEP, data: "" });
  };
  useEffect(() => {
    if (socialPostInfo && defaultProspects) {
      setProspects(
        socialPostInfo.status === SUBSTEP_COMPLETED
          ? socialPostInfo.prospects
          : defaultProspects
      );
      setImage(socialPostInfo.file);
      setContent(socialPostInfo.content);
    }
  }, [socialPostInfo, defaultProspects]);

  const onChangeFile = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (event.target.files.length > 0) {
      try {
        setUploading(true);
        const fileInfo = event.target.files[0];
        if (image) {
          await Storage.remove(image);
        }
        const rtInfo = await Storage.put(
          uuidv4() + "-" + fileInfo.name,
          fileInfo
        );
        setImage(rtInfo.key);

        event.target.value = null;
      } catch (err) {
      } finally {
      }
      setUploading(false);
    }
  };

  const clearFile = async () => {
    if (image) {
      await Storage.remove(image);
    }
    setImage(null);
  };

  return (
    <div className="card w-100">
      <Form.Group>
        <Form.Label className="required">
          Active Prospects to Send a Postcard
        </Form.Label>
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
        <Form.Label className="required">Social Content</Form.Label>
        <RichEditor
          value={content}
          onChange={(event) => setContent(event)}
          placeholder="Please enter your Email Content here. HTML or Plain Text is acceptable."
        />
      </Form.Group>
      <Form.Group>
        <Form.Label className="required">
          Postcard Proof <InfoTooltip description="Postcard Proof" />
        </Form.Label>
        <Form.Text className="text-muted mb-2 d-flex align-items-center">
          {image ? image.substr(37) : "No file selected"}
          {image && (
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
          accept="image/png, image/jpeg"
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
          disabled={!prospects || !image}
          onClick={addAutomatedSocialPost}
        >
          {socialPostInfo.status === SUBSTEP_COMPLETED
            ? "SAVE UPDATES"
            : "ADD AUTOMATED POSTCARD"}
        </Button>
      </div>
    </div>
  );
};

export default AutomatedSocialContent;
