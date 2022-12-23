import React, { PureComponent } from 'react'
import ReactModal from 'react-modal'
import Dropzone from 'react-dropzone'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Tabs, Select, message } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import InputMask from 'react-text-mask'
import DatePicker from "react-datepicker"
import delIcon from '../../../images/ic-delete.svg'
import { CloseIcon, MoreIcon } from '../../../components/icons'
import MapComponent from '../../../components/map'
import { formatPhoneNumber, formatPhoneNumberWithBrackets, formatOrderAddess, formatGeoAddressComponents, getDate, getDateMMDDYYYHHMM, getTimeInDayAndHours, getFormatedDateAndTimeWithoutUTC, getContainerSize } from '../../../components/commonFormate'

export default class CustomerOrdersComponent extends PureComponent {

  constructor() {
    super()
    this.state = {
      customer: '',
      orders: [],
      orderId: '',
      customerName: '',
      permitNumber: '',
      uploadedFile: {},
      validFrom: '',
      fileName: '',
      validTo: '',
      reason: '',
      isPermit: "Yes",
      maxDate: moment(),
      openMapModal: false,
      loadervisible: false
    }
  }

  closeModal() {
    this.props.closeEditPermitModal()
  }
  componentDidMount = async()=> {
    const { orderDetail  } = this.props
    const startdate =  _.get(orderDetail, 'permit_info.startdate', '') !== '' ? (new Date(getDate(_.get(orderDetail, 'permit_info.startdate', '')))) : new Date()
    const enddate =  _.get(orderDetail, 'permit_info.enddate', '') !== '' ? (new Date(getDate(_.get(orderDetail, 'permit_info.enddate', '')))) : new Date()
    let isPermit = ''
    if(this.props.isArchvie) {
      isPermit = 'No'
    } else {
      isPermit = _.get(orderDetail, 'permit_info.isPermit', false) === true ? "Yes" : "No"
    }
    this.setState({
      orderId : _.get(orderDetail, 'orderid', ''),
      customer : _.get(orderDetail, 'customer_info._id', ''),
      customerName : _.get(orderDetail, 'customer_info.companyname', ''),
      validTo : enddate,
      validFrom : startdate,
      permitNumber : _.get(orderDetail, 'permit_info.permitnumber', ''),
      // fileName : _.get(orderDetail, 'permit_info.fileName', ''),
      uploadedFile : _.get(orderDetail, 'permit_info.uploadedFile', {}),
      reason : _.get(orderDetail, 'permit_info.reason', ''),
      otherReason : _.get(orderDetail, 'permit_info.otherReason', ''),
      isPermit : isPermit,
    })

  }


  openMapModal() {
    this.setState({ openMapModal: true })
  }

  closeMapModal() {
    this.setState({ openMapModal: false })
  }


  onHandleChange (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleDateChange (type, date) {
    if (date) {
      if(type === 'validFrom') {
        let validTo = moment(date).add(4,'days')
        this.setState({ [type]: date, validTo: validTo._d },()=>{
          this.forceUpdate()
        })
      } else {
        this.setState({ [type]: date })
      }
    } else {
      this.setState({ [type]: '' })
    }
  }

  onDrop = async (files) => {
    const findIndex = _.findIndex(files, function(file) {
      return file.type == "application/pdf" || file.type ==  "image/png" || file.type == "image/jpeg"
    })
    if(findIndex !== -1) {
      const pdf = {}
      _.forEach(files, (file, i) => {
        this.setState({ fileName: file.name })
        //formdata.append(`files`, file)
        const reader = new FileReader()
        reader.onloadend = () => {
          // this.setState({ uploadfileurl: reader.result })
          pdf.uploadfileurl = reader.result
          pdf.type = file.type
          pdf.fileName = file.name
          this.setState({uploadedFile: pdf, fileError: "" },()=>{
            this.forceUpdate()
          })
        }
        reader.readAsDataURL(file)
      })

      // this.setState({uploadedFile: pdf, fileError: "" },()=>{
      //   this.forceUpdate()
      // })
    } else {
      this.setState({ fileError: "Please upload pdf or png file only.", uploadedFile: [] })
    }
  }

  validate() {
    let errObj = {}
    const {customer, orderId, permitNumber, isPermit, reason, otherReason, validTo, validFrom } = this.state
    if(permitNumber === "") {
      errObj.permitNumber = "Permit number Number is required"
    }

    if(validTo === "") {
      errObj.validTo = "Permit valid to is required"
    }
    if(validFrom === "") {
      errObj.validFrom = "Permit valid from is required"
    }

    if(isPermit === "No" && reason === '') {
      errObj.reason = "Reason is required"
    }
    if(reason && reason === 'Other' && otherReason == '') {
      errObj.otherReason = "Other reason is required"
    }
    this.setState({ err: errObj })
  }

  submit = async(isDraft) => {
    await this.validate()
    const {err} = this.state

    if(Object.keys(err).length === 0) {
      this.setState({ loadervisible: true })
      let { customer, orderId, permitNumber, validTo, validFrom, uploadedFile, isPermit, reason, otherReason } = this.state
      const { user, orderDetail } = this.props
      // validFrom = validFrom.setHours(0, 0, 0, 0)
      // validTo = validTo.setHours(23, 59, 59, 999);
      let obj = {
        customerid: _.get(orderDetail, 'customer_info._id', ''),
        orderid: _.get(orderDetail, '_id', ''),
        permitnumber: permitNumber,
        enddate: moment(validTo).format('YYYY-MM-DDTHH:mm:ss'),
        startdate: moment(validFrom).format('YYYY-MM-DDTHH:mm:ss'),
        isPermit: isPermit === "Yes" ? true: false,
        reason: isPermit === "Yes" ? '' : reason,
        username: _.get(user, 'username', '')
      }
      if(Object.keys(uploadedFile).length !== 0) {
        obj.uploadedFile = uploadedFile
      }
      if (reason && reason === "Other") {
        obj.otherReason = otherReason
      }
      if (this.props.isArchvie) {
        obj.isArchvie = true
      }

      // obj.timezone = _.get(user, 'timezone', {})
      obj.id = _.get(orderDetail, 'permit_info._id', '')
      try {
        let { value } = await this.props.updatePermit(obj)
        this.props.fetchOrderList()
        this.setState({ loadervisible: false })
        this.props.closeEditPermitModal()
      } catch (e) {
        this.setState({errMessage: _.get(e, 'error.message', '')})
      }
    }
  }

  getFormatedDateAndTime(input) {
    //return ""
    const timezone = _.get(this.props, 'orderDetail.permit_info.timezone', {})
    if(Object.keys(this.props.user).length !== 0 && timezone) {
      return getFormatedDateAndTimeWithoutUTC(input, timezone, this.props.user)
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

  removeFile() {
    this.setState({ uploadedFile: {} })
  }

  render() {
    const { orderDetail, user  } = this.props
    const {err  } = this.state
    let created =  orderDetail && orderDetail.permit_info && orderDetail.permit_info.createdat && orderDetail.permit_info.createdat
    if(created) {
      created = this.getFormatedDateAndTime(created)
    }
    let createdInfo = orderDetail && orderDetail.permit_info && orderDetail.permit_info.timezone  && Object.keys(orderDetail.permit_info.timezone).length !== 0 ? getTimeInDayAndHours(created) : getDateMMDDYYYHHMM(orderDetail.permit_info.createdat )
    // console.log(this.state.uploadedFile, 'jjjjjjj')
    return (
      <div>
        { this.state.loadervisible ?
          <div className="fullpage-loader">
            <span className="loaderimg">
                <div className="spinner-border text-warning" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </span>
          </div> :
        "" }
        {/* edit permit open */}
        <ReactModal
          isOpen={this.props.editPermitIsOpen}
          onRequestClose={this.closeModal.bind(this)}
          contentLabel="Add Team Member"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-724 react-modal-dialog-centered">

            <div className="react-modal-header d-flex align-items-center">
              <div>
                <h5 className="react-modal-title d-flex align-items-center">Edit Permit - {_.get(orderDetail, 'permit_info.permitid', '')} </h5>
                <h6 className="react-modal-title-sub"><span>Created On:</span> {createdInfo} <span className="pipeline">|</span> <span className="clearfixmob"></span> <span>By:</span> {_.get(orderDetail, 'created.name', '') !== '' ? _.get(orderDetail, 'created.name', ''): _.get(user, 'firstname', '') !== '' ? _.get(user, 'firstname', '') : _.get(user, 'companyname', '')}</h6>
              </div>
              <div className="marg-left-auto">
                <button type="button" className="btn react-modal-close" onClick={this.closeModal.bind(this)}><CloseIcon /></button>
              </div>
            </div>

            <div className="divider-line"></div>
            <div className="react-modal-body">

              <div className="row">
                <div className="col-md-12">
                  <h4 className="permit-heading">Who is the permit for and where is it going? </h4>
                  <div className="form-group material-textfield">
                    <input
                      type="test"
                      className="form-control material-textfield-input"
                      value={this.state.customerName}
                      readOnly
                      required />
                    <label className="material-textfield-label">Customer <span className="text-danger">*</span></label>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      value={this.state.orderId}
                      readOnly
                      required />
                    <label className="material-textfield-label">Order Number <span className="text-danger">*</span></label>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="boxwrapper-address">
                    <ul>
                      <li>
                        <div className="detail detail-map">
                          <p><b>Address:</b> {this.formatAddess(orderDetail)}</p>
                          <p><b>Borough:</b> {_.get(orderDetail, 'borough', 'N/A')}</p>
                          <p><b>Neighborhood:</b> {_.get(orderDetail, 'neighbourhood', 'N/A')}</p>
                        </div>
                        <button className="btn-viewmap" onClick={this.openMapModal.bind(this)}>View Map</button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <h4 className="permit-heading">What are the permit details?</h4>
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name="permitNumber"
                      value={this.state.permitNumber}
                      onChange={this.onHandleChange.bind(this)}
                      required />
                    <label className="material-textfield-label">Permit Number <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.permitNumber ? err.permitNumber : ""}</p>
                  </div>
                </div>
              </div>


              <div className="row">
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                  <DatePicker
                    className="form-control material-textfield-input custom-select"
                    selected={this.state.validFrom}
                    // disabled={this.getStatus(orderDataForEdit.status) === "Complete" ? true : false}
                    onChange={this.handleDateChange.bind(this, 'validFrom')}
                    //minDate={new Date()}
                    required />
                    <label className={this.state.validFrom ? "material-textfield-label address-focus-label" : "material-textfield-label"}>Permit Valid From </label>
                    <p className="text-danger">{err && err.validFrom ? err.validFrom : ""}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                  <DatePicker
                    className="form-control material-textfield-input custom-select"
                    selected={this.state.validTo}
                    disabled={this.state.validFrom ? false : true}
                    onChange={this.handleDateChange.bind(this, 'validTo')}
                    minDate={new Date(this.state.validFrom)}
                    // maxDate={new Date(this.state.maxDate)}
                    required />
                    <label className={this.state.validTo ? "material-textfield-label address-focus-label" : "material-textfield-label"}>Permit Valid To </label>
                    <p className="text-danger">{err && err.validTo ? err.validTo : ""}</p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group material-textfield">
                    <select
                      name="isPermit"
                      value={this.state.isPermit}
                      disabled={this.props.isArchvie ? true : false}
                      onChange={this.onHandleChange.bind(this)}
                      className="form-control custom-select h-66 w-100 font-16 material-textfield-input" required>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                    <label className="material-textfield-label">Does this order need permit?</label>
                  </div>
                </div>
              </div>
              {this.state.isPermit === "No" && (
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group material-textfield">
                      <select
                        name="reason"
                        value={this.state.reason}
                        onChange={this.onHandleChange.bind(this)}
                        className="form-control custom-select h-66 w-100 font-16 material-textfield-input" required>
                          <option value="">Select reason</option>
                          <option value="Permit no longer required as customer obtained their own permit">Permit no longer required as customer obtained their own permit</option>
                          <option value="Permit no longer required as container is no longer being located on the street">Permit no longer required as container is no longer being located on the street</option>
                          <option value="Permit now required as customer's permit is no longer valid">Permit now required as customer's permit is no longer valid</option>
                          <option value="Permit now required as customer's permit is no longer valid">Permit now required as container will be located on the street</option>
                          <option value="Other">Other</option>
                      </select>
                      <label className="material-textfield-label">What's the reason</label>
                      <p className="text-danger">{err && err.reason ? err.reason : ""}</p>
                    </div>
                  </div>
                </div> )}
                {this.state.isPermit === "No" && this.state.reason === "Other" && (
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group material-textfield">
                      <textarea
                        className="form-control material-textfield-input"
                        name="otherReason"
                        placeholder="Enter Reason"
                        value={this.state.otherReason}
                        onChange={this.onHandleChange.bind(this)}
                        required />
                      {/* <label className="material-textfield-label">Permit Number <span className="text-danger">*</span></label> */}
                      <p className="text-danger">{err && err.otherReason ? err.otherReason : ""}</p>
                    </div>
                  </div>
                </div>)}

              <div className="row mb-3">
                <div className="col-md-12">
                  <Dropzone className="dropzone-droparea" multiple={false} onDrop={acceptedFiles => this.onDrop(acceptedFiles)} >
                    {({ getRootProps, getInputProps }) => (
                      <div className="dropzone-border" {...getRootProps()}><input {...getInputProps()} />
                      Upload <br /> or<br />
                      <button className="btn btn-dark btn-sm font-600 mt-2 pl-4 pr-4">Drag & Drop Permit</button>
                    </div>
                    )}
                  </Dropzone>
                </div>
                {this.state.fileError && <p className="text-danger">{this.state.fileError}</p>}
              </div>

              {_.get(this.state, 'uploadedFile.fileName', '') !== '' ?
              <div className="row">
                <div className="col-md-12">
                  <h4 className="permit-heading">Uploaded File</h4>
                  <h5 className="permit-heading yellowfont"><a href={_.get(this.state, 'uploadedFile.uploadfileurl', '')} target="_blank">{_.get(this.state, 'uploadedFile.fileName', '')}</a> <img onClick={this.removeFile.bind(this)} src={delIcon} className="ml-3"/> </h5>
                </div>
              </div> : "" }


              <button onClick={this.submit.bind(this)} className="btn btn-dark btn-lg w-100 font-600" >Update Permit</button>
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
        {/* edit permit close */}
      </div>
    )
  }
}
