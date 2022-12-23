import React, { PureComponent } from 'react'
import ReactModal from 'react-modal'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Tabs, Select } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import InputMask from 'react-input-mask'

import { BackArrowIcon, DotBtnIcon, SortingDownArrow, CloseIcon, SortingNewUpIcon, SortingNewDownIcon } from '../../../components/icons'
import { getContainerSize, getFormatedDateAndTimeWithoutUTC, getDate, formatNumber, getFormatedDateAndTimeByUTC, getTimeInDayAndHours, getDateMMDDYYYHHMM } from '../../../components/commonFormate'
import MapComponent from '../../../components/map'

import ExchangeIcon from '../../../images/btn-exchange.svg'
import removalIcon from '../../../images/btn-removal.svg'
import copyorderIcon from '../../../images/btn-copyorder.svg'
import editorderIcon from '../../../images/btn-editorder.svg'
import deleteorderIcon from '../../../images/btn-deleteorder.svg'
import DownloadArrow from '../../../images/download.svg'
import LoaderGif from '../../../images/loader.gif'

const { TabPane } = Tabs
const { Option } = Select

const styles = {
  tabsContainer : {

  },
}

export default class ViewOrdersComponent extends PureComponent {

  constructor() {
    super()
    this.state = {
      messages: [],
      timezone: {},
      activeKey: "1"
    }

  }

  openModal() {
    this.setState({ modalIsOpen: true })
  }

  changeKey(key) {
    this.setState({activeKey: key})
  }

  closeModal() {
    const tab = _.get(this.props, 'location.state.c', 'active')
    if(_.get(this.props, 'user.type', 'user') === "customer") {
      if(tab === 'pending') {
        this.props.history.push(`/pending-orders`)
      }
      if(tab === 'history') {
        this.props.history.push(`/completed-orders`)
      }
      if(tab === 'active') {
        this.props.history.push(`/active-containers`)
      }
      this.props.closeModal()
    } else {
      const customerid = this.props.match.params.id
      // /this.props.history.goBack()
      if (tab === 'pending') {
        this.props.history.push(`/customer-orders/pending/${customerid}`)
      } else if (tab === 'rejected') {
        this.props.history.push(`/customer-orders/rejected/${customerid}`)
      } else {
        if(this.getStatus(this.props.orderData.status, this.props.orderData) === "Complete") {
          this.props.history.push(`/customer-orders/history/${customerid}`)
        } else {
          this.props.history.push(`/customer-orders/live/${customerid}`)
        }
      }

      this.props.closeModal()
      // this.props.history.push(`/customer-orders/live/${customerid}`)
      // this.props.closeModal()
      // this.props.updateUrl()
    }

  }

  componentDidMount = async()=> {
    let data = { user : {
      id: localStorage.getItem("userid"),
      usertype: localStorage.getItem("usertype")
    }
    }
    this.props.getUser(data)
    //this.getMessages()
    const id = _.get(this.props.orderData, 'id', '') !== "" && _.get(this.props.orderData, 'id', '') !== undefined ? _.get(this.props.orderData, 'id', '') : _.get(this.props.orderData, '_id', '')
    if(id !== "" && id !== undefined && id !== "undefined") {
      let { value } = await this.props.getOrderActivity(id)
      if(value) {
        this.setState({ activity: _.get(value, 'data', [])})
      }
    }
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
    return (
      <div>
      <ReactModal
        isOpen={this.props.isViewModalOpen}
        onRequestClose={this.closeModal.bind(this)}
        contentLabel="Add Team Member"
        ariaHideApp={false}
      >
        <div className="react-modal-dialog react-modal-dialog-960 react-modal-dialog-centered">
              <div className="react-modal-header d-flex align-items-center">
                <div>
                  <h5 className="react-modal-title d-flex align-items-center">Order Information - {_.get(orderData, 'orderid', '')} <span className="greenlable status-container" status={status}>{this.getStatus(orderData.status, orderData)}</span></h5>
                <h6 className="react-modal-title-sub"><span>Created On:</span> {createdInfo} <span className="pipeline">|</span> <span>By:</span>
                  {_.get(orderData, 'created.name', '') !== '' ? _.get(orderData, 'created.name', ''): _.get(user, 'firstname', '') !== '' ? _.get(user, 'firstname', '') : _.get(user, 'companyname', '')}
                  </h6>
                </div>
                <div className="marg-left-auto">
                  <button type="button" className="btn react-modal-close" onClick={this.closeModal.bind(this)}><CloseIcon /></button>
                </div>
              <div className="loaderdownloadbtn">
                  {(statusCheck !== "Pending Delivery" && statusCheck !== "Future Exchange" && statusCheck !== "Future Removal") ?
                    <img className="arrow-loader" onClick={this.getDownloadReceipt.bind(this, orderData.id)}
                      src={String(this.state.receiptid) === String(orderData.id) ? LoaderGif : DownloadArrow}
                    />
                  : "" }
                </div>
              </div>
              {/* <div className="divider-line"></div> */}
              <div className="react-modal-body p-0">

              <div className="leftcontent">
                  <div className="tabsContainer mb-3">
                    <Tabs activeKey={this.state.activeKey} onTabClick={this.changeKey.bind(this)}>
                      <TabPane tab="Order Details" key="1">
                        <div className="pannel-wrapper">
                          <ul>
                            <li>
                              <h4>What are we picking up and how much of it? </h4>
                              <div className="boxwrapper">
                                <ul>
                                  <li>
                                    <label>Container Size</label>
                                    <div className="detail">{this.getContainerSize(_.get(orderData, 'container', ''))}</div>
                                  </li>
                                  {this.getContainerSize(_.get(orderData, 'container', '')) === "1/2 Yard"  ?
                                  <li>
                                    <label>On Site</label>
                                    <div className="detail">{_.get(orderData, 'half_yrd_qty', '')}</div>
                                  </li> : "" }
                                  {this.getContainerSize(_.get(orderData, 'container', '')) === "1/2 Yard" && _.get(orderData, 'parentId', '') !== null  ?
                                  <li>
                                    <label>Loose Yardage</label>
                                    <div className="detail">{_.get(orderData, 'looseyardage', '')}</div>
                                  </li> : "" }
                                  {this.getContainerSize(_.get(orderData, 'container', '')) === "1/2 Yard" && _.get(orderData, 'parentId', '') !== null  ?
                                  <li>
                                    <label>Empty Amount</label>
                                    <div className="detail">{_.get(orderData, 'emptyamount', '')}</div>
                                  </li> : "" }
                                  {this.getContainerSize(_.get(orderData, 'container', '')) === "1/2 Yard" && _.get(orderData, 'parentId', '') !== null  ?
                                  <li>
                                    <label>Remove Minis</label>
                                    <div className="detail">{_.get(orderData, 'removeminis', '')}</div>
                                  </li> : "" }
                                  {this.getContainerSize(_.get(orderData, 'container', '')) === "1/2 Yard" && _.get(orderData, 'parentId', '') !== null  ?
                                  <li>
                                    <label>Add Minis</label>
                                    <div className="detail">{_.get(orderData, 'addminis', '')}</div>
                                  </li> : "" }
                                  {this.getContainerSize(_.get(orderData, 'container', '')) === "Live Load" ?
                                  <li>
                                    <label> Yardage</label>
                                    <div className="detail">{_.get(orderData, 'live_load_yard', '')}</div>
                                  </li> : "" }
                                  <li>
                                    <label>Type of Debris</label>
                                    <div className="detail">
                                      {typeof _.get(orderData, 'typeofdebris', []) !== "string" && _.get(orderData, 'typeofdebris', []).map((td, i)=>{
                                        return(
                                          <div key={i}>- {td}</div>
                                        )
                                      })}
                                    </div>
                                  </li>
                                  {_.get(orderData, 'otherDebris', []).length !== 0 ?
                                  <li>
                                    <label>Other Debris</label>
                                    <div className="detail">
                                      {_.get(orderData, 'otherDebris', []).map((td, j)=>{
                                        return(
                                          <div key={j}>- {td}</div>
                                        )
                                      })}
                                    </div>
                                  </li> : ""}
                                </ul>
                              </div>
                            </li>

                            <li>
                              <h4>Where do you want the container(s)? </h4>
                              <div className="boxwrapper">
                                <ul>
                                  <li>
                                    <label>Address</label>
                                    <div className="detail detail-map">
                                      <p>{_.get(orderData, 'address', '')}</p>
                                      <p><b>Borough:</b> {_.get(orderData, 'borough', '')}</p>
                                      <p><b>Neighborhood:</b> {_.get(orderData, 'neighborhood', '')}</p>
                                    </div>
                                    <button className="btn-viewmap" onClick={this.openMapModal.bind(this)}>View Map</button>
                                  </li>
                                  <li>
                                    <label>Container Placement</label>
                                    <div className="detail">{_.get(orderData, 'placement', '')}</div>
                                  </li>
                                  <li>
                                    <label>Container Location</label>
                                    <div className="detail">{_.get(orderData, 'containerlocation', '')}</div>
                                  </li>
                                  <li>
                                    <label>Parking</label>
                                    <div className="detail">{_.get(orderData, 'parking', '')}</div>
                                  </li>
                                  <li>
                                    <label>Permit</label>
                                    <div className="detail">{_.get(orderData, 'permit', '') ? 'Yes' : 'No'}</div>
                                  </li>
                                </ul>
                              </div>
                            </li>

                            <li>
                              <h4>When do you want the container(s)?</h4>
                              <div className="boxwrapper">
                                <ul>
                                  <li>
                                    <label>Date</label>
                                    <div className="detail">{getDate(orderData.deliverydate)}</div>
                                  </li>
                                  <li>
                                    <label>Delivery Day</label>
                                    <div className="detail">{_.get(orderData, 'deliveryday', '')}</div>
                                  </li>
                                </ul>
                              </div>
                            </li>

                            <li>
                              <h4>Who’s placing this order?</h4>
                              <div className="boxwrapper">
                                <ul>
                                  <li>
                                    <label>Full Name</label>
                                    <div className="detail">{_.get(orderData, 'orderedby', '')}</div>
                                  </li>
                                  <li>
                                    <label>Phone number</label>
                                    <div className="detail">{_.get(orderData, 'orderedbycontact', '')}</div>
                                  </li>
                                  <li>
                                    <label>Email</label>
                                    <div className="detail">{_.get(orderData, 'orderEmail.email', '')}</div>
                                  </li>
                                </ul>
                              </div>
                            </li>

                            <li>
                              <h4>Who’s going to be onsite?</h4>
                              <div className="boxwrapper">
                                <ul>
                                  <li>
                                    <label>Job Site Contact Person</label>
                                    <div className="detail">{_.get(orderData, 'contactname', '')}</div>
                                  </li>
                                  <li>
                                    <label>Job Site Contact Person Phone</label>
                                    <div className="detail">{_.get(orderData, 'contactnumber', '')}</div>
                                  </li>
                                  <li>
                                    <label>Job Site Contact Person Email</label>
                                    <div className="detail">{_.get(orderData, 'contactEmail.email', '')}</div>
                                  </li>
                                  {/* <li>
                                    <label>Job Site Contact Person Email</label>
                                    <div className="detail">{_.get(orderData, 'contactemail', '')}</div>
                                  </li> */}
                                </ul>
                              </div>
                            </li>
                            {_.get(orderData, 'isApproved', 'false') === true ?
                            <li>
                              <h4>Payment Information</h4>
                              <div className="boxwrapper">
                                <ul>
                                 <li>
                                    <label>Purchase Order Number</label>
                                    <div className="detail">{_.get(orderData, 'purchaseordernumber', '')}</div>
                                  </li>
                                  {/* {_.get(orderData, 'paymenttype', '') !== '' ?
                                  <li>
                                    <label>Payment Type</label>
                                    <div className="detail">{_.get(orderData, 'paymenttype', '')}</div>
                                  </li> : ""}
                                  {_.get(orderData, 'pricingtype', '') !== '' ?
                                  <li>
                                    <label>Pricing Type</label>
                                    <div className="detail">{_.get(orderData, 'pricingtype', '')}</div>
                                  </li> : ""}
                                  <li>
                                    <label>Total Cost</label>
                                    <div className="detail">${formatNumber(_.get(orderData, 'consumercost', ''))}</div>
                                  </li> */}
                                </ul>
                              </div>
                            </li> : ""}

                            <li>
                              <h4>Internal Details</h4>
                              <div className="boxwrapper">
                                <ul>
                                  {_.get(orderData, 'haular.companyname', '') !== '' || _.get(orderData, 'haular.company_name', '') !== ''  ?
                                  <li>
                                    <label>Hauler</label>
                                    <div className="detail">{_.get(orderData, 'haular.companyname', '') !== '' ? _.get(orderData, 'haular.companyname', '') : _.get(orderData, 'haular.company_name', '')}</div>
                                  </li> : ""}
                                  <li>
                                    <label>Special Instructions</label>
                                    <div className="detail">
                                    {_.get(orderData, 'specialinstruction', '')}
                                    </div>
                                  </li>
                                  <li>
                                    <label>Accessibility Notes</label>
                                    <div className="detail">
                                    {accessibilitynotes !== "" && accessibilitynotes !== "Select" ? accessibilitynotes : "N/A"}
                                    </div>
                                  </li>
                                  {statusCheck === "Complete"  &&
                                  <li>
                                    <label>Removal Date</label>
                                    <div className="detail">{getDate(_.get(orderData, 'pickupdate', ''))}</div>
                                  </li>
                                  }
                                  {statusCheck === "Complete"  &&
                                  <li>
                                    <label>Removal Day</label>
                                    <div className="detail">{moment(_.get(orderData, 'pickupdate', '')).format('dddd')}</div>
                                  </li>
                                  }
                                  <li>
                                    <label>Dump Ticket Number</label>
                                    <div className="detail">{_.get(orderData, 'dumpticketnumber', '') !== '' ? _.get(orderData, 'dumpticketnumber', '') : 'N/A'}</div>
                                  </li>
                                  {/* <li>
                                    <label>Dump Cost</label>
                                    <div className="detail">{_.get(orderData, 'dumpcost', '') !== '' ? _.get(orderData, 'dumpcost', '') : 'N/A'}</div>
                                  </li> */}
                                  <li>
                                    <label>Dump Site</label>
                                    <div className="detail">{_.get(orderData, 'dump.companyname', '') !== '' ? _.get(orderData, 'dump.companyname', '') : 'N/A'}</div>
                                  </li>
                                </ul>
                              </div>
                            </li>

                          </ul>
                          <ul>
                              <li>
                              {_.get(orderData, 'uploadedpdf', '') && _.get(orderData, 'uploadedpdf', []).length !== 0 ?
                                <div className="col-md-12 col-sm-12 padd-lft0">
                                    <h4>Uploaded Files</h4>
                                    <ul className="uploaded-list">
                                        {_.get(orderData, 'uploadedpdf', []).map((file, index) => {
                                            return(
                                                <li>
                                                    <p>{file.name}</p>
                                                    <a href={file.url} target="_blank" className="btn btn-download" download><img src={DownloadArrow} width="18"/> </a>
                                                </li>
                                            )
                                        })
                                        }
                                    </ul>
                                </div>
                                : "" }
                              </li>
                            </ul>
                          { orderData && statusCheck === "Complete" && orderData.sustainabilityinformation !== undefined && this.getContainerSize(orderData.container) !== "1/2 Yard" ?
                          <div className="subs-box-wrapper">
                            <h4>Sustainability Information</h4>
                              <ul>
                                <li>
                                  <label className="view-textfield-label">Total % (yards)</label>
                                  <p className="detail">{orderData && orderData.sustainabilityinformation &&  orderData.sustainabilityinformation.totalpercentage && Math.round(orderData && orderData.sustainabilityinformation.totalpercentage)}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Total % (tons)</label>
                                  <p className="detail">{orderData && orderData.sustainabilityinformation && orderData.sustainabilityinformation.weight_total && Math.round(orderData && orderData.sustainabilityinformation.weight_total)}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Weight (tons)</label>
                                  <p className="detail">{orderData && orderData.weight && orderData.weight}</p>
                                </li>

                                <li>
                                  <label className="view-textfield-label">Waste % (Yards)</label>
                                  <p className="detail">{orderData && orderData.sustainabilityinformation && orderData.sustainabilityinformation.waste}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Waste % (Tons)</label>
                                  <p className="detail">{Math.round(tonnagepercentage && tonnagepercentage[0].value)}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Waste Weight (Tons)</label>
                                  <p className="detail">{tonnageweight && tonnageweight[0].value}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Brick % (Yards)</label>
                                  <p className="detail">{orderData && orderData.sustainabilityinformation && orderData.sustainabilityinformation.brick && orderData.sustainabilityinformation.brick}</p>
                                </li>

                                <li>
                                  <label className="view-textfield-label">Brick % (Tons)</label>
                                  <p className="detail">{Math.round(tonnagepercentage[1].value)}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Brick Weight (Tons)</label>
                                  <p className="detail">{tonnageweight && tonnageweight[1].value}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Dirt % (Yards)</label>
                                  <p className="detail">{orderData && orderData.sustainabilityinformation.dirt && orderData.sustainabilityinformation.dirt}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Dirt % (Tons)</label>
                                  <p className="detail">{Math.round(tonnagepercentage[2].value)}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Dirt Weight (Tons)</label>
                                  <p className="detail">{tonnageweight && tonnageweight[2].value}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Concrete % (Yards)</label>
                                  <p className="detail">{orderData && orderData.sustainabilityinformation.concrete && orderData.sustainabilityinformation.concrete}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Concrete % (Tons)</label>
                                  <p className="detail">{Math.round(tonnagepercentage[3].value)}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Concrete Weight (Tons)</label>
                                  <p className="detail">{tonnageweight && tonnageweight[3].value}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Wood % (Yards)</label>
                                  <p className="detail">{orderData && orderData.sustainabilityinformation.cleanwood && orderData.sustainabilityinformation.cleanwood}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Wood % (Tons)</label>
                                  <p className="detail">{Math.round(tonnagepercentage[4].value)}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Wood Weight (Tons)</label>
                                  <p className="detail">{tonnageweight && tonnageweight[4].value}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Metal % (Yards)</label>
                                  <p className="detail">{orderData && orderData.sustainabilityinformation.metal && orderData.sustainabilityinformation.metal}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Metal % (Tons)</label>
                                  <p className="detail">{Math.round(tonnagepercentage[5].value)}</p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Metal Weight (Tons)</label>
                                  <p className="detail">{tonnageweight && tonnageweight[5].value} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Paper/Cardboard % (Yards)</label>
                                  <p className="detail">{orderData && orderData.sustainabilityinformation.paper_cardboard && orderData.sustainabilityinformation.paper_cardboard} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Paper/Cardboard % (Tons)</label>
                                  <p className="detail">{Math.round(tonnagepercentage[6].value)} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Paper/Cardboard Weight (Tons)</label>
                                  <p className="detail">{tonnageweight && tonnageweight[6].value} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Plastic % (Yards)</label>
                                  <p className="detail">{orderData && orderData.sustainabilityinformation.plastic && orderData.sustainabilityinformation.plastic} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Plastic % (Tons)</label>
                                  <p className="detail">{Math.round(tonnagepercentage[7].value)} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Plastic Weight (Tons)</label>
                                  <p className="detail">{tonnageweight && tonnageweight[7].value} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Drywall % (Yards)</label>
                                  <p className="detail">{orderData && orderData.sustainabilityinformation.drywall && orderData.sustainabilityinformation.drywall} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Drywall % (Tons)</label>
                                  <p className="detail">{Math.round(tonnagepercentage[8].value)} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Drywall Weight (Tons)</label>
                                  <p className="detail">{tonnageweight && tonnageweight[8].value} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Glass % (Yards)</label>
                                  <p className="detail">{orderData && orderData.sustainabilityinformation.glass && orderData.sustainabilityinformation.glass} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Glass % (Tons)</label>
                                  <p className="detail">{Math.round(tonnagepercentage[9].value)} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Glass Weight (Tons)</label>
                                  <p className="detail">{tonnageweight && tonnageweight[9].value} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Asphalt % (Yards)</label>
                                  <p className="detail">{orderData && orderData.sustainabilityinformation.asphalt && orderData.sustainabilityinformation.asphalt} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Asphalt % (Tons)</label>
                                  <p className="detail">{Math.round(tonnagepercentage[10].value)}  </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Asphalt Weight (Tons)</label>
                                  <p className="detail">{tonnageweight && tonnageweight[10].value} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Recycling % (Tons)</label>
                                  <p className="detail">{Math.round(orderData && orderData.sustainabilityinformation.recyclingpercentage && orderData.sustainabilityinformation.recyclingpercentage)} </p>
                                </li>
                                <li>
                                  <label className="view-textfield-label">Residual Waste % (Tons)</label>
                                  <p className="detail">{Math.round(orderData && orderData.sustainabilityinformation.residualpercentage && orderData.sustainabilityinformation.residualpercentage)} </p>
                                </li>
                              </ul>
                            </div>: "" }
                        </div>
                      </TabPane>
                      <TabPane tab="Connected Orders" key="2">
                      <div className="container">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="table-responsive">
                            <table className="table custom-table-secondary white-bg">
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
                                  <th>
                                    <span className="custom-table-th-title-sm for-cursor">Status </span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                              {_.get(orderData, 'connectedOrders', []).map((connectedOrders, i)=>{
                                return (
                                  <tr key={i} className={String(orderData.id) === String(connectedOrders.id) ? "selected-connected" : "" } onClick={this.openConnectedOrders.bind(this, connectedOrders)}>
                                    <td>{_.get(connectedOrders,'orderid', '')}</td>
                                    <td>{moment(connectedOrders.deliverydate).format('MM/DD/YYYY')}</td>
                                    <td>{connectedOrders.pickupdate ? moment(connectedOrders.pickupdate).format('MM/DD/YYYY') : '-'}</td>
                                    <td>{this.getStatus(connectedOrders.status, orderData)}</td>
                                  </tr>
                                )
                              })}
                                {/* <tr>
                                  <td>O0004307</td>
                                  <td>2-12-2020</td>
                                  <td>2-12-2020</td>
                                  <td>Removed</td>
                                </tr> */}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                      </TabPane>
                      <TabPane tab="Order Activity" key="3">
                      {_.get(this.state, 'activity', []).length !== 0 ?
                        <ul className="order-activity-list">
                          {_.get(this.state, 'activity', []).map((activity, i)=>{
                            // console.log(connectedOrders)
                            return (
                              <li>{activity.description}
                              <div className="fordate">{getFormatedDateAndTimeByUTC(activity.createdat)}</div>
                              </li>
                            )
                          })}
                        </ul>
                        :
                        <div className="no-activity-mdl">
                          No Activity
                        </div>

                         }

                      </TabPane>
                    </Tabs>
                  </div>
                </div>
                { this.getStatus(orderData.status, orderData) === "Complete" ?
                  <div className="rightbtns">
                    <h4>Actions</h4>
                      <button className="btn btn-dark w-180 w-half font-600 font-16 " onClick={this.clickOrder.bind(this, 'copy')} ><span><img src={copyorderIcon} /></span> Copy Order</button>
                    </div>
                    :
                  <div className="rightbtns">
                  { this.getStatus(orderData.status, orderData) !== "Removed" ? <h4>Actions</h4> : "" }
                    {getContainerSize(this.props.containerList, orderData.container) !== "Live Load" &&
                    this.getStatus(orderData.status, orderData) !== "Removed" && this.getStatus(orderData.status, orderData) !== "Future Removal" && this.getStatus(orderData.status, orderData) !== "Future Exchange" ?
                    this.getStatus(orderData.status, orderData) === "In Use" ?
                    <button className="btn btn-dark w-180 w-half font-600 font-16" onClick={this.clickOrder.bind(this, 'exchange', false)}><span><img src={ExchangeIcon} /></span> {getContainerSize(this.props.containerList, orderData.container) === "1/2 Yard" ? "Action" : "Exchange"}</button>
                    :
                    this.getStatus(orderData.status, orderData) === "Pending Removal" ?
                    "" :
                    this.getStatus(orderData.status, orderData) !== "Pending Action" && getContainerSize(this.props.containerList, orderData.container) !== "1/2 Yard"  ?
                    ""
                    : "" : "" }
                    {getContainerSize(this.props.containerList, orderData.container) !== "Live Load" && getContainerSize(this.props.containerList, orderData.container) !== "1/2 Yard" &&  this.getStatus(orderData.status, orderData) !== "Future Removal" && this.getStatus(orderData.status, orderData) !== "Future Exchange"  && this.getStatus(orderData.status, orderData) !== "Removed" ?
                    this.getStatus(orderData.status, orderData) === "In Use" ?
                    <button className="btn btn-dark w-180 w-half font-600 font-16" onClick={this.clickOrder.bind(this, 'removal', false)}><span><img src={removalIcon} /></span> Removal</button>
                    :
                    this.getStatus(orderData.status, orderData) === "Pending Removal" ?
                    ""
                    : ""
                    : "" }
                    {this.getStatus(orderData.status, orderData) !== "Removed" && this.getStatus(orderData.status, orderData) !== "Future Removal" && this.getStatus(orderData.status, orderData) !== "Future Exchange" ? <button className="btn btn-dark w-180 w-half font-600 font-16" onClick={this.clickOrder.bind(this, 'copy')}><span><img src={copyorderIcon} /></span> Copy Order</button> : "" }
                    {(this.getStatus(orderData.status, orderData) === "Pending Delivery" && orderData && _.get(orderData, 'job_details.started_at', null) === null)  || (this.getStatus(orderData.status, orderData) === "Future Removal" || String(this.getStatus(orderData.status, orderData)).indexOf('Future Exchange') !== -1)? <button className="btn btn-dark w-180 w-half font-600 font-16" onClick={this.clickOrder.bind(this, 'edit')}><span><img src={editorderIcon} /></span> Edit Order</button> :  "" }
                    { this.getStatus(orderData.status, orderData) !== "Removed" ?
                    <button className="btn btn-dark w-180 w-half redbg font-600 font-16" onClick={this.clickOrder.bind(this, 'delete')}><span><img src={deleteorderIcon} /></span> Delete Order</button>
                    : "" }
                    { this.getStatus(orderData.status, orderData) === "Removed" ?
                    ""
                    : "" }
                  </div>
                  }
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
