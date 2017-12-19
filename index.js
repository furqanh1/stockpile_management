require('!style-loader!css-loader!sass-loader!./styles/main.scss')

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Route, Switch } from 'react-router-dom'
import { store, history } from './store'

import './styles/main.scss'

import {
  App,

  LoggedOutLayout,
  Login,
  Register,
  Password,
  ForgetPassword,
  EmailSent,

  LoggedInLayout,
  Dashboard,
  LocationData,
  Profile,
  NotFound,

  Image3D,

  AdminLayout,
  Users,
  Piles,
  Sites,
  Companies,
  Home,
  Levels,
} from './containers'

ReactDOM.render(
  <Provider store={store}>
    <App>
      <ConnectedRouter history={history}>
        <div>
          <LoggedOutLayout>
            <Switch>
              <Route exact path="/forget-password" component={ForgetPassword} />
              <Route exact path="/change-password" component={Password}/>
              <Route exact path="/email-sent" component={EmailSent} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
            </Switch>
          </LoggedOutLayout>

          <AdminLayout>
            <Switch>
              <Route exact path="/admin" component={Home} />
              <Route exact path="/admin/users" component={Users} />
              <Route exact path="/admin/piles" component={Piles} />
              <Route exact path="/admin/sites" component={Sites} />
              <Route exact path="/admin/companies" component={Companies} />
              <Route exact path="/admin/Levels" component={Levels} />
            </Switch>
          </AdminLayout>

          <LoggedInLayout>
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route exact path="/Profile" component={Profile} />
              <Route exact path="/location" component={LocationData} />
              <Route exact path="/3d" component={Image3D} />
              
            </Switch>
          </LoggedInLayout>
        </div>
      </ConnectedRouter>
    </App>
  </Provider>,
  document.getElementById('app')
)
