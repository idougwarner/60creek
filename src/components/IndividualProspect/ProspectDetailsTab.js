import React from "react";
import "./ProspectDetailsTab.scss";
const ProspectDetailsTab = ({ data }) => {
  return (
    <>
      {data.enhance && (
        <div className="detail-item">
          <div className="detail-item-label">Enhanced First Name</div>
          <div className="detail-item-value">{data.firstName}</div>
        </div>
      )}
      <div className="detail-item">
        <div className="detail-item-label">First Name</div>
        <div className="detail-item-value">{data.firstName}</div>
      </div>
      {data.enhance && (
        <div className="detail-item">
          <div className="detail-item-label">Enhanced Last Name</div>
          <div className="detail-item-value">{data.lastName}</div>
        </div>
      )}
      <div className="detail-item">
        <div className="detail-item-label">Last Name</div>
        <div className="detail-item-value">{data.lastName}</div>
      </div>
      {data.enhance && (
        <div className="detail-item">
          <div className="detail-item-label">Enhanced Phone</div>
          <div className="detail-item-value">{data.phone}</div>
        </div>
      )}
      <div className="detail-item">
        <div className="detail-item-label">Phone</div>
        <div className="detail-item-value">{data.phone}</div>
      </div>
      {data.enhance && (
        <div className="detail-item">
          <div className="detail-item-label">Enhanced Phone Type</div>
          <div className="detail-item-value">{"Mobile"}</div>
        </div>
      )}
      {data.enhance && (
        <div className="detail-item">
          <div className="detail-item-label">Enhanced Email Address</div>
          <div className="detail-item-value">{data.email}</div>
        </div>
      )}
      <div className="detail-item">
        <div className="detail-item-label">Email</div>
        <div className="detail-item-value">{data.email}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Facebook Handle</div>
        <div className="detail-item-value">{data.facebook}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Company Name</div>
        <div className="detail-item-value">{data.company}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Street Address</div>
        <div className="detail-item-value">{data.address1}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">City</div>
        <div className="detail-item-value">{data.city}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">State</div>
        <div className="detail-item-value">{data.state}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Zip</div>
        <div className="detail-item-value">{data.zip}</div>
      </div>
    </>
  );
};

export default ProspectDetailsTab;
