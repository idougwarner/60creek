import { CREATE_CAMPAIGN_ACTIONS } from "./actionTypes";

const initState = {
  step: 0,
  substep: "",

  defaultProspects: 0,

  details: {
    campaignTitle: "",
    targetList: null,
  },
  outreach: {
    email: {
      status: "",
      prospects: 0,
      message: "",
      replyEmail: "",
    },
    text: {
      status: "",
      prospects: 0,
      text: "",
      phone: "",
    },
    ringlessVoicemail: {
      status: "",
      prospects: 0,
      file: "",
      phone: "",
    },
    postcard: {
      status: "",
      prospects: 0,
      file: "",
    },
    socialPost: {
      status: "",
      prospects: 0,
      image: "",
      content: "",
    },
  },
  timeline: {
    day: null,
    month: null,
    year: null,
    hour: null,
    minute: null,
    am: null,
    consent: false,
  },
  checkout: {
    brand: "",
    last4: "",
    total: 0,
    discount: 0,
    email: "",
  },
};

const createCampaignStore = (state = initState, action) => {
  switch (action.type) {
    case CREATE_CAMPAIGN_ACTIONS.INIT:
      return {
        ...initState,
      };
    case CREATE_CAMPAIGN_ACTIONS.UPDATE_STEP:
      return {
        ...state,
        step: action.data,
      };
    case CREATE_CAMPAIGN_ACTIONS.UPDATE_DEFAULT_PROSPECTS:
      return {
        ...state,
        defaultProspects: action.data,
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
          postcard: action.data,
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
