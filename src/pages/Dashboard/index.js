import React from "react";
import "./Dashboard.scss";
import ComingSoon from "../../components/layout/ComingSoon";
const Dashboard = () => {
  return (
    <div className="position-relative vh-100">
      <h4>Dashboard</h4>
      <ComingSoon />
      {/* <div className="g-page-background-with-nav">
          <div className="g-page-header">
            <div className="g-page-title">Dashboard</div>
          </div>

          {addProspectForm}

          <div
            className="g-page-content"
            onClick={() => {
              this.setState({ showAddProspect: false });
            }}
          >
            <div className="g-page-content-column column-one">
              <DashboardMarketingSection
                marketingCampaigns={marketingCampaigns}
              />
              <DashboardProspectsSection
                prospectLists={prospectLists}
                addProspect={this.handleAddProspectButtonPushed}
              />
            </div>
            <div className="g-page-content-column">
              <DashboardMessagesSection />
            </div>
          </div>
        </div> */}
    </div>
  );
};

export default Dashboard;
