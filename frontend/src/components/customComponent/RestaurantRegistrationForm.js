import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import PhoneInput from "react-phone-input-2";

import { staffsecondregistration } from "../../redux/actions/auth";

import countries from "../../countryStateCityData/countries.json";
import cities from "../../countryStateCityData/cities.json";

class RestaurantRegistrationForm extends Component {
  constructor(props) {
    super(props);
    this.firstname = React.createRef();
    this.lastname = React.createRef();
    this.nationality = React.createRef();
    // this.phonenumber = React.createRef();
    this.businessname = React.createRef();
    this.taxnumber = React.createRef();
    this.country = React.createRef();
    this.city = React.createRef();
    this.zip_code = React.createRef();
    this.street = React.createRef();
    this.street_details = React.createRef();

    this.state = {
      phonenumber: "",
      profile_photo: "",
      restaurant_cover_photo: "",
      restaurant_contact_person: "",
      business_certification: "",
    };
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleImageChange = (e) => {
    console.log(e.target.name, e.target.files[0]);
    this.setState({
      [e.target.name]: e.target.files[0],
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const firstname =
      this.firstname && this.firstname.current && this.firstname.current.value;
    const lastname =
      this.lastname && this.lastname.current && this.lastname.current.value;
    const nationality =
      this.nationality &&
      this.nationality.current &&
      this.nationality.current.value;
    const businessname =
      this.businessname &&
      this.businessname.current &&
      this.businessname.current.value;
    const taxnumber =
      this.taxnumber && this.taxnumber.current && this.taxnumber.current.value;
    const country =
      (this.country && this.country.current && this.country.current.value) ||
      (this.businessname && "AF");
    const city =
      (this.city && this.city.current && this.city.current.value) ||
      (this.businessname && "1");
    const zip_code =
      this.zip_code && this.zip_code.current && this.zip_code.current.value;
    const street =
      this.street && this.street.current && this.street.current.value;
    const street_details =
      this.street_details &&
      this.street_details.current &&
      this.street_details.current.value;

    const {
      phonenumber,
      profile_photo,
      restaurant_cover_photo,
      restaurant_contact_person,
      business_certification,
    } = this.state;

    console.log({ state: this.state });
    const formData = new FormData();
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("nationality", nationality);
    formData.append("phonenumber", phonenumber);
    formData.append("businessname", businessname);
    formData.append("taxnumber", taxnumber);
    formData.append("country", country);
    formData.append("city", city);
    formData.append("zip_code", zip_code);
    formData.append("street", street);
    formData.append("street_details", street_details);
    formData.append("profile_photo", profile_photo);
    formData.append("restaurant_cover_photo", restaurant_cover_photo);
    formData.append("restaurant_contact_person", restaurant_contact_person);
    formData.append("business_certification", business_certification);

    console.log(formData);
    this.props.staffsecondregistration(formData);

    // this.setState({
    //   email: "",
    //   password: "",
    // });
  };

  render() {
    const { auth } = this.props;
    if (auth && auth.redirect) {
      return <Redirect to="/" />;
    }
    const isrestaurant = (auth && auth.user && auth.user.is_restaurant) || false;
    console.log(this.state.phonenumber);
    const CountryOptions =
      countries &&
      countries.countries &&
      countries.countries.map((country) => (
        <option value={country.sortname}>{country.name}</option>
      ));

    const CitiesOptions =
      cities &&
      cities.cities &&
      cities.cities.map((city) => <option value={city.id}>{city.name}</option>);

    return (
      <div className="row card card-body mt-4 mb-4">
        <p className="h5 text-center mb-4">Restaurant Registration Form </p>
        <form className="col-6 offset-3" onSubmit={this.onSubmit}>
          {isrestaurant && (
            <>
              <div className="form-group">
                <label for="male">Phone Number</label>
                <PhoneInput
                  inputProps={{
                    name: "phonenumber",
                    required: true,
                    autoFocus: true,
                  }}
                  inputStyle={{ width: "100%" }}
                  inputClass="form-control "
                  country={"in"}
                  onBlur={(e) => this.setState({ phonenumber: e.target.value })}
                />
              </div>
              <div className="form-group ">
                <label for="male">First Name</label>
                <input
                  className="form-control"
                  placeholder="First Name"
                  type="text"
                  name="firstname"
                  id="firstname"
                  // value={firstname}
                  // onChange={this.onChange}
                  required
                  ref={this.firstname}
                />
              </div>
              <div className=" form-group ">
                <label for="male">Last Name</label>
                <input
                  className="form-control"
                  placeholder="Last Name"
                  type="text"
                  name="lastname"
                  id="lastname"
                  // value={lastname}
                  // onChange={this.onChange}
                  required
                  ref={this.lastname}
                />
              </div>
              <div className="form-group ">
                <label for="Nationality">Nationality</label>
                <select
                  name="nationality"
                  id="nationality"
                  // onChange={this.onChange}
                  required={false}
                  className="browser-default custom-select"
                  placeholder="Select Nationality"
                  ref={this.nationality}
                >
                  <option value="">None</option>
                  {CountryOptions}
                </select>
              </div>

              <div className="form-group ">
                <p className="h5 text-center mb-4">Business Details</p>
              </div>
              <div className="form-group ">
                <label for="male">Business Name</label>
                <input
                  className="form-control"
                  placeholder="Business Name"
                  type="text"
                  name="businessname"
                  id="businessname"
                  // value={businessname}
                  // onChange={this.onChange}
                  required
                  ref={this.businessname}
                />
              </div>
              <div className="form-group ">
                <label for="male">Tax Number</label>
                <input
                  className="form-control"
                  placeholder="Tax Number"
                  type="text"
                  name="taxnumber"
                  id="taxnumber"
                  // value={taxnumber}
                  // onChange={this.onChange}
                  required
                  ref={this.taxnumber}
                />
              </div>
              <div className="form-group ">
                <label for="country">Country</label>
                <select
                  name="country"
                  id="country"
                  // onChange={this.onChange}
                  placeholder="Select Country"
                  required
                  className="browser-default custom-select"
                  ref={this.country}
                >
                  {CountryOptions}
                </select>
              </div>
              <div className="form-group ">
                <label for="city">City</label>
                <select
                  name="city"
                  id="city"
                  // onChange={this.onChange}
                  placeholder="Select City"
                  required
                  className="browser-default custom-select"
                  ref={this.city}
                >
                  {CitiesOptions}
                </select>
              </div>
              <div className="form-group ">
                <label for="male">Zip Code</label>
                <input
                  className="form-control"
                  placeholder="Zip Code"
                  type="text"
                  name="zip_code"
                  id="zip_code"
                  // value={zip_code}
                  // onChange={this.onChange}
                  required
                  ref={this.zip_code}
                />
              </div>
              <div className="form-group ">
                <label for="male">Street</label>
                <input
                  className="form-control"
                  placeholder="Street"
                  type="text"
                  name="street"
                  id="street"
                  // value={street}
                  // onChange={this.onChange}
                  required
                  ref={this.street}
                />
              </div>
              <div className="form-group ">
                <label for="male">Street Details</label>

                <input
                  className="form-control"
                  placeholder="Street Details"
                  type="text"
                  name="street_details"
                  id="street_details"
                  // value={street_details}
                  // onChange={this.onChange}
                  required
                  ref={this.street_details}
                />
              </div>
              <div className="form-group ">
                <label for="male">Business Certification</label>
                <input
                  required
                  className="form-control"
                  placeholder="Upload Business Certification"
                  type="file"
                  name="business_certification"
                  id="business_certification"
                  onChange={this.handleImageChange}
                />
              </div>
              <div className="form-group ">
                <label for="male">Restaurant Contact Person National ID</label>
                <input
                  required
                  className="form-control"
                  placeholder="Upload Restaurant Contact Person National ID"
                  type="file"
                  name="restaurant_contact_person"
                  id="restaurant_contact_person"
                  onChange={this.handleImageChange}
                />
              </div>

              <div className="form-group">
                <label for="male">Upload Restaurant Cover Photo</label>
                <input
                  className="form-control"
                  placeholder="Upload Restaurant Cover Photo"
                  type="file"
                  name="restaurant_cover_photo"
                  id="restaurant_cover_photo"
                  required
                  onChange={this.handleImageChange}
                />
              </div>
            </>
          )}
          <div className="form-group ">
            <label for="male"> Profile Photo</label>
            <input
              required
              className="form-control"
              placeholder="Upload Restaurant Profile Photo"
              type="file"
              name="profile_photo"
              id="profile_photo"
              onChange={this.handleImageChange}
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

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { staffsecondregistration })(
  RestaurantRegistrationForm
);
