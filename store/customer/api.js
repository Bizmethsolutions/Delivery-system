import { fetch } from '../../utils'
const HOSTNAME = process.env.REACT_APP_API_HOSTNAME

export const addCostomer = data => {
  return fetch(`${HOSTNAME}/api/customers/add`, {
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

export const fetchCustomers = data => {
  const { search_string, limit, by, page, sort, customerId } = data
  return fetch(`${HOSTNAME}/api/customers/search?string=${search_string}&sort=${sort}&by=${by}&page=${page}&limit=${limit}&customerId=${customerId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    //body: JSON.stringify(credentials)
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

export const deleteCustomer = id => {
  return fetch(`${HOSTNAME}/api/customers/${id}/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    //body: JSON.stringify(credentials)
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

export const updateCostomer = data => {
  return fetch(`${HOSTNAME}/api/customers/modify`, {
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

export const addCard = (data) => {
  return fetch(`${HOSTNAME}/api/customers/addcard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then((res) => {
    return res.json()
   })
  .then((payload) => {
    return payload
  })
  .catch((error) => {
    throw error
  })
}

export const getCustomerById = data => {
  return fetch(`${HOSTNAME}/api/customers/byId/${data}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    //body: JSON.stringify(credentials)
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