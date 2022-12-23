import React, { PureComponent } from 'react'
import ReactModal from 'react-modal'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Tabs, Select } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import InputMask from 'react-input-mask'
import MapComponent from '../../components/map'


import { BackArrowIcon, DotBtnIcon, SortingDownArrow, CloseIcon, SortingNewUpIcon, SortingNewDownIcon } from '../../components/icons'
import { getFormatedDateAndTimeWithoutUTC , getDayDate, getTimeInDayAndHours, formatNumber, getDateMMDDYYYHHMM, getDate, formatOrderAddess} from '../../components/commonFormate'

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

  openMapModal() {
    this.setState({ openMapModal: true })
  }

  closeMapModal() {
    this.setState({ openMapModal: false })
  }


  componentDidMount = async()=> {
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


  render() {
    const { orderData } = this.props
    const tonnagepercentage = orderData && orderData.sustainabilityinformation && orderData.sustainabilityinformation.tonnagepercentage
    const tonnageweight = orderData && orderData.sustainabilityinformation && orderData.sustainabilityinformation.tonnageweight
    let created = orderData.createdat
    if(created) {
      created = this.getFormatedDateAndTime(created)
    }
    let createdInfo = orderData.timezone ? getTimeInDayAndHours(created) : getDateMMDDYYYHHMM(orderData.createdat)
    const deliveryday = getDayDate(orderData.deliverydate)
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
                <h5 className="react-modal-title">Reporting Info</h5>
                <h6 className="react-modal-title-sub"><span>Order Date:</span> {createdInfo} </h6>
                {/* <h6 className="react-modal-title-sub"><span>Created On:</span> {this.getFormatedDateAndTime(orderData.createdat)} |  <span>By:</span> {_.get(orderData, 'created.name', '')}</h6> */}
              </div>
              <div className="marg-left-auto">
                <button type="button" className="btn react-modal-close" onClick={this.closeModal.bind(this)}><CloseIcon /></button>
              </div>
            </div>
            <div className="divider-line"></div>
            <div className="react-modal-body pd-t-0 padd-5-lr">
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

              <div className="leftcontent leftcontentfull">
                <div className="pannel-wrapper">
                  <ul>
                    <li>
                      <h4>What are we picking up and how much of it?</h4>
                      <div className="boxwrapper">
                        <ul>
                        <li>
                            <label className="view-textfield-label">Container Size</label>
                            <p className="detail">{this.props.getContainerSize(orderData.container)}</p>
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
                              <p>{this.formatAddess(orderData)}</p>
                              <p><b>Borough:</b>{_.get(orderData, 'borough', '')}</p>
                              <p><b>Neighborhood:</b>{_.get(orderData, 'neighborhood', '')}</p>
                            </div>
                            <button className="btn-viewmap" onClick={this.openMapModal.bind(this)}>View Map</button>
                          </li>
                          <li>
                            <label className="view-textfield-label">Container Placement</label>
                            <p className="detail">{_.get(orderData, 'placement', '') !== '' ? _.get(orderData, 'placement', '') : 'N/A'}</p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Container Location</label>
                            <p className="detail">{_.get(orderData, 'containerlocation', '') !== '' ? _.get(orderData, 'containerlocation', ''): 'N/A'}</p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Parking</label>
                            <p className="detail">{_.get(orderData, 'parking', '') !== '' ? _.get(orderData, 'parking', ''): 'N/A'}</p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Permit</label>
                            <p className="detail">{_.get(orderData, 'permit', false) === true ? 'Yes' : 'No'}</p>
                          </li>

                        </ul>
                      </div>
                    </li>
                    <li>
                      <h4>When do you want the container(s)?</h4>
                      <div className="boxwrapper">
                        <ul>
                          <li>
                            <label className="view-textfield-label">Delivery Date</label>
                            <p className="detail">{getDate(orderData.deliverydate)}</p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Delivery Day</label>
                            <p className="detail">{_.get(orderData, 'deliveryday', '') !== '' ? _.get(orderData, 'deliveryday', '') : deliveryday}</p>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li>
                      <h4>Contact Person</h4>
                      <div className="boxwrapper">
                        <ul>
                          <li>
                            <label className="view-textfield-label">Full Name</label>
                            <p className="detail">{_.get(orderData, 'contactname', '')}</p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Phone number</label>
                            <p className="detail">{_.get(orderData, 'contactnumber', '')}</p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Email</label>
                            <p className="detail">{_.get(orderData, 'contactEmail.email', '')}</p>
                          </li>
                        </ul>
                      </div>
                    </li>

                    <li>
                      <h4>Payment Information</h4>
                      <div className="boxwrapper">
                        <ul>
                        <li>
                            <label className="view-textfield-label">Purchase Order #</label>
                            <p className="detail">{_.get(orderData, 'purchaseorderno', '') !== '' ? _.get(orderData, 'purchaseorderno', '') : 'N/A'}</p>
                          </li>
                        {_.get(orderData, 'paymenttype', '') !== '' ?
                          <li>
                            <label>Payment Type</label>
                            <div className="detail">{_.get(orderData, 'paymenttype', '')}</div>
                          </li> : ""}
                          {_.get(orderData, 'pricingtype', '') !== '' ?
                          <li>
                            <label>Pricing Type</label>
                            <div className="detail">{_.get(orderData, 'pricingtype', '')}</div>
                          </li> : ""}
                          {orderData.consumercost && orderData.consumercost !== "" ?
                          <li>
                            <label>Total Price</label>
                            <div className="detail">{ orderData.consumercost && orderData.consumercost !== "" && parseFloat(orderData.consumercost).toFixed(2) ? `$${formatNumber(parseFloat(orderData.consumercost).toFixed(2))}` : "" }</div>
                          </li> : ''}
                        </ul>
                      </div>
                    </li>

                    <li>
                      <h4>Internal Details</h4>
                      <div className="boxwrapper">
                        <ul>
                          <li>
                            <label className="view-textfield-label">Hauler</label>
                            <p className="detail">{_.get(orderData, 'haular.company_name', '')}</p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Special Instructions</label>
                            <p className="detail">{_.get(orderData, 'specialinstruction', '') !== '' ? _.get(orderData, 'specialinstruction', '') : 'N/A'}</p>
                          </li>
                          <li>
                          <label className="view-textfield-label">Dump Ticket Number</label>
                          <p className="detail">{_.get(orderData, 'dumpticketnumber', '') !== "" ? _.get(orderData, 'dumpticketnumber', '') : 'N/A'}</p>
                        </li>
                        </ul>
                      </div>
                    </li>

                  </ul>
                </div>
                { orderData && orderData.sustainabilityinformation !== undefined && this.props.getContainerSize(orderData.container) !== "1/2 Yard" ?
                  <div className="subs-box-wrapper-reporting">
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
                            <p className="detail">{Math.round(tonnagepercentage && tonnagepercentage.length > 0 && tonnagepercentage[0].value)}</p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Waste Weight (Tons)</label>
                            <p className="detail">{tonnageweight && tonnageweight.length > 0 && tonnageweight[0].value}</p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Brick % (Yards)</label>
                            <p className="detail">{orderData && orderData.sustainabilityinformation && orderData.sustainabilityinformation.brick && orderData.sustainabilityinformation.brick}</p>
                          </li>

                          <li>
                            <label className="view-textfield-label">Brick % (Tons)</label>
                            <p className="detail">{Math.round(tonnagepercentage && tonnagepercentage.length > 0 && tonnagepercentage[1].value)}</p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Brick Weight (Tons)</label>
                            <p className="detail">{tonnageweight && tonnageweight.length > 0 && tonnageweight[1].value}</p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Dirt % (Yards)</label>
                            <p className="detail">{orderData && orderData.sustainabilityinformation.dirt && orderData.sustainabilityinformation.dirt}</p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Dirt % (Tons)</label>
                            <p className="detail">{Math.round(tonnagepercentage && tonnagepercentage.length > 0 && tonnagepercentage[2].value)}</p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Dirt Weight (Tons)</label>
                            <p className="detail">{tonnageweight && tonnageweight.length > 0 && tonnageweight[2].value}</p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Concrete % (Yards)</label>
                            <p className="detail">{orderData && orderData.sustainabilityinformation.concrete && orderData.sustainabilityinformation.concrete}</p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Concrete % (Tons)</label>
                            <p className="detail">{Math.round(tonnagepercentage && tonnagepercentage.length > 0 && tonnagepercentage[3].value)}</p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Concrete Weight (Tons)</label>
                            <p className="detail">{tonnageweight && tonnageweight.length > 0 && tonnageweight[3].value}</p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Wood % (Yards)</label>
                            <p className="detail">{orderData && orderData.sustainabilityinformation.cleanwood && orderData.sustainabilityinformation.cleanwood}</p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Wood % (Tons)</label>
                            <p className="detail">{Math.round(tonnagepercentage && tonnagepercentage.length > 0 && tonnagepercentage[4].value)}</p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Wood Weight (Tons)</label>
                            <p className="detail">{tonnageweight && tonnageweight.length > 0 && tonnageweight[4].value}</p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Metal % (Yards)</label>
                            <p className="detail">{orderData && orderData.sustainabilityinformation.metal && orderData.sustainabilityinformation.metal}</p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Metal % (Tons)</label>
                            <p className="detail">{Math.round(tonnagepercentage && tonnagepercentage.length > 0 && tonnagepercentage[5].value)}</p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Metal Weight (Tons)</label>
                            <p className="detail">{tonnageweight && tonnageweight.length > 0 && tonnageweight[5].value} </p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Paper/Cardboard % (Yards)</label>
                            <p className="detail">{orderData && orderData.sustainabilityinformation.paper_cardboard && orderData.sustainabilityinformation.paper_cardboard} </p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Paper/Cardboard % (Tons)</label>
                            <p className="detail">{Math.round( tonnagepercentage && tonnagepercentage.length > 0 && tonnagepercentage[6].value)} </p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Paper/Cardboard Weight (Tons)</label>
                            <p className="detail">{tonnageweight && tonnageweight.length > 0 && tonnageweight[6].value} </p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Plastic % (Yards)</label>
                            <p className="detail">{orderData && orderData.sustainabilityinformation.plastic && orderData.sustainabilityinformation.plastic} </p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Plastic % (Tons)</label>
                            <p className="detail">{Math.round(tonnagepercentage && tonnagepercentage.length > 0 && tonnagepercentage[7].value)} </p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Plastic Weight (Tons)</label>
                            <p className="detail">{tonnageweight && tonnageweight.length > 0 && tonnageweight[7].value} </p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Drywall % (Yards)</label>
                            <p className="detail">{orderData && orderData.sustainabilityinformation.drywall && orderData.sustainabilityinformation.drywall} </p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Drywall % (Tons)</label>
                            <p className="detail">{Math.round( tonnagepercentage && tonnagepercentage.length > 0 && tonnagepercentage[8].value)} </p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Drywall Weight (Tons)</label>
                            <p className="detail">{tonnageweight && tonnageweight.length > 0 && tonnageweight[8].value} </p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Glass % (Yards)</label>
                            <p className="detail">{orderData && orderData.sustainabilityinformation.glass && orderData.sustainabilityinformation.glass} </p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Glass % (Tons)</label>
                            <p className="detail">{Math.round(tonnagepercentage && tonnagepercentage.length > 0 && tonnagepercentage[9].value)} </p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Glass Weight (Tons)</label>
                            <p className="detail">{tonnageweight && tonnageweight.length > 0 && tonnageweight[9].value} </p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Asphalt % (Yards)</label>
                            <p className="detail">{orderData && orderData.sustainabilityinformation.asphalt && orderData.sustainabilityinformation.asphalt} </p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Asphalt % (Tons)</label>
                            <p className="detail">{Math.round( tonnagepercentage && tonnagepercentage.length > 0 && tonnagepercentage[10].value)}  </p>
                          </li>
                          <li>
                            <label className="view-textfield-label">Asphalt Weight (Tons)</label>
                            <p className="detail">{tonnageweight && tonnageweight.length > 0 && tonnageweight[10].value} </p>
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



              <div className="clearfix"></div>

              {/* <div className="tabsContainer mb-3"> */}





                  {/* <div className="row">
                    <div className="col-md-8">
                      <ul className="order-listing"> */}
                        {/* <li>
                          <label className="view-textfield-label">Job Address</label>
                          <p className="view-textfield-details">{_.get(orderData, 'new_address', '')}</p>
                        </li> */}
                        {/* <li>
                          <label className="view-textfield-label">State</label>
                          <p className="view-textfield-details">{_.get(orderData, 'state', '')}</p>
                        </li> */}
                        {/* <li>
                          <label className="view-textfield-label">City</label>
                          <p className="view-textfield-details">{_.get(orderData, 'city', '')}</p>
                        </li> */}
                        {/* <li>
                          <label className="view-textfield-label">Zipcode</label>
                          <p className="view-textfield-details">{_.get(orderData, 'zipcode', '')}</p>
                        </li> */}
                        {/* <li>
                          <label className="view-textfield-label">Borough</label>
                          <p className="view-textfield-details">{_.get(orderData, 'borough', '')}</p>
                        </li>
                        <li>
                          <label className="view-textfield-label">Neighborhood</label>
                          <p className="view-textfield-details">{_.get(orderData, 'neighbourhood', '')}</p>
                        </li> */}
                        {/* <li>
                          <label className="view-textfield-label">Delivery Date (MM/DD/YY)</label>
                          <p className="view-textfield-details">{moment(orderData.deliverydate).format('MM/DD/YY')}</p>
                        </li> */}
                        {/* <li>
                          <label className="view-textfield-label">Delivery Day</label>
                          <p className="view-textfield-details">{_.get(orderData, 'deliveryday', '')}</p>
                        </li> */}
                        {/* <li>
                          <label className="view-textfield-label">Container Size</label>
                          <p className="view-textfield-details">{this.props.getContainerSize(orderData.containersize)}</p>
                        </li> */}
                        {/* <li>
                          <label className="view-textfield-label">Type of Debris</label>
                          <p className="view-textfield-details">{_.get(orderData, 'typeofdebris', '')}</p>
                        </li> */}
                        {/* <li>
                          <label className="view-textfield-label">Contact # (xxx-xxx-xxxx)</label>
                          <p className="view-textfield-details">{_.get(orderData, 'contactnumber', '')}</p>
                        </li> */}
                        {/* <li>
                          <label className="view-textfield-label">Contact Name</label>
                          <p className="view-textfield-details">{_.get(orderData, 'contactname', '')}</p>
                        </li> */}
                        {/* <li>
                          <label className="view-textfield-label">Permit</label>
                          <p className="view-textfield-details">{_.get(orderData, 'permit', false) === true ? 'Yes' : 'No'}</p>
                        </li> */}
                        {/* <li>
                          <label className="view-textfield-label">Driver Location</label>
                          <p className="view-textfield-details">AA</p>
                        </li>
                        <li>
                          <label className="view-textfield-label">Order Date (MM/DD/YYYY</label>
                          <p className="view-textfield-details">{_.get(orderData, 'ordereddate', '')}</p>
                        </li> */}
                        {/* <li>
                          <label className="view-textfield-label">Hauler</label>
                          <p className="view-textfield-details">{_.get(orderData, 'haular.company_name', '')}</p>
                        </li> */}
                        {/* <li>
                          <label className="view-textfield-label">Total Cost</label>
                          <p className="view-textfield-details">$ {_.get(orderData, 'consumercost', 0)}</p>
                        </li> */}
                      {/* </ul>
                    </div> */}

                    {/* <div className="col-md-4">
                      <div className="map-section-sm">
                        <MapComponent position={_.get(orderData, 'location', '')} icon={this.props.getContainerSize(orderData.containersize)}/>
                      </div>
                      <ul className="order-listing order-listing-100">
                        <li>
                          <label className="view-textfield-label">Purchase Order #</label>
                          <p className="view-textfield-details">{_.get(orderData, 'purchaseorderno', '')}</p>
                        </li>
                        <li>
                          <label className="view-textfield-label">Special Instructions</label>
                          <p className="view-textfield-details">{_.get(orderData, 'specialinstruction', '')}</p>
                        </li>
                      </ul>
                    </div> */}
                  {/* </div> */}
              {/* </div> */}


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
            <MapComponent position={_.get(orderData, 'location', '')} icon={this.props.getContainerSize(orderData.container)}/>
          </div>
          </div>
          </div>
        </ReactModal>

        </ReactModal>
      </div>
    )
  }
}
