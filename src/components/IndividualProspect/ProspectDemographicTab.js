import React from "react";
import "./ProspectDetailsTab.scss";
const ProspectDemographicTab = ({ data }) => {
  return (
    <>
      <div className="detail-item">
        <div className="detail-item-label">DOB</div>
        <div className="detail-item-value">{"6/9/53"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Age Range</div>
        <div className="detail-item-value">{67}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Ethnicity</div>
        <div className="detail-item-value">{"Caucasian"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Company Name</div>
        <div className="detail-item-value">{data.company}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Occupation - Industry</div>
        <div className="detail-item-value">{"Self-Employed"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Occupation-Detail</div>
        <div className="detail-item-value">{"Private Detectives"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Language</div>
        <div className="detail-item-value">{"English, Spanish"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Religious Affiliation</div>
        <div className="detail-item-value">{"Non-denominational"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Gender</div>
        <div className="detail-item-value">{"Male"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Est. Net Worth</div>
        <div className="detail-item-value">{""}</div>
      </div>
    </>
  );
};

export default ProspectDemographicTab;
