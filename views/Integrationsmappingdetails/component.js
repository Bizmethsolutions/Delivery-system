import React, { PureComponent } from 'react'
import _ from 'lodash'

import { CloseIcon } from '../../components/icons'
import config from '../../config/index'
import './styles.scss'
import integrationsArrow from './../../images/ic-backarrow-integration.svg'

const phoneNumberMask = config.phoneNumberMask

export default class IntegrationsmapdetailsContainer extends PureComponent {
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
        <div className="header-top header-flex">
          <h2>QuickBooks</h2>
          <button className="btn btn-disab">Disable Quickbooks Integration</button>
        </div>
        <div className="quickbook-details">
          <ul>
            <li>
              <h4>Company</h4>
              <h5>Relibit</h5>
            </li>

            <li>
              <h4>Quickbooks connected with</h4>
              <h5>dd@relibit.com</h5>
            </li>

            <li>
              <h4 className="status">Status</h4>
              <h5 className="active">Active</h5>
            </li>
          </ul>
        </div>

      </div>


      </div>
    )
  }
}
