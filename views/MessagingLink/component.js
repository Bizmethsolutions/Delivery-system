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
import ViewOrder from './partials/viewOrderModal'

import YellowMark from '../../images/yellow_img.png'
import GreenImg from '../../images/green_img.png'

import { NotificationIcon, DownCaretIcon, CloseIcon } from '../../components/icons'


import config from '../../config/index'
// import PropTypes from 'prop-types'

//import './styles.scss'
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
      page: 0,
      limit: 20,
      type: 'live',
      search: '',
      activeOrder: [],
      deleteModelIsOpen: false,
      orderId: '',
      isViewModalOpen: false,
      isEditModalOpen: false,
      futureRemoval: false,
      tab: 'active',
      isApproved: true,
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
      pendingRemoval: false
    })
  }

  componentDidMount = async()=> {
    this._isMounted = true;
    document.title = 'Active Containers | CurbWaste'
    const { limit, by, page, sort_field, search_string, type } = this.state
    let data = {
      limit, by, page, sort_field, search_string, type: 'd'
    }

    let customerid = localStorage.getItem('userid')
    if(_.get(this.props, 'user.createdBy', undefined) !== undefined) {
      customerid = _.get(this.props, 'user.createdBy', undefined)
    }
    this.getLocation()
    let interval = setInterval(async() => {
      this.getLocation()
    }, 2000)
    this.setState({ interval: interval })

    let  val  = await this.props.getContainer()
    this.setState({
      containerList: _.get(val, 'value.containers', []),
      statusList: _.get(val, 'value.status', []),
      customerId: customerid,
    })
    if (this.props.match.params && this.props.match.params.id) {
      try {
        let { value } = await this.props.trackingLink(this.props.match.params.id)
        if(value) {
            this.setState({ isViewModalOpen: true,  orderDataForEdit: value.data})
         }
      } catch(e) {
        this.props.history.push('/login')
      }
      
      // let data ={
      //   page: 0,
      //   limit: undefined,
      //   sort: this.state.sort_field,
      //   by: this.state.by,
      //   isRejected: false,
      //   isApproved: true,
      //   customerId: customerid //this.props.match.params.id
      // }

      // let { value } = await this.props.getOrderByOrderId(this.props.match.params.id)
      // if(value) {
      //   // const order = _.find(value.data, (o) => {
      //   //   return String(o.orderid) === String(this.props.match.params.id)
      //   // })
      //   this.setState({ isViewModalOpen: true,  orderDataForEdit: value.data})
      // }
    }
  }

  getLocation =async ()=> {    
    let { value } = await this.props.getLocation()
    let truck = value.data.vehicles
    if (this._isMounted) {
      this.setState({ truck })
    }
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
    let { value } = await this.props.deleteOrder(id)
    message.success('successfully deleted')
    this.fetchOrders()
    this.closeModal()
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
    this.setState({ page: page -1 , isLoader: true }, () => {
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
    const timezone = _.get(order, 'timezone', {})
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
          {...this.props}
        /> : ""}

        

        
      </div>
    )
  }
}
