import { ACTIONS } from "./actionTypes";

export const WORKER_STATUS = {
  IDLE: "idle",
  START: "start",
  COMPLETED: "completed",
  CHANGE: "change",
  ERROR: "error",
};

const initState = {
  status: "idle",
  uploaded: 0,
  estimate: "",
  percentage: 0,
  prospectListId: "",
};

const uploadWorkerStore = (state = initState, action) => {
  switch (action.type) {
    case ACTIONS.START_UPLOADE_WORKER:
      return {
        ...state,
        status: WORKER_STATUS.START,
        uploaded: 0,
        estimate: "",
        percentage: 0,
      };
    case ACTIONS.UPDATE_UPLOADE_WORKER:
      return {
        ...state,
        status: WORKER_STATUS.CHANGE,
        uploaded: action.uploaded,
        estimate: action.estimate || "",
        percentage: action.percentage,
      };
    case ACTIONS.COMPLETED_UPLOADE_WORKER:
      return {
        ...state,
        status: WORKER_STATUS.COMPLETED,
        estimate: "",
        percentage: 100,
        prospectListId: action.prospectListId,
      };
    case ACTIONS.ERROR_UPLOADE_WORKER:
      return {
        ...state,
        status: WORKER_STATUS.ERROR,
      };
    case ACTIONS.IDLE_UPLOADE_WORKER:
      return {
        ...state,
        status: WORKER_STATUS.IDLE,
        uploaded: 0,
        estimate: "",
        percentage: 0,
      };
    default:
      return state;
  }
};

export default uploadWorkerStore;
