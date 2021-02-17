import React from "react";
import "./ProspectDetailsTab.scss";
const ProspectDetailsTab = ({ data }) => {
  return (
    <>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhance ? "Enhanced " : ""}First Name
        </div>
        <div className="detail-item-value">{data.firstName}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhance ? "Enhanced " : ""}Last Name
        </div>
        <div className="detail-item-value">{data.lastName}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhance ? "Enhanced " : ""}Phone
        </div>
        <div className="detail-item-value">{data.phone}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhance ? "Enhanced " : ""}Phone Type
        </div>
        <div className="detail-item-value">{"Mobile"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhance ? "Enhanced " : ""}Email
        </div>
        <div className="detail-item-value">{data.email}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhance ? "Enhanced " : ""}Facebook Handle
        </div>
        <div className="detail-item-value">{data.facebook}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhance ? "Enhanced " : ""}Company Name
        </div>
        <div className="detail-item-value">{data.company}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhance ? "Enhanced " : ""}Street Address
        </div>
        <div className="detail-item-value">{data.address1}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhance ? "Enhanced " : ""}City
        </div>
        <div className="detail-item-value">{data.city}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhance ? "Enhanced " : ""}State
        </div>
        <div className="detail-item-value">{data.state}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">
          {data.enhance ? "Enhanced " : ""}Zip
        </div>
        <div className="detail-item-value">{data.zip}</div>
      </div>
    </>
  );
};

export default ProspectDetailsTab;
