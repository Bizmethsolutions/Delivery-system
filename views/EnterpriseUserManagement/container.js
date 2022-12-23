import { connect } from 'react-redux'

import UserManagementComponent from './component'
import { getCompanyUsers } from '../../store/admin/duck'
import { addEnterpriseUser, deleteEnterpriseUser, updateEnterpriseUser } from '../../store/user/duck'
const UserManagementContainer = connect(
  // Map state to props
  (/*state*/) => ({}),
  // Map actions to dispatch and props
  {
    getCompanyUsers,
    addEnterpriseUser,
    deleteEnterpriseUser,
    updateEnterpriseUser
  }
)(UserManagementComponent)

export default UserManagementContainer
