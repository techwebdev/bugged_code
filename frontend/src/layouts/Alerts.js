import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withAlert } from "react-alert";

export class Alerts extends Component {
  // componentDidMount() {
  //   this.props.alert.show("It Works");
  // }
  render() {
    return <Fragment />;
  }
}

const mapStateToProps = (state) => ({
  error: state.errors,
});

// connect(mapStateToProps)
export default withAlert()(Alerts);
