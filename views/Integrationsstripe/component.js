import React, { PureComponent } from 'react'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import base64 from "base-64"
import { message } from 'antd'

import { CloseIcon } from '../../components/icons'
import config from '../../config/index'
import './styles.scss'
import integrationsArrow from './../../images/ic-backarrow-integration.svg'

const phoneNumberMask = config.phoneNumberMask

export default class IntegrationsstripeContainer extends PureComponent {
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

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.user !== prevState.user) {
      return {
        user: nextProps.user,
        secretKey:  _.get(nextProps.user, 'companyInfo.stripeSecretKey', '') !== "" ? base64.decode(_.get(nextProps.user, 'companyInfo.stripeSecretKey', '')) : "",
        publishkey:  _.get(nextProps.user, 'companyInfo.stripePublishKey', '') !== "" ? base64.decode(_.get(nextProps.user, 'companyInfo.stripePublishKey', '')) : ""
      }
    }
  }
  validate() {
    let errObj = {}
    const { secretKey, publishkey } = this.state
    if(secretKey === "") {
      errObj.secretKey = "secret key is required"
    }
    if(publishkey === "") {
      errObj.publishkey = "publish key is required"
    }
    this.setState({ err: errObj })
  }
  submit = async() => {
    const companyId = localStorage.getItem('companyId')
    await this.validate()
    const { secretKey, publishkey, err } = this.state
    const { updateCompany } = this.props
    const companyObj = {
    }
    if(secretKey !== "" && publishkey !== "") {
      companyObj.stripeSecretKey = base64.encode(secretKey)
      companyObj.stripePublishKey =  base64.encode(publishkey)
    }
    if(Object.keys(err).length === 0) {
      const { value } = await updateCompany({companyObj, companyId})
      // console.log(companyObj, 'value', companyId)
      if(value.type === "success") {
        if(!this.state.messageShown) {
          this.setState({ messageShown: true })
          message.success("Information updated sucessfully.", () => {
            this.setState({ messageShown: false })
          })
        }

      } else {
        if(!this.state.messageShown) {
          this.setState({ messageShown: true })
          message.error("Error in processing your request", () => {
            this.setState({ messageShown: false })
          })
        }
      }
    }
  }

  handleChange(e) {
    this.setState({ [e.target.name] : e.target.value})
  }
  render() {
    const { err } = this.state
    console.log(err)
    return (
      <div>
      <div className="settings-top-header d-flex align-item-center justify-bet">
      <h3 className="integrations-top-heading"><Link to="/integrations"><img src={integrationsArrow} /></Link> Back</h3>
      </div>
      <div className="clearfix"></div>

        <div className="integrations-map-box transp-bg">
          <div className="box-white">
            <div className="header-top">
              <h2>Stripe</h2>
            </div>
            <div className="text-middle">
              <div className="input-wrapper">
                <input type="text" 
                  placeholder="Stripe Publish Key" 
                  name="publishkey"
                  value={this.state.publishkey}
                  onChange={this.handleChange.bind(this)}/>
                  <p className="text-danger">{err && err.publishkey ? err.publishkey : ""}</p>
              </div>
              <div className="input-wrapper">
                <input type="text" placeholder="Stripe Secret Key" 
                  name="secretKey"
                  value={this.state.secretKey}
                  onChange={this.handleChange.bind(this)}
                />
                <p className="text-danger">{err && err.secretKey ? err.secretKey : ""}</p>
              </div>
              
            </div>
          </div>


          <div className="btn-footer padzero">
            <button className="btn save-btn" onClick={this.submit.bind(this)}>Save</button>
          </div>
          
        </div>

        

      </div>
    )
  }
}
