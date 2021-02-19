import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import Select from "react-select";
import { customSelectStyles } from "../../../assets/styles/select-style";
import { APP_URLS } from "../../../helpers/routers";
import { CREATE_CAMPAIGN_ACTIONS } from "../../../redux/actionTypes";
import InfoTooltip from "../../controls/InfoTooltip";

const WizardDetailsStep = () => {
  const [campaignTitle, setCampaignTitle] = useState("");
  const [selectedList, setSelectedList] = useState(null);

  const list = useSelector((state) => state.prospectStore.prospectList) || [];
  const dispatch = useDispatch();
  const gotoNextStep = () => {
    dispatch({ type: CREATE_CAMPAIGN_ACTIONS.UPDATE_STEP, data: 1 });
  };
  return (
    <div>
      <Form.Group>
        <Form.Label className="required">Marketing Campaign Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Campaign Name"
          value={campaignTitle}
          className={campaignTitle ? "completed" : ""}
          onChange={(e) => setCampaignTitle(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label className="required">
          Target List
          <InfoTooltip description="Which Prospect List do you want to market to?" />
        </Form.Label>
        {list && list.length > 0 ? (
          <Select
            placeholder="Select Prospect List"
            options={list.map((item) => ({ label: item.name, value: item.id }))}
            value={selectedList}
            styles={customSelectStyles("40px", selectedList ? true : false)}
            onChange={(value) => setSelectedList(value)}
          />
        ) : (
          <NavLink to={APP_URLS.PROSPECTS} className="d-block">
            No Prospect Lists found. Create one now!
          </NavLink>
        )}
      </Form.Group>
      <Button
        variant="primary"
        size="lg"
        className="w-100 mb-3"
        disabled={!campaignTitle || !selectedList}
        onClick={() => gotoNextStep()}
      >
        NEXT
      </Button>

      <NavLink className="btn btn-lg btn-light w-100" to={APP_URLS.MARKETING}>
        CANCEL
      </NavLink>
    </div>
  );
};

export default WizardDetailsStep;
