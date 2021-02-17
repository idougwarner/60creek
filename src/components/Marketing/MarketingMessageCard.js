import React from "react";
import ComingSoon from "../layout/ComingSoon";

const MarketingMessageCard = () => {
  return (
    <>
      <div className="card p-5" style={{ minHeight: 500 }}>
        <ComingSoon />
        <h5>Messages</h5>
      </div>
    </>
  );
};

export default MarketingMessageCard;
