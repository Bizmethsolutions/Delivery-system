import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types'
import { BackArrowIcon } from '../../components/icons'
import './styles.scss'

export default class UserDetailsBackComponent extends PureComponent {

  static propTypes = {
    // PropTypes go here
  }

  render() {
    return (
      <div>
        <div className="customer-orders-wrapper">
        <div className="container">
          

          
          <div className="row">
            <div className="col-md-12">
              <div className="card__box--wrapper-md">
                  <div className="d-flex align-items-center mb-4">
                    <ul className="customer-orders-list icon-mr-1">
                      <li><BackArrowIcon /> Back</li>
                    </ul>
                  </div>
                <div className="card">
                  <div className="card-header d-flex align-items-center">
                    <h5 className="card-title card-title">Travis Scott</h5>
                    <div className="ml-auto">
                      <button className="btn btn-dark w-240 font-700" onClick={this.openModal}>
                        Edit Travis’s Information
                      </button>
                    </div>
                  </div>
                  <div className="card-body-sm">
                    <ul className="userdetails-back">
                      <li>
                        <label className="view-textfield-label">Email</label>
                        <p className="view-textfield-details">ts@company.com</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Phone Number</label>
                        <p className="view-textfield-details">554.040.0303</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Role</label>
                        <p className="view-textfield-details">Admin</p>
                      </li>
                      <li>
                        <label className="view-textfield-label">Status</label>
                        <p className="view-textfield-details">Active</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    )
  }
}
