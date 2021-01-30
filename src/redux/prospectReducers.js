import { ACTIONS } from "./actionTypes"

const initState = {
  prospects: null,
  prospectList: null,
}

const prospectStore = (state = initState, action) => {
  switch (action.type) {
    case ACTIONS.SET_PROSPECTS:
      return {
        ...state,
        prospects: action.prospects
      }
    case ACTIONS.SET_PROSPECT_LIST:
      return {
        ...state,
        prospectList: action.prospectList
      }
    default:
      return state
  }
}

export default prospectStore;