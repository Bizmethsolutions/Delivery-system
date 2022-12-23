import React, { PureComponent } from 'react'
import ReactModal from 'react-modal'
// import { Menu, Dropdown, Popconfirm, message } from 'antd'
import { CloseIcon, MoreIcon } from './icons'

export default class CustomersComponent extends PureComponent {

  constructor() {
    super()
    this.closeModal = this.closeModal.bind(this)
  }

  openModal() {

  }

  closeModal() {
    this.props.closeModal()
  }
  render() {
    return (
      <div>
        <ReactModal
          isOpen={this.props.errModal}
          onRequestClose={this.closeModal.bind(this)}
          contentLabel="Add Team Member"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-centered">
            <div className="react-modal-header">
              <h5 className="react-modal-title">Unavailable</h5>
              <button type="button" className="btn react-modal-close" onClick={this.closeModal.bind(this)}><CloseIcon /></button>
            </div>
            <div className="react-modal-body">
              <div className="row">
                <div className="col-md-12">
                  <p className="modalpara">
                    Unfortunately, we do not currently service the address you've entered. We are always expanding our service area. Please check again soon or email us at <a class="mailto" href="mailto:hello@mycurbside.com">hello@mycurbside.com</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ReactModal>
      </div>
    )
  }
}
