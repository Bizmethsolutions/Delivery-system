import React from 'react'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import _ from 'lodash'
import LogRocket from 'logrocket'
//import * as Sentry from '@sentry/react';
//import { Integrations } from "@sentry/apm";

import { withCookies } from 'react-cookie'
import Dashboard from '../views/Dashboard/container'
import Signup from '../views/Signup/container'
import SuperAdmin from '../views/SuperAdmin/container'
import ClientDetail from '../views/ClientDetail/container'
import Login from '../views/Login/container'
import Resources from '../views/Resources/container'
import Customers from '../views/Customers/container'
import Permits from '../views/Permits/container'
import Settings from '../views/Settings/container'
import EditProfile from '../views/EditProfile/container'
import CustomerOrders from '../views/CustomerOrders/container'
import Reports from '../views/Reports/container'
import ReportsMainComponent from '../views/ReportsMainComponent/container'
import CustomerDashboard from '../views/CustomerDashboard/container'
// import CustomerJobs from '../views/CustomerJobs/container'
import CustomerJobsStatus from '../views/CustomerJobsStatus/container'
import UserManagement from '../views/UserManagement/container'
import EnterpriseUserManagement from '../views/EnterpriseUserManagement/container'
import UserDetails from '../views/UserDetails/container'
import UserDetailsBack from '../views/UserDetailsBack/container'
import PersonalSelection from '../views/PersonalSelection/container'
import PersonalContainerSize from '../views/PersonalContainerSize/container'
import CheckAvailability from '../views/CheckAvailability/container'
import SelectTime from '../views/SelectTime/container'
import OrderPlaced from '../views/OrderPlaced/container'
import BusinessConfirmationForm from '../views/BusinessConfirmationForm/container'
import BusinessConfirmation from '../views/BusinessConfirmation/container'
import SelectMaterials from '../views/SelectMaterials/container'
import MessagingLink from '../views/MessagingLink/container'
import OrderPlace from '../views/OrderPlace/container'
import DispatcherDashboard from '../views/DispatcherDashboard/container'
import DispatcherTopNavigation from '../views/DispatcherTopNavigation/container'
import ViewMap from '../views/ViewMap/container'
import Results from '../views/Results/container'
import WorkReport from '../views/WorkReport/container'
import Inventory from '../views/Inventory/container'

// import Orders from '../views/Orders/container'
import CustomerJobs from '../views/Orders/container'


import ModalFirst from '../views/ModalFirst/component'
import ModalSecond from '../views/ModalSecond/container'

import { isEmpty } from 'lodash'

import 'antd/dist/antd.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../App.scss'
// if(process.env.REACT_APP_SENTRY && process.env.REACT_APP_SENTRY !== '') {
//   Sentry.init({dsn: process.env.REACT_APP_SENTRY,
//     release: 'curbwaste@0.1.0',
//     integrations: [
//       new Integrations.Tracing(),
//     ],
//     tracesSampleRate: 1.0,
//     beforeSend(event) {
//       return event;
//      }
//     });
//     // Sentry.configureScope(function(scope) {
//     //   scope.setUser({"email": "jane.doe@example.com"});
//     // });
// }
const PrivateRoute = ({ component, user, ...rest }) => {
  const isUser = window.localStorage.getItem('Authorization')
  const isAuthed = isUser ? true : false
  if (!isAuthed) {
    window.localStorage.setItem('direcetUrl', window.location.pathname)
  }
  return (
    <Route {...rest} exact
      render = {props => (
        isAuthed ? (<div>
          {
            React.createElement(component, props)
          }
        </div>)
        :
        (
          <Redirect
            to={{
              pathname: '/',
              state: { from: props.location }
            }}
          />
        )
      )}
    />
  )
}


const AdminRoute = ({ component, user, ...rest }) => {
  const isUser = window.localStorage.getItem('Authorization')
  const isAuthed = isUser ? true : false
  const isAdmin = localStorage.getItem('isSuperadmin') === "true" || (localStorage.getItem('userid') === localStorage.getItem('companyId')) ? true : false
  if (!isAuthed) {
    window.localStorage.setItem('direcetUrl', window.location.pathname)
  }
  return (
    <Route {...rest} exact
      render = {props => (
        isAuthed && isAdmin ? (
        <div>
          {
            React.createElement(component, props)
          }
        </div>
        )
        :
        (
          <Redirect
            to={{
              pathname: '/',
              state: { from: props.location }
            }}
          />
        )
      )}
    />
  )
}

const EnterpriseRoute = ({ component, user, ...rest }) => {
  const isUser = window.localStorage.getItem('Authorization')
  const isAuthed = isUser ? true : false
  const isUserType = localStorage.getItem('usertype') === "user" && (localStorage.getItem('userid') !== localStorage.getItem('companyId')) ? true : false
  if (!isAuthed) {
    window.localStorage.setItem('direcetUrl', window.location.pathname)
  }
  return (
    <Route {...rest} exact
      render = {props => (
        isAuthed && isUserType ? (
        <div>
          {
            React.createElement(component, props)
          }
        </div>
        )
        :
        (
          <Redirect
            to={{
              pathname: '/',
              state: { from: props.location }
            }}
          />
        )
      )}
    />
  )
}

const CustomerRoute = ({ component, user, ...rest }) => {
  const isUser = window.localStorage.getItem('Authorization')
  const isAuthed = isUser ? true : false
  const isUserType = localStorage.getItem('usertype') === "customer"  ? true : false
  if (!isAuthed) {
    window.localStorage.setItem('direcetUrl', window.location.pathname)
  }
  return (
    <Route {...rest} exact
      render = {props => (
        isAuthed && isUserType ? (
        <div>
          {
            React.createElement(component, props)
          }
        </div>
        )
        :
        (
          <Redirect
            to={{
              pathname: '/',
              state: { from: props.location }
            }}
          />
        )
      )}
    />
  )
}

const EnterpriseCustomerRoute = ({ component, user, ...rest }) => {
  const isUser = window.localStorage.getItem('Authorization')
  const isAuthed = isUser ? true : false
  const isUserType = (localStorage.getItem('usertype') === "user" || localStorage.getItem('usertype') === "customer") && (localStorage.getItem('userid') !== localStorage.getItem('companyId')) ? true : false
  if (!isAuthed) {
    window.localStorage.setItem('direcetUrl', window.location.pathname)
  }
  return (
    <Route {...rest} exact
      render = {props => (
        isAuthed && isUserType ? (
        <div>
          {
            React.createElement(component, props)
          }
        </div>
        )
        :
        (
          <Redirect
            to={{
              pathname: '/',
              state: { from: props.location }
            }}
          />
        )
      )}
    />
  )
}

const HaulerRoute = ({ component, user, ...rest }) => {
  const isUser = window.localStorage.getItem('Authorization')
  const isAuthed = isUser ? true : false
  const isUserType = localStorage.getItem('usertype') === "hauler"  ? true : false
  if (!isAuthed) {
    window.localStorage.setItem('direcetUrl', window.location.pathname)
  }
  return (
    <Route {...rest} exact
      render = {props => (
        isAuthed && isUserType ? (
        <div>
          {
            React.createElement(component, props)
          }
        </div>
        )
        :
        (
          <Redirect
            to={{
              pathname: '/',
              state: { from: props.location }
            }}
          />
        )
      )}
    />
  )
}

class  AppComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      user: {},
      superadmins: ['/companies', 'userlist' ],
      enterprise: ["/inventory", "/services-report","/yardage-report","/sustainability-report","/tonnage-report", '/dashboard', '/reports/', '/reports', '/customer-orders/', "/enterprise-user-management", '/customer-orders/rejected/', '/customer-orders/unapproved-orders/', '/customer-orders/unapproved-orders/', '/customer-orders/live/', '/customer-orders/history/', '/haulers', '/drivers', '/dumps', '/yards', '/customers', '/settings', '/edit-profile'],
      hauler: ['/viewmap', '/dispatcher', "/job/", "/order/", '/edit-profile'],
      customer: ['/active-containers', "/job/","/services-report","/yardage-report","/sustainability-report","/tonnage-report", '/dashboard',"/pending-orders", "/results/", "/completed-orders", "/job-status", "/user-management", '/settings', '/edit-profile']

    }
  }

  componentDidMount= async() => {
    // const { getUser, user } = this.props
    // if (isEmpty(user)) {
    //   getUser()
    // } else {
    //   this.setState({ isLoading: false })
    // }
    ///this.redirect()
    window.onpopstate =async()=> {
      const companyEmail = localStorage.getItem('companyEmail')
      if (companyEmail && window.location.pathname !== '/viewmap' && window.location.pathname !== '/dispatcher' && window.location.pathname !== "/active-containers" && window.location.pathname !== "/pending-orders") {
        const data = {
          email: companyEmail,
          usertype: 'user'
        }
        let { value } = await this.props.getToken(data)
        if (value.type=== 'success') {
          localStorage.removeItem('companyEmail')
          localStorage.removeItem('haulerid')
          localStorage.setItem('Authorization', value.data.token)
          localStorage.setItem('userid', value.data._id)
          localStorage.setItem('usertype', value.data.usertype)
          localStorage.setItem('companyId', value.data.companyId ?  value.data.companyId : '')
          this.props.getUser({ user : {
              id: value.data._id,
              usertype: value.data.usertype
            }
          })
        }
      }
    }
  }


  static getDerivedStateFromProps = (props, state) => {
    if(isEmpty(props.user) !== isEmpty(state.user)){
      return { isLoading: false, user: props.user }
    }

    // Return null to indicate no change to state.
    return null;
  }
  componentDidCatch(error, errorInfo) {
    // if(process.env.REACT_APP_SENTRY && process.env.REACT_APP_SENTRY !== '') {
    //   var eventId = Sentry.captureMessage('User Feedback', function() {});
    //   Sentry.showReportDialog({
    //     eventId: eventId
    //   });
    // }
  }
  render() {
    // let { isLoading } = this.state
    const isUser = window.localStorage.getItem('Authorization')
    const userId = localStorage.getItem("userid")
    const companyId = localStorage.getItem("companyId")
    if(isUser && (window.location.pathname.indexOf('/customer-orders') !== -1 ||
    window.location.pathname.indexOf('/active-containers') !== -1)) {
      const logRocketAppName = _.get(process.env, 'REACT_APP_LOGROCKET', '')
      if(userId && logRocketAppName && logRocketAppName !== '') {
        // LogRocket.init(logRocketAppName, {
        //   rootHostname: window.location.origin
        // })
        // LogRocket.identify(companyId, {
        //   userId,
        //   companyId
        // })
      }
    }
    return (
      <>
        {/* <Loader isLoading={isLoading} /> */}
        <div className="application-container">
          <Switch>
            <Route exact path="/" render={() =>
            <Redirect to="/login" />} />
            <EnterpriseCustomerRoute exact path="/dashboard" component={Dashboard} {...this.props} />
            <Route exact path="/signup" component={Signup} {...this.props} />
            <AdminRoute exact path="/companies" component={SuperAdmin} {...this.props} />
            <AdminRoute exact path="/company/:id" component={ClientDetail} {...this.props} />
            <Route exact path="/login" component={Login} {...this.props} />
            <EnterpriseRoute exact path="/haulers" component={Resources} {...this.props} />
            <EnterpriseRoute exact path="/drivers" component={Resources} {...this.props} />
            <EnterpriseRoute exact path="/trucks" component={Resources} {...this.props} />
            <EnterpriseRoute exact path="/dumps" component={Resources} {...this.props} />
            <EnterpriseRoute exact path="/yards" component={Resources} {...this.props} />
            <EnterpriseRoute exact path="/containers" component={Resources} {...this.props} />
            <EnterpriseRoute exact path="/customers" component={Customers} {...this.props} />
            <PrivateRoute exact path="/permits" component={Permits} {...this.props} />
            <EnterpriseRoute exact path="/inventory" component={Inventory} {...this.props} />
            {/* <PrivateRoute exact path="/modalfirst" component={ModalFirst} {...this.props} />
            <PrivateRoute exact path="/modalsecond" component={ModalSecond} {...this.props} /> */}
            {/* <PrivateRoute exact path="/orders" component={Orders} {...this.props} /> */}

            <Route exact path="/live-track/:id" component={MessagingLink} {...this.props} />
            <EnterpriseRoute exact path="/settings" component={Settings} {...this.props} />
            <PrivateRoute exact path="/edit-profile" component={EditProfile} {...this.props} />
            <HaulerRoute exact path="/viewmap" component={ViewMap} {...this.props} />
            <EnterpriseRoute exact path="/customer-orders/live/:id" component={CustomerOrders} {...this.props} />
            <EnterpriseRoute exact path="/customer-orders/history/:id" component={CustomerOrders} {...this.props} />
            <EnterpriseRoute exact path="/customer-orders/unapproved-orders/:id" component={CustomerOrders} {...this.props} />
            <EnterpriseRoute exact path="/customer-orders/unapproved-orders/:id/:orderid" component={CustomerOrders} {...this.props} />
            <EnterpriseRoute exact path="/customer-orders/rejected/:id" component={CustomerOrders} {...this.props} />
            <EnterpriseRoute exact path="/customer-orders/:id/:orderid" component={CustomerOrders} {...this.props} />
            <EnterpriseCustomerRoute exact path="/reports" component={ReportsMainComponent} {...this.props} />
            <EnterpriseCustomerRoute exact path="/status-reports" component={Reports} {...this.props} />
            <EnterpriseCustomerRoute exact path="/status-reports/:id" component={Reports} {...this.props} />
            <CustomerRoute exact path="/customerdashboard" component={CustomerDashboard} {...this.props} />
            <CustomerRoute exact path="/active-containers" component={CustomerJobs} {...this.props} />
            <CustomerRoute exact path="/job/:id" component={CustomerJobs} {...this.props} />
            <CustomerRoute exact path="/pending-orders" component={CustomerJobs} {...this.props} />
            <CustomerRoute exact path="/completed-orders" component={CustomerJobs} {...this.props} />
            <CustomerRoute exact path="/job-status" component={CustomerJobsStatus} {...this.props} />
            <CustomerRoute exact path="/user-management" component={UserManagement} {...this.props} />
            <EnterpriseRoute exact path="/enterprise-user-management" component={EnterpriseUserManagement} {...this.props} />
            <EnterpriseCustomerRoute exact path="/results/:type" component={Results} {...this.props}/>
            <PrivateRoute exact path="/UserDetails" component={UserDetails} {...this.props} />
            <Route exact path="/UserDetailsBack" component={UserDetailsBack} {...this.props} />
            <Route exact path="/personalselection" component={PersonalSelection} {...this.props} />
            <Route exact path="/PersonalContainerSize" component={PersonalContainerSize} {...this.props} />
            <Route exact path="/CheckAvailability" component={CheckAvailability} {...this.props} />
            <Route exact path="/SelectTime" component={SelectTime} {...this.props} />
            <Route exact path="/OrderPlaced" component={OrderPlaced} {...this.props} />
            <Route exact path="/BusinessConfirmationForm" component={BusinessConfirmationForm} {...this.props} />
            <Route exact path="/BusinessConfirmation" component={BusinessConfirmation} {...this.props} />
            <Route exact path="/SelectMaterials" component={SelectMaterials} {...this.props} />
            <Route exact path="/OrderPlace" component={OrderPlace} {...this.props} />
            <HaulerRoute exact path="/dispatcher" component={DispatcherDashboard} {...this.props} />
            <HaulerRoute exact path="/order/:id" component={DispatcherDashboard} {...this.props} />
            <HaulerRoute exact path="/DispatcherTopNavigation" component={DispatcherTopNavigation} {...this.props} />
            <EnterpriseCustomerRoute exact path="/services-report" component={WorkReport} {...this.props} />
            <EnterpriseCustomerRoute exact path="/yardage-report" component={WorkReport} {...this.props} />
            <EnterpriseCustomerRoute exact path="/sustainability-report" component={WorkReport} {...this.props} />
            <EnterpriseCustomerRoute exact path="/sustainability-summary" component={WorkReport} {...this.props} />
            <EnterpriseCustomerRoute exact path="/tonnage-report" component={WorkReport} {...this.props} />


          </Switch>
        </div>
      </>
    )
  }
}

export default withRouter(withCookies(AppComponent))
