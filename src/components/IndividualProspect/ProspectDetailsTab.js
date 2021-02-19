import React from "react";
import "./ProspectDetailsTab.scss";
const ProspectDetailsTab = ({ data }) => {
  return (
    <>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhance ? "Enhanced " : ""}First Name
        </div>
        <div className="detail-item-value">{data.firstName || "N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhance ? "Enhanced " : ""}Last Name
        </div>
        <div className="detail-item-value">{data.lastName || "N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhance ? "Enhanced " : ""}Phone
        </div>
        <div className="detail-item-value">{data.phone || "N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhance ? "Enhanced " : ""}Phone Type
        </div>
        <div className="detail-item-value">{"Mobile" || "N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhance ? "Enhanced " : ""}Email
        </div>
        <div className="detail-item-value">{data.email || "N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhance ? "Enhanced " : ""}Facebook Handle
        </div>
        <div className="detail-item-value">{data.facebook || "N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhance ? "Enhanced " : ""}Company Name
        </div>
        <div className="detail-item-value">{data.company || "N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhance ? "Enhanced " : ""}Street Address
        </div>
        <div className="detail-item-value">{data.address1 || "N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhance ? "Enhanced " : ""}City
        </div>
        <div className="detail-item-value">{data.city || "N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhance ? "Enhanced " : ""}State
        </div>
        <div className="detail-item-value">{data.state || "N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhance ? "Enhanced " : ""}Zip
        </div>
        <div className="detail-item-value">{data.zip || "N/A"}</div>
      </div>
    </>
  );
};

export default ProspectDetailsTab;
