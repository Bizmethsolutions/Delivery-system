import 'rxjs'
import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import * as _ from 'lodash'
import { reduxForm } from 'redux-form'
import moment from 'moment'
import ReactModal from 'react-modal'
import InputMask from 'react-text-mask'
import Board from 'react-trello/dist'
import CarouselSlider from "react-carousel-slider"
import Lightbox from "react-image-lightbox"
import "react-image-lightbox/style.css"

import DeleteModal from '../../components/deleteModal'
import { Select, Icon, notification, Tabs, DatePicker, message  } from 'antd'
import DispatcherTopNavigation from './../DispatcherTopNavigation/container'
import './style.scss'
import Mycard from './card.js'
//import io from 'socket.io-client';
import config from '../../config/index'
import { CloseIcon, DownCaretIcon, ArrowIcon } from '../../components/icons'
import MapComponent from '../../components/map'
import { formatPhoneNumber, getDate } from '../../components/commonFormate'
import { socket } from '../../components/socketForDispatcher'
import dirverimg from '../../images/profilepic-default.png'
import DownloadArrow from './../../images/download.svg'
import LoaderGif from './../../images/loader.gif'

const timezoneoptions = config.timeZoneArr;
const { Option } = Select;
const antIcon = <Icon type="loading" style={{ fontSize: 20 }} spin />
const HOSTNAME = process.env.SOCKET_URL
let socketId = ""
let socketStatus = true
const { MonthPicker, RangePicker } = DatePicker
const { TabPane } = Tabs
const dateFormat = 'MM/DD/YYYY'
const phoneNumberMask = config.phoneNumberMask

const styles = {
  tabsContainer : {

  },
}

const openNotification = (message, description) => {
  notification.open({
    description: description,
      style: {
        backgroundColor: '#f4ffa2'
      },
      placement: 'bottomRight',
    onClick: () => {
    },
  });
};
const Marker = (props) => {
  const markerStyle = {
    cursor: 'pointer',
    zIndex: 10,
    marginLeft: '-12px',
    marginTop: '12px'
  };
  let icon = "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
  return (
    <Fragment>
      <img src={icon} style={markerStyle} alt=""/>
    </Fragment>
  );
};

const reactModalStyle = {
  content : {
    top                   : '40px',
    left                  : '40px',
    right                 : '40px',
    bottom                : '40px',
    height                : "auto"
  }
};

class DashboardForm extends Component {
  constructor(props) {
    super(props)
    this._isMounted = false;
    this.state = {
      modal: false,
      photoIndex: 0,
      driverPhotos: false,
      activeTab: '1',
      carouselItems: [],
      activeIndex: 0,
      data: {
        lanes: [],
        addDriverModal: false
      },
      driverError: "",
      name: "",
      activeKey: "1",
      email: "",
      phone: "",
      tabletId: "",
      status: "",
      timezone: "",
      lastname: "",
      timezoneoptionsIndex: 0,
      err: {},
      deleteDriverConfirmation:false,
      saveClicked: false,
      taskModalText: "New Task",
      driverModalText: "New Driver",
      showMessage: true,
      items: [],
      truckid: "",
      filterDate: new Date(),
      orderInformationModal: false,
      taskInformation: false,
      taskname: "",
      taskEditId: "",
      description: "",
      errTask: "",
      drivers: [],
      laneNewData: [],
      sourceLaneId: "",
      showLoader: false,
      trucks: [],
      center: {
        lat: 40.7128,
        lng: -74.0060
      },
      user: {},
      accessibility: "",
      manualaccessibility: "",
      dragged: true,
      currentobj: null,
      driversList: [],
      truck: [],
      orders: [],
      labels: [],
      haulerId: '',
      haulerDetails: {},
      driverData: [],
    }
    this.toggle = this.toggle.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.laneClick = this.laneClick.bind(this)
    this.unableToComplete = this.unableToComplete.bind(this)
    this.next = this.next.bind(this)
    this.previous = this.previous.bind(this)
    this.goToIndex = this.goToIndex.bind(this)
    this.onExiting = this.onExiting.bind(this)
    this.onExited = this.onExited.bind(this)
    this.laneHeader = this.laneHeader.bind(this)
    this.apiCallfunction = this.apiCallfunction.bind(this)
  }

  componentDidMount= async(connect)=> {
    this._isMounted = true;
    document.title = 'Dispatcher | CurbWaste'
    // const self = this
    socket(this.props, this.apiCallfunction)
    const { getOrder, getDriver, getLocation, getMessage, orderDetail, getLabel, getHaulerDetails } = this.props
    let { value } = await getLocation()
    const truckarr = [{key:"Select Truck", value: "select" }]
    let truck = value.data.vehicles
    _.forEach(truck, (t) => {
      truckarr.push({key: t.name, value: t.id })
    })
    if (this._isMounted) {
      this.setState({ truck, trucks: truckarr })
    }
    const date = moment().format('MM/DD/YYYY')//this.getTodayDate(this.props.user)
    if(localStorage.getItem('haulerid') !== null) {
      let val  = await getHaulerDetails(localStorage.getItem('haulerid'))
      let haulerId = _.get(val, 'value.data._id', '')
      //window.localStorage.setItem("lanesArr", JSON.stringify(_.get(val.value, 'data.lanes', [])))
      this.setState({ haulerId, haulerDetails: _.get(val, 'value.data', ''), driversListData: _.get(val.value, 'data.lanes', []) },()=>{
        if (this.state.haulerId) {
          this.apiCallfunction ()
        }
      })
    }
    if (this.props.match.params && this.props.match.params.id) {
      this.setState({cardclick: true})
      const {getOrderByOrderId } = this.props
      const {value} = await getOrderByOrderId(this.props.match.params.id)
      if(value.type === "success") {
        if(_.get(value, 'data.id', '') !== '') {
          this.getOrderDetail(_.get(value, 'data.id', ''), true)
        }
      }
    }
  }

  getLabel=async()=>{
    let { value } = await this.props.getLabel()
    this.setState({ labels: value.data })
  }

  apiCallfunction =async ()=> {
    const { getDriver, getHaulers } = this.props
    this.getLabel()
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
    this.setState({ orders: value.data }, async () => {
      const obj =  {
        // limit: 20,
        // by: 1,
        // page: 0,
        // sort_field : '_id',
        // search_string: '',
        date: date,
        haulerId: this.state.haulerId
      }
      let { value } = await getDriver(obj)
      this.setState({ driverData:  _.get(value, 'data.dataArr', []) })

      let driversListData = this.state.driversListData
      if(driversListData.length === 0 || driversListData.length !== _.get(value, 'data.dataArr', []).length) {
        driversListData = _.get(value, 'data.dataArr', [])
      }

      const data = {}
      let drivers = []
      let driverSelect = []
      let label = "false"
      const self = this
      let today = moment().format('YYYY-MM-DD')
      let filterDate = moment(this.state.filterDate).format('YYYY-MM-DD')
      today = new Date(today)
      filterDate = new Date(filterDate)
      today.setHours(0, 0, 0, 0)
      filterDate.setHours(0, 0, 0, 0)
      if(today <= filterDate) {
        label = "true"
      }
      const lanes = [{
        id: "sortable",
        title: "ADD TASK",
        allowDrag: false,
        label: label,
        cards: [

        ]
      }]
      const driversList = []
      _.forEach(driversListData, function(driver, i){
        driversList.push({
          id: driver.id,
          name: driver.name,
          loginTime: driver.loginTime,
        })
      })

      _.forEach(driversList, function(driver, i){
        drivers.push({
          id: driver.id,
          completed: [],
          inprogress: [],
          pending: []
        })
        const driverDetail = _.find(_.get(value, 'data.dataArr', []), function(drivers) {
          return String(drivers.id) === String(driver.id)
        })
        driverSelect.push({ name: driver.name, id: driver.id, loginTime: driverDetail && driverDetail.loginTime !== "" ? self.getFormatedDateAndTimeLogin(driverDetail.loginTime, driverDetail.driveroffset ? driverDetail.driveroffset : 0) : "" })
        lanes.push({
          id: driver.id,
          title: driver.name,
          allowDrag: true,
          draggable: true,
          label: driverDetail ? self.getFormatedDateAndTimeLogin(driverDetail.loginTime, driverDetail.driveroffset ? driverDetail.driveroffset : 0) : "",
          cards: [

          ]
        })
      })
      data.lanes = lanes
      this.setState({driversList, drivers: drivers, data: data, driverSelect: driverSelect }, () => {
        const self = this
        if(this.state.dragged) {
          setTimeout(function() {
            self.updateOrder()
            self.setState({ dragged: false })
          }, 100)
        } else {
          self.updateOrder()
        }
      })
    })
  }

  getTodayDate(user) {
    const todayDateInISO = new Date()
    const offset = user && user.timezone && user.timezone.tzName ? user.timezone.offset: todayDateInISO.getTimezoneOffset()
    const timezone = user && user.timezone && user.timezone.tzName ? user.timezone.tzName: Intl.DateTimeFormat().resolvedOptions().timeZone
    let today = new Date()
    const clientoffset = today.getTimezoneOffset()
    const utc = today.getMinutes() + parseInt(clientoffset)
    //const hoursFromMinutes = parseInt(utc/60)
    today.setMinutes(today.getMinutes() + parseInt(clientoffset))
    //const newminutes = today.getMinutes() - parseInt(offset)
    //const hoursFromMinutesOffset = parseInt(offset/60)
    today.setMinutes(today.getMinutes() + offset)
    today = moment(today).tz(timezone).format('MM/DD/YYYY')
    return today
  }
  onFocus() {
    // if(!socketStatus){
    //   location.reload();
    // }
  }

  getFormatedDateAndTimeLogin(input , driveroffset) {
    if(input !== null && input !== "" && input !== undefined) {
      const newdate = new Date()
      const clientoffset = newdate.getTimezoneOffset()
      driveroffset = parseInt(driveroffset)
      if(driveroffset === 0) {
        driveroffset = clientoffset
      }
      const dateStr = input.split("T")[0];
      const timeStr = input.split("T")[1];
      const dateArr = dateStr.split('-');
      const timeArr = timeStr.split(":")
      let created = new Date(dateArr[0], (dateArr[1] - 1), dateArr[2], timeArr[0], timeArr[1])
      const hoursFromMinutes = (driveroffset/60)
      created.setMinutes(created.getMinutes() + driveroffset)
      let timezone = this.props.user && this.props.user.timezone && this.props.user.timezone.tzName ? this.props.user.timezone.tzName : Intl.DateTimeFormat().resolvedOptions().timeZone
      const offset = moment.tz(moment(), timezone).utcOffset()
      created.setMinutes(created.getMinutes() + offset)
      return  moment(created).format('hh:mm A')
    }
  }
  setLocalNotifications(event, data, message) {
    let newNotification = this.formatNotification(event, data, message)
    let notifications = localStorage.getItem('notifications');
    if(notifications) {
      notifications = (notifications && notifications.length > 0) ? JSON.parse(notifications) : [];
    } else {
      notifications = []
    }
    notifications.unshift(newNotification);
    localStorage.setItem('notifications', JSON.stringify(notifications))
  }
  getUpdatedDrivers() {
    this.apiCallfunction()
    // const { getDriver } = this.props
    // getDriver({date: this.state.filterDate})
  }
  formatNotification(event, data, message){
    return {
        is_viewed:false,
        event:event,
        data:data,
        message:message,
        date: new Date().toISOString(),
        show_id: event + '-' + data.id,
        id:data.id
      }
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
      this.updateOrder()
    })
  }

  handleDateChange(newdate) {
    const date = moment(newdate).format('MM/DD/YYYY')
    const timezone = this.state.user && this.state.user.timezone && this.state.user.timezone.tzName ? this.state.user.timezone.tzName: Intl.DateTimeFormat().resolvedOptions().timeZone
    const offset = moment.tz(moment(), timezone).utcOffset()
    const obj = {
      date: date,
      offset:String(offset),
      All: false
    }
    this.setState({ filterDate: newdate}, ()=>{
      this.getOrders()
      this.apiCallfunction()
    })
    // const { getOrder, getDriver } = this.props
    // getOrder(obj)
    // getDriver({date: date})
  }

  getFormatedDateAndTime(input, completedoffset) {
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

  getFormatedDateAndTimeMessage(input, completedoffset, type) {
    if(input !== null && input !== undefined && input !== "") {
      const newdate = new Date()
      const clientoffset = newdate.getTimezoneOffset()
      //if(completedoffset === undefined && completedoffset === 0) {
        completedoffset = clientoffset
      //}
      const dateStr = input.split("T")[0];
      const timeStr = input.split("T")[1];
      const dateArr = dateStr.split('-');
      const timeArr = timeStr.split(":")
      let created = new Date(dateArr[0], (dateArr[1] - 1), dateArr[2], timeArr[0], timeArr[1])
      const utc = created.getMinutes() + parseInt(completedoffset)
      const hoursFromMinutes = (utc/60)
      //created.setMinutes(created.getMinutes() + parseInt(completedoffset))
      const timezone = this.props.user && this.props.user.timezone && this.props.user.timezone.tzName ? this.props.user.timezone.tzName: Intl.DateTimeFormat().resolvedOptions().timeZone
      const offset = moment.tz(moment(), timezone).utcOffset()
      let hoursFromMinutesOffset = (offset/60)
      created.setMinutes(created.getMinutes() + offset)
      if(type === "time") {
        return  moment(created).format('hh:mm a')
      } else {
        return  moment(created).format('MM-DD-YYYY')
      }
    }
  }

  updateOrder() {
    const { updateJobIndex } = this.props
    const { drivers, driverSelect, truck, orders } = this.state
    let data = this.state.data
    _.forEach(data.lanes, (lane) => {
      lane.cards = []
    })
    const rucks = truck
    let unassignedTasks = []
    let unassignedJobs = []
    let jobindexArr = []
    if(orders && orders.length !== 0) {
      let entireCollection = orders.tasks.concat(orders.jobs)
      if(entireCollection.length > 0 ) {
        entireCollection.sort(function(obj1, obj2){
          return (new Date(obj1.updatedAt) > new Date(obj2.updatedAt) ? 1 : (new Date(obj1.updatedAt) < new Date(obj2.updatedAt) ? -1: 0));
        })
      }
      if(entireCollection.length > 0 ) {
        for(var j = 0; j < entireCollection.length; j++ ) {
          const singleJobObject = entireCollection[j];
          let driverIndex = _.findIndex(drivers, function(d) {
            return String(d.id) === String(singleJobObject.driverId)
          })
          let obj = {}
          if(singleJobObject.type === "task") {
             obj = {
                index: singleJobObject.index ? singleJobObject.index : 0,
                id: singleJobObject.id,
                title: singleJobObject.taskName,
                type: "task",
                description: singleJobObject.description,
                laneId: singleJobObject.driverId ? singleJobObject.driverId : "",
                assigned: singleJobObject.assigned,
                incompleted_by: singleJobObject.incompleted_by,
                completedAt: this.state.user && this.state.user.timezone ? this.getFormatedDateAndTime(singleJobObject.completedAt, singleJobObject.completedoffset) : this.getFormatedDateAndTime(singleJobObject.completedAt, singleJobObject.completedoffset),
                completedAtFull: singleJobObject.completedAt,
                status: singleJobObject.status,
                //draggable: true,
                draggable: true,
                oncardclick: () => this.cardClick(singleJobObject.id),
                manualMove: (obj) => this.manualMove(obj),
                createLabel: (obj) => this.props.createLabel(obj),
                deleteLabel: (obj) => this.props.deleteLabel(obj),
                updateLabel: (obj) => this.props.updateLabel(obj),
                getLabel: () => this.props.getLabel(),
                labels: this.state.labels,
                truckid: singleJobObject.truck_id,
                driver: singleJobObject.driverId,
                unableToComplete: (id) => this.unableToComplete(id),
                trucks: this.state.trucks,
                drivers: this.state.driverSelect,
                orders: this.state.orders,
                assignLabel: this.props.assignLabel,
                cardlabels: singleJobObject.labels,
                createLabelPhase:this.props.createLabelPhase,
                getLabelPhase:this.props.getLabelPhase,
                updateLabelPhase:this.props.updateLabelPhase,
                deleteLabelPhase:this.props.deleteLabelPhase,
                assignLabelPhase: this.props.assignLabelPhase,
                getOrder : () => this.getOrders(),
                getLocation: this.props.getLocation,
                apiCallfunction : () => this.apiCallfunction(),
                clearPhaseLabel: () => this.props.clearPhaseLabel,
                createLabelData: this.props.createLabelData,
                newlabel: this.props.newlabel,
                isQueueOrder: singleJobObject.isQueueOrder,
                orderIndex: singleJobObject.orderIndex
             }
          } else {
              let address = singleJobObject.new_address
              address = address.replace(', USA', ' ')
              if(singleJobObject.city !== "") {
                address = `${address}, ${singleJobObject.city}`
              }
              if(singleJobObject.state !== "") {
                address = `${address}, ${singleJobObject.state}`
              }
              if(singleJobObject.zipcode !== "") {
                address = `${address} ${singleJobObject.zipcode}`
              }
              // if(singleJobObject.borough !== "") {
              //   address = `${address} - ${singleJobObject.borough}`
              // }
              // if(singleJobObject.neighborhood !== "") {
              //   address = `${address} - ${singleJobObject.neighborhood}`
              // }
              obj = {
                index: singleJobObject.index,
                id: singleJobObject.id,
                title: singleJobObject.companyname,
                type: singleJobObject.type,
                duedate: singleJobObject.deliveryDate,
                description: address,
                borough: _.get(singleJobObject, 'borough', ''),
                neighborhood: _.get(singleJobObject, 'neighborhood', ''),
                laneId: singleJobObject.driverId ? singleJobObject.driverId : "",
                jobStatus: singleJobObject.jobStatus,
                status: singleJobObject.status,
                container: singleJobObject.container,
                assigned: singleJobObject.assigned,
                incompleted_by: singleJobObject.incompleted_by,
                completedAt: this.state.user && this.state.user.timezone ? this.getFormatedDateAndTime(singleJobObject.completedAt, singleJobObject.completedoffset) : this.getFormatedDateAndTime(singleJobObject.completedAt, singleJobObject.completedoffset),
                completedAtFull: singleJobObject.completedAt,
                getLocation: this.props.getLocation,
                truck_number: singleJobObject.truck_number,
                truckid: singleJobObject.truck_id,
                driver: singleJobObject.driverId,
                oncardclick: () => this.cardClick(singleJobObject.id),
                //draggable: true,
                draggable: true,
                manualMove: (obj) => this.manualMove(obj),
                createLabel: (obj) => this.props.createLabel(obj),
                updateLabel: (obj) => this.props.updateLabel(obj),
                deleteLabel: (obj) => this.props.deleteLabel(obj),
                getLabel: () => this.props.getLabel(),
                unableToComplete: (id) => this.unableToComplete(id),
                trucks: this.state.trucks,
                drivers: this.state.driverSelect,
                orders: this.props.orders,
                truck: this.props.trucks,
                labels:this.state.labels,
                createLabelPhase:this.props.createLabelPhase,
                getLabelPhase:this.props.getLabelPhase,
                updateLabelPhase:this.props.updateLabelPhase,
                deleteLabelPhase:this.props.deleteLabelPhase,
                assignLabelPhase: this.props.assignLabelPhase,
                assignLabel: this.props.assignLabel,
                cardlabels: singleJobObject.labels,
                getOrder : () => this.getOrders(),
                apiCallfunction : () => this.apiCallfunction(),
                clearPhaseLabel: () => this.props.clearPhaseLabel,
                createLabelData: this.props.createLabelData,
                newlabel: this.props.newlabel,
                isQueueOrder: singleJobObject.isQueueOrder,
                orderIndex: singleJobObject.orderIndex
          }
        }
            if(singleJobObject.status === "completed" || singleJobObject.status === "inprogress") {
              obj.draggable = false
            }
            const timezone = this.state.user && this.state.user.timezone ? this.state.user.timezone.tzName : Intl.DateTimeFormat().resolvedOptions().timeZone
            let today = moment().tz(timezone).format('YYYY-MM-DD')
            let filterDate = moment(this.state.filterDate).format('YYYY-MM-DD')
            today = new Date(today)
            filterDate = new Date(filterDate)
            today.setHours(0, 0, 0, 0)
            filterDate.setHours(0, 0, 0, 0)
            if(today > filterDate) {
              obj.draggable = false
            }
            if(singleJobObject.status !== "unassigned") {
              obj.index = singleJobObject.index ? singleJobObject.index : 0
            }
          // if(laneIndex === -1) {
          //   laneIndex = 0
          // }
          // let isExists = _.findIndex(data.lanes[laneIndex].cards, function(card) {
          //   return String(card.id) === String(task.id)
          // })
          //console.log('driverIndex', driverIndex)
          if(singleJobObject.status === "completed") {
            if(driverIndex !== -1) {
              drivers[driverIndex].completed.push(obj)
            }
          } else if(singleJobObject.status === "inprogress") {
            if(driverIndex !== -1) {
              drivers[driverIndex].inprogress.push(obj)
            }
          } else if(singleJobObject.status === "pending") {
            if(driverIndex !== -1) {
              drivers[driverIndex].pending.push(obj)
            }
          } if(singleJobObject.status === "unassigned") {
            obj.laneId = "sortable"
            if(obj.type === "task") {
              unassignedTasks.push(obj)
            } else {
              unassignedJobs.push(obj)
            }
          }
        }
      }

      unassignedTasks = unassignedTasks.sort(function(order1, order2) {
        return (order1.index - order2.index);
      })
      unassignedJobs = unassignedJobs.sort(function(order1, order2) {
        return (order1.index - order2.index);
      })
      data.lanes[0].cards = unassignedTasks.concat(unassignedJobs)
      drivers.forEach(function(d) {
        let laneIndex = _.findIndex(data.lanes, function(lane) {
          return String(lane.id) === String(d.id)
        })
        let completeCards = d.completed
        completeCards = completeCards.sort(function(order1, order2) {
          return (order1.index - order2.index);
        });
        completeCards = completeCards.sort(function(order1, order2) {
          return new Date(order1.completedAtFull) - new Date(order2.completedAtFull);
        });
        let inprogressCards = d.inprogress
        inprogressCards = inprogressCards.sort(function(order1, order2) {
          return (order1.index - order2.index);
        });
        let pendingCards = d.pending
        pendingCards = pendingCards.sort(function(order1, order2) {
          return (order1.index - order2.index);
        });
        let cards = completeCards.concat(inprogressCards)
        cards = cards.concat(pendingCards)
        // cards = cards.sort(function(order1, order2) {
        //   return (order1.index - order2.index);
        // });
        data.lanes[laneIndex].cards = cards

      })

      this.setState({ data: data }, () => {

      })
      this.forceUpdate()
    }
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  unableToComplete(id) {
    this.setState({ dragged: true })
    const objId = {
      jobId: id
    }
    const {incompleteJob} = this.props
    incompleteJob(objId)
    this.getOrders()
    this.apiCallfunction()
  }

  laneClick(laneId)  {
    if(laneId === "sortable") {
      this.openAddTaskModal()
    } else {
      let editDriver = _.find(this.state.driverData, function(dr) {
        return dr.id === laneId
      })
      if(editDriver) {
        const timezoneoptionsIndex = _.findIndex(timezoneoptions, (time) => {
          return String(time.name) === String(_.get(editDriver,'timezone.name',''))
        })
        this.setState({
          addDriverModal: true,
          driverModalText: "Driver Information",
          editDriverId: editDriver.id,
          name: editDriver.name,
          lastname: editDriver.lastName,
          status: editDriver.status,
          phone: editDriver.phone,
          tabletId: editDriver.tabletId,
          tzone:_.get(editDriver,'timezone.name',''),
          timezoneoptionsIndex: timezoneoptionsIndex,
          license: editDriver.driverLicenseNo,
          email: editDriver.email
        })
      }
    }
  }

  handleChange(e) {
    if(e.target.name === "tabletId") {
      if(e.target.value.length <= 3) {
        this.setState({ [e.target.name] : e.target.value}, () => {
          if(this.state.saveClicked === true) {
            this.validate()
          }
        })
      }
    } else {
      this.setState({ [e.target.name] : e.target.value}, () => {
        if(this.state.saveClicked === true) {
          this.validate()
        }
      })
    }
  }

  handleDragEnd(cardId, sourceLaneId, targetLaneId, position, cardDetails) {
    let self = this
    let jobDate = moment(this.state.filterDate).format("MM/DD/YYYY")
    this.setState({sourceLaneId})
    const timezone = this.props.user && this.props.user.timezone ? this.props.user.timezone.tzName : Intl.DateTimeFormat().resolvedOptions().timeZone
    const offset = moment.tz(moment(), timezone).utcOffset()
    if(cardDetails.draggable === false) {
      return false
    } else {

      if(targetLaneId === "sortable") {
        if(sourceLaneId !== "sortable") {
          setTimeout(function() {
            const jobIndexArr = self.updatedJobPriorityIndex()
          const obj = {
            assigned: targetLaneId === "sortable"  ? false : true,
            offset: offset,
            driverId: targetLaneId === "sortable" ? "" : targetLaneId,
            jobDate: jobDate, //moment().utc(),
            jobId: cardId,
            truck_id: "",
            truck_number: "",
            type: cardDetails.type,
              indexList: jobIndexArr
          }
            self.assignTask(obj)
          }, 500);
        }
      } else {
        if(cardDetails.type === "task") {
          setTimeout(function() {
            const jobIndexArr = self.updatedJobPriorityIndex()
          const obj = {
            assigned: targetLaneId === "sortable"  ? false : true,
            driverId: targetLaneId === "sortable" ? "" : targetLaneId,
            jobDate: jobDate, //moment().utc(),
            offset: offset,
            jobId: cardId,
            truck_id: "",
            truck_number: "",
            type: cardDetails.type,
              indexList: jobIndexArr
          }
            self.assignTask(obj)
          }, 500);
        } else {
          this.getOrderDetail(cardId, 'false')
          // const {getOrderDetail} = this.props
          // getOrderDetail(cardId)
          this.setState({ orderInformationModal: false, activeTab: "1", cardclick: false, showMessage: false}) //, currentobj: cardDetails, truckid: (cardDetails.assigned === true ? ((cardDetails.truck_number  === null || cardDetails.truck_number  === "" || cardDetails.truck_number  === undefined) ? "select" : cardDetails.truck_number) : "select")})
          this.setState({cardId, sourceLaneId, targetLaneId, position, cardDetails , orderInformationModal: false})
        }
      }
      this.setState({ dragged: true })
    }
  }

  getOrderDetail =async(id, cardclicked)=> {
    const {getOrderDetail, getMessage} = this.props
    let {value} = await getOrderDetail(id)
    if (value.type === 'success') {
      let orderDetail = value.data
      let value2 = await getMessage(value.data.orderId)
      this.setState({ orderDetail: value.data, orderInformationModal: true, activeTab: "1", messages: _.get(value2.value, 'data', [])  })
      const _center = {lat: _.get(orderDetail, 'geoLocation.lat', ''), lng: _.get(orderDetail, 'geoLocation.lng', '')}
      this.setState({
        currentobj: {
          id: orderDetail.id,
          status: orderDetail.orderStatus,
          jobStatus: orderDetail.jobStatus,
          container: _.get(orderDetail, 'container.size', ''),
          labels: _.get(orderDetail, 'labels', ''),
          completedoffset: _.get(orderDetail, 'completedoffset', 0)
        },
        truckid: orderDetail.orderStatus !== "unassigned" ? (orderDetail.truck_number  === null || orderDetail.truck_number  === "" || orderDetail.truck_number  === undefined) ? "" : orderDetail.truck_number : ""
      })
      if(cardclicked === true) {
        this.props.history.push(`/order/${orderDetail.orderId}`)
      }
      this.setState({
        orderInformationModal: true, activeKey: "1", accessibility: orderDetail.accessibility ? orderDetail.accessibility : "" , items: (orderDetail.image ? orderDetail.image.attachedImage : []), center: _center, manualaccessibility: orderDetail ? orderDetail.manualaccessibility : ""
      })
    }
  }

  assignTask = async (obj) => {
    const {assignDriver} = this.props
    let value2 = await assignDriver(obj)
    this.setState({ orderInformationModal: false, activeTab: "1", dragged: false })
    this.apiCallfunction()
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
      status: '',
      driverModalText: "New Driver",
      timezoneoptionsIndex: 0,
      driverError: ""
    })
  }

  hideDriverModal() {
    this.setState({
      addDriverModal: false
    })
  }

  openAddTaskModal() {
    this.setState({addTaskModal : true, taskModalText: "New Task", taskname: "", taskEditId: "", description: "", errTask: "" })
  }

  hideAddTaskModal() {
    this.setState({taskInformation: false, addTaskModal : false, taskModalText: "New Task", taskname: "", taskEditId: "", description: "", errTask: "" })
  }

  validate() {
    let errObj = {}
    const { email, lastname, name, phone, tabletId, status,  err } = this.state
    // if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false) {
    //   errObj.email = "Please enter a valid email address"
    // }
    // if(email === "") {
    //   errObj.email = "Email is required"
    // }
    if(name.length < 3) {
      errObj.name = "Please enter atleast 3 characters"
    }
    // if(lastname.length < 2) {
    //   errObj.lastname = "Please enter atleast 2 characters"
    // }
    // if(lastname === "") {
    //   errObj.lastname = "This field is required"
    // }
    if(name === "") {
      errObj.name = "First name is required"
    }
    if(status === "") {
      errObj.status = "Status is required"
    }
    if(phone === "") {
      errObj.phone = "Cell Phone number is required"
    }
    const phonelength = phone.replace(/[^0-9]/g,"").length
    if(phonelength !== 10) {
      errObj.phone = "Please enter exactly 10 digit number"
    }
    if(tabletId === "") {
      errObj.tabletId = "Tablet ID is required"
    }
    this.setState({ err: errObj })
  }

  updateHauler = async() => {
    const { updateJobIndex } = this.props
    let arr =  this.state.driversList
    //localStorage.setItem('lanesArr', JSON.stringify(arr))
    let data = {
      arr : arr,
      sortedsrivers: true,
      haulerid: this.state.haulerId
    }
    let { value } = await updateJobIndex(data)
  }

  saveDriver = async() => {
    this.setState({ saveClicked : true })
    await this.validate()
    const {err, email} = this.state
    const { addDriver, updateDriver } = this.props
    if(Object.keys(err).length === 0) {
      if(this.state.editDriverId === "") {
        const obj ={
          driverLicenseNo: this.state.license,
          email: email && email.toLowerCase(),
          lastName: this.state.lastname,
          name: this.state.name,
          phone: formatPhoneNumber(this.state.phone),
          tabletId: this.state.tabletId,
          timezone: this.state.timezone,
          haulerId: this.state.haulerId,
          status: this.state.status === "true" || this.state.status === true ? true : false
        }
        try {
          let { value } = await addDriver(obj)
          let driversList = this.state.driversList //localStorage.getItem('lanesArr') ? JSON.parse(localStorage.lanesArr) : []
          driversList.push({name: value.data.name, id: value.data.id, loginTime: ""})
          //localStorage.setItem('lanesArr', JSON.stringify(driversList))
          this.setState({ addDriverModal: false, editDriverModal: false, driverError: '', driversList, driversListData: driversList }, () => {
            this.updateHauler()
            this.apiCallfunction()
          })
        } catch(e) {
          this.setState({ driverError:e.error.message })
          message.error(e.error.message)
        }

      } else {
        const obj ={
          driverLicenseNo: this.state.license,
          email: email && email.toLowerCase(),
          lastName: this.state.lastname,
          name: this.state.name,
          phone: formatPhoneNumber(this.state.phone),
          tabletId: this.state.tabletId,
          timezone: this.state.timezone,
          id: this.state.editDriverId,
          haulerId: this.state.haulerId,
          oldHaulerId: this.state.haulerId,
          status: this.state.status === "true" || this.state.status === true ? true : false
        }
        try {
          let { value } = await updateDriver(obj)
          let driversList = this.state.driversList//localStorage.getItem('lanesArr') ? JSON.parse(localStorage.lanesArr) : []
          let editIndex = _.findIndex(driversList, function(driver) {
            return String(driver.id) === String(value.data.id)
          })
          if (editIndex > -1) {
            driversList[editIndex].name = value.data.name
          }
          //localStorage.setItem('lanesArr', JSON.stringify(driversList))
          this.setState({ addDriverModal: false, editDriverModal: false, driverError: '', driversList, driversListData: driversList }, () => {
            this.updateHauler()
            this.apiCallfunction()
          })
        } catch(e) {
          this.setState({ driverError: _.get(e, 'error.message', '') })
          message.error(_.get(e, 'error.message', ''))
        }

      }
    }
  }

  editDriver() {
    this.setState({ editDriverModal:false, addDriverModal: true, driverModalText: "Driver Information" , driverError: ""})
  }

  deleteDriverConfirmation() {
    this.setState({ deleteDriverConfirmation: true })
  }

  closeDriverModal() {
    this.setState({ addDriverModal: false,tzone: '',timezone: '', editDriverModal: false, editDriverId: "",
  })
  }

  closeDeleteModal() {
    this.setState({ deleteDriverConfirmation: false, deleteSuccessModal: false, editDriverId: "" })
  }

  confirmDelete = async() => {
    let id = this.state.orderId
    let { value } = await this.props.deleteOrder(id)
    message.success('successfully deleted')
    this.fetchOrders()
    this.closeModal()
  }

  closeDeleteModalTask() {
    this.setState({ deleteTaskConfirmation: false })
  }

  deleteDriver = async()=> {
    const {deleteDriver} = this.props
    const obj = {
      driverId: this.state.editDriverId
    }
    try {
      let { value } = await deleteDriver(obj)
      let driversList = this.state.driversList//localStorage.getItem('lanesArr') ? JSON.parse(localStorage.lanesArr) : []
      let removeIndex = _.findIndex(driversList, function(driver) {
        return String(driver.id) === String(value.data.id)
      })
      if (removeIndex > -1) {
        driversList.splice(removeIndex, 1);
      }
      //localStorage.setItem('lanesArr', JSON.stringify(driversList))
      this.setState({ deleteSuccessModal: false, addDriverModal: false, deleteDriverConfirmation: false, editDriverModal: false, driversList, driversListData: driversList}, () => {
        this.apiCallfunction()
        this.updateHauler()
      })
    } catch (e) {
      if (_.get(e.error, 'statusCode', '') === 403) {
        this.setState({ deleteSuccessModal: false, addDriverModal: false, deleteDriverConfirmation: false, editDriverModal: false}, ()=>{
          message.success("Driver can't be deleted because a job is assigned")
        })
      }
    }

  }

  handleChangeTask(e) {
    if(e.target.name === "taskname") {
      if(e.target.name === "") {
        this.setState({ errTask: "This field is required" })
      } else {
        this.setState({ errTask: "" })
      }
    }
    this.setState({ [e.target.name] : e.target.value})
  }

  saveTask =async()=> {
    const { errTask } = this.state
    let err = ""
    if(this.state.taskname.trim() === "") {
      err =  "Task name is required"
    }
    if(err === "") {
      if(this.state.taskEditId === "") {
        const { addTask } = this.props
        const today = new Date()
        const obj = {
          description: this.state.description,
          jobDate:moment(this.state.filterDate).format('MM/DD/YYYY'),
          offset: today.getTimezoneOffset(),
          taskName: this.state.taskname,
          haulerId: this.state.haulerId
        }
        let { value } = await addTask(obj)
        this.apiCallfunction()
        this.hideAddTaskModal()
      } else {
        const { updateTask } = this.props
        const obj = {
          description: this.state.description,
          taskName: this.state.taskname,
          taskId: this.state.taskEditId
        }

        let { value } = await updateTask(obj)
        this.apiCallfunction()
        this.hideAddTaskModal()
      }
    } else {
      this.setState({ errTask: err })
    }
  }

  cardClick = async(info) => {
    const orders = this.state.orders
    let findType = _.findIndex(orders.jobs, function(job) {
      return String(job.id) === String(info)
    })
    let type = ""
    let object = {}
    if(findType !== -1) {
      type = "job"
      object = this.state.orders.jobs[findType]
      // const {getOrderDetail} = this.props

      this.getOrderDetail(object.id, true)
      //this.props.history.push('/order/')
      this.setState({ orderInformationModal: false, activeTab: "1", cardclick: true, targetLaneId: object.driverId }) //, currentobj: object, targetLaneId: object.driverId, truckid: (object.truck_number  === null || object.truck_number  === "" || object.truck_number  === undefined) ? "select" : object.truck_number })
    } else {
      findType = _.findIndex(orders.tasks, function(job) {
        return String(job.id) === String(info)
      })
      type = "task"
      object = this.state.orders.tasks[findType]
      this.setState({ taskInformation: true, taskname: object.taskName, targetLaneId: object.driverId, description: object.description, taskEditId: object.id, task: object })
    }
  }

  openEditTask() {
    this.setState({ addTaskModal: true, taskModalText: "Edit Task", taskInformation: false})
  }

  openDeleteTask() {
    this.setState({ deleteTaskConfirmation: true, taskInformation: false })
  }

  driverPhotos(index) {
    const { orderDetail } = this.state
    let urls = _.cloneDeep(_.get(orderDetail, 'image.attachedImage', []))
    // let urls = ['https://i.imgur.com/7nbAJ0C.jpg', 'https://i.imgur.com/pgCzueK.jpg', 'https://i.imgur.com/d5aiXJP.jpg']
    const valSelect = [urls[index]]
    urls.splice(index, 1)
    const arrayFinal = valSelect.concat(urls)
    this.setState({ driverPhotos: true, photoIndex: index, carouselItems: arrayFinal }, () => {
      this.forceUpdate()
    })
  }

  deleteTask = async ()=> {
    const { deleteTask } = this.props
    const obj = {
      taskId: this.state.taskEditId
    }
    await deleteTask(obj)
    this.apiCallfunction()
    this.closeTaskModal()
  }

  closeTaskModal() {
    this.setState({ taskInformation: false, driverPhotos: false, deleteModelIsOpen: false })
  }

  moveOrder() {
    const jobIndexArr = this.updatedJobPriorityIndex()
    let jobDate = moment(this.state.filterDate).format("MM/DD/YYYY hh:mm")
    const { orders, orderDetail } = this.state
    const timezone = this.props.user && this.props.user.timezone ? this.props.user.timezone.tzName : Intl.DateTimeFormat().resolvedOptions().timeZone
    const offset = moment.tz(moment(), timezone).utcOffset()
    const {truckid} = this.state
    let trucknumber = _.find(this.state.truck, function(truck) {
      if(truck.name === truckid) {
        return truck
      }
    })
    const obj = {
      assigned: this.state.targetLaneId === "sortable"  ? false : true,
      driverId: this.state.targetLaneId === "sortable" ? "" : this.state.targetLaneId,
      jobDate: jobDate, //moment().utc(),
      offset: offset,
      jobId: orderDetail.id,
      truck_id: (trucknumber ? trucknumber.id : ""),
      truck_number: (trucknumber ? trucknumber.name : ""),
      type: "job",
      indexList: jobIndexArr
    }
    this.assignTask(obj)
  }

  closeInformationModal() {
    this.setState({ orderInformationModal: false, activeTab: "1", dragged: false })
    this.componentDidMount()
    //this.getOrders()
    //this.apiCallfunction()
    //this.updatedJobPriorityIndex()

    this.props.history.push('/dispatcher')
  }

  handleSelectChange(value) {
    this.setState({ truckid: value.target.value })
  }

  handleSelectChangeAccess(e) {
    this.setState({ accessibility: e.target.value })
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
      var getOrderDetail = this.props.getOrderDetail;
      getOrderDetail(data.data.id, false);
      const order = _.find(this.props.orders.jobs, function(order) {
        return String(order.id) === String(data.data.id)
      })
      if(order) {
        this.setState({ orderInformationModal: false, activeTab: "1", cardclick: true}) //, currentobj: order, targetLaneId: order.driverId, truckid: (order.truck_number  === null || order.truck_number  === "" || order.truck_number  === undefined) ? "select" : order.truck_number, accessibility: order.accessibility ? order.accessibility: "", manualaccessibility: order.manualaccessibility ? order.manualaccessibility : "" });
      }
    }
    if(data.event === "new_task" || data.event === "update_task") {
      const task = _.find(this.props.orders.tasks, function(job) {
        return String(job.id) === String(data.data.id)
      })
      if(task) {
        this.setState({ taskInformation: true, taskname: task.taskName, description: task.description, taskEditId: task.id, task: task })
      }
    }
    this.componentDidMount(false)
  }

  messageTabClicked = async() => {
    this.toggle('2')
    const {getMessage} = this.props
    const value2 = await getMessage(this.props.orderDetail && this.props.orderDetail.orderId)
    if(value2) {
      this.setState({ messages: _.get(value2.value, 'data', []) })
    }
  }

  downloadInvoice = async(id) => {
    this.setState({receiptid: id}, async() => {
      try {
        let { value } = await this.props.downloadReceipt(id)
        if(value.type=== 'success') {
          const invoiceUrl = value.data.invoiceUrl
          this.setState({isLoaderInit: false, receiptid: ""})
          window.open(invoiceUrl);
        } else {
          this.setState({isLoaderInit: false, receiptid: ""})
          alert(value.data && value.data.message)
        }

      } catch(error) {
        this.setState({ receiptid: "" })
        alert('Somthing went wrong in receipt fetching.')
       return false;
      }
    });
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    const {items} = this.state
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    const {items} = this.state
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  handleDragStart(cardId, laneId) {
    return false
  }

  manualMove(text) {
    const jobIndexArr = this.updatedJobPriorityIndex()
    let jobDate = moment(this.state.filterDate).format("MM/DD/YYYY")
    const timezone = this.props.user && this.props.user.timezone ? this.props.user.timezone.tzName : Intl.DateTimeFormat().resolvedOptions().timeZone
    const offset = moment.tz(moment(), timezone).utcOffset()
    const truckname = _.find(this.state.truck.length !== 0 && this.state.truck, function(tr) {
      return String(tr.name) === String(text.truck)
    })
    var last_element = jobIndexArr[jobIndexArr.length - 1];
    jobIndexArr.push({
      index: (last_element.index + 1),
      jobId: text.id
    })

    const obj = {
      assigned: text.driver === "select"  ? false : true,
      driverId: text.driver === "select" ? "" : text.driver,
      jobDate: jobDate, //moment().utc(),
      offset: offset,
      jobId: text.id,
      truck_id: text.truck === "select" ? "" : truckname && truckname.id,
      truck_number: text.truck === "select" ? "" : truckname && truckname.name,
      type: text.type,
      indexList: jobIndexArr
    }
    this.assignTask(obj)
  }

  updatedJobPriorityIndex() {
    //const { updateJobIndex } = this.props
    let unassignedIds = []
    let completedIds = []
    let inprogressIds = []
    let pendingIds = []
    let jobIds = []
    let jobindexArr = []
    let laneData = this.state.laneNewData
    if(laneData && laneData.lanes.length > 0) {
      _.forEach(laneData.lanes, function(lane) {
        _.forEach(lane.cards, function(card) {
          if(card.status === "completed") {
            completedIds.push(card.id)
          } else if(card.status === "inprogress") {
            inprogressIds.push(card.id)
          } else if(card.status === "pending" || card.status === "unassigned" && card.laneId !== "sortable") {
            pendingIds.push(card.id)
          } else if(card.status === "unassigned") {
            unassignedIds.push(card.id)
          }
        })
      })
      jobIds = completedIds.concat(inprogressIds)
      jobIds = jobIds.concat(pendingIds)
      jobIds = jobIds.concat(unassignedIds)
    }

    if(jobIds.length > 0) {
      jobIds.forEach(function(id, index) {
        jobindexArr.push({
          index: index,
          jobId: id
        })
      })
      // unassignedIds.forEach(function(id, index) {
      //   jobindexArr.push({
      //     index: index,
      //     jobId: id
      //   })
      // })
      // if(jobindexArr.length > 0) {
      //   updateJobIndex({indexList: jobindexArr})
      // }
    }
    return jobindexArr
  }

  openDeleteModal() {
    this.setState({ deleteModelIsOpen: true })
  }

  laneSortFunction(newData) {
    this.setState({ laneNewData: newData })
  }

  getFormatedDate(ddate) {
    var orderDeliveryDateOnly = ""
    if(ddate) {
      var orderDeliveryDate = new Date(ddate)
      orderDeliveryDateOnly = String(orderDeliveryDate.getUTCMonth()+1)+'-'+String(orderDeliveryDate.getUTCDate())+'-'+String(orderDeliveryDate.getUTCFullYear());
    }
    return orderDeliveryDateOnly
  }

  getFormatedDateConnected(ddate) {
    var orderDeliveryDateOnly = ddate + "T00:00:00.000Z"
    if(ddate) {
      var orderDeliveryDate = new Date(ddate)
      orderDeliveryDateOnly = String(orderDeliveryDate.getUTCMonth()+1)+'-'+String(orderDeliveryDate.getUTCDate())+'-'+String(orderDeliveryDate.getUTCFullYear());
    }
    return orderDeliveryDateOnly
  }

  clickOrder(id) {
    this.laneClick(id)
  }

  closeModal() {
    this.setState({ deleteModelIsOpen: false})
  }

  laneHeader(obj) {
    const self = this
    const clienttimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const clientDate = moment().tz(clienttimezone).format('MM-DD-YYYY')
    let timezone = this.state.user && this.state.user.timezone && this.state.user.timezone.tzName ? this.state.user.timezone.tzName : Intl.DateTimeFormat().resolvedOptions().timeZone
    return (
      <div className="laneHeader">
        {obj.id === "sortable" ?
        obj.label === "true" ? <header className="card__header" >
          <button className="btn btn-dark btn-addtask w-100" onClick={self.clickOrder.bind(self, obj.id)} >Add Task</button>
        </header> : "" :
        <header className="card__header">
            <button className="btn card__btn w-100" onClick={self.clickOrder.bind(self, obj.id)}>{obj.title} <div><span className="font14">Driver Start Time:</span><span className="driver-time">{obj.label !== "" && obj.label !== undefined ? `${obj.label}` : clientDate <= moment(this.state.filterDate).format('MM-DD-YYYY') ? "Not started today" : "N/A" }</span></div></button>
        </header> }
      </div>
    )
  }

  array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
  };

   handleLaneDragEnd= async(removedIndex, addedIndex, payload)=> {
     if(addedIndex === 0) {
       this.componentDidMount()
     } else {
        const { updateJobIndex } = this.props
        let arr =  this.array_move(this.state.driverSelect, removedIndex - 1, addedIndex - 1)
        //localStorage.setItem('lanesArr', JSON.stringify(arr))
        let data = {
          arr : arr,
          sortedsrivers: true,
          haulerid: this.state.haulerId
        }
        let { value } = await updateJobIndex(data)
        this.setState({ driversList: arr, driversListData: arr} , () => {
          this.apiCallfunction()
        })

      }
  }

  saveAccessibility() {
   const data = {
     accessibility: this.state.accessibility,
     id: this.state.currentobj.id,
     manualaccessibility: this.state.accessibility === "Other: Manual entry" ? this.state.manualaccessibility : ""
    }
   const { saveAccessibility } = this.props
   saveAccessibility(data)
   this.setState({ orderInformationModal: false })
  }

  rowClick(record) {
    const orders = this.state.orders
    let object = _.find(orders.jobs, function(job) {
      return String(job.id) === String(record._id)
    })
    if(object) {
      this.setState({currentobj: object, targetLaneId: object.driverId, truckid: (object.truck_number  === null || object.truck_number  === "" || object.truck_number  === undefined) ? "select" : object.truck_number})
    }
    const {getOrderDetail} = this.props
    this.getOrderDetail(String(record._id), false)
    // getOrderDetail(String(record._id))
    this.setState({ orderInformationModal: false, activeTab: "1", cardclick: true })
  }

  rowClassName(record, index) {
    const { orderDetail } = this.props
    var className = ""
    if(orderDetail && (String(orderDetail.id) === String(record._id))) {
      className = "rowStyle"
    }
    return className;
  }

  onTimeZonechange(e){
    let ind = e.target.value;
    let obj={}
     //if(ind !== -1){
    var offset = moment.tz(moment(), timezoneoptions[ind].tzName).utcOffset()
    if(Math.sign(offset) === -1) {
      offset = Math.abs(offset)
    } else {
      offset = -offset
    }
    obj.tzName = timezoneoptions[ind].tzName
    obj.offset = offset
    obj.name = timezoneoptions[ind].name
    this.setState({tzone: timezoneoptions[ind].name ,timezone: obj, timezoneoptionsIndex: ind})
  }

  handleSelectMessageChange(event) {
    var order = this.state.orderDetail
    if(event.target.value === 'sensor_full_message') {
      this.setState({messageBox: `Hi! Your container for ${_.get(order, 'address.address', '')} ${_.get(order, 'address.borough', '')} is on its way.

To track your container please click on the link below.
<LINK>

Thanks!
The Curbside Team.

This is an automated notification, please do not reply to this message.

If you have any questions or concerns please contact us at (718) 384-6357 or hello@mycurbside.com`})
    }
  }

  sendMessage = async() => {
    let user = this.props.user ? this.props.user : {}
    const obj = {
      message: this.state.messageBox,
      orderid: _.get(this.state.orderDetail, 'orderId', ''),
      receiver: {name: _.get(this.state.orderDetail, 'contact.name', ''), phone: _.get(this.state.orderDetail, 'contact.phone', '')},
      sender: {name: user && user.user_name && user.user_name !== '' ? user.user_name : user.company_name, phone: ""},
      to_number: _.get(this.state.orderDetail, 'contact.phone', '')
    }
    let { value } = await this.props.sendMessage(obj)
    if(value) {
      const value2 = await this.props.getMessage(_.get(this.state.orderDetail, 'orderId', ''))
      if(value2) {
        this.setState({ messages: _.get(value2.value, 'data', []), messageBox: "", selected: "" })
      }
    }
  }
  closeImageSlider() {
    this.setState({ driverPhotos: false })
  }

  responsiveTabChange (e) {
    this.props.history.push(`/${e.target.value}`)
  }

  openConnectedOrders = async(order) => {
    let id = _.get(order, 'id', '')
    if(!id) {
      id = _.get(order, '_id', '')
    }

    this.getOrderDetail(id, true)
    this.changeKey("1")

  }

  changeKey(key) {
    this.setState({activeKey: key})
  }

  changeHauler () {
    this.componentDidMount()
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const currentlocation = window.location.pathname
    const options = timezoneoptions.map((time,index) => {
      return (
        <option value={index} key={index} className ="txt-clr4">{time.name}</option>
      )})
    const { data, err, photoIndex } = this.state
    const { haulers } = this.props
    const { activeIndex, orderDetail } = this.state
    const mapOptions = {
      styles: config.mapStyles,
      streetViewControl: true
    };
    const date = new Date()
    const accessibilityOptions = config.accessibilityOptions
    let items = this.state.items
    if(orderDetail) {
      items = orderDetail && orderDetail.image && orderDetail.image.attachedImage
    }
    const components = {
      LaneHeader: this.laneHeader,
      Card: Mycard
    };
    const urls = _.get(orderDetail, 'image.attachedImage', [])
      const itemsSlide = this.state.carouselItems.map((item, i) =>
      <div key={i}>
          <img src = {item} ></img>
      </div>
  )
    let env = 'local'//config.active
    let twillonumber = '+19179050605'//config.twilio_number[env]
    //console.log(moment().format('MM-DD-YYYY') === moment(this.state.filterDate).format('MM-DD-YYYY'))
    return (
      <div>
        <div className="dispatcher-wrapper overflowhide-y">
          <DispatcherTopNavigation openOrderInfo={this.getOrderDetail.bind(this)} openDriverModal={this.openDriverModal.bind(this)} haulerDetails={_.get(this.state, 'haulerDetails', '')} changeHauler={this.changeHauler.bind(this)} {...this.props} />
          {/* <Header onRef={ref => (this.child = ref)} openDriverModal={this.openDriverModal.bind(this)} viewedNotification={this.viewedNotification.bind(this)} handleDateChange={this.handleDateChange.bind(this)} {...this.props}/> */}
          <div className="main__dashboard">
            <div className="dispatcher-btn-wrapper showindesktop">
                <div className="flex-btn h-66">
                  <Link to={'/dispatcher'} className={currentlocation === "/dispatcher" ? "btn primarybtn primarybtn-active" : "btn primarybtn" }>List View</Link>
                  <Link to={'/viewmap'} className={currentlocation === "/viewmap" ? "btn primarybtn primarybtn-active" : "btn primarybtn" }>Map View</Link>
                </div>
              </div>
            <div className="col-md-12 showinmobile pt-3">
              <div className="form-group material-textfield">
              <select
                onChange={this.responsiveTabChange.bind(this)}
                className="form-control custom-select h-66">
                <option value="dispatcher">List View</option>
                <option value="viewmap">Map View</option>
              </select>
              </div>
            </div>
            <div className="dispatcher-select-wrapper dispatcher-select-wrapper-mob">
                <div className="form-group material-textfield material-textfield-select mb-0">
                  <DatePicker
                    allowClear={false}
                  className="form-control custom-select h-66 font-16 material-textfield-input for-cursur"
                    dropdownClassName="datepicker__header--popup"
                    defaultValue={moment(this.state.filterDate, dateFormat)} format={dateFormat}
                    onChange={this.handleDateChange.bind(this)}
                    suffixIcon={<img src="./img/down-arrow.png"/>}
                  />
                  {/* <select className="form-control custom-select h-66 font-16 material-textfield-input" required>
                    <option></option>
                    <option value="0" selected>06/01/2020</option>
                    <option value="0">All Time</option>
                    <option value="0">All Time</option>
                    <option value="0">All Time</option>
                  </select> */}
                <label className="material-textfield-label material-textfield-label-ant">Date </label>
                </div>
              </div>
              <div className="clearfix"></div>
            <Board
              data={data}
              //draggable={moment().format('MM-DD-YYYY') === moment(this.state.filterDate).format('MM-DD-YYYY') ? true : false}
              draggable={true}
              laneDraggable={true}
              className="board__container"
              handleDragEnd={this.handleDragEnd}
              handleDragStart={this.handleDragStart}
              clicked={this.laneClick.bind(this)}
              //onLaneClick = {this.laneClick.bind(this)}
              handleLaneDragEnd={this.handleLaneDragEnd.bind(this)}
              onDataChange={this.laneSortFunction.bind(this)}
              labels={this.state.labels}
              components={components}
            >
            </Board>
          </div>
        </div>

        <ReactModal
          isOpen={this.state.addTaskModal}
          onRequestClose={this.hideAddTaskModal.bind(this)}
          contentLabel="Add Task"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-centered">
            <div className="react-modal-header">
              <h5 className="react-modal-title">{this.state.taskModalText}</h5>
              <button type="button" className="btn react-modal-close"  onClick={this.hideAddTaskModal.bind(this)}><CloseIcon /></button>
            </div>
            <div className="divider-line"></div>
            <div className="react-modal-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group material-textfield">
                    <input className="form-control material-textfield-input" name="taskname" value={this.state.taskname} onChange={this.handleChangeTask.bind(this)} required/>
                    <p className="text-danger">{this.state.errTask}</p>
                    <label className="material-textfield-label">Name of Task <span className="text-danger">*</span></label>
                  </div>

                   <div className="form-group material-textfield material-textfield-lg">
                      <textarea
                        type="text"
                        className="form-control material-textfield-input h-150"
                        name="description"
                        value={this.state.description}
                        onChange={this.handleChangeTask.bind(this)}
                        required />
                    <label className="material-textfield-label">Description of Task</label>
                    </div>


                </div>
              </div>
              {/* <button className="btn btn-dark btn-lg w-100 font-800" onClick={this.hideAddTaskModal.bind(this)}>Cancel</button> */}
              <button className="btn btn-dark btn-lg w-100 font-800" onClick={this.saveTask.bind(this)}>Save</button>
            </div>
            </div>
        </ReactModal>

        {/* view task modal*/}

        <ReactModal
          isOpen={this.state.taskInformation}
          onRequestClose={this.closeTaskModal.bind(this)}
          contentLabel="Add Task"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-centered">
            <div className="react-modal-header">
              <h5 className="react-modal-title">Task Information</h5>
              <button type="button" className="btn react-modal-close"  onClick={this.closeTaskModal.bind(this)}><CloseIcon /></button>
            </div>
            <div className="divider-line"></div>
            <div className="react-modal-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group material-textfield">
                  <input className="form-control material-textfield-input" name="taskname" value={this.state.taskname} onChange={this.handleChangeTask.bind(this)} required/>
                    <p className="text-danger">{this.state.errTask}</p>
                    {/* <label className="material-textfield-label">Name of Task <span className="text-danger">*</span></label> */}
                  </div>
                  <div className="form-group material-textfield">
                      <textarea
                        type="text"
                        className="form-control material-textfield-input h-150"
                        name="description"
                        value={this.state.description}
                        onChange={this.handleChangeTask.bind(this)}
                        required />
                    {/* <label className="material-textfield-label">Description of task <span className="text-danger">*</span></label> */}
                    {/* <p className="text-danger">{err && err.name ? err.name : ""}</p> */}
                  </div>
                </div>
              </div>
              {/* <button className="btn btn-dark btn-lg w-100 font-800" onClick={this.hideAddTaskModal.bind(this)}>Cancel</button> */}
              {this.state.task && this.state.task.status !== "completed" ?
              <div>
              <button className="btn btn-dark btn-lg w-100 font-800" onClick={this.saveTask.bind(this)}>Save</button>
              </div> : "" }
              {this.state.task && this.state.task.status !== "completed" ?
              <div>
              <button className="btn btn-md btn-outline-danger w-100 font-800 hide-border-bg" onClick={this.openDeleteModal.bind(this)}>Delete</button>
            </div> : "" }
            </div>
          </div>

        </ReactModal>

        {/* view order moda*/}

        <ReactModal
          isOpen={this.state.orderInformationModal}
          onRequestClose={this.closeInformationModal.bind(this)}
          contentLabel="Add Task"
          ariaHideApp={false}
        >

          <div className="react-modal-dialog react-modal-dialog-full react-modal-dialog-centered">
            <div className="react-modal-header d-flex flex-unset align-items-center">
              <h5 className="react-modal-title">
                {(orderDetail && orderDetail.container && orderDetail.container.size === "Live Load") ?
                  <div>Live Load Information</div>
                  :
                  ((orderDetail && orderDetail.container&& orderDetail.container.size === "1/2 Yard" && orderDetail.jobStatus === "Exchange") ?
                    <div>Mini Action Information</div>
                    :
                    ((orderDetail && orderDetail.container && orderDetail.container.size === "1/2 Yard") ?
                      <div>Mini Delivery Information</div>
                      :
                      <div>{orderDetail && orderDetail.jobStatus} Information</div>
                    )
                  )
                }
              </h5>
                { (this.state.currentobj && this.state.currentobj.status  === "completed") ?
                <div className="task__status ml-3 ml0 unassigned" status={this.state.currentobj && this.state.currentobj.status}>
                  <span className="task__status--icon"></span>{this.state.currentobj && this.state.currentobj.status} At&nbsp;<span className="text-lowercase">
                  {/* {moment(orderDetail.completedAt).format('MM-DD-YYYY hh:mm a')} */}
                  {this.getFormatedDateAndTime(orderDetail.completedAt, this.state.currentobj && this.state.currentobj.completedoffset ? this.state.currentobj.completedoffset : 0)}</span>
                </div>
                :
                <div className="task__status ml-3 ml0 unassigned" status={this.state.currentobj && this.state.currentobj.status}>
                  <span className="task__status--icon"></span> {(this.state.currentobj && this.state.currentobj.status === "inprogress") ? "in progress" : (this.state.currentobj && this.state.currentobj.status)}
                </div>
              }
              {this.state.currentobj && this.state.currentobj.status === "completed" ?
              <div className="loaderdownloadbtn">
              <img className="arrow-loader" onClick={this.downloadInvoice.bind(this, orderDetail.id)}
                      src={String(this.state.receiptid) === String(orderDetail.id) ? LoaderGif : DownloadArrow}
                    /> </div>
               : "" }
              {orderDetail && (orderDetail.jobStatus === "Exchange" || orderDetail.jobStatus === "Removal") && orderDetail.parentDeliveryDate !== "" ? <div className="parent_date_div">Last done at {this.props.user && this.props.user.timezone && this.props.user.timezone.offset ? this.getFormatedDateAndTime(orderDetail&& orderDetail.parentDeliveryDate, orderDetail && orderDetail.parentcompletedoffset) : this.getFormatedDateAndTime(orderDetail&& orderDetail.parentDeliveryDate, orderDetail && orderDetail.parentcompletedoffset)}</div> : "" }
              <button type="button" className="btn react-modal-close"  onClick={this.closeInformationModal.bind(this)}><CloseIcon /></button>
            </div>
            <div className="divider-line"></div>
            <div className="react-modal-body pd-t-0">

              <div className="tabsContainer mb-3">
                <Tabs activeKey={this.state.activeKey} onTabClick={this.changeKey.bind(this)}>
                  <TabPane tab="Order Details" key="1">
                  <div className="row">
                    <div className="col-lg-8 col-md-12">
                      <ul className="order-listing">
                        <li>
                          <label className="view-textfield-label">Job Address</label>
                          <p className="view-textfield-details">{orderDetail && orderDetail.address && orderDetail.address.address}</p>
                        </li>
                        <li>
                          <label className="view-textfield-label">State</label>
                          <p className="view-textfield-details">{orderDetail && orderDetail.address && orderDetail.address.state}</p>
                        </li>
                        <li>
                          <label className="view-textfield-label">City</label>
                          <p className="view-textfield-details">{orderDetail && orderDetail.address && orderDetail.address.city}</p>
                        </li>
                        <li>
                          <label className="view-textfield-label">Zipcode</label>
                          <p className="view-textfield-details">{orderDetail && orderDetail.address && orderDetail.address.zipcode}</p>
                        </li>
                        <li>
                          <label className="view-textfield-label">Borough</label>
                          <p className="view-textfield-details">{orderDetail && orderDetail.address && orderDetail.address.borough}</p>
                        </li>
                        <li>
                          <label className="view-textfield-label">Neighborhood</label>
                          <p className="view-textfield-details">{orderDetail && orderDetail.address && orderDetail.address.neighbourhood}</p>
                        </li>
                        <li>
                          <label className="view-textfield-label">Delivery Date (MM/DD/YY)</label>
                          <p className="view-textfield-details">{orderDetail && this.getFormatedDate(orderDetail.deliveryDate)}</p>
                        </li>
                        <li>
                          <label className="view-textfield-label">Delivery Day</label>
                          <p className="view-textfield-details">{orderDetail && moment(orderDetail.deliveryDate).utc().format("dddd")}</p>
                        </li>

                        { orderDetail && orderDetail.container && orderDetail.container.size === "Live Load" ?
                          <li>
                            <label className="view-textfield-label">Yardage</label>
                            <p className="view-textfield-details">{_.get(orderDetail, 'container.quantity', '')}</p>
                          </li>
                          :
                          <li>
                            <label className="view-textfield-label">Product/Service</label>
                            <p className="view-textfield-details">{_.get(orderDetail, 'container.size', '')}</p>
                          </li>
                        }

                        { orderDetail && orderDetail.container && orderDetail.container.size === "1/2 Yard" &&(
                          <li>
                            <label className="view-textfield-label">On site</label>
                            <p className="view-textfield-details">{_.get(orderDetail, 'container.quantity', '')}</p>
                          </li> )
                        }

                        { orderDetail && orderDetail.container && orderDetail.container.size === "1/2 Yard" && _.get(orderDetail,'jobStatus', '') === "Exchange" &&(
                          <li>
                            <label className="view-textfield-label">Add Minis</label>
                            <p className="view-textfield-details">{_.get(orderDetail, 'addminis', 'N/A')}</p>
                          </li> )
                        }
                        { orderDetail && orderDetail.container && orderDetail.container.size === "1/2 Yard" && _.get(orderDetail,'jobStatus', '') === "Exchange" &&(
                          <li>
                            <label className="view-textfield-label">Empty Amount</label>
                            <p className="view-textfield-details">{_.get(orderDetail, 'emptyamount', 'N/A')}</p>
                          </li> )
                        }
                        { orderDetail && orderDetail.container && orderDetail.container.size === "1/2 Yard" && _.get(orderDetail,'jobStatus', '') === "Exchange" &&(
                          <li>
                            <label className="view-textfield-label">Remove Minis</label>
                            <p className="view-textfield-details">{_.get(orderDetail, 'removeminis', 'N/A')}</p>
                          </li> )
                        }
                        { orderDetail && orderDetail.container && orderDetail.container.size === "1/2 Yard" && _.get(orderDetail,'jobStatus', '') === "Exchange" &&(
                          <li>
                            <label className="view-textfield-label">Loose Yardage</label>
                            <p className="view-textfield-details">{_.get(orderDetail, 'looseyardage', 'N/A')}</p>
                          </li> )
                        }

                        <li>
                          <label className="view-textfield-label">Parking</label>
                          <p className="view-textfield-details">{_.get(orderDetail, 'parking', '')}</p>
                        </li>
                        {/* <li>
                          <label className="view-textfield-label">Type of Debris</label>
                          <p className="view-textfield-details">{orderDetail && orderDetail.debris}</p>
                        </li> */}
                        <li>
                          <label className="view-textfield-label">Type of Debris</label>
                          <p className="view-textfield-details">{Array.isArray(_.get(orderDetail, 'debris', [])) ? _.get(orderDetail, 'debris', []).join(', ') : _.get(orderDetail, 'debris', '')}</p>
                        </li>
                        { _.get(orderDetail, 'debris', []).indexOf("Other") !== -1 && _.get(orderDetail, 'otherDebris', []).length !== 0 ?
                        <li>
                          <label className="view-textfield-label">Other Debris</label>
                          <p className="view-textfield-details">{Array.isArray(_.get(orderDetail, 'otherDebris', [])) ? _.get(orderDetail, 'otherDebris', []).join(', ') : _.get(orderDetail, 'otherDebris', '')}</p>
                        </li>
                        :
                        <li>
                          <label className="view-textfield-label">Other Debris</label>
                          <p className="view-textfield-details">N/A</p>
                        </li>
                        }
                        <li>
                          <label className="view-textfield-label">Contact # (xxx-xxx-xxxx)</label>
                          <p className="view-textfield-details">{orderDetail && orderDetail.contact && orderDetail.contact.phone}</p>
                        </li>
                        <li>
                          <label className="view-textfield-label">Contact Name</label>
                          <p className="view-textfield-details">{orderDetail && orderDetail.contact && orderDetail.contact.name}</p>
                        </li>
                        <li>
                          <label className="view-textfield-label">Permit</label>
                          <p className="view-textfield-details">{orderDetail && orderDetail.permit}</p>
                        </li>
                        <li>
                          <label className="view-textfield-label">Container Location</label>
                          <p className="view-textfield-details">{orderDetail && orderDetail.location}</p>
                        </li>
                        <li>
                          <label className="view-textfield-label">Hauler Company</label>
                          <p className="view-textfield-details">{orderDetail && orderDetail.haulerCompanyName}</p>
                        </li>
                        <li>
                          <label className="view-textfield-label">Dump Site</label>
                          <p className="view-textfield-details">{orderDetail && orderDetail.dump && orderDetail.dump.name}</p>
                        </li>

                        { (this.state.cardclick === true && this.state.currentobj && this.state.currentobj.status !== "pending" ) ?
                          <li>
                            <label className="view-textfield-label">Truck Number</label>
                            <p className="view-textfield-details">{this.state.currentobj.status !== "unassigned" ? ((orderDetail && orderDetail.truck_number) ? orderDetail.truck_number : "") : "N/A"}</p>
                          </li>
                        :
                          <li>
                          {this.state.currentobj && this.state.currentobj.status === "completed" ?
                            <div>
                              <label className="view-textfield-label">Truck Number</label>
                              <p className="view-textfield-details">{((orderDetail && orderDetail.truck_number) ? orderDetail.truck_number : "")}</p>
                            </div>
                           :
                            <div className="form-group material-textfield">
                              <select
                                onChange={this.handleSelectChange.bind(this)}
                                value={this.state.truckid}
                                className="form-control material-textfield-input custom-select">
                                {this.state.trucks && this.state.trucks.length !== 0 && this.state.trucks.map((truck, index) => {
                                    return(
                                      <option value={truck.key} key={index}>{truck.key}</option>
                                    )
                                  })
                                }
                              </select>
                              <label className="material-textfield-label">Truck Number</label>
                            </div> }
                          </li>
                        }
                         <li>
                          <label className="view-textfield-label">Driver Photos</label>
                            <br />
                            <ul className="photo-listing">
                          {urls.map((img, index) => {
                            return (<li key={index} onClick={this.driverPhotos.bind(this, index)}>
                              <div className="driver__photos" key={index}>
                                <img src={img} className="driver-profile-img" alt=""/>
                              </div>
                            </li> )})}
                            </ul>
                        </li>
                      </ul>
                    </div>

                    <div className="col-lg-4 col-md-12">
                      {_.get(orderDetail, 'geoLocation.lat', '') && _.get(orderDetail, 'geoLocation.lng', '') &&(
                      <div className="map-section-sm">
                        <MapComponent
                          position={{lat:_.get(orderDetail, 'geoLocation.lat', ''), lng: _.get(orderDetail, 'geoLocation.lng', '')}}
                          icon={_.get(orderDetail, 'container.size', '')}
                        />
                      </div>)}
                      <ul className="order-listing order-listing-100">

                        <li>
                          <label className="view-textfield-label">Special Instructions</label>
                          <p className="view-textfield-details">{orderDetail && orderDetail.specialinstruction}</p>
                        </li>
                        <li>
                        {this.state.currentobj && (this.state.currentobj.status === "completed" || this.state.currentobj.jobStatus === "Exchange" || this.state.currentobj.jobStatus === "Removal") && this.state.currentobj.container !== "Live Load" && this.state.currentobj.container !== "1/2 Yard" ?
                          <div className="">
                          {(this.state.currentobj && this.state.currentobj.status !== "completed" )?
                          <div>
                            <label className="view-textfield-label">Accessibility Notes</label>
                            <p className="view-textfield-details">{this.state.accessibility === "Other: Manual entry" ? this.state.manualaccessibility : this.state.accessibility !== "Select" ? this.state.accessibility : "N/A"}</p>
                          </div>
                          :
                            <div className="form-group material-textfield">
                                <select
                                  className="form-control material-textfield-input custom-select"
                                  //dropdownClassName="select__custom--options"
                                  // defaultValue="Select Accessibility Notes"
                                  onChange={this.handleSelectChangeAccess.bind(this)}
                                  value={this.state.accessibility}
                                  name="accessibility"
                                  //suffixIcon={<img src="./img/down-arrow.png" alt=""/>}
                                  >
                                    {accessibilityOptions && accessibilityOptions.length !== 0 && accessibilityOptions.map((truck, index) => {
                                      return(
                                        <option value={truck.value} key={index}>{truck.key}</option>
                                      )
                                    })
                                  }
                                </select>
                              <label className="material-textfield-label">Accessibility Notes</label>
                            </div>
                            }
                            {this.state.accessibility === "Other: Manual entry" && this.state.currentobj.status === "completed" ?
                            <div className="form-group material-textfield material-textfield-lg">
                              <textarea className="form-control material-textfield-input h-150" type="text" name="manualaccessibility" value={this.state.manualaccessibility} onChange={this.handleChange.bind(this)} ></textarea>
                              <label className="material-textfield-label">Manual Entry</label>
                            </div> : "" }
                          </div> : "" }
                          {/* <label className="view-textfield-label">Accessibility Notes</label>
                          <p className="view-textfield-details">{this.state.accessibility === "Other: Manual entry" ? this.state.manualaccessibility : this.state.accessibility !== "Select" ? this.state.accessibility : ""}</p> */}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <br/>
                  {this.state.cardclick === false || (this.state.currentobj && this.state.currentobj.status === "pending") ?
                  <div className="d-flex align-items-center justify-content-between">
                  <button className="btn btn-lg btn-dark w-100 font-800 mr-2" onClick={this.moveOrder.bind(this)}>Save</button>
                </div>
                  : "" }

                {this.state.currentobj && this.state.currentobj.status === "completed" && this.state.currentobj.container !== "Live Load" && this.state.currentobj.container !== "1/2 Yard" ?
                  <div className="d-flex align-items-center justify-content-between">
                  <button className="btn btn-lg btn-dark w-100 font-800 mr-2" onClick={this.saveAccessibility.bind(this)}>Save</button>
                </div>
                : "" }
                  </TabPane>
                  <TabPane className={styles.tabPane} tab="Connected Orders" key="2">
                      <div className="container">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="table-responsive">
                              <table className="table custom-table-secondary connected white-bg">
                                <thead>
                                  <tr>
                                    <th>
                                      <span className="custom-table-th-title-sm for-cursor">Order Number </span>
                                    </th>
                                    <th>
                                      <span className="custom-table-th-title-sm for-cursor">Delivery Date </span>
                                    </th>
                                    <th>
                                      <span className="custom-table-th-title-sm for-cursor">Removal Date </span>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {_.get(orderDetail, 'connectedOrders', []).map((connectedOrders, i)=>{
                                    return (
                                      <tr key={i} className={String(orderDetail.orderId) === String(connectedOrders.orderid) ? "selected-connected" : "" } onClick={this.openConnectedOrders.bind(this, connectedOrders)}>
                                        <td>{_.get(connectedOrders,'orderid', '')}</td>
                                        <td>{_.get(connectedOrders,'deliverydate', '')}</td>
                                        <td>{_.get(connectedOrders,'pickupdate', '') !== ""  && _.get(connectedOrders,'pickupdate', '') !== "-" && _.get(connectedOrders,'pickupdate', '') && _.get(connectedOrders,'pickupdate', '') !== undefined ? (_.get(connectedOrders,'pickupdate', '')) : "-"}</td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                  </TabPane>
                  {this.state.currentobj && this.state.currentobj.status !== "unassigned" ?
                    <TabPane className={styles.tabPane} tab="Message Customer" key="3">
                    <div className="order__sms-form">

                        <div className="row">
                          <div className="col-md-12 mt-4 mb-4">
                            <div className="form-group material-textfield">
                              {this.state.currentobj && this.state.currentobj.status !== "completed" ?
                                <select className="form-control material-textfield-input custom-select" name="selected" value={this.state.selected} onChange={this.handleSelectMessageChange.bind(this)}>
                                  <option value=""></option>
                                  <option value="sensor_full_message">Track Container</option>
                                </select> : "" }
                                {this.state.currentobj && this.state.currentobj.status !== "completed" ? <label className="material-textfield-label">Select Message Template</label> : "" }
                            </div>
                              {/* {this.state.currentobj && this.state.currentobj.status !== "completed" ? <select className="form-control custom__select" name="selected" value={this.state.selected} onChange={this.handleSelectMessageChange.bind(this)}>
                                <option value="">Select Message Template</option>
                                <option value="sensor_full_message">Track Container</option>
                            </select> : "" } */}
                            <div className="form-group material-textfield">
                              {this.state.currentobj && this.state.currentobj.status !== "completed" ?
                                <textarea className="form-control material-textfield-input h-150" type="text" name="messageBox" value={this.state.messageBox} onChange={this.handleChange.bind(this)}></textarea>
                                  : ""}
                              {/* <label className="material-textfield-label">Special Instructions </label> */}
                            </div>
                            {/* {this.state.currentobj && this.state.currentobj.status !== "completed" ? <textarea className="form-control chat-sms-box" type="text" rows="5" name="messageBox" value={this.state.messageBox} onChange={this.handleChange.bind(this)}></textarea> : ""} */}

                            {this.state.currentobj && this.state.currentobj.status !== "completed" ? <button className="btn btn-dark btn-lg w-180 font-800" onClick={this.sendMessage.bind(this)}>Send</button> : "" }
                          </div>
                        </div>

                        <div className="msg-chat-padd removepad">
                        <div className="msg-chat-section">
                          <ul id="chatlist">
                            { this.state.messages && this.state.messages.map((item, index) => {
                                return (
                                <li key={index}>
                                {item.type === 'sent' ?
                                    <div className="pull-left">
                                      <div className="day-date">{this.getFormatedDateAndTimeMessage(item.created_at, this.state.currentobj && this.state.currentobj.completedoffset ? this.state.currentobj.completedoffset : 0, 'date')} at {this.getFormatedDateAndTimeMessage(item.created_at, this.state.currentobj && this.state.currentobj.completedoffset ? this.state.currentobj.completedoffset : 0, 'time')}</div>
                                      <span className="chat-img">{item.message_body}</span>
                                      <div className="user-name">{item.sender.name} {String(item.from_number) === String(twillonumber) ? "(Enterprise)" : "(Dispatcher)"}</div>
                                    </div>
                                  : <div className="pull-right text-right">
                                  <div className="day-date">{this.getFormatedDateAndTimeMessage(item.created_at, this.state.currentobj && this.state.currentobj.completedoffset ? this.state.currentobj.completedoffset : 0, 'date')} at {this.getFormatedDateAndTimeMessage(item.created_at, this.state.currentobj && this.state.currentobj.completedoffset ? this.state.currentobj.completedoffset : 0, 'time')}</div>
                                      <div className="chat-img">{item.message_body} {item.mediaurl && item.mediaurl !== "" ? <img src={item.mediaurl} /> : ""}</div>
                                      <div className="user-name">{item.sender.name} (Customer)</div>
                                  </div>}
                                </li>
                                )
                            })}
                          </ul>
                        </div>
                        </div>
                      </div>
                    </TabPane>
                    : "" }
              </Tabs>
              </div>
            </div>
          </div>
        </ReactModal>

        {/* <ReactModal
          isOpen={this.state.driverPhotos}
          onRequestClose={this.closeImageSlider.bind(this)}
          contentLabel=""
          ariaHideApp={false}
        > */}
          {this.state.driverPhotos && (
             <div>
              <div>
                  <Lightbox
                    mainSrc={urls[photoIndex]}
                    nextSrc={urls[(photoIndex + 1) % urls.length]}
                    prevSrc={urls[(photoIndex + urls.length - 1) % urls.length]}
                    wrapperClassName="driverphotos"
                    reactModalStyle={reactModalStyle}
                    onCloseRequest={() => this.setState({ driverPhotos: false })}
                    onMovePrevRequest={() =>
                      this.setState({
                        photoIndex: (photoIndex + urls.length - 1) % urls.length
                      })
                    }
                    onMoveNextRequest={() =>
                      this.setState({
                        photoIndex: (photoIndex + 1) % urls.length
                      })
                    }
                  />
                {/* <CarouselSlider slideCpnts = {itemsSlide} /> */}

                   </div>
            </div>)}
       {/* </ReactModal> */}


        {/* view Driver modal*/}

        <ReactModal
          isOpen={this.state.editDriverModal}
          onRequestClose={this.closeDriverModal.bind(this)}
          contentLabel="Add Task"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-centered">
            <div className="react-modal-header">
              <h5 className="react-modal-title">Driver Information</h5>
              <button type="button" className="btn react-modal-close"  onClick={this.closeDriverModal.bind(this)}><CloseIcon /></button>
            </div>
            <div className="divider-line"></div>
            <div className="react-modal-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input type="text" className="form-control material-textfield-input" name="lastname" value={this.state.name} disabled />
                    <label className="material-textfield-label"> Username </label>

                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input type="text" className="form-control material-textfield-input" name="lastname" value={this.state.lastname} disabled />
                    <label className="material-textfield-label">Last Name </label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input type="text" className="form-control material-textfield-input" name="email" value={this.state.email} disabled />
                    <label className="material-textfield-label">Email </label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input type="text" className="form-control material-textfield-input" name="phone" value={this.state.phone} disabled />
                    <label className="material-textfield-label">Phone Number (xxx-xxx-xxxx) </label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input type="text" className="form-control material-textfield-input" name="tabletId" value={this.state.tabletId} disabled />
                    <label className="material-textfield-label">Tablet ID </label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input type="text" className="form-control material-textfield-input" name="license" value={this.state.license} disabled />
                    <label className="material-textfield-label">Driver's License Nubmer </label>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group material-textfield">
                    <select onChange= {this.onTimeZonechange.bind(this)}
                      value={this.state.timezoneoptionsIndex}
                      disabled
                      className="form-control material-textfield-input custom-select">
                      {options}
                    </select>
                    <label className="material-textfield-label">Timezone</label>
                  </div>
                </div>

              </div>
              <div className="d-flex align-items-center justify-content-between">
              <button className="btn btn-md btn-dark w-100 font-800 mr-2" onClick={this.editDriver.bind(this)}>Edit Driver</button>

              <button className="btn btn-md btn-outline-danger w-100 ml-2 font-800" onClick={this.deleteDriverConfirmation.bind(this)}>Delete</button>
            </div>
            </div>
          </div>
        </ReactModal>

        {/* add Driver modal*/}

        <ReactModal
          isOpen={this.state.addDriverModal}
          onRequestClose={this.hideDriverModal.bind(this)}
          contentLabel="Add Task"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-centered">
            <div className="react-modal-header">
              <h5 className="react-modal-title">{this.state.driverModalText}</h5>
              <button type="button" className="btn react-modal-close"  onClick={this.hideDriverModal.bind(this)}><CloseIcon /></button>
            </div>
            <div className="divider-line"></div>
            <div className="react-modal-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input
                      className="form-control material-textfield-input"
                      name="name" value={this.state.name} onChange={this.handleChange.bind(this)}
                    required/>
                    <label className="material-textfield-label"> First Name <span className="text-danger">*</span> </label>
                    <p className="text-danger">{err && err.name ? err.name : ""}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input
                      className="form-control material-textfield-input"
                      name="lastname"
                      value={this.state.lastname} onChange={this.handleChange.bind(this)}
                    required/>
                    <label className="material-textfield-label"> Last Name  </label>
                    <p className="text-danger">{err && err.lastname ? err.lastname : ""}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input
                      className="form-control material-textfield-input"
                      name="email"
                      value={this.state.email} onChange={this.handleChange.bind(this)}
                    required/>
                    <label className="material-textfield-label"> Email </label>
                    <p className="text-danger">{err && err.email ? err.email : ""}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <InputMask
                      guide={false}
                      type="text"
                      keepCharPositions={false}
                      mask={phoneNumberMask}
                      className="form-control material-textfield-input"
                      name="phone"
                      value={this.state.phone}
                      onChange={this.handleChange.bind(this)} required/>
                    <label className="material-textfield-label">Phone <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.phone ? err.phone : ""}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input type="text" className="form-control material-textfield-input" name="tabletId" value={this.state.tabletId} onChange={this.handleChange.bind(this)} required />
                    <label className="material-textfield-label">Tablet ID <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.tabletId ? err.tabletId : ""}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input className="form-control bold-placeholder" placeholder="Driver's License Number" name="license" value={this.state.license} onChange={this.handleChange.bind(this)}/>
                  </div>
                </div>


                  <div className="col-md-12">
                    <div className="form-group material-textfield">
                      <select
                        onChange= {this.handleChange.bind(this)}
                        value={this.state.status}
                        name="status"
                        className="form-control material-textfield-input custom-select">
                        <option value=''> Select status </option>
                        <option value={true}> Active </option>
                        <option value={false}> Inactive </option>
                      </select>
                      <label className="material-textfield-label">Status <span className="text-danger">*</span> </label>
                      <p className="text-danger">{err && err.status ? err.status : ""}</p>
                    </div>
                  </div>


                <div className="col-md-12">
                  <div className="form-group material-textfield">
                    <select onChange= {this.onTimeZonechange.bind(this)}
                      value={this.state.timezoneoptionsIndex}
                      className="form-control material-textfield-input custom-select">
                      {options}
                    </select>
                    <label className="material-textfield-label">Timezone</label>
                {/* <span className="setarrow"><DownCaretIcon /></span> */}
                  </div>
                </div>

              </div>
              <p className="text-danger drivererror">{_.get(this.state, 'driverError', '')}</p>
              <div><button className="btn btn-dark btn-lg w-100 font-800" onClick={this.saveDriver.bind(this)}>Save</button></div>
              <div>
              {this.state.editDriverId && this.state.editDriverId !== "" ?
                <button className="btn btn-md btn-outline-danger w-100 font-800 hide-border-bg" onClick={this.deleteDriverConfirmation.bind(this)}>Delete</button>
              : "" }
              </div>

            </div>
          </div>
        </ReactModal>

        <ReactModal
          isOpen={this.state.deleteDriverConfirmation}
          onRequestClose={this.closeDeleteModal.bind(this)}
          contentLabel="Add Team Member"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-centered">
            <div className="react-modal-header">
              <h5 className="react-modal-title">Delete</h5>
              <button type="button" className="btn react-modal-close" onClick={this.closeDeleteModal.bind(this)}><CloseIcon /></button>
            </div>
            <div className="react-modal-body react-modal-body-delete">
              <div className="row">
                <div className="col-md-12">
                  <p className="modalpara">
                  Are you sure to delete this driver's information? Once it’s deleted,
                  all the information will be removed.
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="d-flex justify-content-end">
                    <button onClick={this.deleteDriver.bind(this)} className="btn btn-danger btn-md font-16 font-600 btnfullwidth-mob">Yes, Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ReactModal>

        <DeleteModal
          deleteModelIsOpen={this.state.deleteModelIsOpen}
          closeModal={this.closeModal.bind(this)}
          confirmDelete={this.deleteTask.bind(this)}
          text={'order’s'}
        />
      </div>
    )
  }
}

export default reduxForm({
  form: 'dashboard',  // a unique identifier for this form
  destroyOnUnmount: true,
})(DashboardForm)
