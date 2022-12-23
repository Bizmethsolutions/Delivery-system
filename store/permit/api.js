import { fetch } from '../../utils'
const HOSTNAME = process.env.REACT_APP_API_HOSTNAME



export const getOrderListForPermit = data => {
  const { page, limit, searchString } = data
  return fetch(`${HOSTNAME}/api/permits/orderlist`, {
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
export const addPermit = data => {
  return fetch(`${HOSTNAME}/api/permits/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    // body: data
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
export const updatePermit = data => {
  return fetch(`${HOSTNAME}/api/permits/modify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    // body: data
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
export const deletePermit = data => {
  const { id, orderId } = data
  return fetch(`${HOSTNAME}/api/permits/delete/${id}/${orderId}`, {
    method: 'DELETE',
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
export const getPermitsByOrder = data => {
  const { id, sort, by } = data
  return fetch(`${HOSTNAME}/api/permits/permitsByOrder/${id}?sort=${sort}&by=${by}`, {
    method: 'GET',
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
export const getPermitByOrderId = data => {
  const { id } = data
  return fetch(`${HOSTNAME}/api/permits/getPermitByOrder/${id}`, {
    method: 'GET',
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
export const getPermitCount = data => {
  return fetch(`${HOSTNAME}/api/permits/getPermitCount`, {
    method: 'GET',
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
export const getPermitFiltersCount = data => {
  return fetch(`${HOSTNAME}/api/permits/getPermitFiltersCount`, {
    method: 'GET',
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
