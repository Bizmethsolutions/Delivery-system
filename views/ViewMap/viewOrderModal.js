import React, { PureComponent } from 'react'
import ReactModal from 'react-modal'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Tabs, Select } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import InputMask from 'react-input-mask'

import { BackArrowIcon, DotBtnIcon, SortingDownArrow, CloseIcon, SortingNewUpIcon, SortingNewDownIcon } from '../../components/icons'
import { getContainerSize, getDate } from '../../components/commonFormate'
import MapComponent from '../../components/map'

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

    }

  }

  openModal() {
    this.setState({ modalIsOpen: true })
  }

  closeModal() {
    this.props.closeModal()
  }

  componentDidMount = async()=> {
  }

  // getContainerSize(id) {
    // if (this.props.containerList.length > 0) {
    //   let master = this.props.containerList
    //   // console.log(id);
    //   for (let index = 0; index < master.length; index++) {
    //     let element = master[index]
    //     if (element._id === id) {
    //       return element.size
    //     }
    //   }
    // }
  //   return ''
  // }

  render() {
    const { orderData } = this.props
    return (
      <div>
      <ReactModal
        isOpen={this.props.isViewModalOpen}
        onRequestClose={this.closeModal.bind(this)}
        contentLabel="Add Team Member"
        ariaHideApp={false}
      >
        <div className="react-modal-dialog react-modal-dialog-full react-modal-dialog-centered">
          <div className="react-modal-header d-flex align-items-center">
            <div>
              <h5 className="react-modal-title">
                {(orderData && orderData.container && orderData.container.size === "Live Load") ?
                    <span>Live Load Information</span>
                  :
                  ((orderData && orderData.container&& orderData.container.size === "1/2 Yard" && orderData.jobStatus === "Exchange") ?
                      <span>Mini Action Information</span>
                    :
                    ((orderData && orderData.container && orderData.container.size === "1/2 Yard") ?
                        <span>Mini Delivery Information</span>
                      :
                        <span>{orderData && orderData.jobStatus} Information</span>
                    )
                  )
                }
              </h5>
              {/* <h6 className="react-modal-title-sub"><span>Created On:</span> {moment(orderData.createdat).format("YYYY-MM-DD HH:mm")} |  <span>By:</span> {_.get(orderData, 'created.name', '')}</h6> */}
            </div>
            <div className="marg-left-auto">
              <button type="button" className="btn react-modal-close" onClick={this.closeModal.bind(this)}><CloseIcon /></button>
            </div>
          </div>
          <div className="divider-line"></div>
          <div className="react-modal-body pd-t-0">
            {/* <div className="row mb-3">
              <div className="col-md-12">
                <div className="flex-btn-tabs">
                  <button className="btn primarybtn primarybtn-active">Order Details</button>
                  <button className="btn primarybtn">Connected Orders</button>
                  <button className="btn primarybtn">Order Activity</button>
                  <button className="btn primarybtn">Message History</button>
                </div>
              </div>
            </div> */}

            <div className="tabsContainer mb-3">
                <div className="row">
                  <div className="col-md-8">
                    <ul className="order-listing">
                      <li>
                        <label className="view-textfield-label">Job Address</label>
                        <p className="view-textfield-details">{_.get(orderData, 'address.address', '')}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">State</label>
                        <p className="view-textfield-details">{_.get(orderData, 'address.state', '')}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">City</label>
                        <p className="view-textfield-details">{_.get(orderData, 'address.city', '')}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Zipcode</label>
                        <p className="view-textfield-details">{_.get(orderData, 'address.zipcode', '')}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Borough</label>
                        <p className="view-textfield-details">{_.get(orderData, 'address.borough', '')}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Neighborhood</label>
                        <p className="view-textfield-details">{_.get(orderData, 'address.neighbourhood', '')}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Delivery Date (MM/DD/YY)</label>
                        <p className="view-textfield-details">{getDate(orderData.deliveryDate)}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Delivery Day</label>
                        <p className="view-textfield-details">{orderData && moment(orderData.deliveryDate).utc().format("dddd")}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Product/Service</label>
                        <p className="view-textfield-details">{orderData && orderData.container && orderData.container.size}</p>
                      </li>
                      {/* <li>
                        <label className="view-textfield-label">Type of Debris</label>
                        <p className="view-textfield-details">{_.get(orderData, 'debris', '')}</p>
                      </li> */}
                      <li>
                        <label className="view-textfield-label">Type of Debris</label>
                        <p className="view-textfield-details">{Array.isArray(_.get(orderData, 'debris', [])) ? _.get(orderData, 'debris', []).join(', ') : _.get(orderData, 'debris', '')}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Contact # (xxx-xxx-xxxx)</label>
                        <p className="view-textfield-details">{_.get(orderData, 'contact.phone', '')}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Contact Name</label>
                        <p className="view-textfield-details">{_.get(orderData, 'contact.name', '')}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Permit</label>
                        <p className="view-textfield-details">{_.get(orderData, 'permit', '')}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Container Location</label>
                        <p className="view-textfield-details">{_.get(orderData, 'location', '')}</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Hauler Company</label>
                        <p className="view-textfield-details">{_.get(orderData, 'haulerCompanyName', '')}</p>
                      </li>
                    </ul>
                  </div>

                  <div className="col-md-4">
                    <div className="map-section-sm">
                      <MapComponent
                        position={_.get(orderData, 'geoLocation', '')}
                        icon={getContainerSize(this.props.containerList, _.get(orderData, 'container', ''))}/>
                    </div>
                    <ul className="order-listing order-listing-100">
                      {/* <li>
                        <label className="view-textfield-label">Purchase Order #</label>
                        <p className="view-textfield-details">{_.get(orderData, 'purchaseorderno', '')}</p>
                      </li> */}
                      <li>
                        <label className="view-textfield-label">Special Instructions</label>
                        <p className="view-textfield-details">{_.get(orderData, 'specialinstruction', '')}</p>
                      </li>
                    </ul>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </ReactModal>
      </div>
    )
  }
}
