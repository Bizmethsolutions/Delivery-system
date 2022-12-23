import io from 'socket.io-client';
import _ from 'lodash'
// Socket manager
const HOSTNAME = process.env.REACT_APP_SOCKET_URL
export const socket = (props) => {
    let socketId = ""
    var socket = io(HOSTNAME, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax : 5000,
      reconnectionAttempts: 99999
    });
    var sockRegId = localStorage.getItem("sockRegId");
    socket.emit("register", {
      userSocketId: localStorage.getItem("userid"),
      sockRegId: sockRegId,
      type: 'web',
      usertype: localStorage.getItem("usertype"),
      companyId: localStorage.getItem("companyId")
    }, function(value){
      if(value) {
        socketId = _.get(value, 'socketId', '');
        window.localStorage.setItem("socketID", JSON.stringify(_.get(value, 'socketId', '')))
      }
    })
    socket.on('new_message', function (data) {
     const id = localStorage.getItem('companyId')
     if(props.fetchPendingOrder) {
      props.fetchPendingOrder()
     }
     props.getEnterpriseNotifications(id)
    })
    socket.on('new_driver', function (data) {
      if(data.socketID === socketId) {
      // self.setLocalNotifications('new_driver', data, `A new driver has just been added`)
      // self.child.updateNotifications()
      // openNotification('Job Added', `A new ${data.name} Driver has just been added`)
      }
    })
    socket.on('new_job', function (data) {
      if(data.socketID === socketId) {
        // if(data.type === "job") {
        //   self.setLocalNotifications('new_job', data, `A new job for customer has been added`)
        //   self.child.updateNotifications()
        //   openNotification('Job Added', `A new job for ${data.customer} customer has been added`)
        // } else {
        //   // self.setLocalNotifications('new_task', data, `A new job for customer has been added`)
        //   // openNotification('Job Added', `A new task ${data.taskName} has been added`)
        // }
      }
      //self.getOrders()
    })
    socket.on('job_updated', function (data) {
      if(data.socketID === socketId) {
        // if(data.type === "job") {
        //   self.setLocalNotifications('new_job', data, `A new job for customer has been added`)
        //   self.child.updateNotifications()
        //   openNotification('Job Added', `A new job for ${data.customer} customer has been added`)
        // } else {
        //   // self.setLocalNotifications('new_task', data, `A new job for customer has been added`)
        //   // openNotification('Job Added', `A new task ${data.taskName} has been added`)
        // }
      }
      //self.getOrders()
    })
    socket.on('job_status', function (data) {
      if(data.socketID === socketId) {
        if(props.fetchOrders) {
          props.fetchOrders()
        }
        if(props.getUser) {
          let data = {
            user: {
              id: localStorage.getItem("userid"),
              usertype: localStorage.getItem("usertype")
            }
          }
          props.getUser(data)
        }
        // if(data.type === "job") {
        //   self.setLocalNotifications('new_job', data, `A new job for customer has been added`)
        //   self.child.updateNotifications()
        //   openNotification('Job Added', `A new job for ${data.customer} customer has been added`)
        // } else {
        //   // self.setLocalNotifications('new_task', data, `A new job for customer has been added`)
        //   // openNotification('Job Added', `A new task ${data.taskName} has been added`)
        // }
      }
      //self.getOrders()
    })
    socket.on( 'disconnect', function () {
      // console.log('SOCKET DISCONNECTED')
        //socketStatus = false;
        window.location.reload();
    });
}
