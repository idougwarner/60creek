import {
  CREATE_USER_IN_STORE, REMOVE_USER_FROM_STORE,
  CREATE_PROSPECT_LIST_IN_STORE, REMOVE_PROSPECT_LIST_FROM_STORE, CREATE_PROSPECT_IN_STORE, UPDATE_PROSPECT_IN_STORE, REMOVE_PROSPECT_FROM_STORE,
  CREATE_MARKETING_CAMPAIGN_IN_STORE, UPDATE_MARKETING_CAMPAIGN_IN_STORE, REMOVE_MARKETING_CAMPAIGN_FROM_STORE
} from './actions'

export const users = (state = [], action) => {
  const { type, payload } = action
  switch (type) {
    case CREATE_USER_IN_STORE: {
      const mutableuser = { ...payload }
      if (!state.find(user => user.id === mutableuser.id)) {
        return state.concat(mutableuser)
      }
      else {
        return state
      }
    }
      
    case REMOVE_USER_FROM_STORE: {
      const { id } = payload
      return state.filter(user => {
        return (user.id !== id) 
      })
    }
      
    default:
      return state
  }
}

export const prospectLists = (state = [], action) => {
  const { type, payload } = action
  switch (type) {
    case CREATE_PROSPECT_LIST_IN_STORE: {
      const mutableProspectList = { ...payload }
      if (!state.find(prospectList => prospectList.id === mutableProspectList.id)) {
        return state.concat(mutableProspectList)
      }
      else {
        return state
      }
    }
      
    case REMOVE_PROSPECT_LIST_FROM_STORE: {
      const { id } = payload
      return state.filter(prospectList => {
        return (prospectList.id !== id) 
      })
    }
      
    default:
      return state
  }
}

export const prospects = (state = [], action) => {
  const { type, payload } = action
  switch (type) {
    case CREATE_PROSPECT_IN_STORE:
    case UPDATE_PROSPECT_IN_STORE: {
      const mutableProspect = { ...payload }
      const prospect = state.find(prospect => prospect.id === mutableProspect.id)
      if (!prospect) {
        return state.concat(mutableProspect)
      }
      else {
        return state.map(prospect => {
          if (prospect.id === mutableProspect.id) {
            return mutableProspect
          }
          else {
            return prospect
          }
        })
      }
    }
      
    case REMOVE_PROSPECT_FROM_STORE: {
      const { id } = payload
      return state.filter(prospect => {
        return (prospect.id !== id) 
      })
    }
    default:
      return state
  }
}

export const marketingCampaigns = (state = [], action) => {
  const { type, payload } = action
  switch (type) {
    case CREATE_MARKETING_CAMPAIGN_IN_STORE:
    case UPDATE_MARKETING_CAMPAIGN_IN_STORE: {
      const mutableMarketingCampaign = { ...payload }
      if (!state.find(marketingCampaign => marketingCampaign.id === mutableMarketingCampaign.id)) {
        return state.concat(mutableMarketingCampaign)
      }
      else {
        return state.map(pl => {
          if (pl.id === mutableMarketingCampaign.id) {
            return mutableMarketingCampaign
          }
          else {
            return pl
          }
        })
      }
    }
      
    case REMOVE_MARKETING_CAMPAIGN_FROM_STORE: {
      const { id } = payload
      return state.filter(marketingCampaign => {
        return (marketingCampaign.id !== id) 
      })
    }
     
    default:
      return state
  }
}