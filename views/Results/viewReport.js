import React, { PureComponent } from 'react'
import ReactModal from 'react-modal'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Tabs, Select } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import InputMask from 'react-input-mask'
import MapComponent from '../../components/map'

import { BackArrowIcon, DotBtnIcon, SortingDownArrow, CloseIcon, SortingNewUpIcon, SortingNewDownIcon } from '../../components/icons'
import { getFormatedDateAndTimeWithoutUTC, getContainerSize, getTimeInDayAndHours, formatNumber, getDateMMDDYYYHHMM, getDate } from '../../components/commonFormate'

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

  getFormatedDateAndTime(input) {
    //return ""
    const timezone = _.get(this.props, 'orderData.timezone', {})
    if(this.props.user && Object.keys(this.props.user).length !== 0 && timezone) {
      return getFormatedDateAndTimeWithoutUTC(input, timezone, this.props.user)
    } else {
      return ""
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
    const status = this.props.getStatus(orderData.status, orderData) ? (this.props.getStatus(orderData.status, orderData).replace(/\s/g,'').replace(/[0-9]/g, '')).toLowerCase() : ""
    let created = orderData.createdat
    if(created) {
      created = this.getFormatedDateAndTime(created)
    }
    let createdInfo = orderData.timezone ? getTimeInDayAndHours(created) : getDateMMDDYYYHHMM(orderData.createdat)
    return (
      <div>

        {/* order modal open */}
        <ReactModal
          isOpen={this.props.isViewModalOpen}
          onRequestClose={this.closeModal.bind(this)}
          contentLabel="Add Team Member"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-724 react-modal-dialog-centered">
              <div className="react-modal-header d-flex align-items-center">
                <div>
                  <h5 className="react-modal-title d-flex align-items-center">Order Information - {_.get(orderData, 'orderid', '')} <span className="greenlable status-container" status={status}>{this.props.getStatus(orderData.status, orderData)}</span></h5>
                  <h6 className="react-modal-title-sub"><span>Created On:</span> {createdInfo} |  <span>By:</span> {_.get(orderData, 'created.name', '') !== '' ? _.get(orderData, 'created.name', ''): _.get(user, 'firstname', '') !== '' ? _.get(user, 'firstname', '') : _.get(user, 'companyname', '')}</h6>
                </div>
                <div className="marg-left-auto">
                  <button type="button" className="btn react-modal-close" onClick={this.closeModal.bind(this)}><CloseIcon /></button>
                </div>
              </div>
              {/* <div className="divider-line"></div> */}
              <div className="react-modal-body p-0">

              <div className="leftcontent leftcontentfull">
                  <div className="tabsContainer mb-3">
                        <div className="pannel-wrapper">
                          <ul>
                          <li>
                              <h4>What are we picking up and how much of it?</h4>
                              <div className="boxwrapper">
                                <ul>
                                  <li>
                                    <label>Product/Service</label>
                                    <div className="detail">{this.props.getContainerSize(_.get(orderData, 'container', ''))}</div>
                                  </li>
                                  {this.props.getContainerSize(_.get(orderData, 'container', '')) === "1/2 Yard" ?
                                  <li>
                                    <label>On Site</label>
                                    <div className="detail">{_.get(orderData, 'half_yrd_qty', '')}</div>
                                  </li> : "" }
                                  {this.props.getContainerSize(_.get(orderData, 'container', '')) === "Live Load" ?
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
                                    <div className="detail">{_.get(orderData, 'placement', '') !== '' ? _.get(orderData, 'placement', ''): 'N/A'}</div>
                                  </li>
                                  <li>
                                    <label>Container Location</label>
                                    <div className="detail">{_.get(orderData, 'containerlocation', '') !== '' ? _.get(orderData, 'containerlocation', '') : 'N/A' }</div>
                                  </li>
                                  <li>
                                    <label>Parking</label>
                                    <div className="detail">{_.get(orderData, 'parking', '') !== '' ? _.get(orderData, 'parking', '') : 'N/A'}</div>
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
                                    <label>Purchase Order Number</label>
                                    <div className="detail">{_.get(orderData, 'purchaseordernumber', '')!== ''? _.get(orderData, 'purchaseordernumber', ''): 'N/A'}</div>
                                  </li>
                                  {_.get(orderData, 'paymenttype', '') ?
                                    <li>
                                      <label>Payment Type</label>
                                      <div className="detail">{_.get(orderData, 'paymenttype', '')}</div>
                                    </li> : ''
                                  }
                                  {_.get(orderData, 'pricingtype', '') ?
                                  <li>
                                    <label>Pricing Type</label>
                                    <div className="detail">{_.get(orderData, 'pricingtype', '')}</div>
                                  </li> : '' }
                                  {orderData.consumercost && orderData.consumercost !== "" ?
                                  <li>
                                    <label>Total Price</label>
                                    <div className="detail">{ orderData.consumercost && orderData.consumercost !== "" && parseFloat(orderData.consumercost).toFixed(2) ? `$${formatNumber(parseFloat(orderData.consumercost).toFixed(2))}` : "" }</div>
                                  </li> : '' }
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
                                    {_.get(orderData, 'specialinstruction', '') !== ''? _.get(orderData, 'specialinstruction', '') : 'N/A'}
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
