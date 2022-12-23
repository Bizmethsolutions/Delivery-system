import React, { PureComponent } from 'react'
import ReactModal from 'react-modal'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Tabs, Select, message } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import InputMask from 'react-text-mask'
import DatePicker from "react-datepicker"
import Dropzone from 'react-dropzone'
import { CloseIcon, MoreIcon } from '../../../components/icons'
import config from '../../../config'
import { formatPhoneNumber, formatPhoneNumberWithBrackets, formatOrderAddess, formatGeoAddressComponents, getDate, getDateMMDDYYYHHMM, getTimeInDayAndHours, getFormatedDateAndTimeWithoutUTC, getContainerSize } from '../../../components/commonFormate'
const timezoneKey = config.timezone_api_key.api_key
const timezoneApi = config.timezone_api_key.api_url

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
      validTo: '',
      maxDate: moment(),
      loadervisible: false
    }
    this.closeModal = this.closeModal.bind(this)
  }

  closeModal() {
    this.props.closeModal()
  }
  componentDidMount = async()=> {
    const { orderDetail  } = this.props
    const startdate =  _.get(orderDetail, 'permit_info.startdate', '') !== '' ? (new Date(getDate(_.get(orderDetail, 'permit_info.startdate', '')))) : ''
    const enddate =  _.get(orderDetail, 'permit_info.enddate', '') !== '' ? (new Date(getDate(_.get(orderDetail, 'permit_info.enddate', '')))) : ''

    if (_.get(this.props, 'copyPermit', false)) {
      this.setState({
        orderId : _.get(orderDetail, 'orderid', ''),
        customer : _.get(orderDetail, 'customer_info._id', ''),
        customerName : _.get(orderDetail, 'customer_info.companyname', ''),
        permitNumber : _.get(orderDetail, 'permit_info.permitnumber', ''),
        uploadedFile : _.get(orderDetail, 'permit_info.uploadedFile', {}),
        validTo : enddate,
        validFrom : startdate,
      })
    } else {
      this.setState({
        orderId : _.get(orderDetail, 'orderid', ''),
        customer : _.get(orderDetail, 'customer_info._id', ''),
        customerName : _.get(orderDetail, 'customer_info.companyname', ''),
      })
    }
  }



  onHandleChange (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleDateChange (type, date) {
    if (date) {
      let validTo = moment(date).add(4,'days')
      if(type === 'validFrom') {
        this.setState({ [type]: date, validTo: validTo._d })
      } else {
        this.setState({ [type]: date })
      }
    } else {
      this.setState({ [type]: '' })
    }
  }

  // selectCustomer = async(e)=> {
  //   if (e.target.value) {
  //     this.setState({customer: e.target.value }, async()=>{
  //       let data ={
  //         customerId: this.state.customer
  //       }
  //       let { value } = await this.props.getOrdersForPermit(data)
  //       if (value.type === 'success'){
  //         this.setState({ orders: value.data })
  //       }
  //     })
  //   } else {
  //     this.setState({customer: '', orders: [] }, ()=>{
  //
  //     })
  //   }
  // }

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
    const {customer, orderId, permitNumber, validTo, validFrom } = this.state
    if(permitNumber === "") {
      errObj.permitNumber = "Permit number Number is required"
    }
    if(validTo === "") {
      errObj.validTo = "Permit valid to is required"
    }
    if(validFrom === "") {
      errObj.validFrom = "Permit valid from is required"
    }
    this.setState({ err: errObj })
  }

  submit = async(isDraft) => {
    await this.validate()
    const {err} = this.state

    if(Object.keys(err).length === 0) {
      this.setState({ loadervisible: true })
      let {customer, orderId, permitNumber, validTo, validFrom, uploadedFile} = this.state
      const { user, orderDetail } = this.props
        // validFrom = validFrom.setHours(0, 0, 0, 0)
        // validTo = validTo.setHours(23, 59, 59, 999);
      let obj = {
        customerid: _.get(orderDetail, 'customer_info._id', ''),
        orderid: _.get(orderDetail, '_id', ''),
        permitnumber: permitNumber,
        enddate: moment(validTo).format('YYYY-MM-DDTHH:mm:ss'),
        startdate: moment(validFrom).format('YYYY-MM-DDTHH:mm:ss'),
        uploadedFile: uploadedFile
      }
      const date = new Date().getTimezoneOffset()
      let timezone = {}
      timezone.clientoffset = date
      timezone.clienttimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      obj.timezone = timezone
      //obj.createdat = new Date()
      try {
        let { value } = await this.props.addPermit(obj)
        this.props.fetchOrderList()
        this.props.getPermitCount()
        this.setState({ loadervisible: false })
        this.props.closeModal()
      } catch (e) {
        this.setState({errMessage: _.get(e, 'error.message', '')})
      }
    }
  }

  async fetchCustomersForList() {
    const { search_string, limit, by, page, sort_field  } = this.state
    let customerid = this.props.selectedCustomer && this.props.selectedCustomer.id
    let data = {
      search_string,
      limit,
      by,
      page,
      sort: sort_field,
      customerId: customerid
    }
    let { value } = await this.props.fetchCustomers(data)
    this.setState({
      customersList: _.get(value, 'customers', [])
    })
  }

  render() {
    const { isViewModalOpen, isEditModalOpen, err } = this.state
    const isHomeCustomer = _.get(this.props, 'selectedCustomer.isHomeCustomer', false)
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
        {/* add permit open */}
        <ReactModal
          isOpen={this.props.addPermitIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Add Team Member"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-724 react-modal-dialog-centered">
            <div className="react-modal-header">
              <h5 className="react-modal-title">Add Permit</h5>
              <button type="button" className="btn react-modal-close" onClick={this.closeModal}><CloseIcon /></button>
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
                    type="test"
                    className="form-control material-textfield-input"
                    value={this.state.orderId}
                    readOnly
                    required />
                    <label className="material-textfield-label">Order Number <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.orderId ? err.orderId : ""}</p>
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
                    {/* <select className="form-control material-textfield-input custom-select" name="haulercompany" className="form-control custom-select h-66 w-100 font-16 material-textfield-input" required>
                      <option value="">Select</option>
                    </select> */}
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
                    {/* <select className="form-control material-textfield-input custom-select" name="haulercompany" className="form-control custom-select h-66 w-100 font-16 material-textfield-input" required>
                      <option value="">Select</option>
                    </select> */}
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
                  <h5 className="permit-heading yellowfont">{_.get(this.state, 'uploadedFile.fileName', '')} </h5>
                </div>
              </div> : "" }
              {/* <div className="row mb-3">
                <div className="col-md-12">
                  <div className="dropzone-border">
                    Upload <br /> or<br />
                    <button className="btn btn-dark btn-sm font-600 mt-2 pl-4 pr-4">Drag & Drop Permit</button>
                  </div>
                </div>
              </div> */}


              <button onClick={this.submit.bind(this)} className="btn btn-dark btn-lg w-100 font-600" >Upload New Permit</button>
            </div>
          </div>
        </ReactModal>
        {/* add permit close */}

      </div>
    )
  }
}
