import { fetch } from '../../utils'
const HOSTNAME = process.env.REACT_APP_API_HOSTNAME

export const addYard = data => {
  return fetch(`${HOSTNAME}/api/yards/add`, {
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

export const getYards = data => {
  const { type, by, page, limit, sort_field, search_string } = data
  return fetch(`${HOSTNAME}/api/yards/search?type=${type}&by=${by}&sort=${sort_field}&page=${page}&limit=${limit}&string=${search_string}`, {
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

export const updateYard = data => {
  return fetch(`${HOSTNAME}/api/yards/modify`, {
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

export const deleteYard = data => {
  return fetch(`${HOSTNAME}/api/yards/${data.yardId}/delete`, {
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

export const addDump = data => {
  return fetch(`${HOSTNAME}/api/dumps/add`, {
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

export const getDumps = data => {
  const { type, by, page, limit, sort_field, search_string } = data
  return fetch(`${HOSTNAME}/api/dumps/search?type=${type}&by=${by}&sort=${sort_field}&page=${page}&limit=${limit}&string=${search_string}`, {
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

export const updateDump = data => {
  return fetch(`${HOSTNAME}/api/dumps/modify`, {
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

export const deleteDump = data => {
  return fetch(`${HOSTNAME}/api/dumps/${data.dumpId}/delete`, {
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
