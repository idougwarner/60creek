import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { APP_URLS } from "../../helpers/routers";
import "./CreateCampaign.scss";
import CreateCampaignWizard from "../../components/Marketing/CreateCampaignWizard";
import { useDispatch, useSelector } from "react-redux";
import { API, graphqlOperation } from "aws-amplify";
import { listProspectLists } from "../../graphql/queries";
import { ACTIONS, CREATE_CAMPAIGN_ACTIONS } from "../../redux/actionTypes";
import AutomatedEmail from "../../components/Marketing/Wizard/Outreach/AutomatedEmail";
import AutomatedText from "../../components/Marketing/Wizard/Outreach/AutomatedText";
import AutomatedRinglessVoicemail from "../../components/Marketing/Wizard/Outreach/AutomatedRinglessVoicemail";
import AutomatedPostCard from "../../components/Marketing/Wizard/Outreach/AutomatedPostCard";
import AutomatedSocialContent from "../../components/Marketing/Wizard/Outreach/AutomatedSocialContent";

const CreateCampaign = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userStore);
  const step = useSelector((state) => state.createCampaignStore.step);
  const substep = useSelector((state) => state.createCampaignStore.substep);
  useEffect(() => {
    if (user) {
      const f = async () => {
        const rtList = await API.graphql(
          graphqlOperation(listProspectLists, {
            filter: { userId: { eq: user.id } },
          })
        );
        if (rtList?.data?.listProspectLists?.items) {
          dispatch({
            type: ACTIONS.SET_PROSPECT_LIST,
            prospectList: rtList.data.listProspectLists.items,
          });
        }
      };
      f();
    }
    // eslint-disable-next-line
  }, [user]);
  useEffect(() => {
    dispatch({ type: CREATE_CAMPAIGN_ACTIONS.INIT });
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <NavLink
        className="d-flex align-items-center mb-4 font-weight-bold"
        to={APP_URLS.MARKETING}
      >
        <img
          src="/assets/icons/chevron-left-blue.svg"
          className="mr-2"
          alt="back"
        />
        BACK TO MARKETING DASHBOARD
      </NavLink>
      <div className="d-flex">
        <div className="left-panel">
          <CreateCampaignWizard />
        </div>
        <div className="right-panel">
          {step === 1 && (
            <div className="substep-container">
              {substep === "email" && <AutomatedEmail />}
              {substep === "text" && <AutomatedText />}
              {substep === "ringlessVoicemail" && (
                <AutomatedRinglessVoicemail />
              )}
              {substep === "postcard" && <AutomatedPostCard />}
              {substep === "socialPost" && <AutomatedSocialContent />}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateCampaign;
