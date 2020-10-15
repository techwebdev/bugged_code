import React, { Component, Fragment } from "react";
import { Link, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../redux/actions/auth";
import "../../assets/scss/components/navbar/navbar.scss";

class navbar extends Component {

  render() {
    const { isAuthenticated, user } = this.props.auth;
    console.log({ user });
    const authLinks = (
      <>
        <div className="navbar__bottom">
        </div>
      </>
    );

    const guestLinks = (
      <>
        <p>
          <NavLink className="navbar__top__auth__link" to="/login">
            Login
          </NavLink>
        </p>
        <p>
          <NavLink className="navbar__top__auth__link" to="/signup">
            Sign Up
          </NavLink>
        </p>
        <p>
          <NavLink className="navbar__top__auth__link" to="#">
            Forgot Password
          </NavLink>
        </p>
      </>
    );

    return (
      <Fragment>
        <nav className="navbar">
          <div className="firstnav">
          <div class="topBarProfile">
            <div className="welcome_message">
              <h3><span>Bine ai venit</span>{user ? `${user.username} !` : ""}</h3>
            </div>
            <div>
              <img src="https://placeimg.com/500/500/people" class="profileImage"/>
            </div>

          </div>
            <div className="profile_settings">
              <button
                className="logoutBtn"
                onClick={this.props.logout}> 
                Logout
              </button>
              <p>
                <NavLink className="navbar__top__auth__link" to="/change-password">
                  Change Password
                </NavLink>
              </p>
              {user && user.is_restaurant && (
                <p>
                  <NavLink className="navbar__top__auth__link" to="/invite-staff">
                    Add Staff
                  </NavLink>
                </p>
              )}
              <p>
                <NavLink className="navbar__top__auth__link" to="/restaurantform">
                  Staff/Restaurant form
                </NavLink>
              </p>
              {/* If the user is isAuthenticated then show the authlinks else show guestLinks. */}
              <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
            </div>
          </div>
        </nav>
      </Fragment>
    );
  }
}


navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(navbar);
