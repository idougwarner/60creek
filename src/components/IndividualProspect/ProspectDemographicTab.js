import React from "react";
import "./ProspectDetailsTab.scss";
const ProspectDemographicTab = ({ data }) => {
  return data?.demographic ? (
    <>
      <div className="detail-item">
        <div className="detail-item-label">DOB</div>
        <div className="detail-item-value">{data.demographic.DOB}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Age Range</div>
        <div className="detail-item-value">{data.demographic.ageRange}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Ethnicity</div>
        <div className="detail-item-value">{data.demographic.ethnicCode}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Occupation - Industry</div>
        <div className="detail-item-value">{data.demographic.occupation}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Occupation - Detail</div>
        <div className="detail-item-value">
          {data.demographic.occupationDetail}
        </div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Language</div>
        <div className="detail-item-value">{data.demographic.language}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Religious Affiliation</div>
        <div className="detail-item-value">{data.demographic.religion}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Gender</div>
        <div className="detail-item-value">{data.demographic.gender}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Est. Net Worth</div>
        <div className="detail-item-value">{data.demographic.DOB}</div>
      </div>
    </>
  ) : (
    <>Unavailable demographic data</>
  );
};

export default ProspectDemographicTab;
