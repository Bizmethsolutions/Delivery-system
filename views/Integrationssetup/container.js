import { connect } from 'react-redux'

import IntegrationssetupComponent from './component'
import { updateCompany  } from '../../store/admin/duck'
import { getUser  } from '../../store/user/duck'
const IntegrationssetupContainer = connect(
  // Map state to props
  (state) => ({
    user: state.user.user,
  }),
  // Map actions to dispatch and props
  {
    updateCompany,
    getUser
  }
)(IntegrationssetupComponent)

export default IntegrationssetupContainer
