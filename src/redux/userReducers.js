import { ACTIONS } from "./actionTypes";

const initState = null
const userStore = (state = initState, action) => {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return action.user
    default:
      return state
  }
}
export default userStore;