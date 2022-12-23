import React, { PureComponent } from 'react'
import { Switch, message } from 'antd'
import ReactModal from 'react-modal'
import { Link } from 'react-router-dom'
import _ from "lodash"
import Dropzone from 'react-dropzone'

import { ArrowIcon, CloseIcon, MoreIcon } from '../../components/icons'
import TopNavigation from './../TopNavigation/container'

import './styles.scss'

export default class SuperAdminComponent extends PureComponent {

  constructor() {
    super()
    this.state = {
      modalIsOpen: false,
      companyname: '',
      firstname: '',
      lastname: '',
      email: '',
      hauleremail: '',
      switchStatus: true,
      fields: ['companyname', 'lastname', 'firstname', 'email', 'hauleremail', 'switchStatus'],
      error: {},
      searchKey: '',
      errorMessage: '',
      companies: [],
      image: "",
      sameEmail: false,
    };
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.onChangeToggle = this.onChangeToggle.bind(this)
    this.onHandleChange = this.onHandleChange.bind(this)
  }

  openModal() {
    this.setState({ modalIsOpen: true })
  }

  closeModal() {
    this.setState({ modalIsOpen: false })
  }

  onChangeToggle(checked) {
    this.setState({ switchStatus: checked })
    // console.log(`switch to ${checked}`);
  }

  onHandleChange (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  componentDidMount () {
    document.title = "Admin | CurbWaste"
    this.getCompaniesApiCall()
  }

  onSearch (key) {
    // this.setState({ search_string: key}, ()=>{
    //
    // })
  }

  checkValidations () {
    const self = this
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let require = false
    let error = {}
    _.forEach(this.state.fields, function(field, i) {
      if (self.state[field] == undefined || self.state[field] == "") {
        if(field === 'hauleremail') {
          if(!self.state.sameEmail) {
            error[field] = 'Required'
            require = true
          }
        } else {
          error[field] = 'Required'
          require = true
        }
      } else if (field === 'email' || field === 'hauleremail') {
        if(field === 'hauleremail') {
          if(!self.state.sameEmail) {
            let testR = regex.test(String(self.state[field]).toLowerCase())
            if (!testR) {
              error[field] = 'Invalid email'
              require = true
            } else {
              if (self.state.hauleremail === self.state.email) {
                error['hauleremail'] = 'Email and Hauler email must be different'
                require = true
              } else {
                error[field] = ''
              }
            }
          }
        } else {
          let testR = regex.test(String(self.state[field]).toLowerCase())
          if (!testR) {
            error[field] = 'Invalid email'
            require = true
          } else {
            if (self.state.hauleremail === self.state.email) {
              error['hauleremail'] = 'Email and Hauler email must be different'
              require = true
            } else {
              error[field] = ''
            }
          }
        }
      }
      else {
        error[field] = ''
      }
    })
    if(this.state.domainurl !== "") {
      if (/\s/.test(this.state.domainurl)) {
        require = true
        error['domainurl'] = "Please remove spaces from the name."
      }
    }
    this.setState({error})
    return require
  }

  async createCompany () {
    const { companyname, lastname, firstname, email, hauleremail, switchStatus, domainurl, image } = this.state
    let validate = this.checkValidations()
    if (!validate) {
      let companyObj = {
        companyname,
        lastname,
        firstname,
        email: email && email.toLowerCase(),
        hauleremail : this.state.sameEmail ? email && email.toLowerCase() :hauleremail && hauleremail.toLowerCase() ,
        domainurl,
        image,
        sameEmail: this.state.sameEmail,
        isActive:switchStatus
      }
      const data = {companyObj}
      try {
        let { value } = await this.props.createCompany(data)
        if (value.type == 'success') {
          this.setState({ companyname: '', firstname: '', lastname: '', email: '', hauleremail: '', switchStatus: true, errorMessage: '', domainurl: '', image: '' }, ()=>{
            message.success(value.message)
            this.getCompaniesApiCall()
            this.closeModal()
          })
        } else {
          message.error(value.message)
        }
      } catch (e) {
        this.setState({errorMessage: _.get(e, 'error.message', 'Error adding company') })
        // message.error(e.error.message)
      }
    }
  }

  async getCompaniesApiCall () {
    let data = { searchKey: this.state.searchKey }
    let { value } = await this.props.getCompanies(data)
    this.setState({ companies: value.data})
  }

  handleSearch(e) {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }   
    this.setState({ searchKey: e.target.value, typingTimeout: setTimeout(() => {
        this.getCompaniesApiCall()
      }, 400)
    })
  }

  async updateCompanyStatus (index) {
    let companies = this.state.companies
    companies[index].isActive = !companies[index].isActive

    let data = {
      companyObj: {
        isActive: companies[index].isActive
      },
      companyId:  companies[index].id
    }
    let { value } = await this.props.updateCompany(data)
    this.setState({ companies },()=>{
      this.forceUpdate()
    })
  }

  onDrop (files) {
    const _URL = window.URL || window.webkitURL
    const image = []
    files.forEach(file => {
      if (file.type.split('/')[0] === 'image') {
        const img = new Image()
        const self = this
        const reader = new FileReader()
        reader.onloadend = () => {
          img.src = _URL.createObjectURL(file)
          img.onload = function () {
            /* eslint-disable */
            const name = file.name ? file.name.replace(/-|\s/g, '-').trim() : Math.floor(Math.random() * 100)
            image.push({ name, imagePreviewUrl: reader.result, imgIndex: image.length })
            if (image.length === 1) {
              self.setState({ image: image[0], showImage:  reader.result})
            } else {
              self.setState({ images: [] })
            }
          }
        }
        reader.readAsDataURL(file)
      } else {
        /* eslint-disable */
        alert('File Type Invalid')
      }
    })
  }

  changeSameEmail(checked) {
    this.setState({ sameEmail: !this.state.sameEmail })
  }

  render() {
    return (
      <div>
       <TopNavigation onSearch={this.onSearch} {...this.props} />
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="card__box--wrapper">
                <div className="card">
                  <div className="card-header d-flex flex-superadmin align-items-center">
                      <h5 className="card-title card-title-lg">Admin</h5>
                      <div className="ml-auto">
                      <button className="btn btn-dark w-200 font-700" onClick={this.openModal}>
                          Create New Company
                        </button>
                      </div>
                  </div>
                  <div className="card-body-sm">
                    <div className="search-input-wrapper adminwrapper">
                      <input
                        name="searchKey"
                        value={this.state.searchKey}
                        type="text"
                        onChange={this.handleSearch.bind(this)}
                        placeholder="Search company..."
                        className="search-input" />
                      </div>
                    <div className="admin-list">
                      <ul>
                        { _.get(this.state, 'companies', []).map((company, i)=>{
                            const id = _.get(company, 'id', _.get(company, '_id', ''))
                            return (
                              <li key={i}>
                                <h4>{company.companyname}</h4>
                                <div className="right-section">
                                  <Switch checked={company.isActive} onChange={this.updateCompanyStatus.bind(this, i)} />
                                  <Link to={{ pathname: `/company/${id}`, state: { company: company } }} className="btn btn-view">Company Details <ArrowIcon /></Link>
                                </div>
                              </li>
                            )
                          })
                        }
                      </ul>
                    </div>
                  </div>
                </div>
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
          <div className="react-modal-dialog react-modal-dialog-centered">
            <div className="react-modal-header">
              <h5 className="react-modal-title">Create New Company</h5>
              <button type="button" className="btn react-modal-close" onClick={this.closeModal}><CloseIcon /></button>
            </div>
            <div className="divider-line"></div>
            <div className="react-modal-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      onChange= {this.onHandleChange}
                      name="companyname"
                      value={this.state.companyname}
                      required />
                    <label className="material-textfield-label">Company Name <span className="text-danger">*</span></label>
                    <p className="text-danger">{_.get(this.state, 'error.companyname', '')}</p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      onChange= {this.onHandleChange}
                      name="firstname"
                      value={this.state.firstname}
                      required />
                    <label className="material-textfield-label">First Name <span className="text-danger">*</span></label>
                    <p className="text-danger">{_.get(this.state, 'error.firstname', '')}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group material-textfield">
                    <input
                      type="text"
                      className="form-control material-textfield-input"
                      onChange= {this.onHandleChange}
                      name="lastname"
                      value={this.state.lastname}
                      required />
                    <label className="material-textfield-label">Last Name <span className="text-danger">*</span></label>
                    <p className="text-danger">{_.get(this.state, 'error.lastname', '')}</p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
              <div className="form-group material-textfield">
                <input
                  type="text"
                  className="form-control material-textfield-input"
                  onChange= {this.onHandleChange}
                  name="email"
                  value={this.state.email}
                  required />
                <label className="material-textfield-label">Email <span className="text-danger">*</span></label>
                <p className="text-danger">{_.get(this.state, 'error.email', '')}</p>
              </div>
                </div>
                </div>
              <div class="form-group checkboxlists" onClick={this.changeSameEmail.bind(this)}>
                  <input type="checkbox" checked={this.state.sameEmail} />
                  <label>Hauler email is same as primary email</label>
              </div>
              {!this.state.sameEmail ?
              <div className="row">
                <div className="col-md-12">
              <div className="form-group material-textfield">
                <input
                  type="text"
                  className="form-control material-textfield-input"
                  onChange= {this.onHandleChange}
                  name="hauleremail"
                  value={this.state.hauleremail}
                  required />
                <label className="material-textfield-label">Hauler Email <span className="text-danger">*</span></label>
                <p className="text-danger">{_.get(this.state, 'error.hauleremail', '')}</p>
              </div>
                </div>
              </div> : "" }

              <div className="row">
                <div className="col-md-12">
              <div className="form-group material-textfield">
                <input
                  type="text"
                  className="form-control material-textfield-input"
                  onChange= {this.onHandleChange}
                  name="domainurl"
                  value={this.state.domainurl}
                  required />
                <label className="material-textfield-label">Domain Name<span className="text-danger">*</span></label>
                <p className="text-danger">{_.get(this.state, 'error.domainurl', '')}</p>
              </div>
              </div>
                </div>

              <div className="row">
                <div className="col-md-12">
              <Dropzone
                  onDrop={this.onDrop.bind(this)}
                  multiple={false}
                >
                  {({ getRootProps, getInputProps }) => (
              <div className="profile-wrapper--avatar dropzone-border" {...getRootProps()}>
                    <input {...getInputProps()} /> Upload Image <br /> or<br />
                    <button className="btn btn-dark btn-sm font-600 mt-2 pl-4 pr-4">Drag & Drop</button>
                    <img src={this.state.showImage} alt="" className="previewimg"/>
              </div>
                  )}
              </Dropzone>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 mt-4">
              <div className="form-group d-flex align-item-center">
                <Switch checked={this.state.switchStatus} onChange={this.onChangeToggle} />
                <label className="switchlabel">Active<span className={this.state.switchStatus ? "switchstatus": "switchstatus-no"}>{this.state.switchStatus ? "Yes" : "No"}</span></label>
              </div>
              </div>
              </div>
              <button className="btn btn-dark btn-lg w-100 font-800" onClick={this.createCompany.bind(this)}>Create Company</button>
              <p className="m-0 p-0">{_.get(this.state,'errorMessage', '')}</p>
            </div>
          </div>
        </ReactModal>
      </div>
    )
  }
}
