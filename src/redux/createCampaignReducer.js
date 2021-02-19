import { CREATE_CAMPAIGN_ACTIONS } from "./actionTypes";

const initState = {
  step: 0,
  substep: "",

  details: {
    campaignTitle: "",
    targetList: "",
  },
  outreach: {
    email: {
      status: "",
      prospects: "",
      message: "",
    },
    text: {
      status: "",
      prospects: "",
      text: "",
    },
    ringlessVoicemail: {
      status: "",
      prospects: "",
      file: "",
      phone: "",
    },
    postCard: {
      status: "",
      prospects: "",
      file: null,
    },
    socialPost: {
      status: "",
      prospects: "",
      image: "",
      content: "",
    },
  },
  timeline: {
    start: null,
    end: null,
    consent: false,
  },
  checkout: {
    discount: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    securityCode: "",
    cardholderName: "",
  },
};

const createCampaignStore = (state = initState, action) => {
  switch (action.type) {
    case CREATE_CAMPAIGN_ACTIONS.UPDATE_STEP:
      return {
        ...state,
        step: action.data,
      };
    case CREATE_CAMPAIGN_ACTIONS.UPDATE_SUBSTEP:
      return {
        ...state,
        substep: action.data,
      };
    case CREATE_CAMPAIGN_ACTIONS.UPDATE_DETAILS:
      return {
        ...state,
        details: action.data,
      };
    case CREATE_CAMPAIGN_ACTIONS.UPDATE_OUTREACH_EMAIL:
      return {
        ...state,
        outreach: {
          ...state.outreach,
          email: action.data,
        },
      };
    case CREATE_CAMPAIGN_ACTIONS.UPDATE_OUTREACH_TEXT:
      return {
        ...state,
        outreach: {
          ...state.outreach,
          text: action.data,
        },
      };
    case CREATE_CAMPAIGN_ACTIONS.UPDATE_OUTREACH_RINGLESS_VOICEMAIL:
      return {
        ...state,
        outreach: {
          ...state.outreach,
          ringlessVoicemail: action.data,
        },
      };
    case CREATE_CAMPAIGN_ACTIONS.UPDATE_OUTREACH_POST_CARD:
      return {
        ...state,
        outreach: {
          ...state.outreach,
          postCard: action.data,
        },
      };
    case CREATE_CAMPAIGN_ACTIONS.UPDATE_OUTREACH_SOCIAL_POST:
      return {
        ...state,
        outreach: {
          ...state.outreach,
          socialPost: action.data,
        },
      };
    case CREATE_CAMPAIGN_ACTIONS.UPDATE_TIMELINE:
      return {
        ...state,
        timeline: action.data,
      };
    case CREATE_CAMPAIGN_ACTIONS.UPDATE_CHECKOUT:
      return {
        ...state,
        checkout: action.data,
      };
    default:
      return state;
  }
};

export default createCampaignStore;
