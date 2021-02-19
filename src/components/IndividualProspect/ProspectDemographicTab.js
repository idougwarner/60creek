import React from "react";
import "./ProspectDetailsTab.scss";
const ProspectDemographicTab = ({ data }) => {
  return (
    <>
      <div className="detail-item">
        <div className="detail-item-label">DOB</div>
        <div className="detail-item-value">
          {data?.demographic?.DOB || "N/A"}
        </div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Age Range</div>
        <div className="detail-item-value">
          {data?.demographic?.ageRange || "N/A"}
        </div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Ethnicity</div>
        <div className="detail-item-value">
          {data?.demographic?.ethnicCode || "N/A"}
        </div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Occupation - Industry</div>
        <div className="detail-item-value">
          {data?.demographic?.occupation || "N/A"}
        </div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Occupation - Detail</div>
        <div className="detail-item-value">
          {data?.demographic?.occupationDetail || "N/A"}
        </div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Language</div>
        <div className="detail-item-value">
          {data?.demographic?.language || "N/A"}
        </div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Religious Affiliation</div>
        <div className="detail-item-value">
          {data?.demographic?.religion || "N/A"}
        </div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Gender</div>
        <div className="detail-item-value">
          {data?.demographic?.gender || "N/A"}
        </div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Est. Net Worth</div>
        <div className="detail-item-value">
          {data?.demographic?.DOB || "N/A"}
        </div>
      </div>
    </>
  );
};

export default ProspectDemographicTab;
