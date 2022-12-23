import 'rxjs'
import React, { Component, Fragment } from 'react'
import { reduxForm } from 'redux-form'
import { Link } from "react-router-dom";
// import Header from "./../Header/container";
import moment from "moment"
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {  Select, Spin } from 'antd';
import _ from 'lodash';
// import { TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
// import classnames from 'classnames';
// import './style.scss'
import TextArea from 'antd/lib/input/TextArea';
import GoogleMap from 'google-map-react';
import { LocationIconRed, CloseIcon, RightArrow, LocationIconPurple, SortingNewDownIcon, LocationIconSky, DumpsiteIcon, YardIcon,
  LocationIconGreen, LocationIconYellow, LocationIconOrange, DotBtnIcon, SortingDownArrow, LocationIconRedActive, LocationIconPurpleActive, LocationIconGreenActive, LocationIconYellowActive, LocationIconOrangeActive, LocationIconSkyActive, DumpsiteIconActive, YardIconActive, LocationIconCompleted, LocationIconCompletedActive }
from '../../../components/icons'

import TenYard from '../../../images/10yard-mapicon.svg'
import Deliveries from '../../../images/15yard_map.svg'
import TwentyYard from '../../../images/20yard-mapicon.svg'
import FifYard from '../../../images/15yard_map.svg'
import ThirtyYard from '../../../images/30yard-mapicon.svg'
import HalfYard from '../../../images/1_2_yard_map.svg'
import Liveloads from '../../../images/1-2-yard-mapicon.svg'
import DumpBig from '../../../images/dump-bg.svg'
import Yardgreen from '../../../images/yard-sm.svg'
import Dumpsmall from '../../../images/dump-sm.svg'
import ExchangesSmall from '../../../images/yellowpin.svg'
import Exchanges from '../../../images/exchanges-mapicon.svg'
import DeliveriesSmall from '../../../images/purplepin.svg'
import RemovalsSmall from '../../../images/pinkpin.svg'
import Removals from '../../../images/10yard-mapicon.svg'
import LiveloadsSmall from '../../../images/orangepin.svg'
import MinisSmall from '../../../images/sky-mapicon.svg'
import InprogressSmall from '../../../images/lightgreen-mapicon.svg'
import CompletedSmall from '../../../images/brown-mapicon.svg'
import Closemapbtn from '../../../images/close_map_btn.png'
import Closemapbtnnew from '../../../images/updated-close.svg'
import GreyIcon from '../../../images/grey-icon.png'
import GreenImg from '../../../images/green_img.png'
import activedump from '../../../images/dump-active.png'
import ViewOrder from './viewOrderModal'
import InprogressBig from '../../../images/inprogress.png'
import Grey from "../../../images/grey.png"

import config from '../../../config/index'

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
            <img src={Closemapbtnnew} alt="close" onClick={props.closeInfoWindow}/>
          </div>
          <ul className="infowindow__wrapper--list">
            <li>
                <span>Company Name</span><b>:</b>
                <p>{props.place.companyname}</p>
            </li>
            <li>
                <span>Order Type</span><b>:</b>
                <p>{props.place.container === "Live Load" ? props.place.container : props.place.container === "1/2 Yard" ? props.place.jobStatus === "Exchange" ? "Mini Action" : "Mini Delivery" : props.place.jobStatus}</p></li>
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
                <span>Container Size</span><b>:</b><p>{props.place.container}</p></li>  : ''}
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
        icon = '../../images/unassigned.png'
      } else if(props.place.status === "inprogress") {
        icon = InprogressBig
      } else if (props.place.status === "pending") {
        icon = '../../images/pending.png'
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
            icon = MinisSmall //'../../images/minis.png'
          }
        } else {
          if(props.place && props.place.jobStatus === "Exchange") {
            icon =  Exchanges
          } else if (props.place && props.place.jobStatus === "Delivery") {
            icon = Deliveries
          } else if (props.place && props.place.jobStatus === "Removal") {
            icon = Removals
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
      filterkeys: []
    }
    this.showInfo = this.showInfo.bind(this)
  }

  popupshow =async (data)=> {
    const { getOrderDetailById } = this.props
    let { value } = await getOrderDetailById(data.id)
    this._isMounted && this.setState({ orderInformationModal: true, orderDetail: value })
  }

  componentDidMount = async () => {
    this._isMounted = true;

    // let val  = await this.props.getHaulerDetails(localStorage.getItem('haulerid'))
    let haulerId = _.get(this.props, 'user.defaultHauler._id', '')
    let  containers  = await this.props.getContainer()
    this.setState({ containerList: containers.value.containers, statusList: containers.value.status })
    this.setState({ haulerId },()=>{
      if (this.state.haulerId) {
        this.getOrders()
      }
    })
    let interval = setInterval(() => {
      this.getTrucks()
    }, 2000);
    this.setState({ interval: interval, isMounted: true})
  }

  getOrders = async()=> {
    const date = moment(this.state.filterDate).format('MM/DD/YYYY')
    const timezone = this.state.user && this.state.user.timezone && this.state.user.timezone.tzName ? this.state.user.timezone.tzName: Intl.DateTimeFormat().resolvedOptions().timeZone
    const offset = moment.tz(moment(), timezone).utcOffset()
    const obj = {
      date: date,
      offset:String(offset),
      All: false,
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
          self.setState({trucksSelect : trucksSelect, setTruck: true})
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

    this.setState({ trucks: trucks })
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
    })
  }

  getYardsAndDump = async () => {
    let { value } = await this.props.getYardsAndDump()
    this.setState({
      dumps: _.get(value,'data.dumps', []),
      yards: _.get(value, 'data.yards', []),
      dumpsForFilter: _.get(value, 'data.dumps', []),
      yardsForFilter: _.get(value, 'data.yards', [])
    }, () => {
      this.dispatchCount()
    })
  }

  componentWillUnmount() {
    clearInterval(this.state.interval)
    this._isMounted = false;
  }

  handleSelectChange(value) {
    this.setState({ truckid: value })
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
        // getOrderDetail(id)
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

  handleSelectChangeAccess(value) {
    this.setState({ accessibility: value  })
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
    const data = []
    const dumps = []
    const yards = []
    if (filterkeys.length > 0) {
      if( filterkeys.indexOf("Delivery") !== -1 ||
          filterkeys.indexOf("Removal") !== -1 ||
          filterkeys.indexOf("Exchange") !== -1
        ) {
        _.forEach(_.get(this.state, 'jobs',[]), function(job) {
          let index = filterkeys.indexOf(job.jobStatus)
          let jobStatus = ''
          if (index !== -1) {
            jobStatus = filterkeys[index]
          }
          if(job.jobStatus === jobStatus && job.container !== "Live Load" && job.container !== "1/2 Yard") {
            if(key === "Exchange") {
              if(job.container !== "1/2 Yard") {
                data.push(job)
              }
            } else {
              data.push(job)
            }
          }
        })
      }
      if (  filterkeys.indexOf("10 Yard") !== -1 ||
            filterkeys.indexOf("15 Yard") !== -1 ||
            filterkeys.indexOf("20 Yard") !== -1 ||
            filterkeys.indexOf("30 Yard") !== -1 ||
            filterkeys.indexOf("Live Load") !== -1 ||
            filterkeys.indexOf("1/2 Yard") !== -1
          ) {
        _.forEach(_.get(this.state, 'jobs', []), function(job) {
          let index = filterkeys.indexOf(job.container)
          if (index !== -1) {
            if (job.container === filterkeys[index]) {
              data.push(job)
            }
          }
          // if(job.container === key) {
          //   if(job.container === "1/2 Yard") {
          //     //if(job.jobStatus === "Exchange") {
          //       data.push(job)
          //     //}
          //   } else {
          //     data.push(job)
          //   }
          // }
        })
      }

      if( filterkeys.indexOf("pending") !== -1 ||
          filterkeys.indexOf("inprogress") !== -1 ||
          filterkeys.indexOf("completed") !== -1 ||
          filterkeys.indexOf("unassigned") !== -1
        ) {
        _.forEach(_.get(this.state, 'jobs', []), function(job) {
          let index = filterkeys.indexOf(job.status)
          if (index !== -1) {
            if (job.status === filterkeys[index]) {
              data.push(job)
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
      this.setState({ filterkey: key, showjobs: data, dumps: dumps, yards: yards },()=>{
        this.dispatchCount()
        this.forceUpdate()
      })
    } else {
      this.getOrders()
    }
  }

  dispatchCount() {
    let count = 0
    // count += _.get(this.state, 'dumps', []).length
    // count += _.get(this.state, 'yards', []).length
    count += _.get(this.state, 'showjobs', []).length
    if(_.get(this.state, 'filterkeys', []).length === 0) {
      count = 0
      count += this.state.jobs.length
      // count += _.get(this.state, 'dumps', []).length
      // count += _.get(this.state, 'yards', []).length
    }
    this.props.updateCount(count)

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

  handleHaulerChange (e) {
    this.props.dispatchOrderCount(e.target.value)
    this.setState({ haulerId: e.target.value },()=>{
      this.getOrders()
      this.forceUpdate()
    })
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



        {this.props.jobPhase === "loading" ?
          <Spin
            tip="Loading..."
            size="large"
            wrapperClassName="spin__color"
          >
            <div className="viewmap__section">
              <div className="viewmap__section--status"></div>
            </div>
          </Spin>
        :
          <div className="viewmap__section viewmap__section-edit">
            <div className="flex-map-btn mb-3">
            <div className="form-group material-textfield material-textfield-lg w-200 mb-0 mr-4">
            <select
              value={this.state.haulerId}
              onChange={this.handleHaulerChange.bind(this)}
              className="form-control custom-select h-66 w-290 font-16 material-textfield-input"
              required>
                {_.get(this.props, 'haulersList', []).map((hauler, i)=>{
                  return (
                    <option key={i} value={hauler._id}> {hauler.company_name}</option>
                  )
                })}
            </select>
            <label className="material-textfield-label">Which Hauler </label>
            </div>
            {/* {this.state.dateType !== "all" ? */}
              <div className="dispatchbtn">
                <button className={this.state.filterkeys.indexOf('Delivery') !== -1 ? "btn map-btn map-btn-purplefilled" : "btn map-btn map-btn-purple"} onClick={this.filterMarkers.bind(this, 'Delivery', 'jobStatus')} >
                  {this.state.filterkeys.indexOf('Delivery') !== -1 ? <LocationIconPurpleActive /> : <LocationIconPurple />} Delivery</button>
                <button className={this.state.filterkeys.indexOf('Removal') !== -1 ? "btn map-btn map-btn-redfilled" : "btn map-btn map-btn-red"} onClick={this.filterMarkers.bind(this, 'Removal', 'jobStatus')}>
                  {this.state.filterkeys.indexOf('Removal') !== -1 ? <LocationIconRedActive/> : <LocationIconRed />} Removal</button>
                <button className={this.state.filterkeys.indexOf('Exchange') !== -1 ? "btn map-btn map-btn-yellowfilled" : "btn map-btn map-btn-yellow"} onClick={this.filterMarkers.bind(this, 'Exchange', 'jobStatus')}>
                  {this.state.filterkeys.indexOf('Exchange') !== -1 ? <LocationIconYellow /> : <LocationIconYellowActive />} Exchange</button>
                <button className={this.state.filterkeys.indexOf('Live Load') !== -1 ? "btn map-btn map-btn-orangefilled" : "btn map-btn map-btn-orange"} onClick={this.filterMarkers.bind(this, 'Live Load', 'containersize')}>
                {this.state.filterkeys.indexOf('Live Load') !== -1 ? <LocationIconOrange />: <LocationIconOrangeActive />} Live Load</button>
                <button className={this.state.filterkeys.indexOf('1/2 Yard') !== -1 ? "btn map-btn map-btn-skyfilled" : "btn map-btn map-btn-sky"} onClick={this.filterMarkers.bind(this, '1/2 Yard', 'containersize')}>
                  {this.state.filterkeys.indexOf('1/2 Yard') !== -1 ? <LocationIconSkyActive />: <LocationIconSky />} Minis</button>
                <button className={this.state.filterkeys.indexOf('inprogress') !== -1 ? "btn map-btn map-btn-lightgreenfilled" : "btn map-btn map-btn-lightgreen"} onClick={this.filterMarkers.bind(this, 'inprogress', 'status')}>
                  {this.state.filterkeys.indexOf('inprogress') !== -1 ? <LocationIconGreen />: <LocationIconGreenActive />} In progress</button>
                <button className={this.state.filterkeys.indexOf('completed') !== -1 ? "btn map-btn map-btn-completedfilled" : "btn map-btn map-btn-completed"} onClick={this.filterMarkers.bind(this, 'completed', 'status')}>
                  {this.state.filterkeys.indexOf('completed') !== -1 ? <LocationIconCompletedActive />: <LocationIconCompleted />} Completed</button>
                <button className={this.state.filterkeys.indexOf('dump') !== -1 ? "btn map-btn map-btn-darkbluefilled" : "btn map-btn map-btn-darkblue"} onClick={this.filterMarkers.bind(this, 'dump', 'dump')}>
                  {this.state.filterkeys.indexOf('dump') !== -1 ? <img src={activedump} className="dumpact" />: <DumpsiteIcon />} Dump Site</button>
                <button className={this.state.filterkeys.indexOf('yard') !== -1 ? "btn map-btn map-btn-darkgreenfilled" : "btn map-btn map-btn-darkgreen"} onClick={this.filterMarkers.bind(this, 'yard', 'yard')}>
                {this.state.filterkeys.indexOf('yard') !== -1 ? <YardIconActive />: <YardIcon />} Yards</button>
              </div>
              {/* : */}
              {/* <div>
                <button className="btn map-btn" onClick={this.filterMarkers.bind(this, '10 Yard', 'containersize')}><img src={TenYard}/>10 Yard Container</button>
                <button className="btn map-btn" onClick={this.filterMarkers.bind(this, '15 Yard', 'containersize')}><img src={FifYard}/> 15 Yard Container</button>
                <button className="btn map-btn" onClick={this.filterMarkers.bind(this, '20 Yard', 'containersize')}><img src={TwentyYard}/> 20 Yard Container</button>
                <button className="btn map-btn" onClick={this.filterMarkers.bind(this, '30 Yard', 'containersize')}><img src={ThirtyYard}/> 30 Yard Container</button>
                <button className="btn map-btn" onClick={this.filterMarkers.bind(this, '1/2 Yard', 'containersize')}><img src={HalfYard}/> 1/2 Yard Container</button>
                <button className="btn map-btn" onClick={this.filterMarkers.bind(this, 'pending', 'status')}><img src="./img/pending_small.png"/> Pending</button>
                <button className="btn map-btn" onClick={this.filterMarkers.bind(this, 'inprogress', 'status')}><img src={InprogressSmall}/> In progress</button>
                <button className="btn map-btn" onClick={this.filterMarkers.bind(this, 'unassigned', 'status')}><img src="./img/unassigned_small.png"/> Unassigned</button>
                <button className="btn map-btn" onClick={this.filterMarkers.bind(this, 'dump', 'dump')}><img src={Dumpsmall} width="18px"/> Dump Site</button>
                <button className="btn map-btn" onClick={this.filterMarkers.bind(this, 'yard', 'yard')}><img src={Yardgreen} width="18px"/> Yards</button>
              </div> */}
            {/* } */}
            </div>
          {/* <div className="viewmap__section--status">
            <h4>Map Key {this.state.isFiltered ? <span className="btn-reset" onClick={this.unFilterMarker.bind(this)}> Reset </span> : "" }</h4>
            {this.state.dateType !== "all" ?
              <ul className="viewmap__section--map-key">
                <li className={this.state.filterkey === "inprogress" ? "active" : "" } onClick={this.filterMarkers.bind(this, 'inprogress', 'status')}><img src={InprogressSmall}/> In progress</li>
                <li className={this.state.filterkey === "completed" ? "active" : "" } onClick={this.filterMarkers.bind(this, 'completed', 'status')}><img src={CompletedSmall}/> Completed</li>
                <li className={this.state.filterkey === "Dump Site" ? "active" : "" } onClick={this.filterMarkers.bind(this, 'Dump Site', 'dump')}><img src={Dumpsmall} width="18px"/> Dump Site</li>
                <li className={this.state.filterkey === "Yards" ? "active" : "" } onClick={this.filterMarkers.bind(this, 'Yards', 'yard')}><img src={Yardgreen} width="18px"/> Yards</li>
              </ul>
              :
              <ul className="viewmap__section--map-key">
                <li className={this.state.filterkey === "10 Yard" ? "active" : "" } onClick={this.filterMarkers.bind(this, '10 Yard', 'containersize')}><img src="./img/10yard.png"/>10 Yard Container</li>
                <li className={this.state.filterkey === "15 Yard" ? "active" : "" } onClick={this.filterMarkers.bind(this, '15 Yard', 'containersize')}><img src="./img/15yard.png"/> 15 Yard Container</li>
                <li className={this.state.filterkey === "20 Yard" ? "active" : "" } onClick={this.filterMarkers.bind(this, '20 Yard', 'containersize')}><img src="./img/20yard.png"/> 20 Yard Container</li>
                <li className={this.state.filterkey === "30 Yard" ? "active" : "" } onClick={this.filterMarkers.bind(this, '30 Yard', 'containersize')}><img src="./img/30yard.png"/> 30 Yard Container</li>
                <li className={this.state.filterkey === "1/2 Yard" ? "active" : "" } onClick={this.filterMarkers.bind(this, '1/2 Yard', 'containersize')}><img src="./img/1_2_yard.png"/> 1/2 Yard Container</li>
                <li className={this.state.filterkey === "pending" ? "active" : "" } onClick={this.filterMarkers.bind(this, 'pending', 'status')}><img src="./img/pending_small.png"/> Pending</li>
                <li className={this.state.filterkey === "inprogress" ? "active" : "" }onClick={this.filterMarkers.bind(this, 'inprogress', 'status')}><img src={InprogressSmall}/> In progress</li>
                <li className={this.state.filterkey === "unassigned" ? "active" : "" } onClick={this.filterMarkers.bind(this, 'unassigned', 'status')}><img src="./img/unassigned_small.png"/> Unassigned</li>
                <li className={this.state.filterkey === "Dump Site" ? "active" : "" } onClick={this.filterMarkers.bind(this, 'Dump Site', 'dump')}><img src={Dumpsmall} width="18px"/> Dump Site</li>
                <li className={this.state.filterkey === "Yards" ? "active" : "" } onClick={this.filterMarkers.bind(this, 'Yards', 'yard')}><img src={Yardgreen} width="18px"/> Yards</li>

              </ul> }
          </div> */}
          <button className="show__traffic--btn" onClick={this.showTraffic.bind(this)}>
            Show traffic
          </button>
            <div className="row mb-5">
              <div className="col-md-12">
            <div className="dashboard-map-ht">
          <GoogleMap
            defaultZoom={10}
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
        </div>
            </div>
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
        <div className="clearfix" />
      </div>
    )
  }
}

export default reduxForm({
  form: 'maps',  // a unique identifier for this form
  destroyOnUnmount: true,
})(MapForm)
