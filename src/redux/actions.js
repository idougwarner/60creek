export const CREATE_PROSPECT = 'CREATE_PROSPECT'

export const createProspect = (prospect) => ({
  type: CREATE_PROSPECT,
  payload: prospect,
})

export const UPDATE_PROSPECT = 'UPDATE_PROSPECT'

export const updateProspect = (prospect) => ({
  type: UPDATE_PROSPECT,
  payload: prospect,
})

export const REMOVE_PROSPECT = 'REMOVE_PROSPECT'

export const removeProspect = (name) => ({
  type: REMOVE_PROSPECT,
  payload: name
})