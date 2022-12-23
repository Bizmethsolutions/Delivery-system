import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import _ from "lodash"
// import PropTypes from 'prop-types'
import ReactModal from 'react-modal'
import InputMask from 'react-text-mask'
import { Menu, Dropdown, Select, Popconfirm, message, Pagination } from 'antd'

import EmptyComponent from '../../../components/emptyComponent'
import { CloseIcon, MoreIcon } from '../../../components/icons'
import AddressAutoComplete from '../../../components/AddressAutoComplete';
import config from '../../../config/index'
import { SortingNewDownIcon, SortingNewUpIcon, ArrowIcon, ViewIcon, LocationIconRed, LocationIconPurple, LocationIconSky, DumpsiteIcon, YardIcon, LocationIconGreen, LocationIconYellow, LocationIconOrange, DotBtnIcon, SortingDownArrow } from '../../../components/icons'
import { formatGeoAddressComponents, formatOrderAddess, formatPhoneNumber } from '../../../components/commonFormate'
import DeleteModal from '../../../components/deleteModal'
import '../styles.scss'
const { Option } = Select
const timezoneoptions = config.timeZoneArr
const phoneNumberMask = config.phoneNumberMask

export default class ResourcesComponent extends PureComponent {

  static propTypes = {
    // PropTypes go here
  }
  constructor() {
    super()
    this.state = {
      limit: 20,
      by: 1,
      page: 0,
      sort_field: '_id',
      search_string: '',
      type: 'd',
      dumpList: [],
      dumpModalTitle: "New Dump",
      companyname: "", address: "", latitute: "", longitude: "",
      zipcode: "", state: "", neighborhood: "", phone: "", email: "",
      city: "", state: "", borough: '', new_address: '', address: '',
      editDumpId: "",
      err: {},
      saveClicked: false,
      dumpid: '',
      dumpError: '',
      onAddressInputvalue: '',
      deleteModelIsOpen: false,
      location:{ lat:0, lng:0 }
    }
    this.onHandleChange = this.onHandleChange.bind(this)
  }

  componentDidMount = async()=> {
    document.title = 'Dumps | CurbWaste'
    this.fetchDump()
  }

  fetchDump = async()=> {
    const {limit, by, page, sort_field, search_string, type } = this.state
    let data = {
      limit, by, page, sort_field, search_string, type
    }
    let { value } = await this.props.getDumps(data)
    this.setState({ dumpList: value.dumps, totalDumps: value.total })
  }

  sortby(field) {
    if (this.state.sort_field === field) {
        this.state.by = this.state.by * -1
    } else {
        this.state.sort_field = field
        this.state.by = 1;
    }
    this.fetchDump()
  }

  onSearch (key) {
    this.setState({ search_string: key}, ()=>{
      this.fetchDump()
    })
  }

  onPagechange (nextPage) {
    let page = nextPage - 1
    this.setState({ page }, ()=>{
      this.fetchDump()
    })
  }

  onHandleChange(e) {
    this.setState({ [e.target.name] : e.target.value}, () => {
      if(this.state.saveClicked === true) {
        this.validate()
      }
    })
  }

  onAddressSelect(suggest) {
    this.suggestedAddress = suggest
    if (suggest) {
      let geoDetails = formatGeoAddressComponents(suggest.gmaps, suggest.description)
      geoDetails.lat = suggest.location.lat
      geoDetails.lng = suggest.location.lng
      geoDetails.geoPlaceId = suggest.gmaps.place_id
      if (geoDetails.address === "") {
        geoDetails.address = suggest.gmaps.formatted_address
      }
      this.setAddressState(geoDetails, suggest.description)
    }
  }

  setAddressState(geoDetails, description) {
    this.setState({
      street_no: geoDetails.streetNo,
      floor: geoDetails.floor,
      route: geoDetails.route,
      new_address: geoDetails.address,
      address: description,
      location: {
          lat: geoDetails.lat,
          lng: geoDetails.lng
      },
      neighborhood: geoDetails.neighborhood,
      state: geoDetails.state,
      city: geoDetails.city,
      latitute: geoDetails.lat,
      longitude: geoDetails.lng,
      borough: geoDetails.borough,
      zipcode: geoDetails.zipcode ? geoDetails.zipcode : "",
      geoPlaceId: geoDetails.geoPlaceId
    })
  }

  validate() {
    let errObj = {}
    const { email, companyname, state, city, new_address, borough, neighborhood, zipcode, phone, err } = this.state
    // if (email) {
    //   if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false) {
    //     errObj.email = "Please enter a valid email address"
    //   }
    // }
    // if(email === "") {
    //   errObj.email = "Email is required"
    // }

    if(companyname === "") {
      errObj.companyname = "Company name is required"
    }
    // if(zipcode === "") {
    //   errObj.zipcode = "Zipcode is required"
    // }
    // if(phone === "") {
    //   errObj.phone = "Cell Phone number is required"
    // }
    // const phonelength = phone.replace(/[^0-9]/g,"").length
    // if(phonelength !== 10) {
    //   errObj.phone = "Please enter exactly 10 digit number"
    // }
    // if(new_address === "" || !new_address) {
    //   errObj.address = "Address is required"
    // }
    // if(city === "") {
    //   errObj.city = "City is required"
    // }
    // if(state === "") {
    //   errObj.state = "State is required"
    // }
    this.setState({ err: errObj })
  }

  saveYard = async() => {
    this.setState({ saveClicked : true })
    await this.validate()
    const {err, email} = this.state
    const { addDump, updateDump } = this.props
    if(Object.keys(err).length === 0) {
      const obj ={
        companyname: this.state.companyname,
        email: email && email.toLowerCase(),
        city: this.state.city,
        state: this.state.state,
        phone: formatPhoneNumber(this.state.phone),
        address: this.state.new_address,
        zipcode: this.state.zipcode,
        borough: this.state.borough,
        neighborhood: this.state.neighborhood,
        type: "d",
        location: this.state.location
      }
      if(this.state.editDumpId === "") {
        try {
          let { value } = await addDump(obj)
          this.closeModal()
          this.fetchDump()
        } catch (e) {
          this.setState({dumpError: e.error.message})
        }
      } else {
        obj.id = this.state.editDumpId
        obj.dumpid = this.state.dumpid
        try {
          let { value } = await updateDump(obj)
          this.closeModal()
          this.fetchDump()
        } catch (e) {
          this.setState({dumpError: e.error.message})
        }
      }
    }
  }

  openYardEditModal (dump) {
    this.props.openModal('dumpModal')
    if(dump) {
      this.setState({
        dumpModalTitle: "Edit Dump",
        companyname: dump.companyname,
        email: dump.email,
        city: dump.city,
        state: dump.state,
        phone: dump.phone,
        new_address: dump.address,
        zipcode: dump.zipcode,
        borough: dump.borough,
        neighborhood: dump.neighborhood,
        editDumpId: dump.id,
        location: dump.location,
        dumpid: dump.dumpid,
        err: {},
        dumpError: ''
      })
    }
  }


  openConfirmDeleteModal (id) {
    this.setState({ dumpid: id, deleteModelIsOpen: true })
  }

  confirmDelete = async() => {
    let data = {
      dumpId: this.state.dumpid
    }
    let { value } = await this.props.deleteDump(data)
    message.success('successfully deleted')
    this.fetchDump()
    this.closeModal()
  }

  closeModal() {
    this.setState({ deleteModelIsOpen: false })
    this.props.closeModal()
    this.resetState()
  }

  resetState () {
    this.setState({
      companyname: "", address: "", latitute: "", longitude: "",
      zipcode: "", state: "", neighborhood: "", phone: "", email: "", city: "", borough: "",
      new_address: '', err: {}, editDumpId: '', dumpid: '', location: {lat:0, lng:0},
      dumpModalTitle: "New Dump", dumpError: ''
    })
  }

  formatAddess (dump) {
    let address = formatOrderAddess(dump)
    return address
  }

  onChangeAddressField (value) {
    this.setState({ onAddressInputvalue: value },()=>{
      if (this.state.onAddressInputvalue ===""){
        this.setState({ new_address: ''})
      }
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

  render() {
    const { err } = this.state
    return (
      <div className="row">
        <div className="col-md-12">
          <div>
            {_.get(this.state, 'dumpList', []).length > 0 ?
              <div className="table-responsive">
                <table className="table custom-table-secondary white-bg">
                  <thead className="gray-bg">
                    <tr>
                      <th onClick={() => { this.sortby('_id')} }>
                        <span className="custom-table-th-title-sm for-cursor">Dump ID {this.getSortArrow('_id')}</span>
                      </th>
                      <th onClick={() => { this.sortby('companyname') }}>
                        <span className="custom-table-th-title-sm for-cursor">Company Name {this.getSortArrow('companyname')}</span>
                      </th>
                      <th onClick={() => { this.sortby('address') }}>
                        <span className="custom-table-th-title-sm for-cursor">Company Address {this.getSortArrow('address')}</span>
                      </th>
                      <th onClick={() => { this.sortby('email') }}>
                        <span className="custom-table-th-title-sm for-cursor">Email {this.getSortArrow('email')}</span>
                      </th>
                      <th onClick={() => { this.sortby('phone') }}>
                        <span className="custom-table-th-title-sm for-cursor">Phone {this.getSortArrow('phone')}</span>
                      </th>
                      <th className="width-50 rem-pad-lr">
                        <span className="custom-table-th-title-sm">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="table-card">
                    {_.get(this.state, 'dumpList', []).map((dump, index)=>{
                      return (
                      <tr key={index}>
                        <td>
                          <span className="custom-table-title custom-table-title-md">{_.get(dump, 'dumpid', '')}</span>
                        </td>
                        <td>
                          <span className="custom-table-title custom-table-title-md">{_.get(dump, 'companyname', '')}</span>
                        </td>
                        <td>
                          <span className="custom-table-title custom-table-title-md">{this.formatAddess(dump)}</span>
                        </td>
                        <td>
                          <span className="custom-table-title custom-table-title-md">{_.get(dump, 'email', '')}</span>
                        </td>
                        <td>
                          <span className="custom-table-title custom-table-title-md">{_.get(dump, 'phone', '')}</span>
                        </td>
                        <td>
                          <Dropdown overlay={<Menu>
                            <Menu.Item key="1">
                              <a href="#" onClick ={this.openYardEditModal.bind(this, dump)}>Edit</a>
                            </Menu.Item>
                            <Menu.Item key="2">
                              <a href="#" onClick={this.openConfirmDeleteModal.bind(this,dump.id )}>Delete</a>
                            </Menu.Item>
                            </Menu>} trigger={['click']} overlayClassName="profile--dropdown--overlay profile--dropdown--overlay-sm dropdownfix-right">
                            <a className="ant-dropdown-link d-flex align-items-center justify-center" href="#">
                              <DotBtnIcon />
                            </a>
                          </Dropdown>
                        </td>
                      </tr>
                    )
                  })}
                  </tbody>
                </table>
              </div>
              :
              <EmptyComponent
                emptyText = "No Dumps"
              />
            }
          </div>
        </div>

        <ReactModal
          isOpen={this.props.dumpModal}
          onRequestClose={this.closeModal.bind(this)}
          contentLabel="Add Team Member"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-centered">
            <div className="react-modal-header">
              <h5 className="react-modal-title">{this.state.dumpModalTitle}</h5>
              <button onClick={this.closeModal.bind(this)} type="button" className="btn react-modal-close" ><CloseIcon /></button>
            </div>
            <div className="divider-line"></div>
            <div className="react-modal-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name="companyname"
                      value={this.state.companyname}
                      onChange={this.onHandleChange}
                      required />
                    <label className="material-textfield-label">Company Name <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.companyname ? err.companyname : ""}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <InputMask
                      className="form-control material-textfield-input"
                      name="phone"
                      value={this.state.phone}
                      onChange={this.onHandleChange}
                      guide={false}
                      type="text"
                      keepCharPositions={false}
                      mask={phoneNumberMask}
                      required />
                    <label className="material-textfield-label">Phone Number</label>
                    <p className="text-danger">{err && err.phone ? err.phone : ""}</p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name="email"
                      value={this.state.email}
                      onChange={this.onHandleChange}
                      required />
                    <label className="material-textfield-label">Email </label>
                    <p className="text-danger">{err && err.email ? err.email : ""}</p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group material-textfield">
                    <AddressAutoComplete
                      inputClassName={"form-control material-textfield-input"}
                      onSelect={(suggest) => this.onAddressSelect(suggest)}
                      initialValue={this.state.new_address}
                      onChange={(value) => this.onChangeAddressField(value)}
                    />
                    <label className={this.state.new_address || this.state.onAddressInputvalue ? "material-textfield-label address-focus-label" : "material-textfield-label"}>Address </label>
                    <p className="text-danger">{err && err.address ? err.address : ""}</p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name="city"
                      value={this.state.city}
                      onChange={this.onHandleChange}
                      required />
                    <label className="material-textfield-label">City</label>
                    <p className="text-danger">{err && err.city ? err.city : ""}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name="state"
                      value={this.state.state}
                      onChange={this.onHandleChange}
                      required />
                    <label className="material-textfield-label">State </label>
                    <p className="text-danger">{err && err.state ? err.state : ""}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name="zipcode"
                      value={this.state.zipcode}
                      onChange={this.onHandleChange}
                      required />
                    <label className="material-textfield-label">Zip </label>
                    <p className="text-danger">{err && err.zipcode ? err.zipcode : ""}</p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name="borough"
                      value={this.state.borough}
                      onChange={this.onHandleChange}
                      required />
                    <label className="material-textfield-label">Borough</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name="neighborhood"
                      value={this.state.neighborhood}
                      onChange={this.onHandleChange}
                      required />
                    <label className="material-textfield-label">Neighborhood</label>
                    <p className="text-danger">{err && err.neighborhood ? err.neighborhood : ""}</p>
                  </div>
                </div>
              </div>


              <p className="text-danger m-0 p-0">{this.state.dumpError}</p>
              <button onClick={this.saveYard.bind(this)} className="btn btn-dark btn-lg w-100 font-800" >Save</button>
            </div>
          </div>
        </ReactModal>

        <DeleteModal
          deleteModelIsOpen={this.state.deleteModelIsOpen}
          closeModal={this.closeModal.bind(this)}
          confirmDelete={this.confirmDelete.bind(this)}
          text={'dump'}
        />

        <Pagination
          className="pb-3 text-center pagination-wrapper w-100 mt-3"
          current={this.state.page+1}
          onChange={this.onPagechange.bind(this)}
          pageSize={this.state.limit}
          hideOnSinglePage= {true}
          total={_.get(this.state, 'totalDumps', 0)}
        />
      </div>
    )
  }
}
