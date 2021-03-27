import React from "react";
import { Table } from "react-bootstrap";
import InfoTooltip from "../controls/InfoTooltip";
import ComingSoon from "../layout/ComingSoon";
const data = [
  { campaign: "Email", prospects: 2000, opened: 1000, responses: "300" },
  { campaign: "Text", prospects: 2000, opened: 700, responses: "300" },
  { campaign: "Voicemail", prospects: 2000, opened: 1500, responses: "N/A" },
  { campaign: "Facebook", prospects: 2000, opened: 1000, responses: "N/A" },
  { campaign: "Postcard", prospects: 2000, opened: "N/A", responses: "N/A" },
];
const MarketingInteractionRateCard = () => {
  return (
    <>
      <div className="card p-5 mb-5">
        <ComingSoon />
        <h5 className="mb-4">Interaction Rate</h5>
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
                <td>{item.opened}</td>
                <td>{item.responses}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default MarketingInteractionRateCard;
