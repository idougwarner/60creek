import React from "react";
import { Tab, Table, Tabs } from "react-bootstrap";
import ComingSoon from "../layout/ComingSoon";
const data = [
  { campaign: "Lorem ipsu", prospects: 127, responses: 64, date: "10/25" },
  { campaign: "Lorem ipsu", prospects: 127, responses: 64, date: "10/25" },
  { campaign: "Lorem ipsu", prospects: 127, responses: 64, date: "10/25" },
  { campaign: "Lorem ipsu", prospects: 127, responses: 64, date: "10/25" },
];
const MarketingCampaignsCard = () => {
  return (
    <>
      <div className="card p-0 mb-5">
        <img src="/assets/images/marketing-campaigns-tmp.png" alt="tmp-img" />
        <ComingSoon />
        {/* <h5 className="mb-4">Campaigns</h5>
        <Tabs defaultActiveKey="current" className="underline-tab">
          <Tab eventKey="current" title="Current">
            <Table responsive="xl" className="data-table">
              <thead>
                <tr>
                  <th>CAMPAIGN</th>
                  <th>PROSPECTS</th>
                  <th>RESPONSES</th>
                  <th>DATE</th>
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
            </Table>
          </Tab>
          <Tab eventKey="upcoming" title="Upcoming"></Tab>
        </Tabs> */}
      </div>
    </>
  );
};

export default MarketingCampaignsCard;
