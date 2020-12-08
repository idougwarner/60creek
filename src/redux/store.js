import { createStore, combineReducers } from 'redux'
import { prospectLists, prospects, marketingCampaigns } from './reducers'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

const reducers = {
  prospectLists,
  prospects,
  marketingCampaigns,
}

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2
}

const rootReducer = combineReducers(reducers)
const persistedReducer = persistReducer(persistConfig, rootReducer)

export let store = null

export const configureStore = () => {
  store = createStore(persistedReducer)
  return store
}

export const serializeMarketingCampaign = (id) => {
  if (store.getState().marketingCampaigns) {
    let marketingCampaign = store.getState().marketingCampaigns.find(mc => {
      return mc.id === id
    })
    if (marketingCampaign) {
      const prospectList = store.getState().prospectLists.find(pl => {
        return pl.id === marketingCampaign.prospectListId
      })
      let mutableMarketingCampaign = { ...marketingCampaign }
      if (prospectList) {
        mutableMarketingCampaign.prospectList = { ...prospectList }
        return mutableMarketingCampaign
      }
    }
  }
  return null
}

export const serializeMarketingCampaigns = (marketingCampaigns) => {
  if (marketingCampaigns && marketingCampaigns.length) {
    let mutableMarketingCampaigns = marketingCampaigns.map(mc => {
      let mutableMarketingCampaign = serializeMarketingCampaign(mc.id)
      return mutableMarketingCampaign
    })
    return mutableMarketingCampaigns
  }
  return []
}

export const serializeProspectList = (id) => {
  if (store.getState().prospectLists) {
    let prospectList = store.getState().prospectLists.find(pl => {
      return pl.id === id
    })
    if (prospectList) {
      let mutableProspectList = { ...prospectList }
      mutableProspectList.prospects = []
      store.getState().prospects.forEach(prospect => {
        if (prospect.prospectListId === id) {
          mutableProspectList.prospects.push({ ...prospect })
        }
      })
      return mutableProspectList
    }
  }
  return null
}

export const serializeProspect = (id) => {
  if (store.getState().prospects) {
    let prospect = store.getState().prospects.find(pl => {
      return pl.id === id
    })
    if (prospect) {
      let mutableProspect = { ...prospect }
      if (mutableProspect.prospectListId) {
        const prospectList = store.getState().prospectLists.find(pl => { return pl.id === mutableProspect.prospectListId })
        if (prospectList) {
          mutableProspect.prospectList = { ...prospectList }
        }
      }
      return mutableProspect
    }
  }
  return null
}

export const serializeProspectLists = (prospectLists) => {
  if (prospectLists && prospectLists.length) {
    let mutableProspectLists = prospectLists.map(pl => {
      let mutableProspectList = serializeProspectList(pl.id)
      return mutableProspectList
    })
    return mutableProspectLists
  }
  return []
}