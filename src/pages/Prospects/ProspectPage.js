import { API, graphqlOperation } from "aws-amplify";
import React, { useEffect, useRef, useState } from "react";
import { Dropdown, Spinner, Tab, Tabs } from "react-bootstrap";
import { NavLink, useParams } from "react-router-dom";
import { APP_URLS } from "../../helpers/routers";
import { listProspects } from "../../graphql/queries";
import "./ProspectPage.scss";
import ProspectListTab from "../../components/IndividualProspect/ProspectListTab";
import Messages from "../../components/IndividualProspect/Messages";
import ProspectDetailsTab from "../../components/IndividualProspect/ProspectDetailsTab";
import ProspectDemographicTab from "../../components/IndividualProspect/ProspectDemographicTab";
import ProspectHomeTab from "../../components/IndividualProspect/ProspectHomeTab";
import { INTERESTE_STATUS } from "../../components/Prospects/FilterDropdown";
import { updateProspect } from "../../graphql/mutations";
import { ToastContainer, toast } from "react-toastify";

const ProspectPage = () => {
  const [data, setData] = useState(null);
  const [interested, setInterested] = useState(INTERESTE_STATUS.UNKNOWN);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  useEffect(async () => {
    if (id) {
      try {
        setLoading(true);
        const rt = await API.graphql(
          graphqlOperation(listProspects, { filter: { id: { eq: id } } })
        );
        if (rt.data.listProspects.items) {
          setData(rt.data.listProspects.items[0]);
        }
      } catch (err) {}
      setLoading(false);
    }
  }, [id]);
  useEffect(() => {
    if (data) {
      if (data.interested === INTERESTE_STATUS.INTERESTED) {
        setInterested(INTERESTE_STATUS.INTERESTED);
      } else if (data.interested === INTERESTE_STATUS.NOT_INTERESTED) {
        setInterested(INTERESTE_STATUS.NOT_INTERESTED);
      } else {
        setInterested(INTERESTE_STATUS.UNKNOWN);
      }
    }
  }, [data]);
  const changeInterested = (value) => {
    setInterested(value);
    updateData({ interested: value });
  };
  const updateData = async (newDt) => {
    const newData = {
      ...data,
      ...newDt,
    };
    try {
      setData(newData);
      const putData = { ...newData };
      delete putData.prospectList;
      delete putData.createdAt;
      delete putData.updatedAt;
      const rt = await API.graphql(
        graphqlOperation(updateProspect, { input: putData })
      );
      toast.success("Updated successfully.");
    } catch (err) {
      toast.error("Failed to update item.");
    }
  };
  return (
    <>
      <ToastContainer />
      <NavLink
        className="d-flex align-items-center mb-4 font-weight-bold"
        to={APP_URLS.PROSPECTS}
      >
        <img src="/assets/icons/chevron-left-blue.svg" className="mr-2" />
        BACK TO PROSPECT LIST
      </NavLink>
      {loading && (
        <div className="d-flex align-items-center justify-content-center p-5">
          <Spinner size="lg" animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )}
      {data && !loading && (
        <div className="row">
          <div className="col-12 col-sm-5 col-xl-4">
            <div className="card p-4">
              <div className="d-flex justify-content-between">
                <div className="mb-4">
                  <h4>{data.firstName + " " + data.lastName}</h4>
                  <div className="summary-item">
                    Prospect List <span>{data.prospectList.name}</span>
                  </div>
                  <div className="summary-item">
                    Marketing Attempts <span>{2}</span>
                  </div>
                  <div className="summary-item">
                    Last Attempt{" "}
                    <span>{new Date(data.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <Dropdown>
                  <Dropdown.Toggle
                    className="interested"
                    variant="link"
                    id="dropdown-basic"
                  >
                    <span>{interested}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="interested-menu">
                    <Dropdown.Item
                      className={
                        interested === INTERESTE_STATUS.UNKNOWN ? "active" : ""
                      }
                      onClick={() => changeInterested(INTERESTE_STATUS.UNKNOWN)}
                    >
                      {INTERESTE_STATUS.UNKNOWN}
                    </Dropdown.Item>
                    <Dropdown.Item
                      className={
                        interested === INTERESTE_STATUS.INTERESTED
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        changeInterested(INTERESTE_STATUS.INTERESTED)
                      }
                    >
                      {INTERESTE_STATUS.INTERESTED}
                    </Dropdown.Item>
                    <Dropdown.Item
                      className={
                        interested === INTERESTE_STATUS.NOT_INTERESTED
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        changeInterested(INTERESTE_STATUS.NOT_INTERESTED)
                      }
                    >
                      {INTERESTE_STATUS.NOT_INTERESTED}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              <Tabs defaultActiveKey="list" id="uncontrolled-tab-example">
                <Tab eventKey="list" title="LIST">
                  <ProspectListTab
                    data={data}
                    changeData={(event) => updateData(event)}
                  />
                </Tab>
                <Tab eventKey="details" title="DETAILS">
                  <ProspectDetailsTab data={data} />
                </Tab>
                <Tab eventKey="demographics" title="DEMOGRG.">
                  <ProspectDemographicTab data={data} />
                </Tab>
                <Tab eventKey="home" title="HOME">
                  <ProspectHomeTab data={data} />
                </Tab>
              </Tabs>
            </div>
          </div>
          <div className="col-12 col-sm-7 col-xl-8">
            <div className="card p-4">
              <Messages />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProspectPage;
