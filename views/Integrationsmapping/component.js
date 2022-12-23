import React, { PureComponent } from 'react'
import _ from 'lodash'

import { CloseIcon } from '../../components/icons'
import config from '../../config/index'
import './styles.scss'
import integrationsArrow from './../../images/ic-backarrow-integration.svg'

const phoneNumberMask = config.phoneNumberMask

export default class IntegrationsmapContainer extends PureComponent {
  constructor(){
    super()
    this.state= {
    }
  }
  static propTypes = {
  }

  render() {
    const { err } = this.state
    return (
      <div>
      <div className="settings-top-header d-flex align-item-center justify-bet">
      <h3 className="integrations-top-heading"><img src={integrationsArrow} /> Back</h3>
      </div>
      <div className="clearfix"></div>

      <div className="integrations-map-box">
        <div className="header-top">
          <h2>Customer Mapping</h2>
          <p>To finish the setup map your quickbook customers</p>
        </div>
        <div className="text-middle">
          <ul>
            <li>
              <div className="left-sec"><h5>Curbwaste Works Customer Name</h5></div>
              <div className="right-sec"><h5>Quickbooks Customer </h5></div>
            </li>
            <li>
              <div className="left-sec">
                <h4>Relibit</h4>
              </div>
              <div className="right-sec">
                  <div className="form-group material-textfield">
                    <select name="containersize" className="form-control custom-select h-55 font-16 material-textfield-input" required>
                      <option value="">Relibit,LLC</option>
                    </select>
                    <label className="material-textfield-label">Quickbooks Company Name</label>
                  </div>
              </div>
            </li>

              <li>
                <div className="left-sec">
                  <h4>Google</h4>
                </div>
                <div className="right-sec">
                  <div className="form-group material-textfield">
                    <select name="containersize" className="form-control custom-select h-55 font-16 material-textfield-input" required>
                      <option value="">Select</option>
                    </select>
                    <label className="material-textfield-label">Quickbooks Company Name</label>
                  </div>
                </div>
              </li>

              <li>
                <div className="left-sec">
                  <h4>Stripe</h4>
                </div>
                <div className="right-sec">
                  <div className="form-group material-textfield">
                    <select name="containersize" className="form-control custom-select h-55 font-16 material-textfield-input" required>
                      <option value="">Select</option>
                    </select>
                    <label className="material-textfield-label">Quickbooks Company Name</label>
                  </div>
                </div>
              </li>
          </ul>
        </div>

        <div className="btn-footer">
          <button className="btn save-btn">Save</button>
          <button className="btn skip-btn">Skip</button>
        </div>
      </div>


      </div>
    )
  }
}
