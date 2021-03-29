import React from "react";
import "./ProspectDetailsTab.scss";
const ProspectDetailsTab = ({ data }) => {
  return (
    <>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhanced ? "Enhanced " : ""}First Name
        </div>
        <div className="detail-item-value">{data.firstName || "N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhanced ? "Enhanced " : ""}Last Name
        </div>
        <div className="detail-item-value">{data.lastName || "N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhanced ? "Enhanced " : ""}Phone
        </div>
        <div className="detail-item-value">{data.phone || "N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhanced ? "Enhanced " : ""}Phone Type
        </div>
        <div className="detail-item-value">{"Mobile" || "N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhanced ? "Enhanced " : ""}Email
        </div>
        <div className="detail-item-value">{data.email || "N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhanced ? "Enhanced " : ""}Facebook Handle
        </div>
        <div className="detail-item-value">{data.facebook || "N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhanced ? "Enhanced " : ""}Company Name
        </div>
        <div className="detail-item-value">{data.company || "N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhanced ? "Enhanced " : ""}Street Address
        </div>
        <div className="detail-item-value">{data.address1 || "N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhanced ? "Enhanced " : ""}City
        </div>
        <div className="detail-item-value">{data.city || "N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhanced ? "Enhanced " : ""}State
        </div>
        <div className="detail-item-value">{data.state || "N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhanced ? "Enhanced " : ""}Zip
        </div>
        <div className="detail-item-value">{data.zip || "N/A"}</div>
      </div>
    </>
  );
};

export default ProspectDetailsTab;
