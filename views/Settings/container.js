import { connect } from 'react-redux'

import SettingsComponent from './component'
import { updateCompany  } from '../../store/admin/duck'
import { getUser  } from '../../store/user/duck'
const SettingsContainer = connect(
  // Map state to props
  (state) => ({
    user: state.user.user,
  }),
  // Map actions to dispatch and props
  {
    updateCompany,
    getUser
  }
)(SettingsComponent)

export default SettingsContainer
