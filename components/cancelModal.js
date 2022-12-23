import React, { PureComponent } from 'react'
import ReactModal from 'react-modal'
// import { Menu, Dropdown, Popconfirm, message } from 'antd'
import { CloseIcon, MoreIcon } from './icons'

export default class CancelComponent extends PureComponent {

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
          isOpen={this.props.cancelModalIsOpen}
          onRequestClose={this.closeModal.bind(this)}
          contentLabel="Add Team Member"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-centered">
            <div className="react-modal-header">
              <h5 className="react-modal-title">Cancel Order?</h5>
              <button type="button" className="btn react-modal-close" onClick={this.closeModal.bind(this)}><CloseIcon /></button>
            </div>
            <div className="react-modal-body">
              <div className="row">
                <div className="col-md-12">
                  <p className="modalpara">
                    Are sure to cancel this order information? Once it’s canceled, order will be reverted to it’s previous state.
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="d-flex justify-content-end">
                    <button onClick={this.props.confirmCancel} className="btn btn-danger btn-md font-16 font-600 btnfullwidth-mob">Yes, Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ReactModal>
      </div>
    )
  }
}
