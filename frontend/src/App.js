import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ReduxToastr from "react-redux-toastr";

// Layouts
import Layout from "./layouts/Layout";

// Components
import NotFound from "./components/error/NotFound";
import Signup from "./components/customComponent/Signup";
import Login from "./components/customComponent/Login";
import PrivateRoute from "./common/PrivateRoute";

import ChangePassword from "./components/customComponent/ChangePassword";
import SendInvitation from "./components/customComponent/SendInvitation";

import RestaurantRegistrationForm from "./components/customComponent/RestaurantRegistrationForm";

// Containers
import Home from "./containers/Home";


import { Provider } from "react-redux";
import { store } from "./redux/store";
import { loadUser } from "./redux/actions/auth";

import "./assets/scss/main.scss";
// Alert Options

const alertOptions = {
  timeout: 3000,
  newestOnTop: false,
  position: "top-right",
  preventDuplicates: true,
  transitionIn: "fadeIn",
  transitionOut: "fadeOut",
  progressBar: true,
  closeOnToastrClick: true,
};

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }
  render() {
    return (
      <Provider store={store}>
        {/* <AlertProvider template={AlertTemplate} {...alertOptions}> */}
        <Router>
          <Layout>
            <ReduxToastr
              getState={(state) => state.toastr} // This is the default
              {...alertOptions}
            />
            <Switch>
              <PrivateRoute exact path="/" component={Home} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/login" component={Login} />
              <PrivateRoute
                exact
                path="/change-password"
                component={ChangePassword}
              />
              <PrivateRoute
                exact
                path="/invite-staff"
                component={SendInvitation}
              />
              <PrivateRoute exact path="/restaurantform" component={RestaurantRegistrationForm}/>

              {/* Not Found */}
              <Route component={NotFound} />
            </Switch>
          </Layout>
        </Router>
        {/* </AlertProvider> */}
      </Provider>
    );
  }
}

export default App;
