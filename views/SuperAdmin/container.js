import { connect } from 'react-redux'

import { createCompany, getCompanies, updateCompany } from '../../store/admin/duck'
import SuperAdminComponent from './component'

const SuperAdminContainer = connect(
  // Map state to props
  (/*state*/) => ({}),
  // Map actions to dispatch and props
  {
    createCompany,
    getCompanies,
    updateCompany
  }
)(SuperAdminComponent)

export default SuperAdminContainer
