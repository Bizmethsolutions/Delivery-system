import { connect } from 'react-redux'

import { getCompanyUsers, getCompanyDetail, updateCompany } from '../../store/admin/duck'
import { getToken, updateStatus, updateUser, addEnterpriseUser } from '../../store/user/duck'
import {  updateHauler } from '../../store/hauler/duck'
import ClientDetailComponent from './component'

const ClientDetailContainer = connect(
  // Map state to props
  (state) => ({
    user: state.user.user
  }),
  // Map actions to dispatch and props
  {
    getCompanyUsers,
    updateHauler,
    updateStatus,
    updateUser,
    getToken,
    addEnterpriseUser,
    getCompanyDetail,
    updateCompany
  }
)(ClientDetailComponent)

export default ClientDetailContainer
