import { fetch } from '../../utils'
const HOSTNAME = process.env.REACT_APP_API_HOSTNAME

export const addHauler = data => {
  return fetch(`${HOSTNAME}/api/haulers/register`, {
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

export const getHaulers = data => {
  const { page, limit, by, sort_field } = data
  return fetch(`${HOSTNAME}/api/haulers/getAllHaulers?page=${page}&limit=${limit}&by=${by}&sortby=${sort_field}`, {
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
export const getHaulerDetails = id => {
  return fetch(`${HOSTNAME}/api/haulers/details/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
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

export const updateHauler = data => {
  return fetch(`${HOSTNAME}/api/haulers/modify`, {
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

export const deleteHauler = data => {
  return fetch(`${HOSTNAME}/api/haulers/subUser`, {
    method: 'DELETE',
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

export const setDefaultHauler = data => {
  return fetch(`${HOSTNAME}/api/haulers/makeDefault/${data.id}`, {
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
