import { connect } from 'react-redux'

import IntegrationsComponent from './component'
import { updateCompany  } from '../../store/admin/duck'
import { getUser  } from '../../store/user/duck'
const IntegrationsContainer = connect(
  // Map state to props
  (state) => ({
    user: state.user.user,
  }),
  // Map actions to dispatch and props
  {
    updateCompany,
    getUser
  }
)(IntegrationsComponent)

export default IntegrationsContainer
