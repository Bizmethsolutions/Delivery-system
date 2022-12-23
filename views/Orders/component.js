import React, { PureComponent, Fragment } from 'react'
import { Link } from 'react-router-dom'
import _ from "lodash"
import moment from "moment"
import { Menu, Dropdown, Popconfirm, message, Pagination } from 'antd'
import GoogleMap from 'google-map-react'

import TopNavigation from './../CustomerTopNavigation/container'
// import SidebarNavigation from './../SidebarNavigation/container'
// import { SortingNewDownIcon, SortingNewUpIcon, ArrowIcon, ViewIcon, LocationIconRed, LocationIconPurple, LocationIconSky, DumpsiteIcon, YardIcon, LocationIconGreen, LocationIconYellow, LocationIconOrange, DotBtnIcon, SortingDownArrow } from '../../components/icons'
import { formatPhoneNumber, formatPhoneNumberWithBrackets, formatOrderAddess, formatGeoAddressComponents, getContainerSize, getDate, getFormatedDateAndTimeWithoutUTC,  getTimeInDayAndHoursForCustomer, getDateMMDDYYYHHMMForCustomer } from '../../components/commonFormate'
import AddOrder from './partials/addOrderModal'
import EditOrder from './partials/editOrderModal'
import ViewOrder from './partials/viewOrderModal'
import ExchangeOrder from '../CustomerOrders/partials/exchangeOrderModal'
import RemovalOrder from '../CustomerOrders/partials/removalOrderModal'
import HistoryOrders from './partials/historyOrders'
import DeleteModal from '../../components/deleteModal'
import EmptyComponent from '../../components/emptyComponent'
import CancelModal from '../../components/cancelModal'
import containerImg from './../../images/containerimg.svg'
import greenFillIcon from './../../images/greenfillicon.svg'
import grayOutlineIcon from './../../images/grayoutlineicon.svg'
import ordersIcon from './../../images/orders-icon.svg'
import curbsideLogo from './../../images/curbsidelogo.svg'
import YellowMark from '../../images/yellow_img.png'
import GreenImg from '../../images/green_img.png'

import { NotificationIcon, DownCaretIcon, CloseIcon } from '../../components/icons'


import config from '../../config/index'
// import PropTypes from 'prop-types'

import './styles.scss'
const phoneNumberMask = config.phoneNumberMask

const Marker = (props) => {
  const markerStyle = {
    cursor: 'pointer',
    zIndex: 10,
    marginLeft: '-12px',
    marginTop: '12px',
  }
  return (
    <Fragment>
      <img src={YellowMark} style={markerStyle} />
    </Fragment>
  );
};

const TruckMarker = (props) => {
  const markerStyle = {
    cursor: 'pointer',
    zIndex: 10,
    marginLeft: '-12px',
    marginTop: '12px',
    width: props.type === "yard" ? '30px' : '30px'
  };
  let icon = GreenImg

  let name = props.name

  if (name == "point" || name == "Point" ) {
    name = 'P'
  }
  return (
    <Fragment>
      <div className="markerLabel">
        <span className="markerLabel--text">
        {name}
        </span>
        <img src={icon} style={markerStyle} width="40"/>
      </div>
    </Fragment>
  );
};

export default class CustomersOrdersComponent extends PureComponent {

  constructor() {
    super()
    this._isMounted = false;
    this.state = {
      addOrderModalIsOpen: false,
      sort_field: "deliverydate",
      search_string: '',
      by: -1,
      page: 1,
      limit: 20,
      type: 'live',
      search: '',
      activeOrder: [],
      deleteModelIsOpen: false,
      orderId: '',
      isViewModalOpen: false,
      isEditModalOpen: false,
      futureRemoval: false,
      loadervisible: false,
      tab: 'active',
      isApproved: true,
      cancelModalIsOpen: false,
      cancelId: '',
      classname: [
        {class: "red-yard", size: '10 Yard'},
        {class: "purple-yard", size: '15 Yard'},
        {class: "green-yard", size: '20 Yard'},
        {class: "yellow-yard", size: '30 Yard'},
        {class: "orange-yard", size: '1/2 Yard'},
        {class: "blue-yard", size: 'Live Load'}
      ]
    };
    this.closeModal = this.closeModal.bind(this);
  }

  openModal(key) {
    this.setState({ [key]: true });
  }

  closeModal() {
    this.setState({
      editModalIsOpen: false,
      isViewModalOpen: false,
      orderDataForEdit: {},
      orderData: {},
      addOrderModalIsOpen: false,
      exchangeModalIsOpen: false,
      removalModalIsOpen: false,
      deleteModelIsOpen: false,
      pendingRemoval: false,
      cancelModalIsOpen: false,
    })
  }

  componentDidMount = async()=> {
    this._isMounted = true;
    document.title = 'Active Containers | CurbWaste'
    let data1 = {
      user: {
        id: localStorage.getItem("userid"),
        usertype: localStorage.getItem("usertype")
      }
    }
    const { getUserDetail } = this.props
    const { value } = await getUserDetail(data1)
    let customerid = localStorage.getItem('userid')
    if(_.get(value.data, 'createdBy', undefined) !== undefined) {
      customerid = _.get(this.props, 'user.createdBy', undefined)
    }
    const { limit, by, page, sort_field, search_string, type } = this.state
    let data = {
      limit, by, page, sort_field, search_string, type: 'd'
    }
    this.urlCheck()
    this.getLocation()
    let interval = setInterval(async() => {
      this.getLocation()
    }, 2000)
    this.setState({ interval: interval })

    let  val  = await this.props.getContainer()
    let  dumpval  = await this.props.getDumps(data)
    this.setState({
      containerList: _.get(val, 'value.containers', []),
      statusList: _.get(val, 'value.status', []),
      customerId: customerid,
      dumps: _.get(dumpval, 'value.dumps', [])
    })
    if (this.props.match.params && this.props.match.params.id) {
      let type = "live"
      if(this.props.match.path === "/pending-orders") {
        type = "pending"
      }
      if(this.props.match.path === "/completed-orders") {
        type = "completed"
      }
      if(this.props.match.path === "/active-containers") {
        type = "active"
      }
      this.setState({ type: type})
    }
    if (this.props.match.params && this.props.match.params.id) {
      let data ={
        page: 1,
        limit: 20,
        sort: this.state.sort_field,
        by: this.state.by,
        isRejected: false,
        isApproved: true,
        customerId: customerid //this.props.match.params.id
      }

      let { value } = await this.props.getOrderByOrderId(this.props.match.params.id)
      if(value) {
        // const order = _.find(value.data, (o) => {
        //   return String(o.orderid) === String(this.props.match.params.id)
        // })
        this.setState({ isViewModalOpen: true,  orderDataForEdit: value.data})
      }
    }
  }

  getLocation =async ()=> {
    let { value } = await this.props.getLocation()
    let truck = value.data.vehicles
    if (this._isMounted) {
      this.setState({ truck })
    }
  }

  urlCheck() {
    let isApproved = true
    let type = 'live'
    let tab = "active"
    const currentLocation = this.props.location.pathname
    if(currentLocation === "/active-containers") {
      document.title = 'Active Containers | CurbWaste'
      tab = "active"
    } else if (currentLocation === "/pending-orders") {
      document.title = 'Pending Orders | CurbWaste'
      isApproved = false
      tab = "pending"
    } else if (currentLocation === "/completed-orders") {
      document.title = 'Completed Orders | CurbWaste'
      type = 'history'
      tab = "history"
    } else {
      document.title = 'Active Containers | CurbWaste'
      tab = "active"
    }
    this.setState({ isApproved, type, tab }, ()=>{
      this.fetchOrders()
      //this.props.history.push(url)
    })
  }

  tabChange (tab, url) {
    let isApproved = true
    let type = 'live'
    let search= ''
    if(tab === 'pending') {
      document.title = 'Pending Orders | CurbWaste'
      isApproved = false
    }
    if(tab === 'history') {
      document.title = 'Completed Orders | CurbWaste'
      type = 'history'
    }
    if(tab === 'active') {
      document.title = 'Active Containers | CurbWaste'
    }
    this.setState({ isApproved, type, tab, page: 1, search }, ()=>{
      this.fetchOrders()
      this.props.history.push(url)
    })
  }

  fetchOrders =async()=> {
    let customerid = localStorage.getItem('userid')
    if(_.get(this.props, 'user.createdBy', undefined) !== undefined) {
      customerid = _.get(this.props, 'user.createdBy', undefined)
    }
    this.setState({ loadervisible: true })
    let data ={
      page: this.state.page,
      limit: this.state.limit,
      sort: this.state.sort_field,
      by: this.state.by,
      type: this.state.type,
      search: this.state.search,
      isApproved: this.state.isApproved,
      customerId: customerid //this.props.match.params.id
    }

    let { value } = await this.props.getOrdersBycustomer(data)
    this.setState({
      loadervisible: false,
      totalActiveOrder: _.get(value, 'count', 0),
      activeOrder: _.get(value, 'order', []),
    })
  }

  getStatus(input, order) {
    if (input && this.state.statusList) {
      let status = "";
      this.state.statusList.forEach(function (element) {
          if (input === element._id)
              status = element.status
      }, this);
      if(status === "Future Exchange") {
        if(order.queue_exchange_orders && order.queue_exchange_orders.length > 0) {
            const _index = _.findIndex(order.queue_exchange_orders, (o) => {
              return String(o.id) === String(order.id)
            })
            if(_index >= 0) {
                status = `${status} ${_index + 1}`
            }
            return status;
        }
      } else {
        return status;
      }
    }
  }

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

  confirmDelete = async() => {
    let id = this.state.orderId
    const orderData = _.find(_.get(this.state, 'activeOrder', []), (order) => {
      return String(order.id) === String(id)
    })
    if(orderData.type === "Removal") {
      const { revertOrder } = this.props
      try{
        const { value } = await revertOrder({id: orderData._id ? orderData._id : orderData.id})
        if(value) {
          message.success('successfully deleted')
            this.fetchOrders()
            this.closeModal()
          //  try {
          //   let { value } = await this.props.deleteOrder(orderData._id ? orderData._id : orderData.id)
          //   message.success('successfully deleted')
          //   this.fetchOrders()
          //   this.closeModal()
          // } catch(e) {
          //   message.success(_.get(e, 'error.message', "Sorry can't delete an inprogress job"))
          //   this.closeModal()
          // }
        }
      } catch(e) {
        message.success(_.get(e, 'error.message', "can't cancel and inprogress job"))
        this.closeModal()
        //this.closeRejectModal()
      }
    } else if (orderData.type === "Exchange") {
      const { revertOrder } = this.props
      try {
        const { value } = await revertOrder({id: orderData.parentId , reject: true})
        if(value) {
          try {
            let { value } = await this.props.deleteOrder(id)
            message.success('successfully deleted')
            this.fetchOrders()
            this.closeModal()
          } catch(e) {
            message.success(_.get(e, 'error.message', "Sorry can't delete an inprogress job"))
            this.closeModal()
          }
          //this.props.fetchOrders()
          //this.closeModal()
        }
      } catch(e) {
        message.success(_.get(e, 'error.message', "Sorry can't delete an inprogress job"))
        this.closeModal()
        //this.closeRejectModal()
      }
    } else {
      try {
        let { value } = await this.props.deleteOrder(id)
        message.success('successfully deleted')
        this.fetchOrders()
        this.closeModal()
      } catch(e) {
        message.success(_.get(e, 'error.message', "Sorry can't delete an inprogress job"))
        this.closeModal()
      }
    }
  }

  openConfirmDeleteModal (id) {
    this.setState({ orderId: id, deleteModelIsOpen: true })
  }

  toggleAddModal (order) {
    this.setState({ orderData: order, addOrderModalIsOpen: true })
  }

  viewOrder (order) {
    const customerid = _.get(this.props, 'user.customerid', '')
    if(customerid !== '') {
      this.props.history.push(`/job/${order.orderid}`, {c: this.state.tab})
      this.setState({ isViewModalOpen: true, orderDataForEdit: order })
    }
  }

  toggleEditModal = (order) => {
    let status = order.status && this.getStatus(order.status, order) ? this.getStatus(order.status, order) : ""
    if ( status === "Pending Removal" ) {
      this.setState({ pendingRemoval: true })
      this.toggleRemovalModal(order, false)
    }
    this.setState({ editModalIsOpen: true, orderDataForEdit: order })
  }

  toggleExchangeModal (order, futureExchange) {
    order.futureExchange = futureExchange
    order.isApproved = false
    this.setState({ exchangeModalIsOpen: !this.state.exchangeModalIsOpen, orderDataForExchange: order, futureExchange: futureExchange})
  }

  toggleRemovalModal (order, futureRemoval) {
    order.futureRemoval = futureRemoval
    order.isApproved = false
    this.setState({ removalModalIsOpen: !this.state.removalModalIsOpen, orderDataForRemoval: order, futureRemoval: futureRemoval})
  }

  onPagechange(page) {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
    this.setState({ page: page , isLoader: true }, () => {
      this.fetchOrders()
    })
  }

  createMapOptions(maps) {
    return {
      panControl: true,
      mapTypeControl: true,
      scrollwheel: true,
      styles: config.mapStyles,
      streetViewControl: true
    }
  }

  onSearch (e) {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    this.setState({
      search: e.target.value, typingTimeout: setTimeout(async () => {
        this.fetchOrders()
      }, 1000)
    })
  }

  getFormatedDateAndTime(input, order) {
    //return ""
    // const timezone = _.get(order, 'timezone', {})
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
      } else if(key === "job_details.completed_at" ) {
        d = this.getFormatedDateAndTimeCompleted( date, _.get( order, 'job_details.offset', 0))
      } else if(key === "childIdJobDetails.started_at" || key === "job_details.started_at") {
        d = this.getFormatedDateAndTimeCompleted( date, _.get( order, 'childIdJobDetails.job_details.offset', 0))
      }
      let dateInfo = getTimeInDayAndHoursForCustomer(d)    
      return dateInfo 
   }

  // getDateinfo(date, order, key) {
  //   if(date) {
  //     date = this.getFormatedDateAndTime(date, order)
  //   }
  //   let dateInfo = order.timezone ? getTimeInDayAndHoursForCustomer(date) : getDateMMDDYYYHHMMForCustomer(order[key])
  //   return dateInfo
  // }

  openCancel(id) {
    this.setState({ cancelModalIsOpen: true, cancelId: id })
  }

  confirmCancel = async() => {
    let id = this.state.cancelId
    const orderData = _.find(_.get(this.state, 'activeOrder', []), (order) => {
      return String(order.id) === String(id)
    })
    if (orderData.type === "Exchange") {
      const { revertOrder } = this.props
      try {
        const { value } = await revertOrder({id: orderData.parentId , reject: true})
        if(value) {
          try {
            let { value } = await this.props.deleteOrder(id)
            // message.success('successfully deleted')
            this.fetchOrders()
            this.closeModal()
          } catch(e) {
            message.success(_.get(e, 'error.message', "Sorry can't delete an inprogress job"))
            this.closeModal()
          }
        }
      } catch(e) {
        message.success(_.get(e, 'error.message', "Sorry can't delete an inprogress job"))
        this.closeModal()
      }
    } else if(orderData.type === "Removal") {
      const { revertOrder } = this.props
      try{
        const { value } = await revertOrder({id: orderData._id ? orderData._id : orderData.id})
        if(value) {
          this.fetchOrders()
          this.closeModal()
        }
      } catch(e) {
        message.success(_.get(e, 'error.message', "can't cancel and inprogress job"))
        this.closeModal()
      }
    } else {
      try {
        let { value } = await this.props.deleteOrder(id)
        // message.success('successfully deleted')
        this.fetchOrders()
        this.closeModal()
      } catch(e) {
        message.success(_.get(e, 'error.message', "Sorry can't delete an inprogress job"))
        this.closeModal()
      }
    }//
  }

  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this.state.interval)
  }

  render() {
    const currentLocation = this.props.location.pathname
    const timezone = this.props.user && this.props.user.timezone && this.props.user.timezone.tzName ? this.props.user.timezone.tzName: Intl.DateTimeFormat().resolvedOptions().timeZone
    const timeZoneOffset = this.props.user && this.props.user.timezone && this.props.user.timezone.offset ? this.props.user.timezone.offset: _.get(Intl.DateTimeFormat().resolvedOptions(), 'offset', 0)
    const timezoneText = moment.tz.zone(timezone).abbr(timeZoneOffset)
    return (
      <div className="layout-has-sidebar layout-has-sidebar-edit">
      { this.state.loadervisible ?
        <div className="fullpage-loader">
          <span className="loaderimg">
              <div className="spinner-border text-warning" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </span>
        </div> :
      "" }
        <TopNavigation fetchOrders={this.fetchOrders} {...this.props} />
        {/* <header className="customer-header">
        <div className="flex-inner">
            <img src={curbsideLogo} className="logo" />
            <ul>
              <li className="active">Dashboard</li>
              <li>Orders</li>
              <li>Reports</li>
            </ul>
        </div>

        <div>
            <div className="flex-inner">
            <NotificationIcon />
              <div className="topnavigation-layout__profile hidemobileview ml">
              <Dropdown ClassName="profile--dropdown--overlay">
                <a className="ant-dropdown-link d-flex align-items-center" href="#">
                  <div className="avatar-info mr-2">
                    <div className="avatar-name">Lee James</div>
                    <div className="avatar-email">lee.james@curbside.com</div>
                  </div>
                  <DownCaretIcon />
                </a>
              </Dropdown>
            </div>
        </div>
          </div>
        </header> */}
        <main className="dashboard-layout-content width1033">
          <div className="row mb-3">
            <div className="col-md-12 mb-4">
              <div className="d-flex align-items-center flex-unset-mob">
                <h5 className="table-title"><img src={ordersIcon} className="mr-2" /> Your Orders</h5>
                <div className="ml-auto">
                  <button onClick={this.openModal.bind(this, 'addOrderModalIsOpen')} className="btn btn-dark w-180 font-600 font-16 fullwidth-mobile">
                    Create New Order
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="flex-btn">
                {/* <Link to="" className="btn primarybtn primarybtn-active">Active Orders</Link>
                <Link to="" className="btn primarybtn">Pending Approval</Link>
                <Link to="" className="btn primarybtn">Past Orders</Link> */}
                <button
                  className={this.state.tab === 'active' ? "btn primarybtn primarybtn-active" : "btn primarybtn"}
                  onClick={this.tabChange.bind(this, 'active', '/active-containers')}
                > Active Orders </button>
                <button
                  className={this.state.tab === 'pending' ? "btn primarybtn primarybtn-active" : "btn primarybtn"}
                  onClick={this.tabChange.bind(this, 'pending', '/pending-orders')}
                > Pending Approval</button>
                <button
                  className={this.state.tab === 'history' ? "btn primarybtn primarybtn-active" : "btn primarybtn"}
                  onClick={this.tabChange.bind(this, 'history', '/completed-orders')}
                > Past Orders </button>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <input value={this.state.search} onChange={this.onSearch.bind(this)} type="search" placeholder="Search" className="customer-searchbar" />
            </div>
          </div>

          { this.state.tab !== 'history' ?
          <div className="">
            {_.get(this.state, 'activeOrder', []).length !== 0 ?
              <div className="">
                {_.get(this.state, 'activeOrder', []).map((order, i)=>{
                  let createdInfo = this.getDateinfo(order.createdat, order, 'createdat')
                  let startedInfo = this.getDateinfo(_.get(order, 'job_details.started_at', null), order, 'job_details.started_at')
                  let completedInfo = this.getDateinfo(_.get(order, 'job_details.completed_at', null), order, 'job_details.completed_at')
                  const status = this.getStatus(order.status, order) && (this.getStatus(order.status, order).replace(/\s/g,'').replace(/[0-9]/g, '')).toLowerCase()

                  let idx = -1
                  let selectedTruck= ''
                  if (order.job_details && order.job_details.incompleted_by) {
                    order.inporgress = false
                  }
                  if (order.inporgress && order.job_details.truck_number && !order.job_details.incompleted_by ) {
                    idx = _.get(this.state, 'truck', []).findIndex(obj => obj.name === order.job_details.truck_number )
                    if (idx !== -1) {
                      selectedTruck = this.state.truck[idx]
                    }
                  }

                  if ((order.type === "Removal" || _.get(order,'childIdOrderDetails.type', '') === "Exchange") && order.childIdJobDetails && order.childIdJobDetails.truck_number && order.childIdJobDetails.started_at && !order.childIdJobDetails.completed_at && !order.childIdJobDetails.incompleted_by) {
                    idx = _.get(this.state, 'truck', []).findIndex(obj => obj.name === order.childIdJobDetails.truck_number )
                    if (idx !== -1) {
                      selectedTruck = this.state.truck[idx]
                    }
                  }

                  return (
                    <div key={i} className="row">
                      <div className="col-md-12">
                        <div className="customer-left-sec">
                          <div onClick={this.viewOrder.bind(this, order)} className="top-sec">
                            <ul>
                              <li>
                                <h4>Delivery Date</h4>
                                <h5>{(this.getStatus(order.status, order) === "Future Exchange" || this.getStatus(order.status, order) === "Future Removal") ? getDate(order.pickupdate) : getDate(order.deliverydate)}</h5>
                              </li>

                              <li>
                                <h4>Removal Date</h4>
                                <h5>{((this.getStatus(order.status, order) === 'Future Removal' || this.getStatus(order.status, order) === 'Pending Removal' || this.getStatus(order.status, order) === 'Removed') ? (getContainerSize(this.state.containerList, order.container) === 'Live Load' ? getDate(order.deliverydate) : getDate(order.pickupdate)) : '-')}</h5>
                              </li>

                              <li>
                                <h4>Address</h4>
                                <h5>{this.formatAddess(order)}</h5>
                              </li>

                              <li>
                                {/* <span className="greenlabel">In Use</span> */}
                                { this.state.tab === 'pending' && (_.get(order, 'type', '') === "Exchange" || _.get(order, 'type', '') === "Removal")  ?
                                <span className="greenlable unapproved-status exchange">{_.get(order, 'type', '')}</span>
                                : <span className="btn-purple-fill--lg status-container" status={status}>{this.getStatus(order.status, order)}</span>
                               }
                              </li>
                            </ul>
                          </div>
                          <div onClick={this.viewOrder.bind(this, order)} className="middle-sec">
                            <img src={containerImg} />
                            <div>
                            <h4>Container Size : <span>
                            {order.save_as_draft ?
                              <span> Draft
                                {/* <button key ={i} className="btn">Draft</button> */}
                              </span>
                            : _.get(this.state, 'containerList', []).map((cnt, i)=>{
                                  const classIndex = _.findIndex(this.state.classname, (c) => {
                                    return c.size === _.get(cnt, 'size', '')
                                  })
                                  if (cnt._id === order.container) {
                                    return (
                                      <span key ={i}>{_.get(cnt, 'size', '')}</span>
                                    )
                                  }
                                })
                              }
                            </span>
                            </h4>

                            <h4>Order Number : <span>{_.get(order, 'orderid', '')}</span></h4>
                            </div>
                          </div>

                            <div className="last-sec">
                              <div onClick={this.viewOrder.bind(this, order)} className="listwrapper">
                                <ul>
                                  <li>
                                    <img src={greenFillIcon} />
                                    <h4>Order Placed</h4>
                                    <h6>{createdInfo} {timezoneText}</h6>
                                  </li>
                                  <li>
                                    <img src={(_.get(order, 'inporgress', false) === true || this.getStatus(order.status, order) === "In Use" || this.getStatus(order.status, order) === "Pending Removal" || this.getStatus(order.status, order) === "Removed") && !_.get(order, 'job_details.incompleted_by', null) ? greenFillIcon: grayOutlineIcon} />
                                    <h4>On Its Way</h4>
                                    {(_.get(order, 'inporgress', false) === true || this.getStatus(order.status, order) === "In Use" || this.getStatus(order.status, order) === "Pending Removal" || this.getStatus(order.status, order) === "Removed") && !_.get(order, 'job_details.incompleted_by', null)?
                                    <h6>{startedInfo}  {timezoneText}</h6> : ''}
                                  </li>
                                  <li>
                                    <img src={this.getStatus(order.status, order) === "In Use" || this.getStatus(order.status, order) === "Pending Removal" || this.getStatus(order.status, order) === "Removed" ? greenFillIcon : grayOutlineIcon} />
                                    <h4>Delivered</h4>
                                    {_.get(order, 'job_details.completed_at', null) !== null ?
                                     <h6>{completedInfo}  {timezoneText}</h6> : '' }
                                  </li>
                                </ul>
                              </div>

                              <div onClick={this.viewOrder.bind(this, order)} className="listwrapper">
                                { _.get(order, 'childIdOrderDetails', null) && (
                                  <ul>
                                    <li>
                                      <img src={greenFillIcon} />
                                      <h4>Removal Scheduled</h4>
                                      <h6>{this.getDateinfo(_.get(order, 'childIdOrderDetails.createdat', ''), _.get(order, 'childIdOrderDetails', {}), 'createdat')} {timezoneText} </h6>
                                    </li>
                                      <li>
                                      <img src={order.childIdJobDetails && order.childIdJobDetails.started_at && !order.childIdJobDetails.incompleted_by ? greenFillIcon : grayOutlineIcon  } />
                                      <h4>On Its Way</h4>
                                      { order.childIdJobDetails && order.childIdJobDetails.started_at && !order.childIdJobDetails.incompleted_by ?
                                        <h6>{this.getDateinfo(_.get(order, 'childIdJobDetails.started_at', ''), order, 'childIdJobDetails.started_at')} {timezoneText}</h6>
                                        : ""
                                      }
                                    </li>
                                    <li>
                                      <img src={order.childIdJobDetails && order.childIdJobDetails.completed_at ? greenFillIcon : grayOutlineIcon} />
                                      <h4>Removed</h4>
                                      { order.childIdJobDetails && order.childIdJobDetails.completed_at ?
                                        <h6>{this.getDateinfo(_.get(order, 'childIdJobDetails.completed_at', ''), order, 'completed_at', 'removal')} {timezoneText}</h6>
                                      : "" }
                                    </li>
                                  </ul>
                                )}
                              </div>
                              { (_.get(order, 'inporgress', false) === true || selectedTruck !== '') && _.get(order, 'location', '') !== '' ?
                              <div className="map-section-small" style={{height: "380px"}}>
                                <GoogleMap
                                  id="map"
                                  defaultZoom={12}
                                  center={_.get(order, 'location', '')}
                                  // layerTypes={layerTypes}
                                  options={this.createMapOptions()}
                                >
                                  <Marker
                                    id="map"
                                    lat={_.get(order, 'location.lat', '')}
                                    lng={_.get(order, 'location.lng', '')}
                                  />
                                  { idx !== -1 && selectedTruck !== '' && (
                                    <TruckMarker
                                      key={selectedTruck.id}
                                      id={selectedTruck.id}
                                      name={selectedTruck.name}
                                      lat={selectedTruck.latitude}
                                      lng={selectedTruck.longitude}
                                    />
                                  )}
                                </GoogleMap>
                              </div>
                              :""}
                            </div>


                        </div>

                        <div className="customer-right-sec">
                        { this.getStatus(order.status, order) !== "Removed" && this.getStatus(order.status, order) !== "Future Removal" && this.getStatus(order.status, order) !== "Future Exchange" ?
                            <button onClick={this.toggleAddModal.bind(this,order)} className="btn btn-dark">Order Again</button>
                          : "" }
                          <button onClick={this.viewOrder.bind(this, order)} className="btn btn-dark">View Order Details</button>
                          { (this.getStatus(order.status, order) === "Pending Delivery" && order && _.get(order, 'job_details.started_at', null) === null) || (this.getStatus(order.status, order) === "Future Removal" || String(this.getStatus(order.status, order)).indexOf('Future Exchange') !== -1) ?
                            <button onClick={this.toggleEditModal.bind(this,order)} className="btn btn-dark">Edit Order</button>
                          : "" }
                          { this.getStatus(order.status, order) === "In Use" && this.getStatus(order.status, order) !== "Pending Removal" ?
                            <button onClick={this.toggleExchangeModal.bind(this,order, false)} className="btn btn-dark">{ getContainerSize(this.state.containerList, order.container) !== "1/2 Yard" ? "Exchange" : "Action"}</button>
                          : "" }
                          { this.getStatus(order.status, order) === "In Use" && getContainerSize(this.state.containerList, order.container) !== "1/2 Yard" ?
                            <button onClick={this.toggleRemovalModal.bind(this,order, false)} className="btn btn-dark">Removal</button>
                           : "" }
                          { this.getStatus(order.status, order) !== "Removed" && this.getStatus(order.status, order) !== "Pending Delivery" && this.getStatus(order.status, order) !== "In Use" && this.getStatus(order.status, order) !== "Pending Removal" ?
                             <button className="btn btn-dark" onClick={this.openConfirmDeleteModal.bind(this,order.id )}>Delete</button>
                          : "" }

                          { (this.getStatus(order.status, order) === "Pending Delivery" && _.get(order, 'inporgress', false) !== true) || this.getStatus(order.status, order) === "Pending Action" || (this.getStatus(order.status, order) === "Pending Removal" && _.get(order, 'type', '') === "Removal" && _.get(order, 'childIdJobDetails.started_at' ,'') == '' && _.get(order, 'childIdJobDetails.incompleted_by', '') == '') ?
                           <button className="btn btn-dark" onClick={this.openCancel.bind(this, order.id)}>Cancel</button>
                           : ''}

                          {/* <button className="btn btn-dark">Order Again</button>
                          <button className="btn btn-dark">View Order Details</button>
                          <button className="btn btn-dark">Edit Order</button>
                          <button className="btn btn-dark">Cancel Order</button> */}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            :
              <EmptyComponent
                emptyText = "No Orders"
              />
            }
          </div>
          :
          <HistoryOrders
            customerId={this.state.customerId}
            {...this.props}
            liveOrders={this.state.activeOrder}
            fetchOrders={this.fetchOrders}
            containerList={this.state.containerList}
            statusList={this.state.statusList}
            orderSorting= {(sort, by)=>{this.orderSorting(sort, by)}}
            toggleAddModal = {this.toggleAddModal.bind(this)}
            toggleEditModal = {this.toggleEditModal.bind(this)}
            toggleExchangeModal = {this.toggleExchangeModal.bind(this)}
            toggleRemovalModal = {this.toggleRemovalModal.bind(this)}
            openConfirmDeleteModal= {this.openConfirmDeleteModal.bind(this)}
          />
          }
          {this.state.limit < this.state.totalActiveOrder ?
            <Pagination
              className="pb-3 text-center pagination-wrapper w-100 mt-3"
              current={this.state.page}
              onChange={this.onPagechange.bind(this)}
              pageSize={this.state.limit}
              total={this.state.totalActiveOrder}
            />
            : '' }
        </main>
        {this.state.addOrderModalIsOpen ?
        <AddOrder
          addOrderModalIsOpen = {this.state.addOrderModalIsOpen}
          orderData={this.state.orderData}
          closeModal={this.closeModal}
          customerId={this.state.customerId}
          containerList={this.state.containerList}
          statusList={this.state.statusList}
          selectedCustomer= {_.get(this.props, 'user', {})}
          fetchOrders={this.fetchOrders}
          {...this.props}
        /> : ""}
        {this.state.editModalIsOpen ?

        <EditOrder
          editModalIsOpen = {this.state.editModalIsOpen}
          closeModal={this.closeModal}
          customerId={this.state.customerId}
          containerList={this.state.containerList}
          statusList={this.props.statusList}
          fetchOrders={this.fetchOrders}
          selectedCustomer= {_.get(this.props, 'user', {})}
          orderDataForEdit = {this.state.orderDataForEdit}
          {...this.props}
        /> : ""}

        {this.state.isViewModalOpen ?
        <ViewOrder
          isViewModalOpen = {this.state.isViewModalOpen}
          closeModal={this.closeModal}
          customerId={this.state.customerId}
          containerList={this.state.containerList}
          statusList={this.state.statusList}
          trucks={this.state.truck}
          fetchOrders={this.fetchOrders}
          orderData = {this.state.orderDataForEdit}
          viewOrder ={this.viewOrder.bind(this)}
          selectedCustomer= {_.get(this.props, 'user', {})}
          toggleAddModal = {this.toggleAddModal.bind(this)}
          toggleEditModal = {this.toggleEditModal.bind(this)}
          toggleExchangeModal = {this.toggleExchangeModal.bind(this)}
          toggleRemovalModal = {this.toggleRemovalModal.bind(this)}
          openConfirmDeleteModal= {this.openConfirmDeleteModal.bind(this)}
          openCancel={this.openCancel.bind(this)}
          {...this.props}
        /> : ""}

        {this.state.exchangeModalIsOpen ?
        <ExchangeOrder
          exchangeModalIsOpen = {this.state.exchangeModalIsOpen}
          closeModal={this.closeModal}
          customerId={_.get(this.props, 'user.customerid', '')}
          containerList={this.state.containerList}
          statusList={this.state.statusList}
          //selectedCustomer= {this.props.selectedCustomer}
          fetchOrders={this.fetchOrders}
          orderDataForExchange = {this.state.orderDataForExchange}
          futureExchange={this.state.futureExchange}
          dumps={this.state.dumps}
          {...this.props}
        /> : ""}

        {this.state.removalModalIsOpen ?
        <RemovalOrder
          removalModalIsOpen = {this.state.removalModalIsOpen}
          closeModal={this.closeModal}
          customerId={this.state.customerId}
          containerList={this.state.containerList}
          statusList={this.state.statusList}
          selectedCustomer= {_.get(this.props, 'user', {})}
          fetchOrders={this.fetchOrders}
          orderDataForRemoval = {this.state.orderDataForRemoval}
          futureRemoval={this.state.futureRemoval}
          dumps={this.state.dumps}
          {...this.props}
          pendingRemoval={this.state.pendingRemoval}
        /> : ""}

        <CancelModal
          cancelModalIsOpen={this.state.cancelModalIsOpen}
          closeModal={this.closeModal.bind(this)}
          confirmCancel={this.confirmCancel.bind(this)}
          text={'order’s'}
        />

        <DeleteModal
          deleteModelIsOpen={this.state.deleteModelIsOpen}
          closeModal={this.closeModal.bind(this)}
          confirmDelete={this.confirmDelete.bind(this)}
          text={'order’s'}
        />
      </div>
    )
  }
}
