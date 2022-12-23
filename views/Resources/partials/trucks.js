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
      page: 1,
      sort_field: '_id',
      search_string: '',
      type: 't',
      truckModalTitle: "New Truck",
      license: '',
      number: '',
      editTruckId: '',
      err: {},
      saveClicked: false,
      name: '',
      vin: '',
      serial: '',
      make: '',
      model: '',
      year: '',
    }
    this.onHandleChange = this.onHandleChange.bind(this)
  }

  componentDidMount = async()=> {
    document.title = 'Trucks | CurbWaste'
    this.fetchTruck()
  }

  fetchTruck = async()=> {
    const {limit, by, page, sort_field, search_string, type } = this.state
    let data = {
      limit, by, page, sort_field,
    }
    let { value } = await this.props.getTrucks(data)
    this.setState({ truckList: value.data, totalTrucks: value.count})
  }

  sortby(field) {
    if (this.state.sort_field === field) {
        this.state.by = this.state.by * -1
    } else {
        this.state.sort_field = field
        this.state.by = 1;
    }
    this.fetchTruck()
  }

  // onSearch (key) {
  //   this.setState({ search_string: key}, ()=>{
  //     this.fetchYard()
  //   })
  // }

  onPagechange (nextPage) {
    let page = nextPage
    this.setState({ page }, ()=>{
      this.fetchTruck()
    })
  }

  onHandleChange(e) {
    this.setState({ [e.target.name] : e.target.value}, () => {
      if(this.state.saveClicked === true) {
        this.validate()
      }
    })
  }

  validate() {
    let errObj = {}
    const { license, err, number } = this.state

    if(license === "") {
      errObj.license = "License Plate Number is required"
    }
    if(number === "") {
      errObj.number = "Truck Number is required"
    }
    this.setState({ err: errObj })
  }

  saveTruck = async() => {
    this.setState({ saveClicked : true })
    await this.validate()
    const {err, license,number } = this.state
  //   const { addYard, updateYard } = this.props
    if(Object.keys(err).length === 0) {
      if(this.state.editTruckId === "") {
        const obj ={
          license: this.state.license,
          number: this.state.number,
          name: this.state.name,
          vin: this.state.vin,
          serial: this.state.serial,
          make: this.state.make,
          model: this.state.model,
          year: this.state.year
        }
        try {
          let { value } = await this.props.addTruck(obj)
        // if (value.type === "success") {
          this.closeModal()
          this.fetchTruck()
        } catch (e) {
          this.setState({ truckError: _.get(e, 'error.message', '') })
        }
      } else {
        const obj ={
          license: this.state.license,
          number: this.state.number,
          id: this.state.editTruckId,
          name: this.state.name,
          vin: this.state.vin,
          serial: this.state.serial,
          make: this.state.make,
          model: this.state.model,
          year: this.state.year
        }
        try {
          let { value } = await this.props.updateTruck(obj)
          // if (value.type === "success") {
          this.closeModal()
          this.fetchTruck()
          // }
        } catch (e) {
          this.setState({ truckError: _.get(e, 'error.message', '') })
        }
      }
    }
  }

  openTruckEditModal (truck) {
    this.props.openModal('truckModal')
    if(truck) {
      this.setState({
        truckModalTitle: "Edit Truck",
        license: truck.license,
        number: truck.number,
        editTruckId: truck._id,
        name: truck.name,
        vin: truck.vin,
        serial: truck.serial,
        make: truck.make,
        model: truck.model,
        year: truck.year,
        err: {}
      })
    }
  }

  openConfirmDeleteModal (id) {
    this.setState({ editTruckId: id, deleteModelIsOpen: true })
  }

  confirmDelete = async() => {
    let data = {
      id: this.state.editTruckId
    }
    let { value } = await this.props.deleteTruck(data)
    message.success('successfully deleted')
    this.fetchTruck()
    this.closeModal()
  }

  closeModal() {
    this.setState({ deleteModelIsOpen: false })
    this.props.closeModal()
    this.resetState()
  }

  resetState () {
    this.setState({
      license: "",
      number: '',
      editTruckId: '',
      truckError: '',
      err: {},
      truckModalTitle: "New Truck",
      saveClicked: false
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
            {_.get(this.state, 'truckList', []).length > 0 ?
              <div className="table-responsive">
                <table className="table custom-table-secondary white-bg">
                  <thead className="gray-bg">
                    <tr>
                      <th onClick={() => { this.sortby('license')} }>
                        <span className="custom-table-th-title-sm for-cursor">License Plate Number {this.getSortArrow('license')}</span>
                      </th>
                      <th onClick={() => { this.sortby('number') }} >
                        <span className="custom-table-th-title-sm for-cursor">Truck Number {this.getSortArrow('number')}</span>
                      </th>
                      <th onClick={() => { this.sortby('name') }} >
                        <span className="custom-table-th-title-sm for-cursor">Truck Name {this.getSortArrow('name')}</span>
                      </th>
                      <th onClick={() => { this.sortby('vin') }} >
                        <span className="custom-table-th-title-sm for-cursor">Vin # {this.getSortArrow('vin')}</span>
                      </th>
                      <th onClick={() => { this.sortby('serial') }} >
                        <span className="custom-table-th-title-sm for-cursor">Serial # {this.getSortArrow('serial')}</span>
                      </th>
                      <th onClick={() => { this.sortby('make') }} >
                        <span className="custom-table-th-title-sm for-cursor">Make {this.getSortArrow('make')}</span>
                      </th>
                      <th onClick={() => { this.sortby('model') }} >
                        <span className="custom-table-th-title-sm for-cursor">Model {this.getSortArrow('model')}</span>
                      </th>
                      <th onClick={() => { this.sortby('year') }} >
                        <span className="custom-table-th-title-sm for-cursor">Year {this.getSortArrow('year')}</span>
                      </th>
                      <th className="width-50 rem-pad-lr">
                        <span className="custom-table-th-title-sm">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="table-card">
                    {_.get(this.state, 'truckList', []).map((truck, index)=>{
                      return (
                      <tr key={index}>
                        <td>
                          <span className="custom-table-title custom-table-title-md"> {_.get(truck, 'license', '-') !== '' ? _.get(truck, 'license', '-') : "-"}{_.get(truck, 'samsaraId', '') !== '' ? <span className="default-hauler">Samsara</span> : "" }</span>
                        </td>
                        <td>
                        <span className="custom-table-title custom-table-title-md">{_.get(truck, 'number', '-') !== '' ? _.get(truck, 'number', '-') : "-"}</span>
                        </td>
                        <td>
                        <span className="custom-table-title custom-table-title-md">{_.get(truck, 'name', '-') !== '' ? _.get(truck, 'name', '-') : "-"}</span>
                        </td>
                        <td>
                        <span className="custom-table-title custom-table-title-md">{_.get(truck, 'vin', '-') !== '' ? _.get(truck, 'vin', '-') : "-"}</span>
                        </td>
                        <td>
                        <span className="custom-table-title custom-table-title-md">{_.get(truck, 'serial', '-') !== '' ? _.get(truck, 'serial', '-') : "-"}</span>
                        </td> <td>
                        <span className="custom-table-title custom-table-title-md">{_.get(truck, 'make', '-') !== '' ? _.get(truck, 'make', '-') : "-"}</span>
                        </td>
                        <td>
                        <span className="custom-table-title custom-table-title-md">{_.get(truck, 'model', '-') !== '' ? _.get(truck, 'model', '-') : "-"}</span>
                        </td>
                        <td>
                        <span className="custom-table-title custom-table-title-md">{_.get(truck, 'year', '-') !== '' ? _.get(truck, 'year', '-') : "-"}</span>
                        </td>
                        <td>
                          <Dropdown overlay={<Menu>
                            <Menu.Item key="1">
                              <a href="#" onClick ={this.openTruckEditModal.bind(this, truck)}>Edit</a>
                            </Menu.Item>
                            <Menu.Item key="2">
                              <a href="#" onClick={this.openConfirmDeleteModal.bind(this,truck._id )}>Delete</a>
                            </Menu.Item>
                            {/* <Menu.Item key="3">
                              <Link to={{ pathname: `trucks/dvir/${truck._id}`, state: { truckNumber: truck.number } }} >View DVIR Details</Link>
                            </Menu.Item> */}
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
                emptyText = "No Truck"
              />
            }
          </div>
        </div>

        <ReactModal
          isOpen={this.props.truckModal}
          onRequestClose={this.closeModal.bind(this)}
          contentLabel="Add Team Member"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-centered">
            <div className="react-modal-header">
              <h5 className="react-modal-title">{this.state.truckModalTitle}</h5>
              <button onClick={this.closeModal.bind(this)} type="button" className="btn react-modal-close" ><CloseIcon /></button>
            </div>
            <div className="divider-line"></div>
            <div className="react-modal-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      name="license"
                      value={this.state.license}
                      onChange={this.onHandleChange}
                      required />
                    <label className="material-textfield-label">License Plate Number <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.license ? err.license : ""}</p>
                  </div>
                </div>
              </div>
              <div className="form-group material-textfield">
                <input
                  type="text"
                  className="form-control material-textfield-input"
                  name="number"
                  value={this.state.number}
                  onChange={this.onHandleChange}
                  required />
                <label className="material-textfield-label">Truck Number <span className="text-danger">*</span></label>
                <p className="text-danger">{err && err.number ? err.number : ""}</p>
              </div>
              <div className="form-group material-textfield">
                <input
                  type="text"
                  className="form-control material-textfield-input"
                  name="name"
                  value={this.state.name}
                  onChange={this.onHandleChange}
                  required />
                <label className="material-textfield-label">Truck Name</label>
              </div>

              <div className="form-group material-textfield">
                <input
                  type="text"
                  className="form-control material-textfield-input"
                  name="vin"
                  value={this.state.vin}
                  onChange={this.onHandleChange}
                  required />
                <label className="material-textfield-label">Vin #</label>
              </div>
              <div className="form-group material-textfield">
                <input
                  type="text"
                  className="form-control material-textfield-input"
                  name="serial"
                  value={this.state.serial}
                  onChange={this.onHandleChange}
                  required />
                <label className="material-textfield-label">Serial #</label>
              </div>
              <div className="form-group material-textfield">
                <input
                  type="text"
                  className="form-control material-textfield-input"
                  name="make"
                  value={this.state.make}
                  onChange={this.onHandleChange}
                  required />
                <label className="material-textfield-label">Make</label>
              </div>
              <div className="form-group material-textfield">
                <input
                  type="text"
                  className="form-control material-textfield-input"
                  name="model"
                  value={this.state.model}
                  onChange={this.onHandleChange}
                  required />
                <label className="material-textfield-label">Model</label>
              </div>
              <div className="form-group material-textfield">
                <input
                  type="text"
                  className="form-control material-textfield-input"
                  name="year"
                  value={this.state.year}
                  onChange={this.onHandleChange}
                  required />
                <label className="material-textfield-label">Year</label>
              </div>
                <p className="text-danger m-0 p-0">{_.get(this.state, 'truckError')}</p>
              <button onClick={this.saveTruck.bind(this)} className="btn btn-dark btn-lg w-100 font-800" >Save</button>
            </div>
          </div>
        </ReactModal>

        <DeleteModal
          deleteModelIsOpen={this.state.deleteModelIsOpen}
          closeModal={this.closeModal.bind(this)}
          confirmDelete={this.confirmDelete.bind(this)}
          text={'truck'}
        />

        <Pagination
          className="pb-3 text-center pagination-wrapper w-100 mt-3"
          current={this.state.page}
          onChange={this.onPagechange.bind(this)}
          pageSize={this.state.limit}
          hideOnSinglePage= {true}
          total={_.get(this.state, 'totalTrucks', 0)}
        />
      </div>
    )
  }
}
