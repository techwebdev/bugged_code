import React, { Component } from "react";
import { connect } from "react-redux";
import { sendinvitation } from "../../redux/actions/auth";
import PhoneInput from "react-phone-input-2";
class Login extends Component {
  state = {
    first_name: "",
    last_name: "",
    email: "",
    phonenumber: "",
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { first_name, last_name, email, phonenumber } = this.state;
    const users = { first_name, last_name, email, phonenumber };
    this.props.sendinvitation(users);
  };
  render() {
    const { first_name, last_name, email, phonenumber } = this.state;
    const { auth } = this.props;
    console.log({ auth: auth.user.staffs });
    return (
      <div className="row card card-body mt-4 mb-4">
        <p className="h5 text-center mb-4">Invite Staff</p>
        <form className="col-6 offset-3" onSubmit={this.onSubmit}>
          <div className="form-group">
            <label for="male">First Name</label>
            <input
              className="form-control"
              placeholder="First Name"
              type="text"
              name="first_name"
              id="first_name"
              value={first_name}
              onChange={this.onChange}
              required
            />
          </div>
          <div className="form-group">
            <label for="male">Last Name</label>
            <input
              className="form-control"
              placeholder="Last Name"
              type="text"
              name="last_name"
              id="last_name"
              value={last_name}
              onChange={this.onChange}
              required
            />
          </div>
          <div className="form-group">
            <label for="male">Email</label>
            <input
              className="form-control"
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
            <label for="male">Phone Number</label>
            <PhoneInput
              inputProps={{
                name: "phonenumber",
                required: true,
                autoFocus: false,
              }}
              inputStyle={{ width: "100%" }}
              inputClass="form-control"
              country={"in"}
              onChange={(e) => this.setState({ phonenumber: e })}
            />
          </div>

          <div className="form-group text-center">
            <button className="btn btn-primary" type="submit">
              Add
            </button>
          </div>
        </form>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">email</th>
              <th scope="col">verify</th>
            </tr>
          </thead>
          <tbody>
            {auth &&
              auth.user &&
              auth.user.staffs &&
              auth.user.staffs.map((staff, index) => {
                return (
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td>{staff.email}</td>
                    <td>{staff.verified ? "Verified" : "UnVerified"}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { sendinvitation })(Login);
