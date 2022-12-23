import { fetch } from '../../utils'
const HOSTNAME = process.env.REACT_APP_API_HOSTNAME

export const addDriver = data => {
  return fetch(`${HOSTNAME}/api/drivers/add`, {
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

export const getDrivers = data => {
  const { by, page, limit, sort_field, date } = data
  return fetch(`${HOSTNAME}/api/haulers/drivers?date=${date}&page=${page}&limit=${limit}&by=${by}&sortby=${sort_field}&haulerId=${data.haulerId}`, {
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

export const updateDriver = data => {
  return fetch(`${HOSTNAME}/api/drivers/update`, {
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

export const deleteDriver = data => {
  return fetch(`${HOSTNAME}/api/drivers/delete`, {
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

export const addTruck = data => {
  console.log(data, 'kkk')
  return fetch(`${HOSTNAME}/api/trucks/add`, {
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

export const getTrucks = data => {
  const { by, page, limit, sort_field } = data
  return fetch(`${HOSTNAME}/api/trucks/getAll?page=${page}&limit=${limit}&by=${by}&sort=${sort_field}`, {
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

export const deleteTruck = data => {
  return fetch(`${HOSTNAME}/api/trucks/delete/${data.id}`, {
    method: 'DELETE',
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

export const updateTruck = data => {
  return fetch(`${HOSTNAME}/api/trucks/modify`, {
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

export const getTrucksDvir = data => {
  const { page, limit, id } = data
  return fetch(`${HOSTNAME}/api/trucks/getTrucksDvir?page=${page}&limit=${limit}&id=${id}`, {
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
