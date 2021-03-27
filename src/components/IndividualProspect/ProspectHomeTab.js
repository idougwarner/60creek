import React from "react";
import "./ProspectDetailsTab.scss";
const ProspectHomeTab = ({ data }) => {
  return (
    <>
      <div className="detail-item">
        <div className="detail-item-label">Single Parent</div>
        <div className="detail-item-value">
          {data?.demographic?.singleParent || "N/A"}
        </div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Senior Adult in Household</div>
        <div className="detail-item-value">
          {data?.demographic?.seniorAdultInHousehold || "N/A"}
        </div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Young Adult in Household</div>
        <div className="detail-item-value">
          {data?.demographic?.youngAdultInHousehold || "N/A"}
        </div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Career Women in Household</div>
        <div className="detail-item-value">
          {data?.demographic?.workingWoman || "N/A"}
        </div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Small Office / Home Office</div>
        {/* <div className="detail-item-value">{data.demographic.}</div> */}
        <div className="detail-item-value">{"N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Business Owner</div>
        <div className="detail-item-value">
          {data?.demographic?.businessOwner || "N/A"}
        </div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Marital Status</div>
        <div className="detail-item-value">
          {data?.demographic?.maritalStatusInHousehold || "N/A"}
        </div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Own/Rent</div>
        <div className="detail-item-value">
          {data?.demographic?.homeOwnerRenter || "N/A"}
        </div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Number of Children</div>
        <div className="detail-item-value">
          {data?.demographic?.numberOfChildren || "N/A"}
        </div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Education</div>
        <div className="detail-item-value">
          {data?.demographic?.education || "N/A"}
        </div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Prescense of Children</div>
        <div className="detail-item-value">
          {data?.demographic?.prescenseOfChildren || "N/A"}
        </div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Est. Household Income</div>
        {/* <div className="detail-item-value">{data.demographic.}</div> */}
        <div className="detail-item-value">{"N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Length of Residence</div>
        {/* <div className="detail-item-value">{data.demographic.}</div> */}
        <div className="detail-item-value">{"N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Home Purchase Date</div>
        {/* <div className="detail-item-value">{data.demographic.}</div> */}
        <div className="detail-item-value">{"N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Est. Home Value</div>
        {/* <div className="detail-item-value">{data.demographic.}</div> */}
        <div className="detail-item-value">{"N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Est. Home Purchase Price</div>
        {/* <div className="detail-item-value">{data.demographic.}</div> */}
        <div className="detail-item-value">{"N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Dwelling Type</div>
        {/* <div className="detail-item-value">{data.demographic.}</div> */}
        <div className="detail-item-value">{"N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Number of Credit Lines</div>
        {/* <div className="detail-item-value">{data.demographic.}</div> */}
        <div className="detail-item-value">{"N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Credit Card Holder</div>
        {/* <div className="detail-item-value">{data.demographic.}</div> */}
        <div className="detail-item-value">{"N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Gas Credit Card Holder</div>
        {/* <div className="detail-item-value">{data.demographic.}</div> */}
        <div className="detail-item-value">{"N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Auto Year</div>
        {/* <div className="detail-item-value">{data.demographic.}</div> */}
        <div className="detail-item-value">{"N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Auto Make</div>
        {/* <div className="detail-item-value">{data.demographic.}</div> */}
        <div className="detail-item-value">{"N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Auto Model</div>
        {/* <div className="detail-item-value">{data.demographic.}</div> */}
        <div className="detail-item-value">{"N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Auto Edition</div>
        {/* <div className="detail-item-value">{data.demographic.}</div> */}
        <div className="detail-item-value">{"N/A"}</div>
      </div>
      <div className="detail-item">
        <div className="detail-item-label">Upscale Card Holder</div>
        {/* <div className="detail-item-value">{data.demographic.}</div> */}
        <div className="detail-item-value">{"N/A"}</div>
      </div>
    </>
  );
};

export default ProspectHomeTab;
