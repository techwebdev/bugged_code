import React, { Component } from "react";
import { connect } from "react-redux";
import { registered } from "../../redux/actions/auth";
import qs from "qs";

class Signup extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    defaultemail: false,
  };

  componentDidMount() {
    const email = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    }).email;
    this.setState({
      email,
      defaultemail: !!email,
    });
  }

  componentDidUpdate(preProps) {
    if (preProps !== this.props) {
      const email = qs.parse(this.props.location.search, {
        ignoreQueryPrefix: true,
      }).email;
      this.setState({
        email,
        defaultemail: !!email,
      });
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { username, email, password, confirm_password } = this.state;
    const users = { username, email, password, confirm_password };
    this.props.registered(users);
    this.setState({
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      defaultemail: false,
    });
  };
  render() {
    const {
      username,
      email,
      password,
      confirm_password,
      defaultemail,
    } = this.state;

    return (
      <div className="row card card-body mt-4 mb-4">
        <p className="h5 text-center mb-4">Sign up</p>
        <form className="col-6 offset-3" onSubmit={this.onSubmit}>
          <div className="form-group">
            <label for="male">UserName</label>
            <input
              className="form-control"
              placeholder="Username"
              type="text"
              name="username"
              id="username"
              onChange={this.onChange}
              required
              value={username}
            />
          </div>
          <div className="form-group">
            <label for="male">Email</label>
            <input
              className="form-control"
              disabled={defaultemail}
              placeholder="Email"
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={this.onChange}
              required
            />
          </div>
          <div className="form-group">
            <label for="male">Password</label>
            <input
              className="form-control"
              placeholder="Password"
              type="password"
              name="password"
              id="password"
              onChange={this.onChange}
              required
              value={password}
            />
          </div>
          <div className="form-group">
            <label for="male">Confirm Password</label>
            <input
              className="form-control"
              placeholder="Confirm Password"
              type="password"
              name="confirm_password"
              id="confirm_password"
              onChange={this.onChange}
              required
              value={confirm_password}
            />
          </div>
          <div className="form-group text-center">
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(null, { registered })(Signup);
