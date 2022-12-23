import { connect } from 'react-redux'

import IntegrationsmapdetailsComponent from './component'
import { updateCompany  } from '../../store/admin/duck'
import { getUser  } from '../../store/user/duck'
const IntegrationsmapdetailsContainer = connect(
  // Map state to props
  (state) => ({
    user: state.user.user,
  }),
  // Map actions to dispatch and props
  {
    updateCompany,
    getUser
  }
)(IntegrationsmapdetailsComponent)

export default IntegrationsmapdetailsContainer
