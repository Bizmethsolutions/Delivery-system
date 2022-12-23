import React, { PureComponent } from 'react'
import ReactModal from 'react-modal'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Tabs, Select } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import InputMask from 'react-input-mask'

import { BackArrowIcon, DotBtnIcon, SortingDownArrow, CloseIcon, SortingNewUpIcon, SortingNewDownIcon } from '../../../components/icons'
import { getContainerSize, getFormatedDateAndTimeWithoutUTC, getTimeInDayAndHours, formatNumber, getDateMMDDYYYHHMM, getDate } from '../../../components/commonFormate'
import MapComponent from '../../../components/map'

import ExchangeIcon from '../../../images/btn-exchange.svg'
import removalIcon from '../../../images/btn-removal.svg'
import copyorderIcon from '../../../images/btn-copyorder.svg'
import editorderIcon from '../../../images/btn-editorder.svg'
import deleteorderIcon from '../../../images/btn-deleteorder.svg'

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
    return ''
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

  openMapModal() {
    this.setState({ openMapModal: true })
  }

  closeMapModal() {
    this.setState({ openMapModal: false })
  }

  render() {
    const { orderData, user } = this.props
    const accessibilitynotes = _.get(orderData, 'accessibility', '') === "Other: Manual entry" ? _.get(orderData, 'manualaccessibility', '') : _.get(orderData, 'accessibility', '')
    const status = this.getStatus(orderData.status, orderData) ? (this.getStatus(orderData.status, orderData).replace(/\s/g,'').replace(/[0-9]/g, '')).toLowerCase() : ""
    let created = orderData.createdat
    if(created) {
      created = this.getFormatedDateAndTime(created)
    }
    let createdInfo = orderData.timezone ? getTimeInDayAndHours(created) : getDateMMDDYYYHHMM(orderData.createdat)
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
                <h6 className="react-modal-title-sub"><span>Created On:</span> {createdInfo} <span className="pipeline">|</span>  <span>By:</span> {_.get(orderData, 'created.name', '') !== '' ? _.get(orderData, 'created.name', ''): _.get(user, 'firstname', '') !== '' ? _.get(user, 'firstname', '') : _.get(user, 'companyname', '')}</h6>
                </div>
                <div className="marg-left-auto">
                  <button type="button" className="btn react-modal-close" onClick={this.closeModal.bind(this)}><CloseIcon /></button>
                </div>
              </div>
              {/* <div className="divider-line"></div> */}
              <div className="react-modal-body p-0">

              <div className="leftcontent fullwrapper">
                  <div className="tabsContainer mb-3">
                        <div className="pannel-wrapper">
                          <ul>
                          <li>
                              <h4>What are we picking up and how much of it?</h4>
                              <div className="boxwrapper">
                                <ul>
                                  <li>
                                    <label>Product/Service</label>
                                    <div className="detail">{this.getContainerSize(_.get(orderData, 'container', ''))}</div>
                                  </li>
                                  {this.getContainerSize(_.get(orderData, 'container', '')) === "1/2 Yard" ?
                                  <li>
                                    <label>On Site</label>
                                    <div className="detail">{_.get(orderData, 'half_yrd_qty', '')}</div>
                                  </li> : "" }
                                  {this.getContainerSize(_.get(orderData, 'container', '')) === "Live Load" ?
                                  <li>
                                    <label> Yardage</label>
                                    <div className="detail">{_.get(orderData, 'live_load_yard', '')}</div>
                                  </li> : "" }
                                  <li>
                                    <label>Type of Debris</label>
                                    <div className="detail">
                                      {typeof (_.get(orderData, 'typeofdebris', [])) !== "string" && _.get(orderData, 'typeofdebris', []).map((td, i)=>{
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
                                    <label>Purchase Order Number</label>
                                    <div className="detail">{_.get(orderData, 'purchaseordernumber', '')}</div>
                                  </li>
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
                                    <label>Container Location</label>
                                    <div className="detail">{_.get(orderData, 'containerlocation', '')}</div>
                                  </li>
                                  <li>
                                    <label>Container Placement</label>
                                    <div className="detail">{_.get(orderData, 'placement', '')}</div>
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
                              <h4>When do you want the container(s)? </h4>
                              <div className="boxwrapper">
                                <ul>
                                  <li>
                                    <label>Delivery Date</label>
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
                                </ul>
                              </div>
                            </li>

                            <li>
                              <h4>Payment Information</h4>
                              <div className="boxwrapper">
                                <ul>
                                  <li>
                                    <label>Payment Type</label>
                                    <div className="detail">{_.get(orderData, 'paymenttype', '')}</div>
                                  </li>
                                  <li>
                                    <label>Pricing Type</label>
                                    <div className="detail">{_.get(orderData, 'pricingtype', '')}</div>
                                  </li>
                                  <li>
                                    <label>Total Cost</label>
                                    <div className="detail">${formatNumber(_.get(orderData, 'consumercost', ''))}</div>
                                  </li>
                                </ul>
                              </div>
                            </li>

                            <li>
                              <h4>Internal Details</h4>
                              <div className="boxwrapper">
                                <ul>
                                  <li>
                                    <label>Hauler</label>
                                    <div className="detail">{_.get(orderData, 'haular.companyname', '') !== '' ? _.get(orderData, 'haular.companyname', '') : _.get(orderData, 'haular.company_name', '')}</div>
                                  </li>
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
                                </ul>
                              </div>
                            </li>

                          </ul>
                        </div>
                  </div>
                </div>

                {/* <div className="rightbtns">
                  <h4>Actions</h4>
                  <button className="btn btn-dark w-180 w-half font-600 font-16"><span><img src={ExchangeIcon} /></span> Exchange</button>
                  <button className="btn btn-dark w-180 w-half font-600 font-16"><span><img src={removalIcon} /></span> Removal</button>
                  <button className="btn btn-dark w-180 w-half font-600 font-16"><span><img src={copyorderIcon} /></span> Copy Order</button>
                  <button className="btn btn-dark w-180 w-half font-600 font-16"><span><img src={editorderIcon} /></span> Edit Order</button>
                  <button className="btn btn-dark w-180 w-half redbg font-600 font-16"><span><img src={deleteorderIcon} /></span> Delete Order</button>
                </div> */}
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
