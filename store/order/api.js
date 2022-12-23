import { fetch } from '../../utils'
const HOSTNAME = process.env.REACT_APP_API_HOSTNAME


export const getOrder = (data) => {
  return fetch(`${HOSTNAME}/api/tasks/getjobs?date=${data.date}&All=${data.All}&offset=${data.offset}&haulerId=${data.haulerId}`, {
    method: 'GET'
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

export const getJobsByDate = (data) => {
  return fetch(`${HOSTNAME}/api/tasks/getjobsbydate?date=${data.date}&All=${data.All}&haulerId=${data.haulerId}`, {
    method: 'GET'
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
export const getYardsAndDump = (data) => {
  return fetch(`${HOSTNAME}/api/tasks/dumpsandyards`, {
    method: 'GET'
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

export const getDriver = (data) => {
  return fetch(`${HOSTNAME}/api/haulers/drivers?date=${data.date}&haulerId=${data.haulerId}`, {
    method: 'GET'
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


export const assignDriver = (data) => {
  return fetch(`${HOSTNAME}/api/haulers/jobs/assign`, {
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

export const getLocation = (data) => {
  return fetch(`${HOSTNAME}/api/haulers/getLocations`, {
    method: 'GET'
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

export const addDriver = (data) => {
  return fetch(`${HOSTNAME}/api/drivers/add`, {
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

export const sendNewOrderNotification = (data) => {
  return fetch(`${HOSTNAME}/api/orders/newOrderNotification`, {
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

export const updateDriver = (data) => {
  return fetch(`${HOSTNAME}/api/drivers/update`, {
    method: 'PUT',
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

export const deleteDriver = (data) => {
  return fetch(`${HOSTNAME}/api/drivers/delete`, {
    method: 'DELETE',
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

export const addTask = (data) => {
  return fetch(`${HOSTNAME}/api/haulers/task`, {
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

export const updateTask = (data) => {
  return fetch(`${HOSTNAME}/api/tasks/update`, {
    method: 'PUT',
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

export const deleteTask = (data) => {
  return fetch(`${HOSTNAME}/api/tasks/delete`, {
    method: 'DELETE',
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

export const incompleteJob = (data) => {
  return fetch(`${HOSTNAME}/api/haulers/job/incomplete`, {
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

export const getOrderDetail = (data) => {
  return fetch(`${HOSTNAME}/api/tasks/job/${data}`, {
    method: 'GET'
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

export const sendMessage = (data) => {
  return fetch(`${HOSTNAME}/api/haulers/sendMessage/`, {
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

export const enterpriseMessage = (data) => {
  return fetch(`${HOSTNAME}/api/haulers/enterpriseSendMessage`, {
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

export const getMessage = (data) => {
  return fetch(`${HOSTNAME}/api/haulers/getMessage/${data}`, {
    method: 'GET'
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


export const getNotifications = (id) => {
  return fetch(`${HOSTNAME}/api/orders/notifications/${id}`, {
    method: 'GET'
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

export const getEnterpriseNotifications = (id) => {
  return fetch(`${HOSTNAME}/api/orders/enterprise-notifications/${id}`, {
    method: 'GET'
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

export const downloadReceipt = (data) => {
  return fetch(`${HOSTNAME}/api/haulers/downloadReceipt/${data}?source=dispatcher`, {
    method: 'GET'
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
export const updateJobIndex = (data) => {
  return fetch(`${HOSTNAME}/api/driverJobs/sort`, {
    method: 'PUT',
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

export const saveAccessibility = (data) => {
  return fetch(`${HOSTNAME}/api/tasks/accessibility`, {
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
export const addOrder = (data) => {
  return fetch(`${HOSTNAME}/api/orders/add`, {
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

export const exchangeOrder = (data) => {
  return fetch(`${HOSTNAME}/api/orders/exchange`, {
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

export const removalOrder = (data) => {
  return fetch(`${HOSTNAME}/api/orders/removal`, {
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

export const updateOrder = (data) => {
  return fetch(`${HOSTNAME}/api/orders/modify`, {
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

export const getAllOrders = (data) => {
  // const {type, by, limit, page, sort, customerId, search } = data
  return fetch(`${HOSTNAME}/api/orders/search`, {
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

export const deleteOrder = (id) => {
  return fetch(`${HOSTNAME}/api/orders/${id}/delete`, {
    method: 'DELETE'
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

export const getContainer = () => {
  return fetch(`${HOSTNAME}/api/container/get`, {
    method: 'GET'
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
export const getContainerLoc = () => {
  return fetch(`${HOSTNAME}/api/container/getLoc`, {
    method: 'GET'
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

export const fetchOrdersReport = (data) => {
  const { from , to, status, sort_field, by, page, limit, searchstring, searchby, customerId } = data
  return fetch(`${HOSTNAME}/api/orders/report?from=${from}&to=${to}&status=${status}&by=${by}&sort=${sort_field}&page=${page}&limit=${limit}&searchstring=${searchstring}&searchby=${searchby}&customerId=${customerId}`, {
    method: 'GET'
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

export const exportreport = (data) => {
  const { from , to, status, searchstring, searchby, customerId, email } = data
  return fetch(`${HOSTNAME}/api/orders/export?email=${email}&from=${from}&to=${to}&status=${status}&searchstring=${searchstring}&searchby=${searchby}&customerId=${customerId}`, {
    method: 'GET',
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
export const exportall = (data) => {
  const { useremail, customerId } = data
  return fetch(`${HOSTNAME}/api/orders/exportall?email=${useremail}&customerId=${customerId}`, {
    method: 'GET',
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

export const getOrdersBycustomer = (data) => {
  const {type, by, limit, page, sort, customerId, isApproved, isRejected, search } = data
  return fetch(`${HOSTNAME}/api/orders/getOrdersBycustomer?type=${type}&customerId=${customerId}&sort=${sort}&by=${by}&page=${[page]}&limit=${limit}&isApproved=${isApproved}&isRejected=${isRejected}&search=${search}`, {
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

export const getAllOrdersOfCustomer = (data) => {
  const {type, by, limit, page, sort, customerId, isApproved, isRejected } = data
  return fetch(`${HOSTNAME}/api/orders/getAllOrdersOfcustomer?customerId=${customerId}`, {
    method: 'GET'
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
export const fetchPendingOrders = (data) => {
  const {type, by, limit, page, sort, customerId, isApproved } = data
  return fetch(`${HOSTNAME}/api/orders/pendingOrders?sort=${sort}&by=${by} `, {
    method: 'GET'
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

export const searchByCustomerOrOrder = (data) => {
  return fetch(`${HOSTNAME}/api/orders/search-all?search=${data.search_string}`, {
    method: 'GET'
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

export const searchByOrder = (data) => {
  return fetch(`${HOSTNAME}/api/orders/customer-search?search=${data.search_string}&customerId=${data.customerId}`, {
    method: 'GET'
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

export const fetchRecapLogsMatrix = (data) => {
  const { to, from, customer } = data
  return fetch(`${HOSTNAME}/api/orders/recap_logs_matrix?from=${from}&to=${to}&customerId=${customer}`, {
    method: 'GET'
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
export const fetchAllLiveOrders = (data) => {
  return fetch(`${HOSTNAME}/api/orders/totalLiveOrders`, {
    method: 'GET'
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

export const getOrderDetailById = (data) => {
  return fetch(`${HOSTNAME}/api/orders/${data}`, {
    method: 'GET'
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

export const getOrderByOrderId = (data) => {
  return fetch(`${HOSTNAME}/api/orders/byorderid/${data}`, {
    method: 'GET'
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

export const viewedNotification = (data) => {
  return fetch(`${HOSTNAME}/api/orders/updatenotification`, {
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

export const recapLogsResults = (data) => {
  const { from, to, sort_field, by, type, customerId } = data
  return fetch(`${HOSTNAME}/api/orders/recap_logs_results?from=${from}&to=${to}&by=${by}&sort=${sort_field}&customerId=${customerId}&type=${type}`, {
    method: 'GET'
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

export const getDownloadReceipt = (jobId) => {
  return fetch(`${HOSTNAME}/api/haulers/downloadReceipt/${jobId}`, {
    method: 'GET'
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
export const downloadBulkReceipts = (data) => {
  return fetch(`${HOSTNAME}/api/haulers/downloadBulkReciept/${JSON.stringify(data.completedorder)}?from=${data.fromDate}&to=${data.toDate}`, {
    method: 'GET'
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


export const completeOrder = (data) => {
  return fetch(`${HOSTNAME}/api/orders/complete`, {
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

export const uploadFile = (data) => {
  return fetch(`${HOSTNAME}/api/orders/uploadfile`, {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'multipart/form-data'
    // },
    body: data
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

export const revertOrder = (data) => {
  return fetch(`${HOSTNAME}/api/orders/revert`, {
    method: 'PUT',
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

export const getOrderActivity = (id) => {
  return fetch(`${HOSTNAME}/api/orders/orderActivity/${id}`, {
    method: 'GET'
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

export const getOrderById = (id) => {
  return fetch(`${HOSTNAME}/api/orders/customerOrderById/${id}`, {
    method: 'GET'
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
export const chargeForExchange = (data) => {
  return fetch(`${HOSTNAME}/api/orders/chargeForExchange`, {
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

export const applyCoupon = (data) => {
  return fetch(`${HOSTNAME}/api/orders/applyCouponCode`, {
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

export const getOrdersbyCompany = () => {
  return fetch(`${HOSTNAME}/api/orders/getOrdersbyCompany`, {
    method: 'GET'
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
export const getEtasOrders = (data) => {
  const { page, limit, customerId } = data
  return fetch(`${HOSTNAME}/api/orders/getEtasOrders?customerId=${customerId}&page=${page}&limit=${limit}`, {
    method: 'GET'
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

export const dashreports = (data) => {
  return fetch(`${HOSTNAME}/api/orders/dashreports`, {
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

export const exportdashreports = (data) => {
  return fetch(`${HOSTNAME}/api/orders/exoprtdashreports`, {
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

export const getAllJobsForOrderLog = (data) => {
  const { startDate, endDate, sort_field, by } = data
  return fetch(`${HOSTNAME}/api/tasks/getAllJobsForOrderLog?startDate=${startDate}&endDate=${endDate}&All=${data.All}&offset=${data.offset}&sort=${sort_field}&by=${by}`, {
    method: 'GET'
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

export const getOrdersForPermit = (data) => {
  return fetch(`${HOSTNAME}/api/orders/getOrdersForPermit?customerId=${data.customerId}`, {
    method: 'GET'
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
