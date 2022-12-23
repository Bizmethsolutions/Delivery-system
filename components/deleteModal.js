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
          isOpen={this.props.deleteModelIsOpen}
          onRequestClose={this.closeModal.bind(this)}
          contentLabel="Add Team Member"
          ariaHideApp={false}
        >
          <div className="react-modal-dialog react-modal-dialog-centered">
            <div className="react-modal-header">
              <h5 className="react-modal-title">Delete</h5>
              <button type="button" className="btn react-modal-close" onClick={this.closeModal.bind(this)}><CloseIcon /></button>
            </div>
            <div className="react-modal-body react-modal-body-delete">
              <div className="row">
                <div className="col-md-12">
                  <p className="modalpara">
                  Are you sure to delete this {this.props.text} information? Once it’s deleted,
                  all the information will be removed.
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="d-flex justify-content-end">
                    <button onClick={this.props.confirmDelete.bind(this)} className="btn btn-danger btn-md font-16 font-600 btnfullwidth-mob">Yes, Delete</button>
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
