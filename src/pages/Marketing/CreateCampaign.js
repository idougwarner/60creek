import React from "react";
import { NavLink } from "react-router-dom";
import { APP_URLS } from "../../helpers/routers";
import "./CreateCampaign.scss";
import CreateCampaignWizard from "../../components/Marketing/CreateCampaignWizard";

const CreateCampaign = () => {
  return (
    <>
      <NavLink
        className="d-flex align-items-center mb-4 font-weight-bold"
        to={APP_URLS.MARKETING}
      >
        <img src="/assets/icons/chevron-left-blue.svg" className="mr-2" />
        BACK TO MARKETING DASHBOARD
      </NavLink>
      <div className="d-flex">
        <div className="left-panel">
          <CreateCampaignWizard />
        </div>
        <div className="right-panel"></div>
      </div>
    </>
  );
};

export default CreateCampaign;
