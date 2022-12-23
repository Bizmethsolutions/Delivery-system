import { fetch } from '../../utils'
const HOSTNAME = process.env.REACT_APP_API_HOSTNAME

export const addContainer = data => {
  return fetch(`${HOSTNAME}/api/containers/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(res => {
    return res.json()
  })
  .then(payload => {
    return payload
  })
  .catch(error => {
    throw error
  })
}

export const getContainers = data => {
  const { by, page, limit, sort_field } = data
  return fetch(`${HOSTNAME}/api/containers/getAll?by=${by}&sort=${sort_field}&page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    // body: JSON.stringify(data)
  })
  .then(res => {
    return res.json()
  })
  .then(payload => {
    return payload
  })
  .catch(error => {
    throw error
  })
}

export const deleteContainer = data => {
  return fetch(`${HOSTNAME}/api/containers/delete/${data.containerId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    // body: JSON.stringify(data)
  })
    .then(res => {
      return res.json()
    })
    .then(payload => {
      return payload
    })
    .catch(error => {
      throw error
    })
}
export const updateContainer = data => {
  return fetch(`${HOSTNAME}/api/containers/modify`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => {
      return res.json()
    })
    .then(payload => {
      return payload
    })
    .catch(error => {
      throw error
    })
}
