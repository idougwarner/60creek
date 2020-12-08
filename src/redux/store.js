import { createStore, combineReducers } from 'redux'
import { prospectLists, prospects, marketingCampaigns } from './reducers'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

//******************************************************************
//*
//* Reducers-- Redux reducers AND persist store
//*
//******************************************************************

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

//******************************************************************
//*
//* Serializers-- expand record to include sub-records where possible
//*
//******************************************************************

export const serializeMarketingCampaign = (marketingCampaign) => {
  if (marketingCampaign) {
    let mutableMarketingCampaign = { ...marketingCampaign }
    if (!mutableMarketingCampaign.prospectList) {
      const prospectList = store.getState().prospectLists.find(pl => {
        return pl.id === marketingCampaign.prospectListId
      })
      if (prospectList) {
        mutableMarketingCampaign.prospectList = { ...prospectList }
      }
    }
    return mutableMarketingCampaign
  }
  return null
}

export const serializeMarketingCampaigns = (marketingCampaigns) => {
  if (marketingCampaigns && marketingCampaigns.length) {
    let mutableMarketingCampaigns = marketingCampaigns.map(mc => {
      let mutableMarketingCampaign = serializeMarketingCampaign(mc)
      return mutableMarketingCampaign
    })
    return mutableMarketingCampaigns
  }
  return []
}

export const serializeProspectList = (prospectList) => {
  if (prospectList) {
    let mutableProspectList = { ...prospectList }
    mutableProspectList.prospects = []
    store.getState().prospects.forEach(prospect => {
      if (prospect.prospectListId === mutableProspectList.id) {
        mutableProspectList.prospects.push({ ...prospect })
      }
    })
    return mutableProspectList
  }
  return null
}

export const serializeProspect = (prospect) => {
  if (prospect) {
    let mutableProspect = { ...prospect }
    if (mutableProspect.prospectListId && !mutableProspect.prospectList) {
      const prospectList = store.getState().prospectLists.find(pl => { return pl.id === mutableProspect.prospectListId })
      if (prospectList) {
        mutableProspect.prospectList = { ...prospectList }
      }
    }
    return mutableProspect
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