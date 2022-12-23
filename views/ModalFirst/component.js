import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import ReactModal from 'react-modal'
import InputMask from 'react-text-mask'
import _ from "lodash"
import { Menu, Dropdown, Popconfirm, message, Pagination } from 'antd'

import EmptyComponent from '../../components/emptyComponent'
import { CloseIcon, MoreIcon } from '../../components/icons'
import { SortingNewDownIcon, SortingNewUpIcon, ArrowIcon, ViewIcon, LocationIconRed, LocationIconPurple, LocationIconSky, DumpsiteIcon, YardIcon, LocationIconGreen, LocationIconYellow, LocationIconOrange, DotBtnIcon, SortingDownArrow } from '../../components/icons'
import { formatPhoneNumber, formatOrderAddess, formatGeoAddressComponents } from '../../components/commonFormate'
import AddressAutoComplete from '../../components/AddressAutoComplete'
import minusIcon from './../../images/minusIcon.svg'
import plusIcon from './../../images/plusIcon.svg'

import config from '../../config/index'
// import PropTypes from 'prop-types'

import './styles.scss'
const phoneNumberMask = config.phoneNumberMask

export default class CustomersComponent extends PureComponent {

  constructor() {
    super()
    this.state = {
      modalIsOpen: false,

    };
    this.openModal = this.openModal.bind(this)
  }
  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false, deleteModelIsOpen: false })
  }
  render() {
    return (
      <div className="layout-has-sidebar">
        <main className="dashboard-layout-content fullheight">
          <div className="row mb-3">
            <div className="col-md-12">
              <div className="d-flex align-items-center flex-unset-mob">
                <h5 className="table-title">Customer List</h5>
                <div className="ml-auto">
                  <button onClick={this.openModal} className="btn btn-dark w-180 font-600 font-16">
                    Add Order
                  </button>
                </div>
              </div>
            </div>
          </div>




          <ReactModal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            contentLabel="Add Team Member"
            ariaHideApp={false}
          >
            <div className="react-modal-dialog react-modal-dialog-724 react-modal-dialog-centered">
              <div className="react-modal-header">
                <h5 className="react-modal-title">Add Order</h5>
                <button type="button" className="btn react-modal-close" onClick={this.closeModal.bind(this)}><CloseIcon /></button>
              </div>
              <div className="divider-line"></div>
              <div className="react-modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <h4 className="single-heading">When do you want the container(s)? </h4>
                    <div className="form-group material-textfield">
                      <input
                        type="text"
                        className="form-control material-textfield-input"
                        name="borough"
                        required />
                      <label className="material-textfield-label">Delivery Date <span className="text-danger">*</span></label>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <h4 className="single-heading">Where do you want the container(s)? </h4>
                    <div className="form-group material-textfield">
                      <input
                        type="text"
                        className="form-control material-textfield-input"
                        name="borough"
                        required />
                      <label className="material-textfield-label">Purchase Order Number </label>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group material-textfield">
                      <input
                        type="text"
                        className="form-control material-textfield-input"
                        name="borough"
                        required />
                      <label className="material-textfield-label">Address <span className="text-danger">*</span></label>
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
                        required />
                      <label className="material-textfield-label">City <span className="text-danger">*</span></label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group material-textfield">
                      <input
                        type="text"
                        className="form-control material-textfield-input"
                        name="state"
                        required />
                      <label className="material-textfield-label">State <span className="text-danger">*</span></label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group material-textfield">
                      <input
                        type="text"
                        className="form-control material-textfield-input"
                        name="zipcode"
                        required />
                      <label className="material-textfield-label">Zip <span className="text-danger">*</span></label>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div className="modalmap">
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
                        required />
                      <label className="material-textfield-label">Borough</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group material-textfield">
                      <input
                        type="text"
                        className="form-control material-textfield-input"
                        name="borough"
                        required />
                      <label className="material-textfield-label">Neighborhood/Area</label>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group material-textfield">
                      <select className="form-control material-textfield-input custom-select">
                        <option>Select</option>
                      </select>
                      <label className="material-textfield-label">Parking</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group material-textfield">
                      <select className="form-control material-textfield-input custom-select">
                        <option>Select</option>
                      </select>
                      <label className="material-textfield-label">Permit</label>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <h4 className="single-heading">What are we picking up and how much of it? </h4>
                    <div className="form-group material-textfield">
                      <select className="form-control material-textfield-input custom-select">
                        <option>Select</option>
                      </select>
                      <label className="material-textfield-label">Container Size <span className="text-danger">*</span></label>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 mb-2">
                    <h4 className="single-heading-sm">Type of Debris <span className="text-danger">*</span></h4>
                  </div>
                  <div className="col-md-12">
                    <ul className="checkboxlists">
                      <li>
                        <div class="form-group">
                          <input type="checkbox" id="Roofing" />
                          <label for="Roofing">Roofing</label>
                        </div>
                      </li>
                      <li>
                        <div class="form-group">
                          <input type="checkbox" id="Clean Cardboard" />
                          <label for="Clean Cardboard">Cardboard</label>
                        </div>
                      </li>
                      <li>
                        <div class="form-group">
                          <input type="checkbox" id="Furniture" />
                          <label for="Furniture">Furniture</label>
                        </div>
                      </li>
                      <li>
                        <div class="form-group">
                          <input type="checkbox" id="Dirt/Sand" />
                          <label for="Dirt/Sand">Dirt/Sand</label>
                        </div>
                      </li>
                      <li>
                        <div class="form-group">
                          <input type="checkbox" id="Clean Asphalt" />
                          <label for="Clean Asphalt">Asphalt</label>
                        </div>
                      </li>
                      <li>
                        <div class="form-group">
                          <input type="checkbox" id="Appliances" />
                          <label for="Appliances">Appliances</label>
                        </div>
                      </li>
                      <li>
                        <div class="form-group">
                          <input type="checkbox" id="Clean Concrete" />
                          <label for="Clean Concrete">Concrete</label>
                        </div>
                      </li>
                      <li>
                        <div class="form-group">
                          <input type="checkbox" id="Sheetrock" />
                          <label for="Sheetrock">Sheetrock</label>
                        </div>
                      </li>
                      <li>
                        <div class="form-group">
                          <input type="checkbox" id="Stone" />
                          <label for="Stone">Stone</label>
                        </div>
                      </li>
                      <li>
                        <div class="form-group">
                          <input type="checkbox" id="Clean Brick" />
                          <label for="RoClean Brickofing">Brick</label>
                        </div>
                      </li>
                      <li>
                        <div class="form-group">
                          <input type="checkbox" id="Glass" />
                          <label for="Glass">Glass</label>
                        </div>
                      </li>

                      <li>
                        <div class="form-group">
                          <input type="checkbox" id="Tile" />
                          <label for="Tile">Tile</label>
                        </div>
                      </li>
                      <li>
                        <div class="form-group">
                          <input type="checkbox" id="Clean Metal" />
                          <label for="Clean Metal">Metal</label>
                        </div>
                      </li>
                      <li>
                        <div class="form-group">
                          <input type="checkbox" id="Waste" />
                          <label for="Waste">Waste</label>
                        </div>
                      </li>
                      <li>
                        <div class="form-group">
                          <input type="checkbox" id="Other" />
                          <label for="Other">Other</label>
                        </div>
                      </li>
                      <li>
                        <div class="form-group">
                          <input type="checkbox" id="Clean Wood" />
                          <label for="Clean Wood">Wood</label>
                        </div>
                      </li>
                      <li>
                        <div class="form-group">
                          <input type="checkbox" id="Plastic" />
                          <label for="Plastic">Plastic</label>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>


                <div className="row">
                  <div className="col-md-12">
                    <h4 className="single-heading-sm">Other Debris </h4>
                    <div className="form-group material-textfield">
                      <input
                        type="text"
                        className="form-control material-textfield-input"
                        name="borough"
                        required />
                      <label className="material-textfield-label">Enter other debris</label>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <h4 className="single-heading">Who’s placing this order?</h4>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group material-textfield">
                      <input
                        type="text"
                        className="form-control material-textfield-input"
                        name="borough"
                        required />
                      <label className="material-textfield-label">Full Name <span className="text-danger">*</span></label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group material-textfield">
                      <input
                        type="text"
                        className="form-control material-textfield-input"
                        name="borough"
                        required />
                      <label className="material-textfield-label">Phone Number <span className="text-danger">*</span></label>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <h4 className="single-heading">Payment Information?</h4>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group material-textfield">
                      <input
                        type="text"
                        className="form-control material-textfield-input"
                        name="borough"
                        required />
                      <label className="material-textfield-label">Job Site Contact Person <span className="text-danger">*</span></label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group material-textfield">
                      <input
                        type="text"
                        className="form-control material-textfield-input"
                        name="borough"
                        required />
                      <label className="material-textfield-label">Job Site Contact Person Phone <span className="text-danger">*</span></label>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group material-textfield">
                      <input
                        type="text"
                        className="form-control material-textfield-input"
                        name="borough"
                        required />
                      <label className="material-textfield-label">Job Site Contact Person Email <span className="text-danger">*</span></label>
                    </div>
                  </div>
                </div>



                <div className="row">
                  <div className="col-md-12">
                    <h4 className="single-heading">Internal Details</h4>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group material-textfield">
                      <select className="form-control material-textfield-input custom-select">
                        <option>Select</option>
                      </select>
                      <label className="material-textfield-label">Hauler <span className="text-danger">*</span></label>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group material-textfield">
                      <input
                        type="text"
                        className="form-control material-textfield-input"
                        name="borough"
                        required />
                      <label className="material-textfield-label">Total Cost <span className="text-danger">*</span></label>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group material-textfield material-textfield-lg">
                      <textarea className="form-control material-textfield-input h-150" required></textarea>
                      <label className="material-textfield-label">Special Instructions </label>
                    </div>
                  </div>
                </div>


                <button className="btn btn-dark btn-lg w-100 font-800">Create Order</button>
              </div>
            </div>
          </ReactModal>



          {/* global modal close */}


        </main>
      </div>
    )
  }
}
