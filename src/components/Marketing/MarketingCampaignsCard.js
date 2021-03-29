import React from "react";
import { Tab, Table, Tabs } from "react-bootstrap";
import ComingSoon from "../layout/ComingSoon";
const data = [
  { campaign: "Campaign 1", prospects: 2000, responses: 900, date: "10/25" },
  { campaign: "Holiday Camp", prospects: 2000, responses: 900, date: "11/25" },
  { campaign: "Campaign 2", prospects: 2000, responses: 900, date: "12/29" },
  { campaign: "Campaign 3", prospects: 2000, responses: 900, date: "01/25" },
];
const MarketingCampaignsCard = () => {
  return (
    <>
      <div className="card p-5 mb-5">
        <ComingSoon />
        <h5 className="mb-4">Campaigns</h5>
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
        </Tabs>
      </div>
    </>
  );
};

export default MarketingCampaignsCard;
