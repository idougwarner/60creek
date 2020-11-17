import { CREATE_PROSPECT, UPDATE_PROSPECT, REMOVE_PROSPECT } from './actions'

export const prospects = (state = [], action) => {
  const { type, payload } = action
  switch (type) {
    case CREATE_PROSPECT: {
      const { id, status, prospectList, firstName, lastName, companyName, enhancedPhone, enhancedEmail, enhancedFacebookHandle, details } = payload
      const newProspect = { id, status, prospectList, firstName, lastName, companyName, enhancedPhone, enhancedEmail, enhancedFacebookHandle, details }
      if (!state.find(prospect => prospect.id === id)) {
        return state.concat(newProspect)
      }
      else {

        // If it already exists, just update it
        return state.map(prospect => {
          if (prospect.id === newProspect.id) {
            return newProspect
          }
          else {
            return prospect
          }
        })
      }
    }
      
    case UPDATE_PROSPECT: {
      const { id, status, prospectList, firstName, lastName, companyName, enhancedPhone, enhancedEmail, enhancedFacebookHandle, details } = payload
      const updatedProspect = { id, status, prospectList, firstName, lastName, companyName, enhancedPhone, enhancedEmail, enhancedFacebookHandle, details }
      return state.map(prospect => {
        if (prospect.id === updatedProspect.id) {
          return updatedProspect
        }
        else {
          return prospect
        }
      })
    }
      
    case REMOVE_PROSPECT: {
      const { id } = payload
      return state.filter(prospect => prospect.id === id)
    }
    default:
      return state
  }
}