import { serializeMarketingCampaign, serializeProspectList, serializeProspect, serializeProspectLists } from './store'

const apiServer = 'http://localhost:5000'

function normalizeProspectList(prospectList) {
  let mutableProspectList = { ...prospectList }
  delete mutableProspectList.prospects
  return mutableProspectList
}
export const CREATE_PROSPECT_LIST_IN_STORE = 'CREATE_PROSPECT_LIST_IN_STORE'
export const createProspectListInStore = (prospectList) => ({
  type: CREATE_PROSPECT_LIST_IN_STORE,
  payload: normalizeProspectList(prospectList),
})

export const REMOVE_PROSPECT_LIST_FROM_STORE = 'REMOVE_PROSPECT_LIST_FROM_STORE'
export const removeProspectListFromStore = (prospectList) => ({
  type: REMOVE_PROSPECT_LIST_FROM_STORE,
  payload: normalizeProspectList(prospectList),
})

export const FETCH_PROSPECT_LIST = 'FETCH_PROSPECT_LIST'
export const fetchProspectList = async (id) => {
  fetch(`${apiServer}/prospects/prospect-list/${id}`,
    {
      cache: 'no-cache',
      method: 'get',
    })
    .then(response => response.json())
    .then(prospectList => {
      return serializeProspectList(prospectList)
    })
}

export const CREATE_PROSPECT_LIST = 'CREATE_PROSPECT_LIST'
export const createProspectList = async (prospectList) => {
  fetch(`${apiServer}/prospects//prospect-list`, {
    cache: 'no-cache',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(normalizeProspectList(prospectList))
  })
    .then(response => response.json())
    .then(prospectList => {
      return serializeProspectList(prospectList)
    })
}

export const UPDATE_PROSPECT_LIST = 'UPDATE_PROSPECT_LIST'
export const updateProspectList = async (prospectList) => {
  fetch(`${apiServer}/prospects//prospect-list${prospectList.id}`, {
    cache: 'no-cache',
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(normalizeProspectList(prospectList))
  })
    .then(response => response.json())
    .then(prospectList => {
      return serializeProspectList(prospectList)
    })
}

export const DELETE_PROSPECT_LIST = 'DELETE_PROSPECT_LIST'
export const deleteProspectList = async (id) => {
  fetch(`${apiServer}/prospects//prospect-list${id}`,
    {
      method: 'delete',
      cache: 'no-cache',
    }
  )
    .then(response => response.json())
    .then(prospectList => {
      return serializeProspectList(prospectList)
    })
}

export const FETCH_PROSPECT_LISTS = 'FETCH_PROSPECT_LISTS'
export const fetchProspectLists = async () => {
  fetch(`${apiServer}/prospects`, {
    method: 'get',
    cache: 'no-cache'
  })
    .then(response => response.json())
    .then(prospectLists => {
      return serializeProspectLists(prospectLists)
    })
}

function normalizeProspect(prospect) {
  let mutableProspect = { ...prospect }
  if (mutableProspect.projectList) {
    mutableProspect.prospectListId = mutableProspect.prospectList.id
    delete mutableProspect.projectList
  }
  return mutableProspect
}
export const CREATE_PROSPECT_IN_STORE = 'CREATE_PROSPECT_IN_STORE'
export const createProspectInStore = (prospect) => ({
  type: CREATE_PROSPECT_IN_STORE,
  payload: normalizeProspect(prospect),
})

export const UPDATE_PROSPECT_IN_STORE = 'UPDATE_PROSPECT_IN_STORE'
export const updateProspectInStore = (prospect) => ({
  type: UPDATE_PROSPECT_IN_STORE,
  payload: normalizeProspect(prospect),
})

export const REMOVE_PROSPECT_FROM_STORE = 'REMOVE_PROSPECT_FROM_STORE'
export const removeProspectFromStore = (prospect) => ({
  type: REMOVE_PROSPECT_FROM_STORE,
  payload: normalizeProspect(prospect),
})

export const CREATE_PROSPECT = 'CREATE_PROSPECT'
export const createProspect = async (prospect) => {
  fetch(`${apiServer}/prospects/prospect/`, {
    cache: 'no-cache',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(normalizeProspect(prospect))
  })
    .then(response => response.json())
    .then(prospect => {
      return serializeProspect(prospect)
    })
}

export const UPDATE_PROSPECT = 'UPDATE_PROSPECT'
export const updateProspect = async (prospect) => {
  fetch(`${apiServer}/prospects/prospect/${prospect.id}`, {
    cache: 'no-cache',
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(normalizeProspect(prospect))
  })
    .then(response => response.json())
    .then(prospect => {
      return serializeProspect(prospect)
    })
}

export const DELETE_PROSPECT = 'DELETE_PROSPECT'
export const deleteProspect = async (id) => {
  fetch(`${apiServer}/prospects/prospect/${id}`,
    {
      method: 'delete',
      cache: 'no-cache',
    }
  )
    .then(response => response.json())
    .then(prospectList => {
      return prospectList
    })
}

function normalizeMarketingCampaign(marketingCampaign) {
  let mutableMarketingCampaign = { ...marketingCampaign }
  if (mutableMarketingCampaign.prospectList) {
    mutableMarketingCampaign.prospectListId = mutableMarketingCampaign.prospectList.id
    delete mutableMarketingCampaign.projectList
  }
  return mutableMarketingCampaign
}
export const CREATE_MARKETING_CAMPAIGN_IN_STORE = 'CREATE_MARKETING_CAMPAIGN_IN_STORE'
export const createMarketingCampaignInStore = (marketingCampaign) => ({
  type: CREATE_MARKETING_CAMPAIGN_IN_STORE,
  payload: normalizeMarketingCampaign(marketingCampaign)
})

export const UPDATE_MARKETING_CAMPAIGN_IN_STORE = 'UPDATE_MARKETING_CAMPAIGN_IN_STORE'
export const updateMarketingCampaignInStore = (marketingCampaign) => ({
  type: UPDATE_MARKETING_CAMPAIGN_IN_STORE,
  payload: normalizeMarketingCampaign(marketingCampaign)
})

export const REMOVE_MARKETING_CAMPAIGN_FROM_STORE = 'REMOVE_MARKETING_CAMPAIGN_FROM_STORE'
export const removeMarketingCampaignFromStore = (marketingCampaign) => ({
  type: REMOVE_MARKETING_CAMPAIGN_FROM_STORE,
  payload: normalizeMarketingCampaign(marketingCampaign)
})

export const CREATE_MARKETING_CAMPAIGN = 'CREATE_MARKETING_CAMPAIGN'
export const createMarketingCampaign = async (marketingCampaign) => {
  fetch(`${apiServer}/marketing/marketing-campaign/`, {
    cache: 'no-cache',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(normalizeMarketingCampaign(marketingCampaign))
  })
    .then(response => response.json())
    .then(marketingCampaign => {
      return serializeMarketingCampaign(marketingCampaign)
    })
}

export const UPDATE_MARKETING_CAMPAIGN = 'UPDATE_MARKETING_CAMPAIGN'
export const updateMarketingCampaign = async (marketingCampaign) => {
  fetch(`${apiServer}/marketing/marketing-campaign/${marketingCampaign.id}`, {
    cache: 'no-cache',
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(normalizeMarketingCampaign(marketingCampaign))
  })
    .then(response => response.json())
    .then(marketingCampaign => {
      return serializeMarketingCampaign(marketingCampaign)
    })
}

export const DELETE_MARKETING_CAMPAIGN = 'DELETE_MARKETING_CAMPAIGN'
export const deleteMarketingCampaign = async (id) => {
  fetch(`${apiServer}/marketing/marketing-campaign/${id}`,
    {
      method: 'delete',
      cache: 'no-cache',
    }
  )
    .then(response => response.json())
    .then(marketingCampaign => {
      return serializeMarketingCampaign(marketingCampaign)
    })
}