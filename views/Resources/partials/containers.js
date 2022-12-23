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
      by: -1,
      page: 1,
      sort_field: 'number',
      search_string: '',
      type: 'y',
      number: '',
      size: '',
      editContainerId: '',
      containersList: [],
      containerModalTitle: "New Container",

      err: {},
      saveClicked: false,
      deleteModelIsOpen: false
    }
    this.onHandleChange = this.onHandleChange.bind(this)
  }

  componentDidMount = async()=> {
    document.title = 'Containers | CurbWaste'
    this.fetchContainers()
  }

  fetchContainers = async()=> {
    const {limit, by, page, sort_field, search_string, type } = this.state
    let data = {
      limit, by, page, sort_field, search_string, type
    }
    let { value } = await this.props.getContainers(data)
    this.setState({ containersList: value.data, totalContainer: value.count})
  }

  sortby(field) {
    if (this.state.sort_field === field) {
        this.state.by = this.state.by * -1
    } else {
        this.state.sort_field = field
        this.state.by = 1;
    }
    this.fetchContainers()
  }

  // onSearch (key) {
  //   this.setState({ search_string: key}, ()=>{
  //     this.fetchYard()
  //   })
  // }

  onPagechange (nextPage) {
    let page = nextPage
    this.setState({ page }, ()=>{
      this.fetchContainers()
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
    const { size, number, err } = this.state

    if(size === "") {
      errObj.size = "Container size is required"
    }
    if(number === "") {
      errObj.number = "Container number is required"
    }
    this.setState({ err: errObj })
  }

  saveContainer = async() => {
    this.setState({ saveClicked : true })
    await this.validate()
    const {err, email} = this.state
    const { addContainer, updateContainer } = this.props
    if(Object.keys(err).length === 0) {
      if(this.state.editContainerId === "") {
        const obj ={
          size: this.state.size,
          number: this.state.number
        }
        try {
          let { value } = await addContainer(obj)
        // if (value.type === "success") {
          this.closeModal()
          this.fetchContainers()
        } catch (e) {
          this.setState({ containeError: _.get(e, 'error.message', '') })
        }
        // }
      } else {
        const obj ={
          size: this.state.size,
          number: this.state.number,
          id: this.state.editContainerId
        }
        try {
          let { value } = await updateContainer(obj)
          // if (value.type === "success") {
            this.closeModal()
            this.fetchContainers()
          // }
        } catch (e) {
          this.setState({ containeError: _.get(e, 'error.message', '') })
        }
      }
    }
  }

  openContainerEditModal (container) {
    this.props.openModal('containerModal')
    if(container) {
      this.setState({
        containerModalTitle: "Edit Container",
        number: container.number,
        size: container.size,
        editContainerId: container._id,
        err: {}
      })
    }
  }

  openConfirmDeleteModal (id) {
    this.setState({ editContainerId: id, deleteModelIsOpen: true })
  }

  confirmDelete = async() => {
    let data = {
      containerId: this.state.editContainerId
    }
    let { value } = await this.props.deleteContainer(data)
    message.success('successfully deleted')
    this.fetchContainers()
    this.closeModal()
  }

  closeModal() {
    this.setState({ deleteModelIsOpen: false })
    this.props.closeModal()
    this.resetState()
  }

  resetState () {
    this.setState({
      number: "", size: "", saveClicked: false,
      containeError: '',
      editContainerId: '', err: {}, containerModalTitle: "New Container"
    })
  }

  formatAddess (yard) {
    let address = formatOrderAddess(yard)
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
            {_.get(this.state, 'containersList', []).length > 0 ?
              <div className="table-responsive">
                <table className="table custom-table-secondary white-bg">
                  <thead className="gray-bg">
                    <tr>
                      <th onClick={() => { this.sortby('number')} }>
                        <span className="custom-table-th-title-sm for-cursor">Container Number {this.getSortArrow('number')}</span>
                      </th>
                      <th onClick={() => { this.sortby('size') }} style={{ width:'85%' }}>
                        <span className="custom-table-th-title-sm for-cursor">Container Size {this.getSortArrow('size')}</span>
                      </th>

                      <th className="width-50 rem-pad-lr">
                        <span className="custom-table-th-title-sm">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="table-card">
                    {_.get(this.state, 'containersList', []).map((container, index)=>{
                      return (
                      <tr key={index}>
                        <td>
                          <span className="custom-table-title custom-table-title-md">{_.get(container, 'number', '')}</span>
                        </td>
                        <td>
                          <span className="custom-table-title custom-table-title-md">{_.get(container, 'size', '')}</span>
                        </td>
                        <td>
                          <Dropdown overlay={<Menu>
                            <Menu.Item key="1">
                              <a href="#" onClick ={this.openContainerEditModal.bind(this, container)}>Edit</a>
                            </Menu.Item>
                            <Menu.Item key="2">
                              <a href="#" onClick={this.openConfirmDeleteModal.bind(this,container._id )}>Delete</a>
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
                emptyText = "No Containers"
              />
            }
          </div>
        </div>

        <ReactModal
          isOpen={this.props.containerModal}
          onRequestClose={this.closeModal.bind(this)}
          contentLabel="Add Team Member"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-centered">
            <div className="react-modal-header">
              <h5 className="react-modal-title">{this.state.containerModalTitle}</h5>
              <button onClick={this.closeModal.bind(this)} type="button" className="btn react-modal-close" ><CloseIcon /></button>
            </div>
            <div className="divider-line"></div>
            <div className="react-modal-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input "
                      name="number"
                      value={this.state.number}
                      onChange={this.onHandleChange}
                      required />
                    <label className="material-textfield-label">Container Number <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.number ? err.number : ""}</p>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group material-textfield">
                    <select
                      className="form-control material-textfield-input custom-select"
                      name="size"
                      value={this.state.size}
                      onChange={this.onHandleChange}
                      required >
                      <option value=''> Select size </option>
                      <option value='10 Yard'>10 Yard </option>
                      <option value='15 Yard'>15 Yard </option>
                      <option value='20 Yard'>20 Yard </option>
                      <option value='30 Yard'>30 Yard </option>
                      <option value='1/2 Yard'> 1/2 Yard</option>
                      {/* <option value='Live Load'> Live Load</option> */}
                    </select>
                    <label className="material-textfield-label">Container Size <span className="text-danger">*</span></label>
                    <p className="text-danger">{err && err.size ? err.size : ""}</p>
                  </div>
                </div>
              </div>
                <p className="text-danger m-0 p-0">{_.get(this.state, 'containeError')}</p>
              <button onClick={this.saveContainer.bind(this)} className="btn btn-dark btn-lg w-100 font-800" >Save</button>
            </div>
          </div>
        </ReactModal>

        <DeleteModal
          deleteModelIsOpen={this.state.deleteModelIsOpen}
          closeModal={this.closeModal.bind(this)}
          confirmDelete={this.confirmDelete.bind(this)}
          text={'container'}
        />

        <Pagination
          className="pb-3 text-center pagination-wrapper w-100 mt-3"
          current={this.state.page}
          onChange={this.onPagechange.bind(this)}
          pageSize={this.state.limit}
          hideOnSinglePage= {true}
          total={_.get(this.state, 'totalContainer', 0)}
        />
      </div>
    )
  }
}
