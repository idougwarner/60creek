import React from "react";
import { Table } from "react-bootstrap";
import InfoTooltip from "../controls/InfoTooltip";
import ComingSoon from "../layout/ComingSoon";
const data = [
  { campaign: "Lorem ipsu", prospects: 127, responses: 64, date: "10/25" },
  { campaign: "Lorem ipsu", prospects: 127, responses: 64, date: "10/25" },
  { campaign: "Lorem ipsu", prospects: 127, responses: 64, date: "10/25" },
  { campaign: "Lorem ipsu", prospects: 127, responses: 64, date: "10/25" },
];
const MarketingInteractionRateCard = () => {
  return (
    <>
      <div className="card p-0 mb-5">
        <ComingSoon />
        <img
          src="/assets/images/marketing-interation-rate-tmp.png"
          alt="tmp-img"
        />
        {/* <h5 className="mb-4">Interaction Rate</h5>
        <Table responsive="xl" className="data-table">
          <thead>
            <tr>
              <th>METHOD</th>
              <th>SENT</th>
              <th>
                OPENED
                <InfoTooltip description="Opened" />
              </th>
              <th>RESPONDED</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} className="clickable">
                <td>{item.campaign}</td>
                <td>{item.prospects}</td>
                <td>{item.responses}</td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </Table> */}
      </div>
    </>
  );
};

export default MarketingInteractionRateCard;
