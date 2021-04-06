import { ACTIONS } from './actionTypes';

const initState = {
  prospectListId: '',
};

const uploadWorkerStore = (state = initState, action) => {
  switch (action.type) {
    case ACTIONS.SET_COMPLETED_PROSPECT_LIST_ID:
      return {
        ...state,
        prospectListId: action.data.prospectListId,
      };
    default:
      return state;
  }
};

export default uploadWorkerStore;
