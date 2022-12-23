import React, { PureComponent } from 'react'
import _ from "lodash"
import ReactCodeInput from 'react-code-input'
import { message } from 'antd'

import Logo from '../../images/curbside-logo.png'

import './styles.scss'

export default class LoginComponent extends PureComponent {
  constructor() {
    super()
    this.state = {
      error: {},
      loginResponse: {},
      messageShown: true,
      email: '',
      code: '',
      logoUrl: ""
    }
    this.onHandleChange = this.onHandleChange.bind(this)
  }

  componentDidMount = async() => {
    document.title="Login | Curbwaste"
    //localStorage.clear()
    this.redirect()
    const url = window.location.host
    const { getCompanyInfo } = this.props
    const { value } = await getCompanyInfo(url)
    if(value.type === "success") {
      this.setState({ logoUrl: _.get(value, 'data.logoUrl', '')})
    }
  }

  redirect = async() => {
    if(localStorage.getItem("userid") && localStorage.getItem("userid") !== "") {
      let data = {
        user: {
          id: localStorage.getItem("userid"),
          usertype: localStorage.getItem("usertype")
        }
      }
      const { getUserDetail } = this.props
      const { value } = await getUserDetail(data)
      if(value) {
        if(_.get(value.data, 'type', '') === "user" && _.get(value.data, 'role', '') === "superadmin") {
          this.props.history.push('/companies')
        } else if(_.get(value.data, 'type', '') === "user") {
          this.props.history.push('/dashboard')
        } else if(_.get(value.data, 'type', '') === "customer") {
          this.props.history.push('/dashboard')
        } else if(_.get(value.data, 'type', '') === "hauler") {
          this.props.history.push('/dispatcher')
        }
      }
    }
  }

  checkValidations () {
    const self = this
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let require = false
    let error = {}
      if (self.state.email === undefined || self.state.email === "") {
        error.email = 'Required'
        require = true
      } else {
        let testR = regex.test(String(self.state.email).toLowerCase())
        if (!testR) {
          error.email = 'Invalid email'
          require = true
        } else {
          error.email = ''
        }
      }
    this.setState({error})
    return require
  }

  onHandleChange (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  async loginCode () {
    const { email } = this.state
    let validate = this.checkValidations()
    if (!validate) {
      try {
        let data= {
          email: this.state.email.trim().toLowerCase(),
          origin: window.location.host
          // origin: 'stg.curbwaste.com'
          //origin: 'localhost:3000'
        }
        let  { value }  = await this.props.sendLoginCode(data)
        if (value.type == 'success') {
          this.setState({ loginResponse: value.data })
          if(this.state.messageShown) {
            this.setState({ messageShown: false })
              message.success(value.message, () => {
              this.setState({ messageShown: true })
            })
          }
          setTimeout(()=>{
            this.todoTextElem.textInput[0].focus()
          },500)
        } else {
          if(this.state.messageShown) {
            this.setState({ messageShown: false })
              message.error(value.message , () => {
              this.setState({ messageShown: true })
            })
          }
        }
      } catch (e) {
        this.setState({errorMessage: _.get(e, 'error.message', 'something went wrong') })
        message.error(_.get(e, 'error.message', 'something went wrong'))
      }
    }
  }
  handleChangeForCode = async(code) => {
    const codeVal = 4
    this.setState({ code }, async () => {
      if((this.state.code).length === codeVal) {
        let loginData = {
          email: this.state.email.toLowerCase(),
          otp: parseInt(this.state.code),
          usertype: this.state.loginResponse.usertype
        }
        try {
          let { value } = await this.props.loginUser(loginData)
          if (value.type === 'success') {
            localStorage.setItem('Authorization', value.data.token)
            localStorage.setItem('userid', value.data._id)
            localStorage.setItem('usertype', value.data.usertype)
            localStorage.setItem('companyId', value.data.companyId ?  value.data.companyId : '')

            let direcetUrl = window.localStorage.getItem('direcetUrl')
            if (direcetUrl && value.data.usertype === 'customer') {
              window.localStorage.removeItem('direcetUrl')
              this.props.history.push(direcetUrl)
            } else {
              if (value.data.type === 'superadmin') {
                localStorage.setItem('isSuperadmin', true)
                localStorage.setItem('superadminemail', value.data.email ?  value.data.email : '')
                this.props.history.push('/companies')
              }
              if (value.data.type === 'admin') {
                this.props.history.push('/dashboard')
              }
              if (value.data.type === 'h') {
                localStorage.setItem('haulerid', value.data._id)
                this.props.history.push('/dispatcher')
              }
              if (value.data.usertype === "customer") {
                this.props.history.push('/dashboard')
              }
            }
          }
        } catch (e) {
          if(this.state.messageShown) {
            this.setState({ messageShown: false })
              message.error(_.get(e, 'error.message', 'something went wrong'), () => {
              this.setState({ messageShown: true })
            })
          }
        }
      }
    })
  }

  render() {
    const { logoUrl } = this.state
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              { !Object.keys(this.state.loginResponse).length ?
                <div className="login-card white-bg">
                  <div className="sidebar-layout-sider__logo logo-center">
                    <img src={logoUrl !== "" ? logoUrl : Logo} alt="Curbside" />
                  </div>
                  <p className="login-text">Please enter your email address below and we will send you a login code</p>
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      onChange= {this.onHandleChange}
                      name="email"
                      value={this.state.email}
                      required />
                    <label className="material-textfield-label">Login with Email</label>
                    <p className="text-danger">{_.get(this.state, 'error.email', '')}</p>
                  </div>
                  <button className="btn btn-dark btn-lg w-100 font-800" onClick={this.loginCode.bind(this)}>Login</button>
                </div>
                :
                <div className="login-card white-bg">
                  <div className="sidebar-layout-sider__logo logo-center">
                    <img src={Logo} alt="Curbside" />
                  </div>
                  <p className="login-text">We've emailed you a code, please enter it here to log into your secure account. </p>
                  <div className="form-group material-textfield input-25">
                    <ReactCodeInput
                     name="code"
                     type="number"
                     ref= {el => this.todoTextElem = el}
                     fields={4}
                     value={this.state.code}
                     onChange={this.handleChangeForCode} />
                    <p className="text-danger">{_.get(this.state, 'error.email', '')}</p>
                  </div>
                  <button className="btn btn-dark btn-lg w-100 font-800" onClick={this.loginCode.bind(this)}>Resend code</button>
                </div>
              }

            </div>
          </div>
        </div>
      </div>
    )
  }
}
