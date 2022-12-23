import React, { PureComponent } from 'react'
import _ from 'lodash'

import { CloseIcon } from '../../components/icons'
import config from '../../config/index'
import './styles.scss'
import integrationsArrow from './../../images/ic-backarrow-integration.svg'
import icQuickbooks from './../../images/ic-quickbooks.svg'

const phoneNumberMask = config.phoneNumberMask

export default class IntegrationssetupContainer extends PureComponent {
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

          <div className="integrations-Quickbooks-box">
          <h1 className="heading">Setup Quickbooks Invoicing</h1>
          <p className="subheading">Click the button below to start the process to start the Quickbooks integration setup</p>
          <button className="connect-btn"><img src={icQuickbooks} /> Connect to Quickbooks</button>
              </div>

      </div>
    )
  }
}
