import React, { PureComponent } from 'react'
import _ from 'lodash'
import { message } from 'antd'

import { CloseIcon } from '../../components/icons'
import config from '../../config/index'
import { Link } from 'react-router-dom'

import './styles.scss'
import integrationsArrow from './../../images/ic-backarrow-integration.svg'

const phoneNumberMask = config.phoneNumberMask

export default class SamsaraContainer extends PureComponent {
  constructor(){
    super()
    this.state= {
    }
  }
  static propTypes = {
  }
  componentDidMount = async() => {
    document.title = 'Samsara | Curbwaste'
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
        samsaraKey:  _.get(nextProps.user, 'companyInfo.samsaraKey', '') !== "" ? (_.get(nextProps.user, 'companyInfo.samsaraKey', '')) : "",
        samsaraId:  _.get(nextProps.user, 'companyInfo.samsaraId', '') !== "" ? (_.get(nextProps.user, 'companyInfo.samsaraId', '')) : ""
      }
    }
  }
  validate() {
    let errObj = {}
    const { samsaraKey, samsaraId } = this.state
    if(samsaraKey === "") {
      errObj.samsaraKey = "samsara key is required"
    }
    if(samsaraId === "") {
      errObj.samsaraId = "samsara author id is required"
    }
    this.setState({ err: errObj })
  }
  submit = async() => {
    const companyId = localStorage.getItem('companyId')
    await this.validate()
    const { samsaraKey, samsaraId, err } = this.state
    const { updateCompany } = this.props
    const companyObj = {
    }
    if(samsaraKey !== "" && samsaraId !== "") {
      companyObj.samsaraKey = samsaraKey
      companyObj.samsaraId = samsaraId
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
    return (
      <div>
      <div className="settings-top-header d-flex align-item-center justify-bet">
      <h3 className="integrations-top-heading"><Link to="/integrations"><img src={integrationsArrow} /></Link> Back</h3>
      </div>
      <div className="clearfix"></div>

        <div className="integrations-map-box transp-bg">
          <div className="box-white">
            <div className="header-top">
              <h2>Samsara</h2>
            </div>
            <div className="text-middle">
              <div className="input-wrapper">
                <input type="text" placeholder="Samsara  Key" name="samsaraKey"
                  value={this.state.samsaraKey}
                  onChange={this.handleChange.bind(this)}/>
                  <p className="text-danger">{err && err.samsaraKey ? err.samsaraKey : ""}</p>
              </div>
            </div>
            <div className="text-middle">
              <div className="input-wrapper">
                <input type="text" placeholder="Samsara Author Id" name="samsaraId"
                  value={this.state.samsaraId}
                  onChange={this.handleChange.bind(this)}/>
                  <p className="text-danger">{err && err.samsaraId ? err.samsaraId : ""}</p>
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
