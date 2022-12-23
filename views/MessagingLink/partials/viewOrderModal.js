import React, { PureComponent, Fragment } from 'react'
import ReactModal from 'react-modal'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Tabs, Select } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import InputMask from 'react-input-mask'
import GoogleMap from 'google-map-react'

import { BackArrowIcon, DotBtnIcon, SortingDownArrow, CloseIcon, SortingNewUpIcon, SortingNewDownIcon } from '../../../components/icons'
import { getContainerSize, getFormatedDateAndTimeWithoutUTC, getDayDate, getDate, formatNumber, getFormatedDateAndTimeByUTC, getTimeInDayAndHours, getDateMMDDYYYHHMM, calculatePriceForExchange, getAllowedTons } from '../../../components/commonFormate'
import MapComponent from '../../../components/map'

import ExchangeIcon from '../../../images/btn-exchange.svg'
import removalIcon from '../../../images/btn-removal.svg'
import copyorderIcon from '../../../images/btn-copyorder.svg'
import editorderIcon from '../../../images/btn-editorder.svg'
import deleteorderIcon from '../../../images/btn-deleteorder.svg'
import DownloadArrow from '../../../images/download.svg'
import LoaderGif from '../../../images/loader.gif'
import config from '../../../config'
import Logo from '../../../images/curbside-logo.png'
import YellowMark from '../../../images/yellow_img.png'
import GreenImg from '../../../images/green_img.png'
const { TabPane } = Tabs
const { Option } = Select
const heavyMaterials = config.heavyMaterials
const styles = {
  tabsContainer : {

  },
}
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
export default class ViewOrdersComponent extends PureComponent {

  constructor() {
    super()
    this.state = {
      messages: [],
      timezone: {},
      activeKey: "1",
      live_load_yard: 0,
      half_yrd_qty: 0,
      receiptid: ""
    }

  }

  openModal() {
    this.setState({ modalIsOpen: true })
  }

  changeKey(key) {
    this.setState({activeKey: key})
  }

  closeModal() {
   this.props.history.push('/login')

  }

  componentDidMount = async()=> {
    // let data = { user : {
    //   id: localStorage.getItem("userid"),
    //   usertype: localStorage.getItem("usertype")
    // }
    // }
    // this.props.getUser(data)
    //this.getMessages()
    const id = _.get(this.props.orderData, 'id', '') !== "" && _.get(this.props.orderData, 'id', '') !== undefined ? _.get(this.props.orderData, 'id', '') : _.get(this.props.orderData, '_id', '')
    if(id !== "" && id !== undefined && id !== "undefined") {
      let { value } = await this.props.getOrderActivity(id)
      if(value) {
        this.setState({ activity: _.get(value, 'data', [])})
      }
    }
    this.updateCalculation()
  }

  // getMessages = async()=> {
  //   let { value }= await this.props.getMessage(this.props.orderData.orderid)
  //   if(value.type === 'success') {
  //     this.setState({ messages: value.data })
  //   }
  // }

  getContainerSize(id) {
    if (this.props.containerList.length > 0) {
      let master = this.props.containerList
      // console.log(id);
      for (let index = 0; index < master.length; index++) {
        let element = master[index]
        if (element._id === id) {
          return element.size
        }
      }
    }
  }

  getStatus(input, order) {
    if (input && this.props.statusList) {
      let status = "";
      this.props.statusList.forEach(function (element) {
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

  getFormatedDateAndTime(input) {
    //return ""
    const timezone = _.get(this.props, 'orderData.timezone', {})
    if(Object.keys(this.props.user).length !== 0 && timezone) {
      return getFormatedDateAndTimeWithoutUTC(input, timezone, this.props.user)
    } else {
      return ""
    }
  }

  // toggleAddModal (order) {
  //   this.setState({ orderData: order, addOrderModalIsOpen: true })
  // }
  clickOrder(type, futureExchange) {
    if(type === "copy") {
      this.props.toggleAddModal(this.props.orderData)
    } else if (type === "edit") {
      this.props.toggleEditModal(this.props.orderData)
    } else if (type === "delete") {
      this.closeModal()
      this.props.openConfirmDeleteModal(this.props.orderData.id)
    } else if (type === "complete") {
      this.props.openCompleteModal(this.props.orderData)
    } else if (type === "exchange") {
      this.props.toggleExchangeModal(this.props.orderData, futureExchange)
    } else if (type === "removal") {
      this.props.toggleRemovalModal(this.props.orderData, futureExchange)
    } else if (type === "cancel") {
      this.closeModal()
      this.props.openCancel(this.props.orderData.id)
    }
  }

  openMapModal() {
    this.setState({ openMapModal: true })
  }

  closeMapModal() {
    this.setState({ openMapModal: false })
  }

  getDownloadReceipt= async(jobId, e)=> {
    if(jobId && jobId !='') {
      this.setState({receiptid: jobId}, async() => {
        try {
          let { value } = await this.props.getDownloadReceipt(jobId)
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
  }

  openConnectedOrders = async(order) => {
    if(this.props.viewOrder) {
      const { getOrderByOrderId } = this.props
      // console.log(data, 'data data')
      let { value } = await getOrderByOrderId(order.orderid)
      this.props.viewOrder(value.data)
      this.setState({ activeKey: "1" })
      let value2 = await this.props.getOrderActivity(order.id)
      if(value2) {
        this.setState({ activity: _.get(value2, 'value.data', [])})
      }
    }
  }

  updateCalculation =async()=> {
    const { orderData, selectedCustomer, user } = this.props
    let containerName = await getContainerSize(_.get(this.props,'containerList', []), _.get(orderData, 'container', ''))
    const county = this.state.county
    const cal = calculatePriceForExchange(containerName, orderData.typeofdebris, county)
    var permit = 0
    if(_.get(orderData, 'permit', 'false')) {
      permit = 54.44
    }
    let amount = cal.base
    let taxes = (8.875 * (amount + permit))/100
    let totalamount = amount + taxes

    if(containerName !== 'Live Load') {
      totalamount = totalamount + permit
    } else {
      const p = amount * parseInt(_.get(orderData, 'live_load_yard', 0))
      amount = p
      totalamount = p + 250
      taxes = (8.875 * totalamount)/100
      totalamount = totalamount + taxes
      this.setState({ baseprice : amount,taxes: taxes, truckingrate: 250, estimatedprice: p.toFixed(2)},()=>{
        this.forceUpdate()
      })
    }
    if(containerName === '1/2 Yard') {
      const p = amount * parseInt(_.get(this.state, 'half_yrd_qty', 0))
      amount = p
      totalamount = p + 250 + permit
      taxes = (8.875 * totalamount)/100
      totalamount = totalamount + taxes
      this.setState({ baseprice : amount,amount: p, taxes: taxes, estimatedprice: p.toFixed(2)})
    }
    let discount = orderData.discount

    if(orderData.discountPercentage && orderData.discountPercentage !== '') {
      discount = (parseFloat(totalamount)*parseFloat(orderData.discountPercentage))/100
      totalamount = parseFloat(totalamount - discount)
    }
    this.setState({ totalamount, consumercost:totalamount,  taxes, amount, permitPrice : permit, discount },()=>{
      this.forceUpdate()
    })
  }

  formatNumber(number) {
    const nfObject = new Intl.NumberFormat('en-US');
    const output = nfObject.format(number);
    return output
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

  render() {
    const { orderData, selectedCustomer, user } = this.props    
    const accessibilitynotes = _.get(orderData, 'accessibility', '') === "Other: Manual entry" ? _.get(orderData, 'manualaccessibility', '') : _.get(orderData, 'accessibility', '')
    const status = this.getStatus(orderData.status, orderData) ? (this.getStatus(orderData.status, orderData).replace(/\s/g,'').replace(/[0-9]/g, '')).toLowerCase() : ""
    const statusCheck = this.getStatus(orderData.status, orderData)
    let created = orderData.createdat
    if(created) {
      created = this.getFormatedDateAndTime(created)
    }
    let createdInfo = orderData.timezone ? getTimeInDayAndHours(created) : getDateMMDDYYYHHMM(orderData.createdat)
    const tonnagepercentage = orderData && orderData.sustainabilityinformation && orderData.sustainabilityinformation.tonnagepercentage
    const tonnageweight = orderData && orderData.sustainabilityinformation && orderData.sustainabilityinformation.tonnageweight
    const allowedTons = getAllowedTons(this.getContainerSize(_.get(orderData, 'container', '')))
    const isHomeCustomer = _.get(this.props, 'selectedCustomer.isHomeCustomer', false)
    const deliveryday = getDayDate(orderData.deliverydate)
    let selectedTruck= ''
    let idx = -1
    if(this.props.trucks && this.props.trucks.length !== 0) {
      if (orderData.job_details && orderData.job_details.incompleted_by) {
        orderData.inporgress = false
      }
      if (orderData.job_details && orderData.job_details.started_at !== null && orderData.job_details.completed_at === null && orderData.job_details.truck_number && !orderData.job_details.incompleted_by ) {
        idx = _.get(this.props, 'trucks', []).findIndex(obj => String(obj.id) === String(orderData.job_details.truck_id) )
        if (idx !== -1) {
          selectedTruck = this.props.trucks[idx]
        }
      }

      if ((orderData.type === "Removal" || _.get(orderData,'childIdOrderDetails.type', '') === "Exchange") && orderData.childIdJobDetails && orderData.childIdJobDetails.truck_number && orderData.childIdJobDetails.started_at && !orderData.childIdJobDetails.completed_at && !orderData.childIdJobDetails.incompleted_by) {
        idx = _.get(this.props, 'trucks', []).findIndex(obj => obj.name === orderData.childIdJobDetails.truck_number )
        if (idx !== -1) {
          selectedTruck = this.props.trucks[idx]
        }
      }
    }
    return (
      <div>
      <ReactModal
        isOpen={this.props.isViewModalOpen}
        onRequestClose={this.closeModal.bind(this)}
        contentLabel="Add Team Member"
        ariaHideApp={false}
      >
        <div className="react-modal-dialog react-modal-dialog-960 react-modal-dialog-centered">
              <div className="react-modal-header d-flex align-items-center realtrack-header">
                <div>
                <img src={_.get(orderData, 'company.logoUrl', '') !== '' ? _.get(orderData, 'company.logoUrl', '') : Logo} alt="curbside" className="tableview-logo-message" />
                  {/* <h6 className="react-modal-title-sub"><span>Created On:</span> {createdInfo} |  <span>By:</span>
                  {_.get(orderData, 'created.name', '') !== '' ? _.get(orderData, 'created.name', ''): _.get(user, 'firstname', '') !== '' ? _.get(user, 'firstname', '') : _.get(user, 'companyname', '')}
                  </h6> */}
                </div>
                <div className="marg-left-auto">
                  <button type="button" className="btn react-modal-close" onClick={this.closeModal.bind(this)}><CloseIcon /></button>
                </div>
              </div>
              {/* <div className="divider-line"></div> */}
              <div className="react-modal-body p-0">

              <div className="">
                  <div className="tabsContainer mb-3">
                  <div className="boxwrapper">
                  <ul className="realtrack">
                  <li className="heading-h1">Track your container in real-time</li>
                  <li className="heading-h2"><span>Container size:</span> {this.getContainerSize(_.get(orderData, 'container', ''))}</li>
                  <li className="heading-h2"><span>Order Number:</span> {_.get(orderData, 'orderid', '')}</li>
                            {/* {orderData &&  orderData.job_details && orderData.job_details.started_at !== null && orderData.job_details.completed_at === null ? */}
                            <li>
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="modalmap-new">
                                    {_.get(orderData, 'location', '') !== '' ?
                                    <GoogleMap
                                    id="map"
                                    defaultZoom={12}
                                    center={_.get(orderData, 'location', '')}
                                    // layerTypes={layerTypes}
                                    options={this.createMapOptions()}
                                  >
                                  <Marker
                                    id="map"
                                    lat={_.get(orderData, 'location.lat', '')}
                                    lng={_.get(orderData, 'location.lng', '')}
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
                                </GoogleMap> : ""}
                                  </div>
                                </div>
                              </div>
                            </li>
                            </ul>
                            </div>
                  </div>
                </div>

              </div>
            </div>
            <ReactModal
            isOpen={this.state.openMapModal}
            onRequestClose={this.closeMapModal.bind(this)}
            ariaHideApp={false}
          >
           <div className="react-modal-dialog react-modal-dialog-724 react-modal-dialog-centered">
            <div className="react-modal-header d-flex align-items-center">
              <div>
                <h5 className="react-modal-title">View Map</h5>
              </div>
              <div className="marg-left-auto">
                {/* <button className="btn btn-dark btn-md mr-4 font-800">Draft</button> */}
                <button type="button" className="btn react-modal-close pos-static" onClick={this.closeMapModal.bind(this)}><CloseIcon /></button>
              </div>
            </div>
            <div className="divider-line"></div>

            <div className="react-modal-body">

            <div className="mapviewmodal">
              <MapComponent position={_.get(orderData, 'location', '')} icon={getContainerSize(this.props.containerList, _.get(orderData, 'container', ''))}/>
            </div>
            </div>
            </div>
          </ReactModal>
      </ReactModal>
      </div>
    )
  }
}
