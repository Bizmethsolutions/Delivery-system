import React, { PureComponent, Fragment } from 'react'
import { Link } from 'react-router-dom'
import ReactModal from 'react-modal'
import moment from "moment"
import _ from 'lodash'
import { Menu, Dropdown, Select, message } from 'antd'
import GoogleMap from 'google-map-react';
// import io from 'socket.io-client';
import TopNavigation from './../TopNavigation/container'
import CustomerTopNavigation from './../CustomerTopNavigation/container'
import SidebarNavigation from './../SidebarNavigation/container'
import PageviewIcon from './../../images/pageview-icon.svg'
import LeadsIcon from './../../images/leads-icon.svg'
import { formatOrderAddess, formatPhoneNumber, getContainerSize, getDate } from '../../components/commonFormate'
// import NoLeadsIcon from './../../images/no-leads-icon.svg'
import mapImg from './../../images/mapicon.jpg'
import { socket } from '../../components/socket'
import EmptyComponent from '../../components/emptyComponent'
import DatePickerRange from '../../components/date-picker-modal'

import { LocationIconRed, CloseIcon, RightArrow, LocationIconPurple, SortingNewDownIcon, LocationIconSky, DumpsiteIcon, YardIcon,
  LocationIconGreen, LocationIconYellow, LocationIconOrange, DotBtnIcon, SortingNewUpIcon, SortingDownArrow, LocationIconRedActive, LocationIconPurpleActive, LocationIconGreenActive, LocationIconYellowActive, LocationIconOrangeActive, LocationIconSkyActive, DumpsiteIconActive, YardIconActive, LocationIconCompleted, LocationIconCompletedActive }
from '../../components/icons'
import './styles.scss'
import config from '../../config/index'
import ViewOrder from './partials/viewOrderModal'
import ApprovalModel from './partials/approvalOrderModal'
import DispatchMap from './partials/dispatchMap'

import TenYard from '../../images/10yard-mapicon.svg'
import Deliveries from '../../images/deliveries.png'
import TwentyYard from '../../images/20yard-mapicon.svg'
import FifYard from '../../images/15yard_map.svg'
import ThirtyYard from '../../images/30yard-mapicon.svg'
import HalfYard from '../../images/1-2-yard-mapicon.svg'
import Liveloads from '../../images/liveloads.png'
import DumpBig from '../../images/dump-bg.svg'
import Yardgreen from '../../images/yard-sm.svg'
import Dumpsmall from '../../images/dump-sm.svg'
import HaulerImg from '../../images/hauler-yard-mapicon.svg'
import Closemapbtn from '../../images/close_map_btn.png'
import Closemapbtnnew from '../../images/updated-close.svg'
import activedump from '../../images/dump-active.png'

const { Option } = Select

const Marker = (props) => {
  // console.log(props)
  const markerStyle = {
    cursor: 'pointer',
    zIndex: 10,
    marginLeft: '-12px',
    marginTop: '12px'
  };
  let containerName = getContainerSize(props.containerList, props.place.container)
  let status = "";
  props.statusList.forEach(function (element) {
      if (props.place.status === element._id)
          status = element.status
  }, this);
  let icon = ""
  if (containerName === '10 Yard') {
    icon = TenYard
  }
  if (containerName === '15 Yard') {
    icon = FifYard
  }
  if (containerName === '20 Yard') {
    icon = TwentyYard
  }
  if (containerName === '30 Yard') {
    icon = ThirtyYard
  }
  if (containerName === '1/2 Yard') {
    icon = HalfYard
  }
  if (containerName === 'Live Load') {
    icon = Liveloads
  }


  // if( props.place) {
  //   icon = "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
  // }
  // console.log(icon)
  return (
    <Fragment>
      <img src={icon} style={markerStyle} />
      {props.show && <InfoWindow place={props.place}  containerName={containerName} viewDetails={props.viewDetails} closeInfoWindow={props.closeInfoWindow}/>}
    </Fragment>
  )
}

const InfoWindow = (props) => {
  const { place, containerName } = props;
  const infoWindowStyle = {
    position: 'relative',
    bottom: 150,
    left: '-45px',
    width: 220,
    backgroundColor: 'white',
    boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
    padding: 10,
    fontSize: 14,
    zIndex: 100,
  };
  if(place) {
    let address = place.new_address
    address = address.replace(', USA', ' ')
    if(place.city !== "") {
      address = `${address}, ${place.city}`
    }
    if(place.state !== "") {
      address = `${address}, ${place.state}`
    }
    if(place.zipcode !== "") {
      address = `${address} ${place.zipcode}`
    }
    // if(place.borough && place.borough !== "") {
    //   address = `${address} - ${place.borough}`
    // }
    // if(place.neighbourhood && place.neighbourhood !== "") {
    //   address = `${address} - ${place.neighbourhood}`
    // }
    return (
      <div className="infowindow__wrapper">
        <div className="infowindow__wrapper--body">
          <div className="infowindow__wrapper--close">
            <img src={Closemapbtnnew} alt="close" onClick={props.closeInfoWindow}/>
          </div>
          <ul className="infowindow__wrapper--list">
          {_.get(props.place, 'customer.companyname', '') !== "" ?
            <li>
              <span>Customer Name</span><b>:</b>
              <p>{_.get(props.place, 'customer.companyname', '') !== "" ? _.get(props.place, 'customer.companyname', '') : _.get(props.place, 'customer_info.companyname', '')}</p>
            </li> : "" }
            <li>
              <span>Order Type</span><b>:</b>
              <p>{containerName}</p></li>
            <li>
              <span>Address</span><b>:</b>
              <p>{address}</p>
            </li>
            {_.get(place, 'borough', '') !== "" ?
              <li>
                <span>Borough</span><b>:</b>
                <p>{place.borough}</p>
              </li>
            : ""}
            {_.get(place, 'neighbourhood', '') !== "" ?
              <li>
                <span>Neighborhood</span><b>:</b>
                <p>{place.neighbourhood}</p>
              </li>
            : ""}

            {containerName && containerName !== "Live Load" ? containerName === "1/2 Yard" ? <li className="company_name">
              <span>Number of Minis</span><b>:</b><p>{_.get(props, 'place.half_yrd_qty', '')}</p></li>  : <li className="company_name">
              <span>Product/Service</span><b>:</b><p>{containerName}</p></li>  : ''}
            {props.place.accessibility && props.place.accessibility !== "Select" && (props.place.status === "completed" || props.place.jobStatus === "Exchange" || props.place.jobStatus === "Removal" ) ? <li>
              <span>Accessibility Notes</span><b>:</b>
              <p>{props.place.accessibility && props.place.accessibility !== "Select" ? props.place.accessibility === "Other: Manual entry" ? props.place.manualaccessibility : props.place.accessibility : ""}</p>
            </li> : "" }

            </ul>
        </div>
        <div className="infowindow__wrapper--footer">
          <button className="btn btn-outline-primary btn__view_order" onClick={props.viewDetails}>View Order Details</button>&nbsp;
        </div>
      </div>
    );
  } else {
    return ""
  }
}

const InfoWindowForDumpsAndYards = (props) => {
  const { place } = props;
  const infoWindowStyle = {
    position: 'relative',
    bottom: 150,
    left: '-45px',
    width: 220,
    backgroundColor: 'white',
    boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
    padding: 10,
    fontSize: 14,
    zIndex: 100,
  };
  if(place) {
    let name = place.type === "d" ? place.companyname : place.yardname
    if (place.type === "h") {
      name = place.company_name
    }
    let address = place.address
    if (place.city) {
        address += ", " + place.city
    }
    if (place.state) {
        address += ", " + place.state
    }
    // if (item.neighborhood) {
    //     address += "," + item.neighborhood
    // }
    // if (item.borough) {
    //     address += "," + item.borough
    // }
    if (place.zipcode) {
        address += " " + place.zipcode
    }
    return (
      <div className="infowindow__wrapper">
        <div className="infowindow__wrapper--body">
          <div className="infowindow__wrapper--close">
            <img src={Closemapbtnnew} alt="close" onClick={props.closeInfoWindow}/>
          </div>
          <ul className="infowindow__wrapper--list dump_yards">
            <li>
              <span>Name</span><b>:</b>
              <p>{name}</p>
            </li>
            <li>
              <span>Location</span><b>:</b>
              <p>{address}</p>
            </li>
          </ul>
        </div>
      </div>
    );
  } else {
    return ""
  }
};

const DumpAndYardMarker = (props) => {
  const markerStyle = {
    cursor: 'pointer',
    zIndex: 10,
    marginLeft: '-12px',
    marginTop: '12px',
    width: props.type === "yard" ? '30px' : '30px'
  };
  let icon = DumpBig
  if(props.type === "yard") {
    icon = Yardgreen
  }
  return (
    <Fragment>
      <img src={icon} style={markerStyle} />
       {props.show && <InfoWindowForDumpsAndYards place={props.place} closeInfoWindow={props.closeInfoWindow}/>}
    </Fragment>
  );
};

const HaulerMarker = (props) => {
  const markerStyle = {
    cursor: 'pointer',
    zIndex: 10,
    marginLeft: '-12px',
    marginTop: '12px',
    width: props.type === "yard" ? '16px' : '16px'
  };
  let icon = HaulerImg

  return (
    <Fragment>
      <img src={icon} style={markerStyle} />
       {props.show && <InfoWindowForDumpsAndYards place={props.place} closeInfoWindow={props.closeInfoWindow}/>}
    </Fragment>
  );
};


export default class DashboardComponent extends PureComponent {
  constructor() {
    super()
    this.state = {
      todayDate: moment(),
      datePickerModal: false,
      from: moment().format("ll"),
      to: moment().format("ll"),
      pendingOrders: [],
      // FOR SIDEBAR
      isSidebarOpen: false,
      containerList: [],
      statusList: [],
      daysFilter: 'today',
      textShow: `Today (${moment().format('MMM DD, YYYY')})`,
      startDate:  moment(),
      endDate: moment(),
      RecapLogsMatrix: [],
      totalLiveOrder: [],
      filterOrder: [],
      layerTypes: [],
      dateType: 'all',
      dumps: [],
      yards: [],
      sort_field: 'deliverydate',
      by: -1,
      dumpsForFilter: [],
      yardsForFilter: [],
      haulerList: [],
      tab: 'container',
      dispatchCount: 0,
      orderLogCount: 0,
      classname: [
        {class: "red-yard", size: '10 Yard'},
        {class: "purple-yard", size: '15 Yard'},
        {class: "green-yard", size: '20 Yard'},
        {class: "yellow-yard", size: '30 Yard'},
        {class: "orange-yard", size: '1/2 Yard'},
        {class: "blue-yard", size: 'Live Load'}
      ],
      rejectModelIsOpen: false,
      approvalModelIsOpen: false,
      filterkeys: [],
      center: {
        lat: 40.706928,
        lng: -73.621788
      },
    }
    this.showInfo = this.showInfo.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
  }

  componentDidMount = async()=> {
    document.title = 'Dashboard | CurbWaste'
    let  val  = await this.props.getContainer()
    this.setState({ containerList: val.value.containers, statusList: val.value.status })
    const id = localStorage.getItem('companyId')
    if (localStorage.getItem('usertype')=== 'user') {
      this.fetchPendingOrders()
      this.getYardsAndDump()
      this.getHaulers()
      this.dispatchOrderCount(_.get(this.props, 'user.defaultHauler._id', ''))
      this.getAllJobsForOrderLog()
    }

    this.fetchRecapLogsMatrix()
    this.fetchAllLiveOrders()
    this.props.getEnterpriseNotifications(id)
  }
  getHaulers = async()=>{
    const data = {
    }
    let { value } = await this.props.getHaulers(data)
    this.setState({
      haulerList: _.get(value, 'data.dataArr', []),
      haulersForFilter: _.get(value, 'data.dataArr', [])
    })
  }
  fetchPendingOrders=async ()=> {
    let data = {
      sort: this.state.sort_field,
      by: this.state.by
    }
    let { value } = await this.props.fetchPendingOrders(data)
    if (value.type=== 'success') {
      this.setState({ pendingOrders: value.data })
    }
  }

  fetchAllLiveOrders = async()=> {
    let customerid = localStorage.getItem('userid')
    if(_.get(this.props, 'user.createdBy', undefined) !== undefined) {
      customerid = _.get(this.props, 'user.createdBy', undefined)
    }
    if (localStorage.getItem('usertype')=== 'user') {
      let { value } = await this.props.fetchAllLiveOrders()
      let self = this
      let orders = value.filter(function (o) {
          return self.getStatus(o.status, o) && self.getStatus(o.status, o) !== "Removed" && self.getStatus(o.status, o) !== "Pending Delivery"
      });
      // let finalorders = orders.filter(function (o) {
      //   let containerName = getContainerSize(self.state.containerList, o.container)
      //     return containerName && containerName !== "Live Load"
      // });
      this.setState({ totalLiveOrder: orders, filterOrder: orders }, () => {
        this.removeExtraOrder()
      })
    } else {
      let data ={
        page: 1,
        limit: 100,
        sort: 'deliverydate',
        by: 1,
        type: "live",
        customerId: customerid
      }
      let { value } = await this.props.getAllOrders(data)
      this.setState({
        filterOrder: _.get(value, 'order', []),
        totalLiveOrder: _.get(value, 'order', []),
      }, () => {
        this.removeExtraOrder()
      })
    }
  }

  removeExtraOrder() {
    const { totalLiveOrder } = this.state
    const status = ['Pending Delivery', 'Removed', 'Future Exchange', 'Complete']
    const filterOrders = _.filter(totalLiveOrder, (order) => {
      return status.indexOf(this.getStatusCheck(order.status, order)) === -1
    })
    this.setState({ totalLiveOrder: filterOrders, filterOrder: filterOrders })
  }

  getAllJobsForOrderLog = async()=> {
    let timezone = this.props.user && this.props.user.timezone && this.props.user.timezone.tzName  ? this.props.user.timezone.tzName : Intl.DateTimeFormat().resolvedOptions().timeZone
    const startDate = moment(this.state.startDate).tz(timezone).format('MM/DD/YYYY')
    const endDate = moment(this.state.endDate).tz(timezone).format('MM/DD/YYYY')
    const offset = moment.tz(moment(), timezone).utcOffset()
      const obj = {
        startDate, endDate,
        All: false,
        offset:String(offset),
        sort_field: "orderid",
        by: -1,
      }
      let {value} = await this.props.getAllJobsForOrderLog(obj)
      this.setState({ orderLogCount: _.get(value, 'data.jobs', []).length })
  }

  fetchRecapLogsMatrix =async()=>{
    let data ={
      from: moment(this.state.startDate).format("MM-DD-YYYY"),
      to: moment(this.state.endDate).format("MM-DD-YYYY"),
    }
    if (localStorage.getItem('usertype') === 'customer') {
      let customerid = localStorage.getItem('userid')
      if(_.get(this.props, 'user.createdBy', undefined) !== undefined) {
        customerid = _.get(this.props, 'user.createdBy', undefined)
      }
      data.customer = customerid
    }
    let { value } = await this.props.fetchRecapLogsMatrix(data)
    this.setState({ RecapLogsMatrix: value })
  }

  getYardsAndDump = async () => {
    let { value } = await this.props.getYardsAndDump()
    this.setState({
      dumps: _.get(value,'data.dumps', []),
      yards: _.get(value, 'data.yards', []),
      dumpsForFilter: _.get(value, 'data.dumps', []),
      yardsForFilter: _.get(value, 'data.yards', [])
    })
  }
  // FOR SIDEBAR
  toggleSidebar = () => {
    this.setState({ isSidebarOpen: !this.state.isSidebarOpen })
  }

  onSubmitDateRanges ({ startDate, endDate }) {
    this.setState({endDate, startDate, daysFilter: "custom", datePickerModal: false
    }, () => {
      this.fetchRecapLogsMatrix()
      this.getAllJobsForOrderLog()
      this.setState({ textShow: `Custom ${this.getCustomDate()}`})
    })
  }

  updateCount(count) {
    this.setState({ dispatchCount: count})
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

  getStatusCheck(input, order) {
    if (input && this.state.statusList) {
      let status = "";
      this.state.statusList.forEach(function (element) {
          if (input === element._id)
              status = element.status
      }, this);
      return status
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

  getCustomDate () {
    let dataRange = ''
    if (this.state.daysFilter === 'custom') {
      dataRange = `(${moment(this.state.startDate).format('MMM DD, YYYY')} - ${moment(this.state.endDate ).format('MMM DD, YYYY')})`
    }
    return dataRange
  }

  handleDateChange (e) {
    let value = e ? e.target.value : this.state.daysFilter
    let to = moment().format('MM/DD/YYYY')
    if (value === 'today') {
      this.setState({
        daysFilter: value,
        textShow: `Today (${moment().format('MMM DD, YYYY')})`,
        startDate: moment().format('MM/DD/YYYY'),
        endDate: moment().format('MM/DD/YYYY')
      }, ()=> {
        this.fetchRecapLogsMatrix()
        this.getAllJobsForOrderLog()
      })
    } else if (value === 'week') {
      this.setState({
        daysFilter: value,
        textShow: `This Week (${moment().startOf('week').format('MMM DD, YYYY')} - ${moment().endOf('week').format('MMM DD, YYYY')})`,
        startDate: moment().startOf('week').format('MM/DD/YYYY'),
        endDate: moment().endOf('week').format('MM/DD/YYYY')
      }, ()=> {
        this.fetchRecapLogsMatrix()
        this.getAllJobsForOrderLog()
      })
    } else if (value === 'month') {
      this.setState({
        daysFilter: value,
        startDate: moment().startOf('month').format('MM/DD/YYYY'),
        textShow: `This Month (${moment().startOf('month').format('MMM DD, YYYY')} - ${moment().endOf('month').format('MMM DD, YYYY')})`,
        endDate: moment().endOf('month').format('MM/DD/YYYY')
      }, ()=> {
        this.fetchRecapLogsMatrix()
        this.getAllJobsForOrderLog()
      })
    } else {
      this.setState({ datePickerModal: true })
    }
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

  filterMarkers(key, filter) {
    this.setState({ isFiltered: true })
    let filterkeys = this.state.filterkeys
    let idx = filterkeys.indexOf(key)
    if (idx !== -1) {
      filterkeys.splice(idx, 1);
    } else {
      filterkeys.push(key)
    }
    const totalLiveOrder = []
    const dumps = []
    const yards = []
    const haulerList = []
    if (filterkeys.length > 0) {
      if (  filterkeys.indexOf("10 Yard") !== -1 ||
            filterkeys.indexOf("15 Yard") !== -1 ||
            filterkeys.indexOf("20 Yard") !== -1 ||
            filterkeys.indexOf("30 Yard") !== -1 ||
            filterkeys.indexOf("1/2 Yard") !== -1
          ) {
        _.get(this.state, 'filterOrder', []).map((order)=>{
          let containerName = getContainerSize(this.state.containerList, order.container)
          let index = filterkeys.indexOf(containerName)
          if (index !== -1) {
            if (containerName === filterkeys[index]) {
            totalLiveOrder.push(order)
            }
          }
        })
      }
      if(filterkeys.indexOf("dump") !== -1) {
        _.forEach(_.get(this.state, 'dumpsForFilter', []), function(dump) {
          dumps.push(dump)
        })
      }
      if(filterkeys.indexOf("yard") !== -1) {
        _.forEach(_.get(this.state, 'yardsForFilter', []), function(yard) {
            yards.push(yard)
        })
      }
      if(filterkeys.indexOf("hauler") !== -1) {
        _.forEach(_.get(this.state, 'haulersForFilter', []), function(hauler) {
            haulerList.push(hauler)
        })
      }
      this.setState({ filterkeys, dumps: dumps, yards: yards, totalLiveOrder: totalLiveOrder, haulerList: haulerList },()=>{
        this.filterCount()
        this.forceUpdate()
      })
    } else {
      this.unFilterMarker()
    }

  }
  filterCount() {
    const { filterkeys } = this.state
    let count = 0
    if(filterkeys.indexOf("dump") !== -1) {
      // count += _.get(this.state, 'dumpsForFilter', []).length
    }
    if(filterkeys.indexOf("yard") !== -1) {
      // count += _.get(this.state, 'yardsForFilter', []).length
    }
    if(filterkeys.indexOf("hauler") !== -1) {
      // count += _.get(this.state, 'haulersForFilter', []).length
    }
      count += _.get(this.state, 'totalLiveOrder', []).length
      this.setState({ containersOnSite: count })
  }
  unFilterMarker(){
    this.setState({ filterkey: [] },()=>{
      if (localStorage.getItem('usertype')=== 'user') {
        this.getYardsAndDump()
        this.getHaulers()
      }
      this.fetchAllLiveOrders()
    })
  }

  closeInfoWindowDumpsAndYards() {
    const dumps = this.state.dumps
    _.forEach(dumps, function(eachM) {
      eachM.showInfo = false
    })
    const yards = this.state.yards
    _.forEach(yards, function(eachM) {
      eachM.showInfo = false
    })
    const haulerList = this.state.haulerList
    _.forEach(haulerList, function(eachM) {
      eachM.showInfo = false
    })

    this.setState({ yards: yards, dumps: dumps, haulerList },()=>{
      this.forceUpdate()
    })
  }

  showInfo(id, data) {
    const dumps = this.state.dumps
    const yards = this.state.yards
    const totalLiveOrder = this.state.totalLiveOrder
    const haulerList = this.state.haulerList
    _.forEach(totalLiveOrder, function(eachM) {
        eachM.showInfo = false
    })
    _.forEach(dumps, function(eachM) {
      eachM.showInfo = false
    })
    _.forEach(yards, function(eachM) {
      eachM.showInfo = false
    })

    if(data.type === "dump") {
      const particularDump = _.findIndex(dumps, function(dump) {
        return String(dump._id) === String(data.place._id)
      })
      if(particularDump !== -1) {
        dumps[particularDump].showInfo = true
      }
      this.setState({ dumps: dumps }, ()=>{
        this.forceUpdate()
      })
    } else if(data.type === "yard") {
      const particularDump = _.findIndex(yards, function(dump) {
        return String(dump._id) === String(data.place._id)
      })
      if(particularDump !== -1) {
        yards[particularDump].showInfo = true
      }
      this.setState({ yards: yards },()=>{
        this.forceUpdate()
      })
    } else if(data.type === "hauler") {
      const index = _.findIndex(haulerList, function(dump) {
        return String(dump._id) === String(data.place._id)
      })
      if(index !== -1) {
        haulerList[index].showInfo = true
      }
      this.setState({ haulerList: haulerList },()=>{
        this.forceUpdate()
      })
    } else {
      let singleItem = _.findIndex(totalLiveOrder, function(item) {
        return String(item.id) === String(id)
      })
      totalLiveOrder[singleItem].showInfo = true
      this.setState({ totalLiveOrder: totalLiveOrder },()=>{
        this.forceUpdate()
      })
    }
    const center = {lat: data.lat, lng: data.lng}
    this.setState({ center })
  }

  closeInfoWindow() {
    const totalLiveOrder = this.state.totalLiveOrder
    _.forEach(totalLiveOrder, function(eachM) {
      eachM.showInfo = false
    })
    this.setState({ totalLiveOrder: totalLiveOrder },()=>{
      this.forceUpdate()
    })
  }

  viewDetails(data) {
    this.popupshow(data)
  }

  popupshow =async (data)=> {
    const { getOrderDetailById } = this.props
    // console.log(data, 'data data')
    let { value } = await getOrderDetailById(data.id)
    this.setState({ orderInformationModal: true, orderDetail: value },()=>{
      this.forceUpdate()
    })
  }

  closeInformationModal(){
    this.setState({ orderInformationModal: false, orderDetail: {} })
  }

  tabChange (tab)  {
    this.setState({ tab },()=>{
      this.forceUpdate()
    })
  }

  responsiveTabChange (e) {
    this.setState({ tab: e.target.value },()=>{
      this.forceUpdate()
    })
  }

  dispatchOrderCount = async (haulerId) => {
    let timezone = this.props.user && this.props.user.timezone && this.props.user.timezone.tzName  ? this.props.user.timezone.tzName : Intl.DateTimeFormat().resolvedOptions().timeZone
    const date = moment().tz(timezone).format('MM/DD/YYYY')
    const offset = moment.tz(moment(), timezone).utcOffset()
    if (haulerId) {
      const obj = {
        date: date,
        All: false,
        haulerId: haulerId,
        offset:String(offset),
      }
      let orders = []
      // const { getJobsByDate } = this.props
      const { getOrder } = this.props
      let { value } = await getOrder(obj)
      // this.setState({ dispatchCount: value.data.jobs.length + _.get(this.state, 'dumps', []).length +  _.get(this.state, 'yards', []).length})
      this.setState({ dispatchCount: value.data.jobs.length })
    }
  }

  openConfirmModal (data) {
    this.setState({ orderData: data, rejectModelIsOpen: true })
  }
  openApprovalModal (data) {
    const id = data._id
    data.id = id
    //delete data._id
    this.setState({ orderData: data, approvalModelIsOpen: true })
  }


  closeModal() {
    this.setState({
      rejectModelIsOpen: false,
      approvalModelIsOpen: false,
      orderData: {}
    })
  }

  confirmReject = async() => {
    const { orderData } = this.state
    let data = orderData
    let id = data._id
    data.id = id
    data = _.omit(data, '_id')
    data.isRejected = true
    try {
      let { value } = await this.props.updateOrder(data)
      this.fetchPendingOrders()
      this.closeModal()
    } catch (e) {
      message.error('Error updating order')
    }
  }

  displayResult(type) {
    this.props.history.push({
      pathname: `/results/${type}`,
      state: { textShow: this.state.textShow, from: moment(this.state.startDate).format('MM/DD/YYYY'), to: moment(this.state.endDate).format('MM/DD/YYYY'), daysFilter: this.state.daysFilter }
    })
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

  sortby(field) {
    let sort_field = this.state.sort_field
    let by = this.state.by
    if (this.state.sort_field === field) {
      by = this.state.by * -1;
    } else {
      sort_field = field;
      by = 1
    }
    this.setState({ sort_field, by},  () => {
      this.fetchPendingOrders()
    })
  }

  redirect(key) {
    if(key === "tonnage") {
      this.props.history.push({
        pathname: `/tonnage-report`
      })
    } else if(key === "subs") {
      this.props.history.push({
        pathname: `/sustainability-report`
      })
    } else if(key === "yardage") {
      this.props.history.push({
        pathname: `/yardage-report`
      })
    }

  }

  render() {
    // FOR SIDEBAR
    const { isSidebarOpen } = this.state
    return (
      <div className={localStorage.getItem('usertype') === 'user' ? "layout-has-sidebar" : "layout-has-sidebar-edit"}>
        { localStorage.getItem('usertype')=== 'user' ?
          <SidebarNavigation isSidebarOpen={isSidebarOpen} user={this.props.user} {...this.props}/>
          : ""
        }
        { localStorage.getItem('usertype')=== 'user' ?
          <TopNavigation isSidebarOpen={isSidebarOpen} toggleSidebar={this.toggleSidebar} fetchPendingOrder={this.fetchPendingOrders} {...this.props}/>
          :
          <CustomerTopNavigation  {...this.props}/>
        }
        <main className={localStorage.getItem('usertype') === 'user' ? "dashboard-layout-content pb-3 dashboard__wrapper" : "dashboard-layout-content width1033 pb-3 dashboard__wrapper"}>
        {/* <main className={localStorage.getItem('usertype') === 'user' ? "dashboard-layout-content pb-3" : "width1033"}> */}
        {/* <main className="dashboard-layout-content pb-3"> */}
          <div className="d-flex remove-flex justify-content-between align-item-center">
            { localStorage.getItem('usertype')=== 'user' ?
              <div>
                <h2 className="heading-title mb-3">Welcome {_.get(this.props, 'user.firstname', '')}!</h2>
                <h6 className="heading-subtitle mb-4">{_.get(this.props, 'user.companyInfo.businessname', '')}</h6>
              </div> :
              <div>
                <h2 className="heading-title mb-3">Welcome {_.get(this.props, 'user.companyname', '').trim()}!</h2>
              </div>
            }

            {/* native select box open */}
            <div className="form-group material-textfield material-textfield-select">
            <select value="" onChange={this.handleDateChange.bind(this)} className="form-control custom-select h-66 w-290 font-16 material-textfield-input auto-width">
              <option disabled className="hideDefaultOption"></option>
              <option value="today">Today ({moment().format('MMM DD, YYYY')})</option>
              <option value="week">This Week ({moment().startOf('week').format('MMM DD, YYYY')} - {moment().endOf('week').format('MMM DD, YYYY')})</option>
              <option value="month">This Month ({moment().startOf('month').format('MMM DD, YYYY')} - {moment().endOf('month').format('MMM DD, YYYY')})</option>
              <option value="custom" onClick={() => this.setState({ datePickerModal: true })}>Custom {this.getCustomDate()}</option>
            </select>
            <label className="material-textfield-label">Date </label>
            <label className=" text-value">{this.state.textShow} </label>
            </div>
            {/* native select box close */}

            {/* <div className="form-group material-textfield material-textfield-select hidearrow">
              <Select
                value={this.state.daysFilter}
                onChange={this.handleDateChange.bind(this)}
                className="form-control custom-select h-66 w-290 font-16 material-textfield-input"
                required>
                <Option value="today">Today ({moment().format('MMM DD, YYYY')})</Option>
                <Option value="week">This Week ({moment().startOf('week').format('MMM DD, YYYY')} - {moment().endOf('week').format('MMM DD, YYYY')})</Option>
                <Option value="month">This Month ({moment().startOf('month').format('MMM DD, YYYY')} - {moment().endOf('month').format('MMM DD, YYYY')})</Option>
                <Option value="custom" onClick={() => this.setState({ datePickerModal: true })}>
                  Custom {this.getCustomDate()}
                </Option>
              </Select>
              <label className="material-textfield-label">Date </label>
            </div> */}
          </div>

          <DatePickerRange
            datePickerModal={this.state.datePickerModal}
            datePickerToggle={() => this.setState({ datePickerModal: !this.state.datePickerModal })}
            // handleSelect={({ startDate, endDate }) => this.setState({ startDate, endDate })}
            onSubmitDateRanges={(startDate, endDate) => this.onSubmitDateRanges({ startDate, endDate })}
          />

          <div className="row boxrow">
            <div onClick={this.displayResult.bind(this, 'recap')} className="col-sm-12 col-md-6 mb-4">
              <div className="card d-card cursorpointer">
                <div className="row">
                  <div className="col-md-6 fullwidth-col">
                    <h4 className="title">{ localStorage.getItem('usertype') === 'customer' ? "Recap" : "Daily Recap" }</h4>
                    <p className="subtitle subtitlemobile">This shows the total number of orders created</p>
                    <div className="pageviews-count">{_.get(this.state, 'RecapLogsMatrix[0].count', 0)}</div>
                  </div>
                  <div className="col-md-6 text-sm-right hidemobileviewimg">
                    <div className="d-card-icon">
                      <img src={PageviewIcon} alt="" className="imgwidth" />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <h6>{this.state.daysFilter !== "today" ? `${moment(this.state.startDate).format('MMM DD, YYYY')} - ${moment(this.state.endDate).format('MMM DD, YYYY')}` : moment(this.state.startDate).format('MMM DD, YYYY')}</h6>
                  </div>
                </div>
              </div>
            </div>
            { localStorage.getItem('usertype')=== 'user' ?
            <div onClick={this.displayResult.bind(this, 'log')} className="col-sm-12 col-md-6 mb-4">
                <div className="card d-card cursorpointer">
                <div className="row">
                    <div className="col-md-6 fullwidth-col">
                    <h4 className="title">Order Log</h4>
                      <p className="subtitle subtitlemobile">The  number of Removal, Delivery, Exchange, Live Loads and minis orders </p>
                    <div className="leads-count">{_.get(this.state, 'orderLogCount', 0)}</div>
                  </div>
                    <div className="col-md-6 text-sm-right hidemobileviewimg">
                    <div className="d-card-icon">
                      <img src={LeadsIcon} alt="" className="imgwidth" />
                    </div>
                  </div>
                  <div className="col-md-12">
                  <h6>{this.state.daysFilter !== "today" ? `${moment(this.state.startDate).format('MMM DD, YYYY')} - ${moment(this.state.endDate).format('MMM DD, YYYY')}` : moment(this.state.startDate).format('MMM DD, YYYY')}</h6>
                  </div>
                </div>
              </div>
            </div> :
            <div className="col-sm-12 col-md-6 mb-4 nocursor">
              <div className="customer-card-list">
                <ul>
                  <li onClick={this.redirect.bind(this, 'tonnage')}>
                      <p>Total Tonnage</p>
                      <span>{_.get(this.state, 'RecapLogsMatrix[2].count', 0) !== null && _.get(this.state, 'RecapLogsMatrix[2].count', 0) !== undefined ? _.get(this.state, 'RecapLogsMatrix[2].count', 0).toFixed(2) : 0} </span>
                  </li>
                  <li onClick={this.redirect.bind(this, 'subs')}>
                    <p>Total Tonnage Diverted</p>
                    <span>{_.get(this.state, 'RecapLogsMatrix[3].count', 0) !== null && _.get(this.state, 'RecapLogsMatrix[3].count', 0) !== undefined ? _.get(this.state, 'RecapLogsMatrix[3].count', 0).toFixed(2): 0} </span>
                  </li>
                  <li onClick={this.redirect.bind(this, 'yardage')}>
                    <p>Total Containers Ordered</p>
                    <span>{_.get(this.state, 'RecapLogsMatrix[4].count', 0)} </span>
                  </li>
                </ul>
              </div>
            </div>
          }
          </div>


          {localStorage.getItem('usertype')=== 'user' && _.get(this.state, 'pendingOrders', []).length > 0 ?
            <div className="row">
              <div className="col-md-12">
                  <div className="d-flex align-items-center">
                  <h4 className="heading-h4">Unapproved Orders</h4>
                  </div>
                  <div>
                    <div className="table-responsive pending-order-table">
                      <table className="table custom-table-secondary">
                        <thead>
                          <tr>
                            <th onClick={() => { this.sortby('orderid') }}>
                            <span className="custom-table-th-title-sm">Order Number {this.getSortArrow('orderid')}</span>
                            </th>
                            <th onClick={() => { this.sortby('deliverydate') }}>
                            <span className="custom-table-th-title-sm">Delivery Date {this.getSortArrow('deliverydate')}</span>
                            </th>
                            <th onClick={() => { this.sortby('customer_info.companyname') }}>
                            <span className="custom-table-th-title-sm">Customer Name {this.getSortArrow('customer_info.companyname')}</span>
                            </th>
                            <th onClick={() => { this.sortby('address') }}>
                            <span className="custom-table-th-title-sm">JobAddress {this.getSortArrow('address')}</span>
                            </th>
                            <th onClick={() => { this.sortby('container') }}>
                            <span className="custom-table-th-title-sm">Product/Service {this.getSortArrow('container')}</span>
                            </th>
                            <th onClick={() => { this.sortby('typeofdebris') }}>
                            <span className="custom-table-th-title-sm">Debris {this.getSortArrow('typeofdebris')}</span>
                            </th>
                            <th onClick={() => { this.sortby('customer') }}>
                            <span className="custom-table-th-title-sm">Type {this.getSortArrow('customer')}</span>
                            </th>
                            {/* <th className="rem-pad text-center width-50">
                            <span className="custom-table-th-title-sm">Actions</span>
                            </th> */}
                          </tr>
                        </thead>
                      <tbody className="table-card tablewhite">
                        { _.get(this.state, 'pendingOrders', []).map((order, i)=>{
                          const status = this.getStatus(order.status, order) ? (this.getStatus(order.status, order).replace(/\s/g,'').replace(/[0-9]/g, '')).toLowerCase(): ""
                            return (
                              <tr onClick={this.openApprovalModal.bind(this,order )} key={i}>
                                <td>
                                  <span className="custom-table-title-md">{_.get(order, 'orderid', '')}</span>
                                </td>
                                <td>
                                  <span className="custom-table-title-md">{(this.getStatus(order.status, order) === "Future Exchange" || this.getStatus(order.status, order) === "Future Removal") ? getDate(order.pickupdate) : getDate(order.deliverydate)}</span>
                                </td>
                                <td>
                                  <span className="custom-table-title-md">{_.get(order, 'customer_info.companyname', '')}</span>
                                </td>
                                <td>
                                <span className="custom-table-title-md">{this.formatAddess(order)}</span>
                                </td>
                                <td>
                                  {this.state.containerList.map((cnt, i)=>{
                                    const classIndex = _.findIndex(this.state.classname, (c) => {
                                      return c.size === _.get(cnt, 'size', '')
                                    })
                                    if (cnt._id === order.container) {
                                      return (
                                        <button key ={i} className={classIndex !== -1 ? `${this.state.classname[classIndex].class}` : `yellow-yard`}>{_.get(cnt, 'size', '')}</button>
                                      )
                                    }
                                  })}
                                </td>
                                <td>
                                <span className="custom-table-title-md">{Array.isArray(_.get(order, 'typeofdebris', [])) ? _.get(order, 'typeofdebris', []).join(', ') : _.get(order, 'typeofdebris', '')}</span>
                                </td>
                                <td>
                                <button className={_.get(order, 'customer_info.isHomeCustomer', false) === true ? "b2c-customer": "b2b-customer" }>{_.get(order, 'customer_info.isHomeCustomer', false) === true ? "Personal & SMB" : "Corporate"}</button>
                                </td>
                                {/* <td className="rem-pad">
                                  <Dropdown overlay={<Menu>
                                    <Menu.Item key="1">
                                      <a href="#" onClick={this.openConfirmModal.bind(this,order )}>Reject</a>
                                    </Menu.Item>
                                    <Menu.Item key="2">
                                      <a href="#" onClick={this.openApprovalModal.bind(this,order )}>Approval</a>
                                    </Menu.Item>
                                  </Menu>} trigger={['click']} overlayClassName="profile--dropdown--overlay profile--dropdown--overlay-sm dropdownfix-right1">
                                    <a className="ant-dropdown-link d-flex align-items-center justify-center" href="#">
                                      <DotBtnIcon />
                                    </a>
                                  </Dropdown>
                                  </td> */}
                              </tr>
                            )
                          })
                        }
                        </tbody>
                      </table>
                    </div>
                  </div>
              </div>
            </div>
          : ''
          }
          <div className="row mb-3">
            { localStorage.getItem('usertype')=== 'user' ?
              <div className="col-md-12 showindesktop">
              <div className="flex-btn">
                <button
                  className={this.state.tab==="container" ? "btn primarybtn primarybtn-active" : "btn primarybtn"}
                  onClick={this.tabChange.bind(this, 'container')}>
                    Containers on Site  ({this.state.filterkeys.length !==0 ? this.state.containersOnSite : this.state.filterOrder.length})
                  </button>
                <button
                  className={this.state.tab==="dispatch" ? "btn primarybtn primarybtn-active" : "btn primarybtn"}
                  onClick={this.tabChange.bind(this, 'dispatch')}>
                    Dispatch Orders ({this.state.dispatchCount})
                </button>
              </div>
            </div>
            : ""}
            <div className="col-md-12 showinmobile">
              <div className="form-group material-textfield">
                <select
                  name="haulerId"
                  value = {this.state.tab}
                  onChange={this.responsiveTabChange.bind(this)}
                  className="form-control custom-select h-66">
                  <option value="container">Containers on Site  ({this.state.filterkeys.length !==0 ? this.state.containersOnSite : this.state.filterOrder.length})</option>
                  <option value="dispatch">Dispatch Orders ({this.state.dispatchCount})</option>
                </select>
              </div>
            </div>
          </div>
            <div className="">
              {this.state.tab === 'container' ?
                <div className="row mb-3">
                  <div className="col-md-12">
                    <div className="flex-map-btn">
                      <button className={this.state.filterkeys.indexOf('10 Yard') !== -1 ? "btn map-btn map-btn-redfilled" : "btn map-btn map-btn-red"} onClick={this.filterMarkers.bind(this, '10 Yard', 'containersize')}>
                        {this.state.filterkeys.indexOf('10 Yard') !== -1 ? <LocationIconRedActive/> : <LocationIconRed />} 10 Yard Container
                      </button>
                      <button className={this.state.filterkeys.indexOf('15 Yard') !== -1 ? "btn map-btn map-btn-purplefilled" : "btn map-btn map-btn-purple"} onClick={this.filterMarkers.bind(this, '15 Yard', 'containersize')}>
                        {this.state.filterkeys.indexOf('15 Yard') !== -1 ? <LocationIconPurpleActive /> : <LocationIconPurple />} 15 Yard Container
                      </button>
                      <button className={this.state.filterkeys.indexOf('20 Yard') !== -1 ? "btn map-btn map-btn-greenfilled" : "btn map-btn map-btn-green"} onClick={this.filterMarkers.bind(this, '20 Yard', 'containersize')}>
                        {this.state.filterkeys.indexOf('20 Yard') !== -1 ? <LocationIconGreen /> : <LocationIconGreenActive />}  20 Yard Container
                      </button>
                      <button className={this.state.filterkeys.indexOf('30 Yard') !== -1 ? "btn map-btn map-btn-yellowfilled" : "btn map-btn map-btn-yellow"} onClick={this.filterMarkers.bind(this, '30 Yard', 'containersize')}>
                        {this.state.filterkeys.indexOf('30 Yard') !== -1 ? <LocationIconYellow /> : <LocationIconYellowActive />} 30 Yard Container</button>
                      <button className={this.state.filterkeys.indexOf('1/2 Yard') !== -1 ? "btn map-btn map-btn-orangefilled" : "btn map-btn map-btn-orange"} onClick={this.filterMarkers.bind(this, '1/2 Yard', 'containersize')}>
                        {this.state.filterkeys.indexOf('1/2 Yard') !== -1 ? <LocationIconOrange />: <LocationIconOrangeActive />} 1/2 Yard Container</button>
                      { localStorage.getItem('usertype')=== 'user' ? (
                        <div className="d-flex ht-34">
                          <button className={this.state.filterkeys.indexOf('dump') !== -1 ? "btn map-btn map-btn-darkbluefilled" : "btn map-btn map-btn-darkblue"} onClick={this.filterMarkers.bind(this, 'dump', 'dump')}>
                          {this.state.filterkeys.indexOf('dump') !== -1 ? <img src={activedump} className="dumpact" />: <DumpsiteIcon />} Dump Site</button>
                          <button className={this.state.filterkeys.indexOf('yard') !== -1 ? "btn map-btn map-btn-darkgreenfilled" : "btn map-btn map-btn-darkgreen"} onClick={this.filterMarkers.bind(this, 'yard', 'yard')}>
                            {this.state.filterkeys.indexOf('yard') !== -1 ? <YardIconActive />: <YardIcon />} Yard
                          </button>
                          <button className={this.state.filterkeys.indexOf('hauler') !== -1 ? "btn map-btn map-btn-skyfilled" : "btn map-btn map-btn-sky"} onClick={this.filterMarkers.bind(this, 'hauler', 'hauler')}>
                            {this.state.filterkeys.indexOf('hauler') !== -1 ? <LocationIconSkyActive />: <LocationIconSky />} Hauler</button>
                        </div> ) : ""
                      }


                    </div>
                  </div>
                </div> :
                ""
              }
              { this.state.tab === 'container' ?
                  <div className="row mb-5">
                    <div className="col-md-12">
                      {/* <img src={mapImg} alt="" style={{ width: '100%'}} /> */}
                      <div className="dashboard-map-ht">
                      <GoogleMap
                        defaultZoom={10}
                        id="map"
                        center={this.state.center}
                        layerTypes={this.state.layerTypes}
                        options={this.createMapOptions()}
                        bootstrapURLKeys={{ key: "AIzaSyDC4hfVQUrN7Vc45Wh0Qpx4cpxs1YPWE24" }}
                        onChildClick={this.showInfo}
                      >
                        {this.state.totalLiveOrder && this.state.totalLiveOrder.map(place =>
                          this.getStatus(place.status, place) && this.getStatus(place.status, place) !== "Removed" ?
                            (<Marker
                              key={place.id}
                              lat={place.location.lat}
                              lng={place.location.lng}
                              show={place.showInfo}
                              place={place}
                              containerList={this.state.containerList}
                              statusList={this.state.statusList}
                              type={this.state.dateType}
                              viewDetails={this.viewDetails.bind(this, place)}
                              closeInfoWindow={this.closeInfoWindow.bind(this)}
                            />) : ''
                        )}

                          {this.state.dumps && this.state.dumps.map((dumps, i) =>
                            (
                              <DumpAndYardMarker
                                key={i}
                                lat={_.get(dumps, 'location.lat', '')}
                                lng={_.get(dumps, 'location.lng', '')}
                                show={dumps.showInfo}
                                closeInfoWindow={this.closeInfoWindowDumpsAndYards.bind(this)}
                                place={dumps}
                                type="dump"
                              />
                            )
                          )}
                          {this.state.yards && this.state.yards.map((yard, i) =>
                            (
                              <DumpAndYardMarker
                                key={i}
                                lat={_.get(yard, 'location.lat', '')}
                                lng={_.get(yard, 'location.lng', '')}
                                show={yard.showInfo}
                                closeInfoWindow={this.closeInfoWindowDumpsAndYards.bind(this)}
                                place={yard}
                                type="yard"
                              />
                            )
                          )}

                          {this.state.haulerList && this.state.haulerList.map(hauler =>
                            (
                              <HaulerMarker
                                key={hauler.id}
                                lat={hauler.location && hauler.location.lat ? hauler.location.lat : 0 }
                                lng={hauler.location && hauler.location.lng ? hauler.location.lng : 0 }
                                show={hauler.showInfo}
                                place={hauler}
                                closeInfoWindow={this.closeInfoWindowDumpsAndYards.bind(this)}
                                type="hauler"
                              />
                            )
                          )}
                      </GoogleMap>
                      </div>
                    </div>
                  </div>
                :
                <DispatchMap
                  dispatchOrderCount={this.dispatchOrderCount.bind(this)}
                  updateCount={this.updateCount.bind(this)}
                  haulersList={_.get(this.state, 'haulersForFilter', [])}
                  {...this.props} />
              }
            </div>

          {this.state.orderInformationModal ?
          <ViewOrder
            isViewModalOpen = {this.state.orderInformationModal}
            closeModal={this.closeInformationModal.bind(this)}
            orderData = {this.state.orderDetail}
            containerList={this.state.containerList}
            statusList={this.state.statusList}
            {...this.props}
          /> : ""}

            {this.state.approvalModelIsOpen ?
            <ApprovalModel
              editModalIsOpen = {this.state.approvalModelIsOpen}
              closeModal={this.closeModal.bind(this)}
              customerId={this.props.customerId}
              containerList={this.state.containerList}
              statusList={this.state.statusList}
              fetchOrders={this.fetchPendingOrders.bind(this)}
              orderDataForEdit = {this.state.orderData}
              getStatus = {this.getStatus.bind(this)}
              {...this.props}
            /> : ""}

          <ReactModal
            isOpen={this.state.rejectModelIsOpen}
            onRequestClose={this.closeModal.bind(this)}
            contentLabel="Add Team Member"
            ariaHideApp={false}
          >
            <div className="react-modal-dialog react-modal-dialog-centered">
              <div className="react-modal-header">
                <h5 className="react-modal-title">Reject</h5>
                <button type="button" className="btn react-modal-close" onClick={this.closeModal.bind(this)}><CloseIcon /></button>
              </div>
              <div className="react-modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <p className="modalpara">
                      Are you sure to reject this order?
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="d-flex justify-content-end">
                      <button onClick={this.confirmReject.bind(this)} className="btn btn-danger btn-md font-16 font-600 btnfullwidth-mob">Yes, Reject</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ReactModal>
        </main>
      </div>
    )
  }
}
