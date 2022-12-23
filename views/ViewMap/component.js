import 'rxjs'
import React, { Component, Fragment } from 'react'
import { reduxForm } from 'redux-form'
import { Link } from "react-router-dom";
// import Header from "./../Header/container";
import moment from "moment"
import { Spin } from 'antd'
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {  Select } from 'antd';
import _ from 'lodash';
// import { TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
// import classnames from 'classnames';
import './style.scss'
import GoogleMap from 'google-map-react';
import DispatcherTopNavigation from './../DispatcherTopNavigation/container'

import TenYard from '../../images/10yard-mapicon.svg'
import Deliveries from '../../images/15yard_map.svg'
import TwentyYard from '../../images/20yard-mapicon.svg'
import FifYard from '../../images/15yard_map.svg'
import ThirtyYard from '../../images/30yard-mapicon.svg'
import HalfYard from '../../images/1_2_yard_map.svg'
import Liveloads from '../../images/orange-mapicon.svg'
import DumpBig from '../../images/dump-bg.svg'
import Yardgreen from '../../images/yard-sm.svg'
import Dumpsmall from '../../images/dump-sm.svg'
import Grey from "../../images/graypinbig.svg"

import InprogressBig from '../../images/inprogresspinbig.svg'
import RemovalsBig from '../../images/pinkpinbig.svg'
import ExchangesBig from '../../images/exchanges-mapicon.svg'
import Unassigned from '../../images/unussaingedpinbig.svg'
import UnassignedSmall from '../../images/unassigned_small.png'
import Pending from '../../images/pending.png'
import PendingSmall from '../../images/pending_small.png'
import MinisBig from '../../images/sky-mapicon.svg'

import PendingBig from '../../images/skypinbig.svg'


import Exchangespin from '../../images/exchanges-mapicon.svg'

import ExchangesSmall from '../../images/yellowpin.svg'
import DeliveriesSmall from '../../images/purplepin.svg'
import RemovalsSmall from '../../images/pinkpin.svg'
import LiveloadsSmall from '../../images/orangepin.svg'
import MinisSmall from '../../images/skypin.svg'
import InprogressSmall from '../../images/greenpin.svg'
import CompletedSmall from '../../images/brownpin.svg'
import AssignedSmall from '../../images/assigned-mapicon.svg'

import Closemapbtn from '../../images/close_map_btn.png'
import Closemapbtnnew from '../../images/updated-close.svg'
import GreyIcon from '../../images/graycircle.svg'
import GreenImg from '../../images/green_img.png'
import ViewOrder from './viewOrderModal'

import CloseModals from '../../images/map-modal-close.svg'


import config from '../../config/index'
import TextArea from 'antd/lib/input/TextArea';
const { Option } = Select;

const InfoWindow = (props) => {
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
    const link = props.place.truck_id !== undefined ? 'https://cloud.samsara.com/o/26541/devices/'+ props.place.truck_id + '/vehicle' : ""
    const hreftag = (props.place.status !== "unassigned" && (props.place.truck_id !== undefined && props.place.truck_id !== "" && props.place.truck_id !== null)) ? <a className="btn goto__link" href={link} target="_blank">Go To Samsara</a> : ""
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
            <img src={CloseModals} alt="close" onClick={props.closeInfoWindow}/>
          </div>
          <ul className="infowindow__wrapper--list">
            <li>
                <span>Company Name</span><b>: </b>
                <p>{props.place.companyname}</p>
            </li>
            <li>
                <span>Order Type</span><b>: </b>
                <p>{props.place.container === "Live Load" ? props.place.container : props.place.container === "1/2 Yard" ? props.place.jobStatus === "Exchange" ? "Mini Action" : "Mini Delivery" : props.place.jobStatus}</p></li>
            <li>
                <span>Address </span><b>: </b>
                <p>{address}</p>
            </li>
            {_.get(place, 'borough', '') !== "" ?
              <li>
                <span>Borough</span><b>: </b>
                <p>{place.borough}</p>
              </li>
            : ""}
            {_.get(place, 'neighbourhood', '') !== "" ?
              <li>
                <span>Neighborhood</span><b>: </b>
                <p>{place.neighbourhood}</p>
              </li>
            : ""}
            {props.place.container !== "Live Load" ? props.place.container === "1/2 Yard" ? <li className="company_name">
                <span>Number of Minis </span><b>: </b><p>{props.place.half_yrd_qty}</p></li>  : <li className="company_name">
                <span>Product/Service </span><b>: </b><p>{props.place.container}</p></li>  : ''}
            {props.place.accessibility && props.place.accessibility !== "Select" && (props.place.status === "completed" || props.place.jobStatus === "Exchange" || props.place.jobStatus === "Removal" ) ? <li>
              <span>Accessibility Notes:</span>
              <p>{props.place.accessibility && props.place.accessibility !== "Select" ? props.place.accessibility === "Other: Manual entry" ? props.place.manualaccessibility : props.place.accessibility : "N/A"}</p>
            </li> : "" }
            </ul>
        </div>
        <div className="infowindow__wrapper--footer">
          <button className="btn btn-outline-primary btn__view_order" onClick={props.viewDetails}>View Order Details</button>&nbsp;
          {props.place.truck_id !== "select" && props.place.truck_id !== undefined && props.place.truck_id !== "" ? hreftag : ""}
        </div>
      </div>
    );
  } else {
    return ""
  }
};
const InfoWindowForTrucks = (props) => {
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
    const link = props.place.truck_id !== undefined ? 'https://cloud.samsara.com/o/26541/devices/'+ props.place.truck_id + '/vehicle' : ""
    const hreftag = (props.place.status !== "unassigned" && (props.place.truck_id !== undefined && props.place.truck_id !== "" && props.place.truck_id !== null)) ? <a className="btn goto__link" href={link} target="_blank">Go To Samsara</a> : ""
    return (
      <div className="infowindow__wrapper">
        <div className="infowindow__wrapper--body">
          <div className="infowindow__wrapper--close">
            <img src={Closemapbtnnew} alt="close" onClick={props.closeInfoWindowTruck}/>
          </div>
          <ul className="infowindow__wrapper--list">
            <li>
                <span>Company Name</span><b>:</b>
                <p>{props.place.companyname}</p>
            </li>
            <li>
                <span>Order Type</span><b>:</b>
                <p>{props.place.container === "Live Load" ? props.place.container : props.place.container === "1/2 Yard" ? "Mini Delivery" : props.place.jobStatus}</p></li>
            <li>
                <span>Address</span><b>:</b>
                <p>{props.place.address}</p>
            </li>
            {props.place.container !== "Live Load" ? props.place.container === "1/2 Yard" ? <li className="company_name">
                <span>Number of Minis</span><b>:</b><p>{props.place.half_yrd_qty}</p></li>  : <li className="company_name">
                <span>Product/Service</span><b>:</b><p>{props.place.container}</p></li>  : ''}
            {props.place.accessibility && props.place.accessibility !== "Select" && (props.place.status === "completed" || props.place.jobStatus === "Exchange" || props.place.jobStatus === "Removal" ) ? <li>
              <span>Accessibility Notes</span><b>:</b>
              <p>{props.place.accessibility && props.place.accessibility !== "Select" ? props.place.accessibility === "Other: Manual entry" ? props.place.manualaccessibility : props.place.accessibility : "N/A"}</p>
            </li> : "" }
            </ul>
        </div>
        <div className="infowindow__wrapper--footer">
          <button className="btn btn-outline-primary btn__view_order" onClick={props.viewDetailsTruck}>View Order Details</button>&nbsp;
          {props.place.truck_id !== "select" && props.place.truck_id !== undefined && props.place.truck_id !== "" ? hreftag : ""}
        </div>
      </div>
    );
  } else {
    return ""
  }
};
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
const Marker = (props) => {
  const markerStyle = {
    cursor: 'pointer',
    zIndex: 10,
    marginLeft: '-12px',
    marginTop: '12px',
  };
  let icon = ""
  if(props.type === "all") {
    if(props && props.place.status === "completed") {
        switch (props.place.container) {
          case "10 Yard":
            icon=TenYard
            break;
          case "15 Yard":
            icon=FifYard
            break;
          case "20 Yard":
            icon=TwentyYard
            break;
          case "30 Yard":
            icon=ThirtyYard
            break;
          case "1/2 Yard":
            icon=HalfYard
            break;
        }
    } else {
      if(props.place.status === "unassigned") {
        icon = Unassigned
      } else if(props.place.status === "inprogress") {
        icon = InprogressBig
      } else if (props.place.status === "pending") {
        icon = PendingBig
      }
    }
  } else {
    if(props.place && (props.place.status === "inprogress" || props.place.status === "completed")) {
        if(props.place.status === "inprogress") {
          icon = InprogressBig
        } else if (props.place.status === "completed") {
          icon = Grey
        }
      } else {
        if(props.place && (props.place.container === "Live Load" || props.place.container === "1/2 Yard")) {
          if (props.place.container === "Live Load") {
            icon = Liveloads
          } else {
            icon = MinisBig
          }
        } else {
          if(props.place && props.place.jobStatus === "Exchange") {
            icon =  ExchangesBig
          } else if (props.place && props.place.jobStatus === "Delivery") {
            icon = Deliveries
          } else if (props.place && props.place.jobStatus === "Removal") {
            icon = RemovalsBig
          }
        }
      }
  }
  if( props.place && props.noicon === true) {
    icon = "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
  }
  return (
    <Fragment>
      <img src={icon} style={markerStyle} />
      {props.show && <InfoWindow place={props.place} viewDetails={props.viewDetails} closeInfoWindow={props.closeInfoWindow}/>}
    </Fragment>
  );
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

const TruckMarker = (props) => {
  const markerStyle = {
    cursor: 'pointer',
    zIndex: 10,
    marginLeft: '-12px',
    marginTop: '12px',
    width: props.type === "yard" ? '30px' : '30px'
  };
  let icon = GreyIcon
  let progressTruck = _.findIndex(props.allData, function(job) {
      return String(job.truck_id) === String(props.id) && job.status === "inprogress"
  })

  let progressTruckData = _.find(props.allData, function(job) {
    return String(job.truck_id) === String(props.id) && job.status === "inprogress"
  })

  if(progressTruck !== -1) {
    icon = GreenImg
  }
  let name = props.name
  const nameIndex = props.name.toLowerCase().indexOf('point')
  if (nameIndex !== -1) {
    name = 'P'
  }
  return (
    <Fragment>
      <div className="markerLabel">
        <span className={progressTruck !== -1 ? "markerLabel--text black" : "markerLabel--text"}>
        {name}
        </span>
        <img src={icon} style={markerStyle} width="40"/>
      </div>
      {props.show && props.progress ? <InfoWindowForTrucks place={progressTruckData} viewDetailsTruck={props.viewDetailsTruck} closeInfoWindowTruck={props.closeInfoWindowTruck}/> : ""}
    </Fragment>
  );
};

class MapForm extends Component {
  constructor(props) {
    super(props)
    this._isMounted = false;
    this.state = {
      name : '',
      jobs: [],
      showTrafficLayer: false,
      center: {
        lat: 40.706928,
        lng: -73.621788
      },
      filterdate: moment(),
      isMounted: false,
      layerTypes: [],
      setTruck: false,
      trucksSelect: [{key: "Select Truck ", value: "select"}],
      setTruck: false,
      pageloaded: false,
      orders: {},
      dumpsForFilter: [],
      yardsForFilter: [],
      containerList: [],
      statusList: [],
      dateType: "today",
      deliveryCount: 0,
      removalCount: 0,
      exchangeCount: 0,
      liveLoadCount: 0,
      minisCount: 0,
      inProgressCount: 0,
      completedCount: 0,
      dumpCount: 0,
      yardCount: 0,
      tenYardCount: 0,
      twnntYardCount: 0,
      fifYardCount: 0,
      thirtyYardCount: 0,
      halfYardCount: 0,
      pendingCount: 0,
      unassignedCount: 0,
    }
    this.showInfo = this.showInfo.bind(this)
  }
  // componentWillMount() {
  //   const date = moment().format('MM/DD/YYYY')
  //   const obj = {
  //     date: date,
  //     All: false
  //   }
  //   const { getOrder } = this.props
  //   getOrder(obj)
  //   console.log("h")
  // }
  setOpenWindowIndex(id) {
  }

  popupshow =async (data)=> {
    const { getOrderDetail } = this.props
    let { value } = await getOrderDetail(data.id)
    this._isMounted && this.setState({ orderInformationModal: true, orderDetail: value.data })
  }

  componentDidMount = async () => {
    this._isMounted = true;
    let val  = await this.props.getHaulerDetails(localStorage.getItem('haulerid'))
    let haulerId = _.get(val, 'value.data._id', '')
    let  containers  = await this.props.getContainer()
    this.setState({ containerList: containers.value.containers, statusList: containers.value.status })
    this.setState({ haulerId, haulerDetails: _.get(val, 'value.data', '') },()=>{
      if (this.state.haulerId) {
        this.getOrders()
      }
    })

    let interval = setInterval(() => {
      this.getTrucks()
    }, 2000);
    this.setState({ interval: interval, isMounted: true})

    // let timezone = this.props.user && this.props.user.timezone ? this.props.user.timezone.tzName : Intl.DateTimeFormat().resolvedOptions().timeZone
    // const date = moment().tz(timezone).format('MM/DD/YYYY')
    // const obj = {
    //   date: date,
    //   All: false
    // }
    // const { getOrder, getJobsByDate, getYardsAndDump } = this.props
    //getOrder(obj)
    // getJobsByDate(obj);
    // getYardsAndDump()
    // this.getTrucks()
    // let interval = setInterval(() => {
    //   const { getLocation } = this.props
    //   getLocation()
    // }, 1000);
    // this.setState({ interval: interval, isMounted: true})
  }

  getOrders = async()=> {
    const date = moment(this.state.filterdate).format('MM/DD/YYYY')
    const timezone = this.state.user && this.state.user.timezone && this.state.user.timezone.tzName ? this.state.user.timezone.tzName: Intl.DateTimeFormat().resolvedOptions().timeZone
    const offset = moment.tz(moment(this.state.filterdate), timezone).utcOffset()
    const obj = {
      date: date,
      offset:String(offset),
      All: this.state.dateType !== "all" ? false : true,
      haulerId: this.state.haulerId
    }
    const { getOrder } = this.props
    let { value } = await getOrder(obj)
    // let order = value.data
    this.setState({ orders: value.data }, () => {
      this.getTrucks()
      this.getJobs()
      this.getYardsAndDump()
    })
  }

  getTrucks = async ()=> {
    const self = this
    let trucks = []
    const { getLocation } = this.props
    let { value } = await getLocation()
    let data = value.data.vehicles
    _.forEach(data, function(truck, i) {
      let trucksSelect = self.state.trucksSelect
      if(!self.state.setTruck) {
        trucksSelect.push({key: truck.name , value: truck.id})
        if(i + 1 === data.length) {
          if(self._isMounted) {
            self.setState({trucksSelect : trucksSelect, setTruck: true})
          }
        }
      }
      let progressTruck = _.findIndex(_.get(self.state,'orders.jobs', []), function(job) {
        return String(job.truck_id) === String(truck.id) && job.status === "inprogress"
      })
      if(progressTruck !== -1) {
        let currentTruck = _.find(self.state.trucks, function(job) {
          return String(job.id) === String(truck.id)
        })
        if(currentTruck) {
          truck.showInfo = currentTruck.showInfo
        }
        truck.progress = true
      } else {
        truck.progress = false
      }
      //order.showInfo = false
      trucks.push(truck)
    })
    if (self._isMounted) {
      this.setState({ trucks: trucks })
    }
  }

  getJobs= async ()=> {
    let timezone = this.props.user && this.props.user.timezone && this.props.user.timezone.tzName  ? this.props.user.timezone.tzName : Intl.DateTimeFormat().resolvedOptions().timeZone
    const date = moment().tz(timezone).format('MM/DD/YYYY')
    const obj = {
      date: date,
      All: false,
      haulerId: this.state.haulerId
    }
    let orders = []
    // const { getJobsByDate } = this.props
    // let { value } = await getJobsByDate(obj)
    _.forEach(_.get(this.state,'orders.jobs', []), function(job) {
      //order.showInfo = false
      orders.push(job)
    })

    const orderFilter = []
    _.forEach(orders, function(order, i) {
      let neworder = order
      const findSame = _.findIndex(orderFilter, function(o) {
        return String(order.geolocation.lat) === String(o.geolocation.lat) && String(order.geolocation.lng) === String(o.geolocation.lng)
      })
      if(findSame === -1) {
        orderFilter.push(neworder)
      } else {
        orderFilter[findSame] = neworder
      }
    })
    this.setState({ showjobs: orderFilter, jobs: orders },()=>{
      this.calculateCount()
    })
  }

  getYardsAndDump = async () => {
    let { value } = await this.props.getYardsAndDump()
    this.setState({
      dumps: _.get(value,'data.dumps', []),
      yards: _.get(value, 'data.yards', []),
      dumpsForFilter: _.get(value, 'data.dumps', []),
      yardsForFilter: _.get(value, 'data.yards', []),
      dumpCount: _.get(value, 'data.dumps', []).length,
      yardCount: _.get(value, 'data.yards', []).length
    })
  }

  calculateCount () {
    if (this.state.dateType !== "all" ) {
      let exchange = []
      let delivery = []
      let removal = []
      let liveLoad = []
      let minis = []
      let inProgress = []
      let completed  = []

      _.forEach(_.get(this.state,'orders.jobs', []), function(job) {
          if( job.jobStatus === "Exchange" && job.container !== "1/2 Yard" && job.container !== "Live Load" ) {
            exchange.push(job)
          }
          if( job.jobStatus === "Delivery" && job.container !== "1/2 Yard" && job.container !== "Live Load" ) {
            delivery.push(job)
          }
          if( job.jobStatus === "Removal" && job.container !== "1/2 Yard" && job.container !== "1/2 Yard" ) {
            removal.push(job)
          }
          if( job.container === "Live Load" ) {
            liveLoad.push(job)
          }
          if( job.container === "1/2 Yard"  ) {
            minis.push(job)
          }
          if( job.status  === "inprogress"  ) {
            inProgress.push(job)
          }
          if( job.status  === "completed"  ) {
            completed.push(job)
          }
      })

      this.setState({
        exchangeCount: exchange.length,
        deliveryCount: delivery.length,
        removalCount: removal.length,
        liveLoadCount: liveLoad.length,
        minisCount: minis.length,
        inProgressCount: inProgress.length,
        completedCount: completed.length,
      }, ()=>{
        this.forceUpdate()
      })
    } else {
      let tenYard = []
      let fifYard = []
      let twentyYard = []
      let thirtyYard = []
      let halfYard = []
      let pending  = []
      let unassigned  = []
      _.forEach(_.get(this.state,'orders.jobs', []), function(job) {
        if( job.container === "1/2 Yard" ) {
          halfYard.push(job)
        }
        if( job.container === "10 Yard" ) {
          tenYard.push(job)
        }
        if( job.container === "15 Yard" ) {
          fifYard.push(job)
        }
        if( job.container === "20 Yard" ) {
          twentyYard.push(job)
        }
        if( job.container === "30 Yard" ) {
          thirtyYard.push(job)
        }
        if( job.status  === "pending"  ) {
          pending.push(job)
        }
        if( job.status  === "unassigned"  ) {
          unassigned.push(job)
        }
      })

      this.setState({
        fifYardCount: fifYard.length,
        tenYardCount: tenYard.length,
        halfYardCount: halfYard.length,
        twnntYardCount: twentyYard.length,
        thirtyYardCount: thirtyYard.length,
        pendingCount: pending.length,
        unassignedCount: unassigned.length,
      }, ()=>{
        this.forceUpdate()
      })

    }
    // exchange = _.get(this.state, 'jobs',[]).filter(function (job) {
    //   return job.jobStatus === "Exchange" && job.container !== "1/2 Yard"
    // })
    //
    // delivery = _.get(this.state, 'jobs',[]).filter(function (job) {
    //   return job.jobStatus === "Delivery" && job.container !== "Live Load" && job.container !== "1/2 Yard"
    // })
    // removal = _.get(this.state, 'jobs',[]).filter(function (job) {
    //   return job.jobStatus === "Removal" && job.container !== "Live Load" && job.container !== "1/2 Yard"
    // })

    // liveLoad = _.get(this.state, 'jobs',[]).filter(function (job) {
    //   return job.container === "Live Load"
    // })
    //
    // minis = _.get(this.state, 'jobs',[]).filter(function (job) {
    //   return job.container === "1/2 Yard"
    // })

    // inProgress = _.get(this.state, 'jobs',[]).filter(function (job) {
    //   return job.state  === "inprogress"
    // })
    // completed = _.get(this.state, 'jobs',[]).filter(function (job) {
    //   return job.state  === "completed"
    // })
  }

  componentWillUnmount() {
    clearInterval(this.state.interval)
    this._isMounted = false;
  }
  // componentWillReceiveProps(np) {
  //   const self = this
  //   let timezone = this.props.user && this.props.user.timezone ? this.props.user.timezone.tzName : Intl.DateTimeFormat().resolvedOptions().timeZone
  //   const obj = {
  //     date: moment(this.state.filterdate).tz(timezone).format('MM/DD/YYYY'),
  //     All: this.state.dateType !== "all" ? false : true
  //   }
  //   const { getOrder, getJobsByDate, getYardsAndDump } = this.props
  //
  //   if(this.state.isMounted) {
  //     if(!this.state.pageloaded && this.props.user && this.props.user.timezone) {
  //       this.setState({ pageloaded: true })
  //       getJobsByDate(obj)
  //     }
  //     if(np.accessibilityPhase === "success") {
  //       // getOrder(obj)
  //       getJobsByDate(obj)
  //       this.props.clearPhase()
  //     }
  //     if(np.accessibilityPhase === "error") {
  //       this.props.clearPhase()
  //     }
  //     if(np.orderDetailPhase === "success") {
  //       const _center = {lat: np.orderDetail.geoLocation.lat, lng: np.orderDetail.geoLocation.lng}
  //       this.setState({ orderDetail: np.orderDetail, center: _center, truckid: np.orderDetail && np.orderDetail.truck_id === "" ? "select" : np.orderDetail && np.orderDetail.truck_id, accessibility: np.orderDetail.accessibility ? np.orderDetail.accessibility : "select", manualaccessibility: np.orderDetail? np.orderDetail.manualaccessibility : "" })
  //       this.props.clearPhase()
  //     }
  //     if(np.yardsanddumpdata && np.getYardsAndDumpPhase === "success") {
  //       this.setState({ dumps: np.yardsanddumpdata.dumps, yards: np.yardsanddumpdata.yards })
  //       this.props.clearPhase()
  //     }
  //   }
  //   // if(np.orderDetail) {
  //   //   this.setState({ orderDetail: np.orderDetail, truckid: np.orderDetail && np.orderDetail.truck_number === "" ? "select" : np && np.truck_number })
  //   // }
  // }

  handleSelectChange(value) {
    this.setState({ truckid: value })
  }
  dropdownChange(e) {
    let dateType = e.target.value
    this._isMounted && this.setState({dateType: dateType})
    let timezone = this.props.user && this.props.user.timezone ? this.props.user.timezone.tzName : Intl.DateTimeFormat().resolvedOptions().timeZone
    let date = moment().tz(timezone).format('MM/DD/YYYY')
    let all = false
    if(dateType === "tomorrow") {
      date = moment().tz(timezone).add(1, 'days').format('MM/DD/YYYY')
    }
    if(dateType === "all"){
      all = true
    }
    this.setState({ filterdate : date, dateType: dateType, filterkey: "", isFiltered: false }, ()=>{
      this.getOrders()
    })
    // getJobsByDate(obj)
  }
  closeInformationModal(){
    this.setState({ orderInformationModal: false })
  }
  showTraffic() {
    if(!this.state.showTrafficLayer === true) {
      this._isMounted && this.setState({ showTrafficLayer: !this.state.showTrafficLayer, layerTypes: ['TrafficLayer'] })
    } else {
      this._isMounted && this.setState({ showTrafficLayer: !this.state.showTrafficLayer, layerTypes: [] })
    }

  }
  viewedNotification(data) {
    let notifications = localStorage.getItem('notifications')
    notifications = notifications && JSON.parse(notifications)
    _.forEach(notifications, function(n) {
      if(n.show_id === data.show_id) {
        n.is_viewed = true
      }
    })
    localStorage.setItem('notifications', JSON.stringify(notifications))
    if(data.event === "new_job" || data.event === "job_updated" || data.event === "job_status" || data.event === "new_job" || data.event === "update_job" || data.event === "unable_to_complete" ) {
      if(data.data) {
        this.popupshow(data.data)
      }
    }
    // if(data.event === "new_task" || data.event === "update_task") {
    //   const task = _.find(this.props.orders.tasks, function(job) {
    //     return String(job.id) === String(data.data.id)
    //   })
    //   if(task) {
    //     this.setState({ taskInformation: true, taskname: task.taskName, description: task.description, taskEditId: task.id, task: task })
    //   }
    // }
    //this.componentDidMount(false)
  }
  showInfo(id, data) {
    const dumps = this.state.dumps
    const yards = this.state.yards
    const allTrucks = this.state.trucks
    const alldata = this.state.jobs
    _.forEach(alldata, function(eachM) {
        eachM.showInfo = false
    })
    _.forEach(dumps, function(eachM) {
      eachM.showInfo = false
    })
    _.forEach(yards, function(eachM) {
      eachM.showInfo = false
    })
    _.forEach(allTrucks, function(eachM) {
      eachM.showInfo = false
    })
    if(data.type === "dump") {

      const particularDump = _.findIndex(dumps, function(dump) {
        return String(dump._id) === String(data.place._id)
      })
      if(particularDump !== -1) {
        dumps[particularDump].showInfo = true
      }
      this.setState({ dumps: dumps })

    } else if(data.type === "yard") {

      const particularDump = _.findIndex(yards, function(dump) {
        return String(dump._id) === String(data.place._id)
      })

      if(particularDump !== -1) {
        yards[particularDump].showInfo = true
      }
      this.setState({ yards: yards })

    } else {
      const isTruck = _.findIndex(this.state.trucks, function(truck) {
        return String(truck.id) === String(id)
      })
      if(isTruck !== -1) {
        let singleItem = _.findIndex(allTrucks, function(item) {
          return String(item.id) === String(id)
        })
        allTrucks[singleItem].showInfo = true
        let progressTruck = {}
        progressTruck = _.find(this.state.jobs, function(job) {
          return job.truck_id === id && job.status === "inprogress"
        })
        this._isMounted && this.setState({ trucks: allTrucks, clickedData: progressTruck })
      } else {
        const {getOrderDetail} = this.props
        getOrderDetail(id)
        let singleItem = _.findIndex(alldata, function(item) {
          return String(item.id) === String(id)
        })
        alldata[singleItem].showInfo = true
        this._isMounted && this.setState({ jobs: alldata })
      }
    }
    const center = {lat: data.lat, lng: data.lng}
    this.setState({ center})
  }
  viewDetails(data) {
    this.popupshow(data)
  }
  viewDetailsTruck(data) {
    let order = _.find(this.props.jobs && this.props.jobs.jobs , function(job) {
      return String(job.truck_id) === String(data.id) && job.status === "inprogress"
    })
    this.popupshow(order)
  }
  closeInfoWindow() {
    const alldata = this.state.jobs
    _.forEach(alldata, function(eachM) {
      eachM.showInfo = false
  })
  this._isMounted && this.setState({ jobs: alldata })
  }
  closeInfoWindowTruck() {
    const alldata = this.state.trucks
    _.forEach(alldata, function(eachM) {
      eachM.showInfo = false
  })
  this._isMounted && this.setState({ trucks: alldata })
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
    this.setState({ yards: yards, dumps: dumps })
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
  viewDetailDumpAndYards() {
    //console.log("view")
  }
  handleChange(e) {
      this.setState({ [e.target.name] : e.target.value})
  }
  moveOrder() {
    const { orders,jobs, assignDriver, orderDetail } = this.props
    const {truckid} = this.state
    let trucknumber = _.find(this.state.trucksSelect, function(truck) {
      if(String(truck.value) === String(truckid)) {
        return truck
      }
    })
    // let driver_id = orderDetail.driverid
    // if(driver_id === "") {
    //   driver_id = this.state.targetLaneId
    // }
    const obj = {
      assigned: true,
      driverId: orderDetail.driverid,
      jobDate: new Date(), //moment().utc(),
      offset: new Date().getTimezoneOffset(),
      jobId: orderDetail.id,
      truck_id: trucknumber && trucknumber.value,
      truck_number: trucknumber && trucknumber.key,
      type: "job"
    }
    assignDriver(obj)
    this.closeInformationModal()
  }
  saveAccessibility() {
    const {orderDetail} = this.props
    const data = {
      accessibility: this.state.accessibility,
      id: orderDetail.id,
      manualaccessibility: this.state.accessibility === "Other: Manual entry" ? this.state.manualaccessibility : ""
     }
    const { saveAccessibility } = this.props
    saveAccessibility(data)
    this.closeInformationModal()
  }
  handleSelectChangeAccess(value) {
    this.setState({ accessibility: value  })
  }
  filterMarkers(key, filter) {
    this.setState({ isFiltered: true })
    const data = []
    const dumps = []
    const yards = []
    if(filter === "jobStatus") {
      _.forEach(_.get(this.state, 'jobs',[]), function(job) {
        if(job.jobStatus === key && job.container !== "Live Load" && job.container !== "1/2 Yard") {
          if(key === "Exchange") {
            if(job.container !== "1/2 Yard") {
              data.push(job)
            }
          } else {
            data.push(job)
          }
        }
      })
    } else if(filter === "containersize") {
      _.forEach(_.get(this.state, 'jobs', []), function(job) {
        if(job.container === key) {
          if(job.container === "1/2 Yard") {
            //if(job.jobStatus === "Exchange") {
              data.push(job)
            //}
          } else {
            data.push(job)
          }
        }
      })
    } else if(filter === "status") {
      _.forEach(_.get(this.state, 'jobs', []), function(job) {
        if(job.status === key) {
          data.push(job)
        }
      })
    } else if(filter === "dump") {
      _.forEach(_.get(this.state, 'dumpsForFilter', []), function(dump) {
        dumps.push(dump)
      })
    } else if(filter === "yard") {
      _.forEach(_.get(this.state, 'yardsForFilter', []), function(yard) {
          yards.push(yard)
      })
    }

    this.setState({ filterkey: key, showjobs: data, dumps: dumps, yards: yards },()=>{

    })
  }

  unFilterMarker(){
    let timezone = this.props.user && this.props.user.timezone && this.props.user.timezone.tzName ? this.props.user.timezone.tzName : Intl.DateTimeFormat().resolvedOptions().timeZone
    let date = moment().tz(timezone).format('MM/DD/YYYY')
    let all = false
    if(this.state.dateType === "tomorrow") {
      date = moment().tz(timezone).add(1, 'days').format('MM/DD/YYYY')
    }
    if(this.state.dateType === "all"){
      all = true
    }
    const obj = {
      date: date,
      All: all
    }
    this.setState({ filterdate : date, isFiltered: false, filterkey: "" })
    const { getYardsAndDump, getJobsByDate } = this.props
    this.getOrders()
    // getJobsByDate(obj);
    // getYardsAndDump();
  }

  getFormatedDate(ddate) {
    var orderDeliveryDateOnly = ""
    if(ddate) {
      var orderDeliveryDate = new Date(ddate)
      orderDeliveryDateOnly = String(orderDeliveryDate.getUTCMonth()+1)+'-'+String(orderDeliveryDate.getUTCDate())+'-'+String(orderDeliveryDate.getUTCFullYear());
    }
    return orderDeliveryDateOnly
  }

  openDriverModal() {
    this.setState({
      addDriverModal: true,
      err: {},
      name: "",
      editDriverId: "",
      email: "",
      phone: "",
      tzone:"",
      tabletId: "",
      timezone: "",
      license: "",
      lastname: "",
      driverModalText: "New Driver",
      driverError: ""
    })
  }

  responsiveTabChange (e) {
    this.props.history.push(`/${e.target.value}`)
  }

  changeHauler () {
    this.componentDidMount()
  }

  render() {
    let { orderDetail, layerTypes } = this.state
    const currentlocation = window.location.pathname
    const mapOptions = {
      styles: config.mapStyles,
      streetViewControl: true
    };
    let status = "unassigned"
    if(orderDetail) {
      status = _.find(this.props.jobs && this.props.jobs.jobs, function(order){
        return String(order.id) === String(orderDetail.id)
      })
    }
    const accessibilityOptions = config.accessibilityOptions
    return (
      <div>
        {/* <Header {...this.props} onRef={ref => (this.child = ref)} viewedNotification={this.viewedNotification.bind(this)} dropdownChange={this.dropdownChange.bind(this)}/> */}
        <DispatcherTopNavigation changeHauler={this.changeHauler.bind(this)} openDriverModal={this.openDriverModal.bind(this)} haulerDetails={_.get(this.state, 'haulerDetails', '')} {...this.props} />
        <div className="dispatcher-btn-wrapper showindesktop">
          <div className="flex-btn h-66">
            <Link to={'/dispatcher'} className={currentlocation === "/dispatcher" ? "btn primarybtn primarybtn-active" : "btn primarybtn" }>List View</Link>
            <Link to={'/viewmap'} className={currentlocation === "/viewmap" ? "btn primarybtn primarybtn-active" : "btn primarybtn" }>Map View</Link>
          </div>
        </div>
          <div className="col-md-12 pt-4 showinmobile">
            <div className="form-group material-textfield">
              <select
                onChange={this.responsiveTabChange.bind(this)}
                className="form-control custom-select h-66">
                <option value="viewmap">Map View</option>
                <option value="dispatcher">List View</option>
              </select>
            </div>
          </div>

        <div className="dispatcher-select-wrapper">
          <div className="form-group material-textfield material-textfield-select mb-0">
            <select
              onChange={this.dropdownChange.bind(this)}
              value={this.state.dateType}
              className="form-control custom-select h-66 font-16 material-textfield-input" required>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="all">All</option>
            </select>
            <label className="material-textfield-label material-textfield-label-ant">Date </label>
          </div>
        </div>
        <div className="clearfix"></div>

        {this.props.jobPhase === "loading" ?
          <Spin
            tip="Loading..."
            size="large"
            wrapperClassName="spin__color"
          >
            <div className="viewmap__section viewmap__section-dis">
              <div className="viewmap__section--status"></div>
            </div>
          </Spin>
        :
          <div className="viewmap__section viewmap__section-dis">
        <div className="viewmap__section--status">
            <h4>Map Key {this.state.isFiltered ? <span className="btn-reset" onClick={this.unFilterMarker.bind(this)}> Reset </span> : "" }</h4>
            {this.state.dateType !== "all" ?
              <ul className="viewmap__section--map-key">
                <li className={this.state.filterkey === "Delivery" ? "active" : "" } onClick={this.filterMarkers.bind(this, 'Delivery', 'jobStatus')}><img src={DeliveriesSmall}/> Delivery({this.state.deliveryCount})</li>
                <li className={this.state.filterkey === "Removal" ? "active" : "" } onClick={this.filterMarkers.bind(this, 'Removal', 'jobStatus')}><img src={RemovalsSmall}/> Removal ({this.state.removalCount})</li>
                <li className={this.state.filterkey === "Exchange" ? "active" : "" } onClick={this.filterMarkers.bind(this, 'Exchange', 'jobStatus')}><img src={ExchangesSmall}/> Exchange ({this.state.exchangeCount})</li>
                <li className={this.state.filterkey === "Live Load" ? "active" : "" } onClick={this.filterMarkers.bind(this, 'Live Load', 'containersize')}><img src={LiveloadsSmall}/> Live Load ({this.state.liveLoadCount})</li>
                <li className={this.state.filterkey === "1/2 Yard" ? "active" : "" } onClick={this.filterMarkers.bind(this, '1/2 Yard', 'containersize')}><img src={MinisSmall}/> Minis ({this.state.minisCount})</li>
                <li className={this.state.filterkey === "inprogress" ? "active" : "" } onClick={this.filterMarkers.bind(this, 'inprogress', 'status')}><img src={InprogressSmall}/> In progress ({this.state.inProgressCount})</li>
                <li className={this.state.filterkey === "completed" ? "active" : "" } onClick={this.filterMarkers.bind(this, 'completed', 'status')}><img src={CompletedSmall}/> Completed ({this.state.completedCount})</li>
                <li className={this.state.filterkey === "Dump Site" ? "active" : "" } onClick={this.filterMarkers.bind(this, 'Dump Site', 'dump')}><img src={Dumpsmall} width="18px"/> Dump Site ({this.state.dumpCount})</li>
                <li className={this.state.filterkey === "Yards" ? "active" : "" } onClick={this.filterMarkers.bind(this, 'Yards', 'yard')}><img src={Yardgreen} width="18px"/> Yards ({this.state.yardCount})</li>
              </ul>
              :
              <ul className="viewmap__section--map-key">
                <li className={this.state.filterkey === "10 Yard" ? "active" : "" } onClick={this.filterMarkers.bind(this, '10 Yard', 'containersize')}><img src={TenYard}/>10 Yard Container ({this.state.tenYardCount})</li>
                <li className={this.state.filterkey === "15 Yard" ? "active" : "" } onClick={this.filterMarkers.bind(this, '15 Yard', 'containersize')}><img src={DeliveriesSmall}/> 15 Yard Container ({this.state.fifYardCount})</li>
                <li className={this.state.filterkey === "20 Yard" ? "active" : "" } onClick={this.filterMarkers.bind(this, '20 Yard', 'containersize')}><img src={InprogressSmall}/> 20 Yard Container ({this.state.twnntYardCount})</li>
                  <li className={this.state.filterkey === "30 Yard" ? "active" : ""} onClick={this.filterMarkers.bind(this, '30 Yard', 'containersize')}><img src={Exchangespin}/> 30 Yard Container ({this.state.thirtyYardCount})</li>
                <li className={this.state.filterkey === "1/2 Yard" ? "active" : "" } onClick={this.filterMarkers.bind(this, '1/2 Yard', 'containersize')}><img src={LiveloadsSmall}/> 1/2 Yard Container ({this.state.halfYardCount}) </li>
                  <li className={this.state.filterkey === "pending" ? "active" : ""} onClick={this.filterMarkers.bind(this, 'pending', 'status')}><img src={MinisSmall}/> Pending ({this.state.pendingCount})</li>
                {/* <li className={this.state.filterkey === "inprogress" ? "active" : "" }onClick={this.filterMarkers.bind(this, 'inprogress', 'status')}><img src={InprogressSmall}/> In progress</li> */}
                  <li className={this.state.filterkey === "unassigned" ? "active" : ""} onClick={this.filterMarkers.bind(this, 'unassigned', 'status')}><img src={AssignedSmall}/> Unassigned({this.state.unassignedCount})</li>
                <li className={this.state.filterkey === "Dump Site" ? "active" : "" } onClick={this.filterMarkers.bind(this, 'Dump Site', 'dump')}><img src={Dumpsmall} width="18px"/> Dump Site ({this.state.dumpCount})</li>
                <li className={this.state.filterkey === "Yards" ? "active" : "" } onClick={this.filterMarkers.bind(this, 'Yards', 'yard')}><img src={Yardgreen} width="18px"/> Yards ({this.state.yardCount})</li>

              </ul>
            }
          </div>
          <button className="show__traffic--btn" onClick={this.showTraffic.bind(this)}>
            Show traffic
          </button>
          <GoogleMap
            defaultZoom={11}
            id="map"
            center={this.state.center}
            layerTypes={layerTypes}
            options={this.createMapOptions()}
            bootstrapURLKeys={{ key: "AIzaSyDC4hfVQUrN7Vc45Wh0Qpx4cpxs1YPWE24" }}
            onChildClick={this.showInfo}
          >

          {this.state.showjobs && this.state.showjobs.map(place =>
              (<Marker
                key={place.id}
                lat={place.geolocation.lat}
                lng={place.geolocation.lng}
                show={place.showInfo}
                viewDetails={this.viewDetails.bind(this, place)}
                closeInfoWindow={this.closeInfoWindow.bind(this)}
                place={place}
                type={this.state.dateType}
              />))}
          {this.state.trucks && this.state.trucks.map(truck =>
              (<TruckMarker
                key={truck.id}
                id={truck.id}
                name={truck.name}
                lat={truck.latitude}
                lng={truck.longitude}
                allData={this.state.jobs}
                progress={truck.progress}
                show={truck.showInfo}
                viewDetailsTruck={this.viewDetailsTruck.bind(this, truck)}
                closeInfoWindowTruck={this.closeInfoWindowTruck.bind(this)}
                place={this.state.clickedData}
                //type={this.state.dateType}
              />))}
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
          </GoogleMap>
        </div>
        }

        {this.state.orderInformationModal ?
        <ViewOrder
          isViewModalOpen = {this.state.orderInformationModal}
          closeModal={this.closeInformationModal.bind(this)}
          orderData = {this.state.orderDetail}
          containerList={this.state.containerList}
          statusList={this.state.statusList}
          {...this.props}
        /> : ""}
      </div>
    )
  }
}

export default reduxForm({
  form: 'maps',  // a unique identifier for this form
  destroyOnUnmount: true,
})(MapForm)
