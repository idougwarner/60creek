import React from "react";
import Messages from "../IndividualProspect/Messages";
import ComingSoon from "../layout/ComingSoon";

const MarketingMessageCard = () => {
  return (
    <>
      <div className="card" style={{ minHeight: 500 }}>
        <ComingSoon />
        <Messages showSearchList={true} />
      </div>
    </>
  );
};

export default MarketingMessageCard;
