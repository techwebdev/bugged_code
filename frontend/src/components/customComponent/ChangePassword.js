import React, { Component } from "react";
import { connect } from "react-redux";
import { changepassword } from "../../redux/actions/auth";

class Login extends Component {
  state = {
    newpassword: "",
    new_confirm_password: "",
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { newpassword, new_confirm_password } = this.state;
    const users = { newpassword, new_confirm_password };
    this.props.changepassword(users);
    window.location.href = "/login";
  };
  render() {
    const { newpassword, new_confirm_password } = this.state;

    return (
      <div className="row card card-body mt-4 mb-4">
        <p className="h5 text-center mb-4">Change Password</p>
        <form className="col-6 offset-3" onSubmit={this.onSubmit}>
          <div className="form-group">
            <label for="male">New Password</label>
            <input
              className="form-control"
              placeholder="New Password"
              type="password"
              name="newpassword"
              id="newpassword"
              onChange={this.onChange}
              required
              value={newpassword}
            />
          </div>
          <div className="form-group">
            <label for="male">New Confirm Password</label>
            <input
              className="form-control"
              placeholder="New Confirm Password"
              type="password"
              name="new_confirm_password"
              id="new_confirm_password"
              onChange={this.onChange}
              required
              value={new_confirm_password}
            />
          </div>

          <div className="form-group text-center">
            <button className="btn btn-primary" type="submit">
              Change
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { changepassword })(Login);
