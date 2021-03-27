import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import MarketingCampaignsCard from "../../components/Marketing/MarketingCampaignsCard";
import MarketingInteractionRateCard from "../../components/Marketing/MarketingInteractionRateCard";
import MarketingMessageCard from "../../components/Marketing/MarketingMessageCard";
import { APP_URLS } from "../../helpers/routers";
import "./Marketing.scss";

const Marketing = () => {
  const [current] = useState(0);
  const [upcoming] = useState(0);
  return (
    <>
      <div className="d-flex align-items-end mb-4">
        <h4 className="mb-0 mr-4">Marketing</h4>
        <div className="marketing-summary mr-3">
          Current <span>{current}</span>
        </div>
        <div className="marketing-summary">
          Upcoming <span>{upcoming}</span>
        </div>
      </div>
      <div className="d-flex mb-4">
        {/* <DropdownButton
          title="Campaign Name"
          variant="outline-primary"
          className="mr-3"
        >
          <div class="px-3">Campaigns</div>
        </DropdownButton> */}
        <NavLink className="btn btn-primary" to={APP_URLS.CREATE_CAMPAIGN}>
          NEW CAMPAIGN
        </NavLink>
      </div>
      <div className="row">
        <div className="col-12 col-md-6">
          <MarketingCampaignsCard />
          <MarketingInteractionRateCard />
        </div>
        <div className="col-12 col-md-6">
          <MarketingMessageCard />
        </div>
      </div>
    </>
  );
};

export default Marketing;
