import { fetch } from '../../utils'
const HOSTNAME = process.env.REACT_APP_API_HOSTNAME

export const sendLoginCode = credentials => {
  return fetch(`${HOSTNAME}/api/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
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

export const loginUser = credentials => {
  return fetch(`${HOSTNAME}/api/users/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
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

export const updateUser = credentials => {
  return fetch(`${HOSTNAME}/api/sessions/updateuser`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
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

export const updateStatus = credentials => {
  return fetch(`${HOSTNAME}/api/sessions/updateStatus`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
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

export const signupUser = credentials => {
  return fetch(`${HOSTNAME}/api/v1/registration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
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

export const getUser = data => {
  return fetch(`${HOSTNAME}/api/sessions/getuser`, {
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

export const getCompanyOrders = data => {
  return fetch(`${HOSTNAME}/api/sessions/getOrdersOfCompany?from=${data.from}&to=${data.to}&customerIds=${JSON.stringify(data.customerIds)}`, {
    method: 'GET'  
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

export const checkZip = data => {
  return fetch(`${HOSTNAME}/api/sessions/checkzip?zip=${data.zip}`, {
    method: 'GET'
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

export const getUserDetail = data => {
  return fetch(`${HOSTNAME}/api/sessions/getuser`, {
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

export const trackingLink = data => {
  return fetch(`${HOSTNAME}/api/sessions/trackingLink?id=${data}`, {
    method: 'GET'
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

export const getToken = credentials => {
  return fetch(`${HOSTNAME}/api/sessions/gettoken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
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
export const addEnterpriseUser = data => {
  return fetch(`${HOSTNAME}/api/sessions/add`, {
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

export const getCompanyInfo = credentials => {
  return fetch(`${HOSTNAME}/api/sessions/getcompanyinfo?url=${credentials}`, {
    method: 'GET'
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
export const deleteEnterpriseUser = id => {
  return fetch(`${HOSTNAME}/api/sessions/delete/${id}`, {
    method: 'DELETE'
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

export const updateEnterpriseUser = data => {
  return fetch(`${HOSTNAME}/api/sessions/modify`, {
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

export const getZipPricing = data => {
  return fetch(`${HOSTNAME}/api/sessions/getZipPricing`, {
    method: 'GET'
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
