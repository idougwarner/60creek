import React from "react";
import { connect } from "react-redux";
import {
  serializeProspectLists,
  serializeMarketingCampaigns,
} from "../../redux/store";
import DashboardMarketingSection from "../../components/DashboardSections/DashboardMarketingSection";
import DashboardProspectsSection from "../../components/DashboardSections/DashboardPropsectsSection";
import DashboardMessagesSection from "../../components/DashboardSections/DashboardMessagesSection";
import AddProspectForm from "../../components/AddProspectForm";
// import { createProspectInStore } from '../../redux/actions'
import "./Dashboard.scss";
import ComingSoon from "../../components/layout/ComingSoon";
export class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleAddProspect = this.handleAddProspect.bind(this);
    this.handleAddProspectButtonPushed = this.handleAddProspectButtonPushed.bind(
      this
    );
  }

  handleAddProspect(newProspect) {
    const { onCreatePressed } = this.props;
    onCreatePressed(newProspect);
    this.setState({ showAddProspect: false });
  }

  handleAddProspectButtonPushed() {
    this.setState({ showAddProspect: true });
  }

  render() {
    const { marketingCampaigns, prospectLists } = this.props;

    let addProspectForm = null;
    if (this.state.showAddProspect) {
      addProspectForm = (
        <AddProspectForm
          prospectLists={prospectLists}
          createProspectListInStore={this.handleCreateProspectList}
          addProspect={this.handleAddProspect}
        />
      );
    }
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
  }
}

export default Dashboard;
