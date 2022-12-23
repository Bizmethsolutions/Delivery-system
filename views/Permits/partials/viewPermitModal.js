import React, { PureComponent } from 'react'
import ReactModal from 'react-modal'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Tabs, Select, message } from 'antd'
import _ from 'lodash'
import moment from 'moment'

import InputMask from 'react-text-mask'
import DatePicker from "react-datepicker"
import delIcon from '../../../images/ic-delete.svg'
import { CloseIcon, MoreIcon } from '../../../components/icons'
import MapComponent from '../../../components/map'
import PermitOrderIcon from '../../../images/permit-vieworder.svg'
import PermitViewIcon from '../../../images/permit-download.svg'
import removalIcon from '../../../images/btn-removal.svg'
import copyorderIcon from '../../../images/btn-copyorder.svg'
import editorderIcon from '../../../images/btn-editorder.svg'
import deleteorderIcon from '../../../images/btn-deleteorder.svg'
import DeleteModal from '../../../components/deleteModal'
import AddPermitModal from './addPermitModal'
import EditPermitModal from './editPermitModal'
import { formatPhoneNumber, formatPhoneNumberWithBrackets, getTimeInDayAndHoursForCustomer, formatOrderAddess, formatGeoAddressComponents, getDate, getDateMMDDYYYHHMM, getTimeInDayAndHours, getFormatedDateAndTimeWithoutUTC, getContainerSize, getFormatedDateAndTimeByUTC } from '../../../components/commonFormate'
var fileDownload = require('js-file-download');
export default class CustomerOrdersComponent extends PureComponent {

  constructor() {
    super()
    this.state = {
      customer: '',
      openMapModal: false,
      customerName: '',
      permitId: '',
      orderId: '',
      addPermitIsOpen: false,
      editPermitIsOpen: false,
      isArchvie: false
    }
  }

  closeModal() {
    this.props.closeModal()
  }
  componentDidMount = async()=> {
    const { orderDetail  } = this.props
    this.setState({
      orderId : _.get(orderDetail, 'orderid', ''),
      customer : _.get(orderDetail, 'customer_info._id', ''),
      customerName : _.get(orderDetail, 'customer_info.companyname', ''),
      permitNumber : _.get(orderDetail, 'permit_info.permitnumber', '') ,
    })

  }


  openMapModal() {
    this.setState({ openMapModal: true })
  }

  closeMapModal() {
    this.setState({ openMapModal: false })
  }

  copyModal() {
    // this.props.closeModal()
    this.setState({ addPermitIsOpen: true })
  }
  openEditModal() {
    this.setState({ editPermitIsOpen: true })
  }

  archviedPermit() {
    this.setState({ editPermitIsOpen: true, isArchvie: true })
  }

  getFormatedDateAndTime(input) {
    //return ""
    const timezone = _.get(this.props, 'orderDetail.permit_info.timezone', {})
    if(Object.keys(this.props.user).length !== 0 && timezone) {
      return getFormatedDateAndTimeByUTC(input,this.props.user)
    } else {
      return ""
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

  getexpireDays (){
    let order = this.props.orderDetail
    let daysIn = 'N/A'
    const timezone = _.get(order, 'permit_info.timezone', {})
    if (order && order.permit_info && order.permit_info.enddate) {
      const date1 = new Date();
      date1.setHours(0,0,0,0);
      // const date2 = new Date(order.permit_info.enddate);
      let date2 = getFormatedDateAndTimeWithoutUTC(order.permit_info.enddate, timezone, this.props.user)
      date2.setHours(23, 59, 59, 999);
      if (date2 < date1) {
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        // daysIn = diffDays === 1 ? diffDays + " day overdue" : diffDays + " days overdue"
        daysIn = "Expired"
      } else {
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays == 1 || diffDays == 0) {
          daysIn = "Today"
        } else {
          daysIn = diffDays + " days"
        }
        // daysIn = diffDays + " days"
      }
    }
    return daysIn
  }

  vieworder() {
    let { orderDetail } = this.props
    const customerid = _.get(orderDetail.customer_info, 'customerid', '')
    this.props.history.push(`/customer-orders/${customerid}/${orderDetail.orderid}`, { type: 'live' })
  }

  openConfirmDeleteModal (id, orderId) {
    this.setState({ permitId: id, orderId: orderId, deleteModelIsOpen: true })
  }

  downloadPermit () {
    const { orderDetail } = this.props
    let timeStamp = Math.floor(Date.now() / 1000);
    let name = orderDetail.permit_info.uploadedFile.fileName
    const save = document.createElement('a')
    save.href = orderDetail.permit_info.uploadedFile.uploadfileurl
    save.target = '_blank'
    // save.download = orderDetail.permit_info.uploadedFile.uploadfileurl
    save.setAttribute('download', name);
    document.body.appendChild(save)
    save.click()
    // fileDownload(orderDetail.permit_info.uploadedFile.uploadfileurl, orderDetail.permit_info.uploadedFile.fileName)

  }

  confirmDelete = async() => {
    let id = this.state.permitId
    let orderId = this.state.orderId
    let data =  {
      id, orderId
    }
    try {
      let { value } = await this.props.deletePermit(data)
      message.success('successfully deleted')
      this.props.fetchOrderList()
      this.props.getPermitCount()
      this.closeModal()
    } catch(e) {
      // message.success(_.get(e, 'error.message', "can't cancel an inprogress job"))
      this.closeModal()
    }
  }

  fetchOrderList() {
    this.props.fetchOrderList()
  }

  getHistoryDate (h) {
    const { orderDetail, user  } = this.props
    const timezone = this.props.user && this.props.user.timezone && this.props.user.timezone.tzName ? this.props.user.timezone.tzName: Intl.DateTimeFormat().resolvedOptions().timeZone
    const timeZoneOffset = this.props.user && this.props.user.timezone && this.props.user.timezone.offset ? this.props.user.timezone.offset: _.get(Intl.DateTimeFormat().resolvedOptions(), 'offset', 0)
    const timezoneText = moment.tz.zone(timezone).abbr(timeZoneOffset)
    // let d = this.getFormatedDateAndTime(h.createdat,orderDetail)
    let d = getFormatedDateAndTimeByUTC(h.createdat,user)
    d= `${moment(d).format('LL')} ${moment(d).format('hh:mm a')} ${timezoneText}`
    //d = this.getFormatedDateAndTimeCompleted(h.createdat, _.get(this.props, 'user.timezone.offset', 0))
    return d
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

  getStatusOfPermit() {
    let order = this.props.orderDetail
    const timezone = _.get(order, 'permit_info.timezone', {})
    let status = "Active"
    let date = order.permit_info.enddate
    if (order && order.permit_info && order.permit_info.enddate) {
      const date1 = new Date();
      date1.setHours(0,0,0,0);

      let date2 = getFormatedDateAndTimeWithoutUTC(order.permit_info.enddate, timezone, this.props.user)
      date2.setHours(23, 59, 59, 999);
      // const date2 = new Date(order.permit_info.enddate);
      // date2.setHours(23, 59, 59, 999);
      if (date2 < date1) {
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        status = "Expired"
      } else {
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays == 1 || diffDays == 0) {
          status = "Expiring Soon"
        } else {
          // daysIn = diffDays + " days"
        }
        // daysIn = diffDays + " days"
      }
    }
    if(order.permit_info.isPermit === false && status !== "Expired") {
      status = "Pending Active"
    }

    return status
  }
  getStatusClass (status) {
    let classes = "permit-greenlabel status-container"
    if (status === "Pending Active") {
      classes = "permit-bluelabel status-container"
    }
    if (status === "Expiring Soon") {
      classes = "permit-orangelabel status-container"
    }
    if (status === "Expired") {
      classes = "permit-redlabel status-container"
    }
    return classes
  }

  openPermit (url) {
    window.open(url, "_blank")
  }

  render() {
    const { orderDetail, user  } = this.props
    let created =  orderDetail && orderDetail.permit_info && orderDetail.permit_info.createdat && orderDetail.permit_info.createdat
    if(created) {
      created = this.getFormatedDateAndTime(created)
    }
    let createdInfo = orderDetail && orderDetail.permit_info && orderDetail.permit_info.timezone  && Object.keys(orderDetail.permit_info.timezone).length !== 0 ? getTimeInDayAndHours(created) : getDateMMDDYYYHHMM(orderDetail.permit_info.createdat )

    return (
      <div>
        {/* view permit open */}
        <ReactModal
          isOpen={this.props.isViewModalOpen}
          onRequestClose={this.closeModal.bind(this)}
          contentLabel="Add Team Member"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-960 react-modal-dialog-centered">
            <div className="react-modal-header d-flex align-items-center">
              <div>
                <h5 className="react-modal-title d-flex align-items-center">Permit Information - {_.get(orderDetail, 'permit_info.permitid', '')}
                  <span className={this.getStatusClass(this.getStatusOfPermit())}>{this.getStatusOfPermit()}</span></h5>
                <h6 className="react-modal-title-sub"><span>Created On:</span> {createdInfo} <span className="pipeline">|</span> <span className="clearfixmob"></span> <span>By:</span> {_.get(orderDetail, 'created.name', '') !== '' ? _.get(orderDetail, 'created.name', ''): _.get(user, 'firstname', '') !== '' ? _.get(user, 'firstname', '') : _.get(user, 'companyname', '')}</h6>
              </div>
              <div className="marg-left-auto">
                <button type="button" className="btn react-modal-close" onClick={this.closeModal.bind(this)}><CloseIcon /></button>
              </div>
              {/* <div className="loaderdownloadbtn">
                {(statusCheck !== "Pending Delivery" && !String(statusCheck).includes('Future Exchange') && statusCheck !== "Future Removal") ?
                  <img className="arrow-loader" onClick={this.getDownloadReceipt.bind(this, orderData.id)}
                    src={String(this.state.receiptid) === String(orderData.id) ? LoaderGif : DownloadArrow}
                  />
                  : ""}
              </div> */}
            </div>
            {/* <div className="divider-line"></div> */}
            <div className="react-modal-body p-0">

              <div className="leftcontent">
                <div className="tabsContainer mb-3 pt-2">
                  <div className="pannel-wrapper">
                    <ul>
                      <li>
                        <h4>Permit Details</h4>
                        <div className="boxwrapper">
                          <ul>
                            <li>
                              <label>Permit #</label>
                              <div className="detail">{_.get(orderDetail, 'permit_info.permitnumber', '')}</div>
                            </li>
                            <li>
                              <label>Permit Valid To</label>
                              <div className="detail">{ orderDetail && orderDetail.permit_info && orderDetail.permit_info.enddate ? getDate(orderDetail.permit_info.enddate) : "N/A"}</div>
                            </li>
                            <li>
                              <label>Permit Valid From</label>
                              <div className="detail">{ orderDetail && orderDetail.permit_info && orderDetail.permit_info.startdate ? getDate(orderDetail.permit_info.startdate) : "N/A"}</div>
                            </li>
                            <li>
                              <label>Days left to expire</label>
                              <div className="detail">{this.getexpireDays()}</div>
                            </li>
                          </ul>
                        </div>
                      </li>


                      <li>
                        <h4>Who is this permit for and where is it going? </h4>
                        <div className="boxwrapper">
                          <ul>
                            <li>
                              <label>Order Number </label>
                              <div className="detail">{_.get(orderDetail, 'orderid', '')}</div>
                            </li>
                            <li>
                              <label>Customer</label>
                              <div className="detail">{_.get(orderDetail, 'customer_info.companyname', '')}</div>
                            </li>
                            {/* <li>
                              <label>Order Number </label>
                              <div className="detail">29394839393</div>
                            </li> */}
                            <li>
                              <label>Does this order need permit?</label>
                              <div className="detail">{_.get(orderDetail, 'permit_info.isPermit', false) === true ? "Yes" : "No"}</div>
                            </li>
                            <li>
                              <label>Address</label>
                              <div className="detail detail-map">
                                <p>{this.formatAddess(orderDetail)}</p>
                                <p><b>Borough:</b> {_.get(orderDetail, 'borough', 'N/A')}</p>
                                <p><b>Neighborhood:</b> {_.get(orderDetail, 'neighbourhood', 'N/A')}</p>
                              </div>
                              <button className="btn-viewmap" onClick={this.openMapModal.bind(this)}>View Map</button>
                            </li>
                          </ul>
                        </div>
                        {_.get(orderDetail, 'permit_info.isPermit', false) === false && _.get(orderDetail, 'permit_info.history_info', []).length > 0 ?
                        <div className="permitbottom">
                          <h2>Permit History </h2>
                          {_.get(orderDetail, 'permit_info.history_info', []).map((h, i)=>{
                            return (
                              <div className="" key={i}>
                                { h.isArchvie ?
                                  <p> The pemit was <span>archived</span> by <span>{_.get(user, 'username', '')}</span> at <span>{this.getHistoryDate(h)}</span> for <span>{h.reason === "Other" ? h.otherReason : h.reason}</span></p>
                                  :
                                  <p>The pemit was marked as <span>Not Needed Anymore</span> by <span>{_.get(user, 'username', '')}</span>   because <span>{h.reason === "Other" ? h.otherReason : h.reason}</span>.</p>
                                }
                                <h6> {this.getHistoryDate(h)}</h6>
                              </div>
                            )
                          })}
                          {/* <div className="">
                            <p>The pemit was marked as <span>Not Needed Anymore</span> by <span>usersername</span>   because <span>reason</span>.</p>
                            <h6>February 21, 2020 05:12 am EST </h6>
                          </div>
                          <p> The pemit was <span>archvied</span> by <span>usersername</span> at <span>date and time</span> for <span>reason</span></p>
                          <h6>February 21, 2020 05:12 am EST </h6>                  */}
                        </div> : "" }
                      </li>
                    </ul>
                  </div>
                </div>
              </div>



              <div className="rightbtns">
                <h4>Actions</h4>
                <button className="btn btn-dark w-180 w-half font-600 font-16" onClick={this.vieworder.bind(this)}><span><img src={PermitOrderIcon} /></span> View Order</button>
                {_.get(orderDetail, 'permit_info.uploadedFile.fileName', '') !== '' && _.get(orderDetail, 'permit_info.uploadedFile.uploadfileurl', '') !== '' ?
                    <button onClick={this.openPermit.bind(this,_.get(orderDetail, 'permit_info.uploadedFile.uploadfileurl', ''))} className="btn btn-dark w-180 w-half font-600 font-16"><span><img src={PermitOrderIcon} /></span> View Permit</button>
                  :
                  ''
                }
                {/* {_.get(orderDetail, 'permit_info.uploadedFile.fileName', '') !== '' && _.get(orderDetail, 'permit_info.uploadedFile.uploadfileurl', '') !== '' ?
                    <button onClick={this.downloadPermit.bind(this)} className="btn btn-dark w-180 w-half font-600 font-16"><span><img src={PermitViewIcon} /></span> Download Permit</button>
                  :
                  ''
                } */}
                <button className="btn btn-dark w-180 w-half font-600 font-16" onClick={this.copyModal.bind(this)}><span><img src={copyorderIcon} /></span> Copy Permit</button>
                <button className="btn btn-dark w-180 w-half font-600 font-16" onClick={this.openEditModal.bind(this)}><span><img src={editorderIcon} /></span> Edit Permit</button>
                {_.get(orderDetail, 'permit_info.isArchvie', false) === false ?
                  <button className="btn btn-dark w-180 w-half font-600 font-16" onClick={this.archviedPermit.bind(this)} ><span><img src={editorderIcon} /></span> Archive Permit</button>
                : ''}
                <button className="btn btn-dark w-180 w-half redbg font-600 font-16" onClick={this.openConfirmDeleteModal.bind(this, _.get(orderDetail, 'permit_info._id', ''), _.get(orderDetail, 'permit_info.orderid', ''))}><span><img src={deleteorderIcon} /></span> Delete Permit</button>
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

                <button type="button" className="btn react-modal-close pos-static" onClick={this.closeMapModal.bind(this)}><CloseIcon /></button>
              </div>
            </div>
            <div className="divider-line"></div>

            <div className="react-modal-body">

            <div className="mapviewmodal">
              <MapComponent position={_.get(orderDetail, 'location', '')} icon={getContainerSize(this.props.containerList, _.get(orderDetail, 'container', ''))}/>
            </div>
            </div>
            </div>
          </ReactModal>
        </ReactModal>

        {this.state.addPermitIsOpen ?
        <AddPermitModal
          orderDetail= {_.get(this.props, 'orderDetail', {})}
          addPermitIsOpen = {this.state.addPermitIsOpen}
          closeModal={this.closeModal}
          fetchOrderList =  {this.fetchOrderList.bind(this)}
          copyPermit = {true}
          {...this.props}
        /> : ""}

        {this.state.editPermitIsOpen ?
        <EditPermitModal
          orderDetail= {_.get(this.props, 'orderDetail', {})}
          editPermitIsOpen = {this.state.editPermitIsOpen}
          closeEditPermitModal={this.closeModal.bind(this)}
          containerList={_.get(this.props, 'containerList', [])}
          fetchOrderList = {this.fetchOrderList.bind(this)}
          isArchvie = {this.state.isArchvie}
          {...this.props}
        /> : ""}

        <DeleteModal
          deleteModelIsOpen={this.state.deleteModelIsOpen}
          closeModal={this.closeModal.bind(this)}
          confirmDelete={this.confirmDelete.bind(this)}
          text={'permit'}
        />

        {/* view permit close */}
      </div>
    )
  }
}
