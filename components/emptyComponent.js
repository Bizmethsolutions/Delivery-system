import React, { PureComponent } from 'react'
import _ from 'lodash'

export default class EmptyComponent extends PureComponent {

  static propTypes = {
    // PropTypes go here
  }

  render() {
    return (
      <div>
        <div className="error-msg-wrapper mt-0">
          <h4 className="error-heading">{_.get(this.props, 'emptyText', '')}</h4>
        </div>
      </div>
    )
  }
}
