import React, { PureComponent } from 'react'
import ReactModal from 'react-modal'
import { Link } from 'react-router-dom'
import _ from "lodash"
import moment from "moment"
import { Menu, Dropdown, Popconfirm, message, Tabs, Select } from 'antd'

import ViewOrder from './viewOrderModal'
import EmptyComponent from '../../../components/emptyComponent'
import { formatOrderAddess, formatPhoneNumber, getContainerSize, getDate, formatNumber, getFormatedDateAndTimeWithoutUTC,  getTimeInDayAndHoursForCustomer, getDateMMDDYYYHHMMForCustomer } from '../../../components/commonFormate'
import { SortingNewUpIcon ,BackArrowIcon, DotBtnIcon, SortingDownArrow, CloseIcon, SortingNewDownIcon } from '../../../components/icons'
import '../styles.scss'
import greenFillIcon from '../../../images/greenfillicon.svg'
import grayOutlineIcon from '../../../images/grayoutlineicon.svg'
import ordersIcon from '../../../images/orders-icon.svg'
import containerImg from '../../../images/containerimg.svg'
import YellowMark from '../../../images/yellow_img.png'
import GreenImg from '../../../images/green_img.png'
import config from '../../../config/index'

import EditOrder from './editOrderModal'

const { TabPane } = Tabs;
const { Option } = Select;

export default class CustomerOrdersComponent extends PureComponent {

  constructor() {
    super()
    this.state = {
      modalIsOpen: false,
      isViewModalOpen: false,
      isEditModalOpen: false,
      customers: [],
      sort_field: 'updatedat',
      by: -1,
      editModalIsOpen: false,
      orderDataForEdit: {},
      classname: [
        {class: "red-yard", size: '10 Yard'},
        {class: "purple-yard", size: '15 Yard'},
        {class: "green-yard", size: '20 Yard'},
        {class: "yellow-yard", size: '30 Yard'},
        {class: "orange-yard", size: '1/2 Yard'},
        {class: "blue-yard", size: 'Live Load'}
      ]
    };
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  openModal() {
    this.setState({ editModalIsOpen: true })
  }

  closeModal() {
    this.setState({ editModalIsOpen: false, isViewModalOpen: false })
  }

  toggleViewModal = (order) => {
    this.setState({ isViewModalOpen: !this.state.isViewModalOpen, orderDataForEdit:order  })
  }

  toggleEditModal = (order) => {
    this.setState({ editModalIsOpen: true, orderDataForEdit: order })
  }

  componentDidMount = async()=> {
    if(this.props.match.params.id && this.props.match.params.orderid) {
      const customerid = this.props.match.params.id
      this.updatePopup(customerid, this.props.match.params.orderid)
    }
    // this.fetchOrders()
  }

  updatePopup =async(customerid, orderid)=> {
    let data = {
      search_string: "",
      //limit: 20,
      by: 1,
      //page: 0,
      sort: ''
    }
    let { value } = await this.props.fetchCustomers(data)
    if (_.get(value, 'customers', []).length > 0) {
      let idx = _.get(value, 'customers', []).findIndex(obj => obj.customerid === customerid)
      let selectedCustomer =  value.customers[idx]
      let data2 ={
        sort: '',
        by: 1,
        type: 'history',
        customerId: _.get(selectedCustomer, '_id', '')
      }
      let ordersValue = await this.props.getAllOrders(data2)
      const orders = _.get(ordersValue, 'value.order', [])
      let orderIndex = orders.findIndex(obj => obj.orderid === orderid)
      if (orderIndex !== -1) {
        let selectedOrder =  orders[orderIndex]
        this.setState({ isViewModalOpen: true, orderDataForEdit: selectedOrder })
      }
    }
  }

  // fetchOrders =async()=> {
  //   let data ={
  //     page: this.state.page,
  //     limit: this.state.limit,
  //     sort: this.state.sort,
  //     by: this.state.by,
  //     type: this.state.type,
  //     customerId: this.props.customerId
  //   }
  //   let { value } = await this.props.getAllOrders(data)
  //   this.setState({
  //     totalOrder: _.get(value, 'count', 0),
  //     orders: _.get(value, 'order', []),
  //   })
  //   console.log(value)
  // }

  formatAddess (order) {
    let data = {
      address: _.get(order, 'new_address', ''),
      city: _.get(order, 'city', ''),
      state: _.get(order, 'state', ''),
      zipcode: _.get(order, 'zipcode', ''),
      borough: _.get(order, 'borough', ''),
    }
    let address = formatOrderAddess(data)
    return address
  }

  confirmDelete = async(id) => {
    let { value } = await this.props.deleteOrder(id)
    message.success('successfully deleted')
    this.props.fetchOrders()
  }

  cancel =(e)=> {
  }

  getStatus(input) {
    if (input && this.props.statusList) {
      let status = "";
      this.props.statusList.forEach(function (element) {
          if (input === element._id)
              status = element.status
      }, this);
      return status;
    }
  }

  sortby(field) {
    if (this.state.sort_field === field) {
      this.state.by = this.state.by * -1;
      this.props.orderSorting(this.state.sort_field, this.state.by)
    } else {
      this.state.sort_field = field;
      this.state.by = 1
      this.props.orderSorting(this.state.sort_field, this.state.by)
    }

  }

  // viewOrder (order) {
  //   const customerid = this.props.match.params.id
  //   this.props.history.push(`/customer-orders/${customerid}/${order.orderid}`)
  //   this.setState({ isViewModalOpen: true, orderDataForEdit: order })
  // }
  viewOrder (order) {
    const customerid = this.props.customerId
    if(customerid !== '') {
      this.props.history.push(`/job/${order.orderid}`, {c: "history"})
      //this.props.history.push(`/customer-orders/${customerid}/${order.orderid}`, {c: this.state.tab})
      this.setState({ isViewModalOpen: true, orderDataForEdit: order })
    }
  }
  toggleAddModal(order) {
    this.props.toggleAddModal(order)
  }

  getSortArrow(field) {
    if (this.state.sort_field === field) {
      if (this.state.by === 1)
             return (<SortingNewUpIcon />)
         else
             return (<SortingNewDownIcon />)
    } else {
       return (<SortingNewDownIcon />)
    }
  }

  getFormatedDateAndTime(input, order) {
    //return ""
    const { user } = this.props
    let timezone = _.get(order, 'timezone', {})
    if(Object.keys(timezone).length == 0) {
      if(Object.keys(_.get(user, 'timezone', {})).length !== 0) {
        timezone = _.get(user, 'timezone', {})
        if(Object.keys(timezone).length !== 0) {
          timezone.clientoffset = _.get(user, 'timezone.offset', '')
        }
      }
    }
    if(Object.keys(this.props.user).length !== 0 && timezone) {
      return getFormatedDateAndTimeWithoutUTC(input, timezone, this.props.user)
    } else {
      return ""
    }
  }

  // getDateinfo(date, order, key) {
  //   if(date) {
  //     date = this.getFormatedDateAndTime(date, order)
  //   }
  //   let dateInfo = order.timezone ? getTimeInDayAndHoursForCustomer(date) : getDateMMDDYYYHHMMForCustomer(order[key])
  //   return dateInfo
  // }
  getFormatedDateAndTimeCompleted(input, completedoffset) {
    if(input !== null && input !== undefined && input !== "") {
      const newdate = new Date()
      const clientoffset = newdate.getTimezoneOffset()
      if(completedoffset === undefined && completedoffset === 0) {
        completedoffset = clientoffset
      }
      const dateStr = input.split("T")[0];
      const timeStr = input.split("T")[1];
      const dateArr = dateStr.split('-');
      const timeArr = timeStr.split(":")
      let created = new Date(dateArr[0], (dateArr[1] - 1), dateArr[2], timeArr[0], timeArr[1])
      const utc = created.getMinutes() + parseInt(completedoffset)
      const hoursFromMinutes = (utc/60)
      created.setMinutes(created.getMinutes() + parseInt(completedoffset))
      const timezone = this.props.user && this.props.user.timezone && this.props.user.timezone.tzName ? this.props.user.timezone.tzName: Intl.DateTimeFormat().resolvedOptions().timeZone
      const offset = moment.tz(moment(), timezone).utcOffset()
      let hoursFromMinutesOffset = (offset/60)
      created.setMinutes(created.getMinutes() + offset)
      return  moment(created).format('MM-DD-YYYY hh:mm a')
    }
  }

  getDateinfo(date, order, key, type) {    
    // if(date) {    
      //   return this.getFormatedDateAndTime(String(date), order)    
      // }    console.log(order[key])   
      let d = this.getFormatedDateAndTime(date, order)
      if(type === 'removal' && key === "completed_at") {
        d = this.getFormatedDateAndTimeCompleted( date, _.get( order, 'childIdJobDetails.offset', 0))
      } else if(key === "job_details.completed_at") {
        d = this.getFormatedDateAndTimeCompleted( date, _.get( order, 'job_details.offset', 0))
      }
      let dateInfo = getTimeInDayAndHoursForCustomer(d)    
      return dateInfo 
   }

  render() {
    const { isViewModalOpen, isEditModalOpen } = this.state
    return (
      <div className="">
        {_.get(this.props, 'liveOrders', []).length !== 0 ?
          _.get(this.props, 'liveOrders', []).map((order, i)=>{
            let createdInfo = this.getDateinfo(order.createdat, order, 'createdat')
            let startedInfo = this.getDateinfo(_.get(order, 'job_details.started_at', null), order, 'job_details.started_at')
            let completedInfo = this.getDateinfo(_.get(order, 'job_details.completed_at', null), order, 'job_details.completed_at')
            const status = this.getStatus(order.status, order) && (this.getStatus(order.status, order).replace(/\s/g,'').replace(/[0-9]/g, '')).toLowerCase()
            return (
              <div key={i} className="row">
                <div className="col-md-12">
                  <div onClick={this.toggleViewModal.bind(this, order)} className="customer-left-sec">
                    <div className="top-sec">
                      <ul>
                        <li>
                          <h4>Delivery Date</h4>
                          <h5>{getDate(order.deliverydate)}</h5>
                        </li>

                        <li>
                          <h4>Removal Date</h4>
                          <h5>{order.pickupdate !== null ? getDate(order.pickupdate) : getDate(order.completiondate)}</h5>
                        </li>

                        <li>
                          <h4>Address</h4>
                          <h5>{this.formatAddess(order)}</h5>
                        </li>

                        <li>
                          {/* <span className="greenlabel">In Use</span> */}
                          <span className="btn-purple-fill--lg status-container" status={status}>{this.getStatus(order.status, order)}</span>
                        </li>
                      </ul>
                    </div>
                    <div className="middle-sec">
                      <img src={containerImg} />
                      <div>
                      <h4>Container Size : <span>
                        { _.get(this.props, 'containerList', []).map((cnt, i)=>{
                              const classIndex = _.findIndex(this.state.classname, (c) => {
                                return c.size === _.get(cnt, 'size', '')
                              })
                              if (cnt._id === order.container) {
                                return (
                                  <span key ={i} >{ _.get(cnt, 'size', '') }</span>
                                )
                              }
                            })
                        }</span></h4>
                      <h4>Order Number : <span>{_.get(order, 'orderid', '')}</span></h4>
                      </div>
                    </div>

                     <div className="last-sec">
                      <div className="listwrapper">
                        <ul>
                          <li>
                            <img src={greenFillIcon} />
                            <h4>Order Placed</h4>
                            <h6>{createdInfo} </h6>
                          </li>
                          <li>
                            <img src={greenFillIcon} />
                            <h4>On Its Way</h4>
                            <h6>{startedInfo} </h6>
                          </li>
                          <li>
                            <img src={greenFillIcon} />
                            <h4>Delivered</h4>
                            <h6>{completedInfo} </h6>
                          </li>
                        </ul>
                      </div>
                      <div onClick={this.viewOrder.bind(this, order)} className="listwrapper">
                        { _.get(order, 'childIdOrderDetails', null) && (
                          <ul>
                            <li>
                              <img src={greenFillIcon} />
                              <h4>Removal Scheduled</h4>
                              <h6>{this.getDateinfo(_.get(order, 'childIdOrderDetails.createdat', ''), _.get(order, 'childIdOrderDetails', ''), 'createdat')}  </h6>
                            </li>
                              <li>
                              <img src={order.childIdJobDetails && order.childIdJobDetails.started_at ? greenFillIcon : grayOutlineIcon  } />
                              <h4>On Its Way</h4>
                              { order.childIdJobDetails && order.childIdJobDetails.started_at ?
                                <h6>{this.getDateinfo(_.get(order, 'childIdJobDetails.started_at', ''), order, 'started_at')} </h6>
                                : ""
                              }
                            </li>
                            <li>
                              <img src={order.childIdJobDetails && order.childIdJobDetails.completed_at ? greenFillIcon : grayOutlineIcon} />
                              <h4>Removed</h4>
                              { order.childIdJobDetails && order.childIdJobDetails.completed_at ?
                                <h6>{this.getDateinfo(_.get(order, 'childIdJobDetails.completed_at', ''), order, 'completed_at', 'removal')} </h6>
                              : "" }
                            </li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="customer-right-sec">
                    <button onClick={this.toggleAddModal.bind(this, order)} className="btn btn-dark">Order Again</button>
                    <button onClick={this.toggleViewModal.bind(this, order)} className="btn btn-dark">View Order Details</button>
                  </div>
                </div>

              </div>
            )
          })
        :
          <EmptyComponent
            emptyText = "No Orders"
          />
        }
        {this.state.isViewModalOpen ?
          <ViewOrder
            isViewModalOpen = {this.state.isViewModalOpen}
            closeModal={this.closeModal}
            customerId={this.props.customerId}
            containerList={this.props.containerList}
            statusList={this.props.statusList}
            fetchOrders={this.props.fetchOrders}
            viewOrder ={this.viewOrder.bind(this)}
            selectedCustomer= {_.get(this.props, 'user', {})}
            orderData = {this.state.orderDataForEdit}
            toggleAddModal = {this.props.toggleAddModal}
            toggleEditModal = {this.props.toggleEditModal}
            toggleExchangeModal = {this.props.toggleExchangeModal}
            toggleRemovalModal = {this.props.toggleRemovalModal}
            openConfirmDeleteModal= {this.props.openConfirmDeleteModal}
            {...this.props}
            />
        : ""}
      </div>
    )
  }
}
