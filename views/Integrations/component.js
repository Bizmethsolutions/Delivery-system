import React, { PureComponent } from 'react'
import _ from 'lodash'

import { CloseIcon } from '../../components/icons'
import config from '../../config/index'
import './styles.scss'
import integrationsArrow from './../../images/ic-arrow-integrations.svg'
import { Link } from 'react-router-dom'

const phoneNumberMask = config.phoneNumberMask

export default class IntegrationsContainer extends PureComponent {
  constructor(){
    super()
    this.state= {
    }
  }
  static propTypes = {
  }

  componentDidMount = async() => {
    document.title = 'Stripe | Curbwaste'
    let data = { user : {
      id: localStorage.getItem("userid"),
      usertype: localStorage.getItem("usertype")
      }
    }
    this.props.getUser(data)
  }

  render() {
    const { err } = this.state
    const { user } = this.props
    console.log(user)
    const id = localStorage.getItem("userid")
    return (
      <div>
      <div className="settings-top-header d-flex align-item-center justify-bet">
          <h3 className="settings-top-heading">Integrations</h3>
          <Link to ="/dashboard"><button className="settings-card-close"><CloseIcon /></button></Link>
      </div>
        <div className="container">
          <div className="row">
            <div className="col-md-12 pb-4">
              <div className="integrations-card white-bg">
                <div className="integrations-card-body">
                  <ul className="integrations-list">
                    <li className={_.get(user, 'companyInfo.stripeconnected', false) ? "active-list" : ""}><span>Stripe</span> <span><h4>{_.get(user, 'companyInfo.stripeconnected', false) ? "Connected" : "Not Connected"}</h4><Link to={`/stripe/${id}`}><img src={integrationsArrow} /></Link></span></li>
                    <li className={_.get(user, 'companyInfo.samsaraconnected', false) ? "active-list" : ""}><span>Samsara</span> <span><h4>{_.get(user, 'companyInfo.samsaraconnected', false) ? "Connected" : "Not Connected"}</h4><Link to={`/samsara/${id}`}><img src={integrationsArrow} /></Link></span></li>
                    {/* <li className="active-list"><span>Quickbooks</span> <span><h4>Connected</h4><img src={integrationsArrow} /></span></li> */}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
