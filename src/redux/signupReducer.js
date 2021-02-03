import { ACTIONS } from "./actionTypes";

const initState = {
  data: null,
  step: null,
};
const signupStore = (state = initState, action) => {
  switch (action.type) {
    case ACTIONS.SET_SINGUP_STEP:
      return {
        ...state,
        step: action.step,
      };
    default:
      return state;
  }
};
export default signupStore;
