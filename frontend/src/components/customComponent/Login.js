import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import "../../assets/scss/base/base_login.scss";
import Avatar from "../../assets/images/avatar.png"
import Presentation from "../../assets/images/login-presentation-bg.png"

// Login functionalities with backend
import { login } from "../../redux/actions/auth";

class Login extends Component {
  // Inital state of input fields
  state = {
    email: "",
    password: "",
  };

  // Watch for changes in does fields
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // Submit with input changes
  onSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    const users = { email, password };
    this.props.login(users);
  };

  render() {
    // If already authenticated then redirect to homepage
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }
    const { email, password } = this.state;

    // If not authenticated then show login form
    return (
      //Div global
          <div class="global_wrapper">

            {/* GLobal Login with presentation image */}
            <div class="global_login_with_presentation">
              <form class="login_form" method="post" name="loginForm" onSubmit={this.onSubmit}>

              {/*  Container Imagine Avatar */}
                <div class="container_imagine">
                  <img src={Avatar} alt="Avatar" class="avatar" />
                </div>

              {/*  // Container date utilizator*/}
                <div class="container_date">
                  <label for="email"><b>Utilizator :</b></label>
                  <input type="email" placeholder="Introduce adresa de e-mail" name="email" id="email" value={email} onChange={this.onChange} required />

                  <label for="password"><b>Parola :</b></label>
                  <input type="password" placeholder="Introduce parola" name="password" id="password" onChange={this.onChange} value={password} required />
                </div>

                {/*Container tine-ma minte si am uitat parola*/}
                <div class="container_remember_forgot">
                  <label>
                    <input type="checkbox" checked="checked" name="remember" /> Tine-ma minte
                  </label>

                  <span class="psw">Ai uitat <a href="#">parola?</a></span>
                </div>

                {/* Container Logare*/}
                <div class="buton-logare">
                  <button type="submit" href="#">Logare</button>
                </div>
              </form>
            <div class="global_image_presentation">
              <img src={Presentation} alt=""/>
              </div>
            </div>
          </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
