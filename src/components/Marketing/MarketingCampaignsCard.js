import React from "react";
import ComingSoon from "../layout/ComingSoon";

const MarketingCampaignsCard = () => {
  return (
    <>
      <div className="card p-5" style={{ minHeight: 500 }}>
        <ComingSoon />
        <h5>Campaigns</h5>
      </div>
    </>
  );
};

export default MarketingCampaignsCard;