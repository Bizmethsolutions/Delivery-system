import { fetch } from '../../utils'
const HOSTNAME = process.env.REACT_APP_API_HOSTNAME

export const createCompany = data => {
  return fetch(`${HOSTNAME}/api/companies/add`, {
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
export const updateCompany = data => {
  let companyId = data.companyId
  delete data.companyId
  return fetch(`${HOSTNAME}/api/companies/update/${companyId}`, {
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

export const getCompanies = (data) => {
  return fetch(`${HOSTNAME}/api/companies/getAllCompanies?searchKey=${data.searchKey}`, {
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

export const getCompanyDetail = (companyId) => {  
  return fetch(`${HOSTNAME}/api/companies/getCompanyDetail/${companyId}`, {
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

export const getCompanyUsers = (companyId) => {
  return fetch(`${HOSTNAME}/api/companies/users/${companyId}`, {
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
