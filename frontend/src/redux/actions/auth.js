import axios from "axios";
import { toastr } from "react-redux-toastr";
import requests, { BACKEND_URL } from "../../requests";
import { useHistory } from "react-router-dom";

export const loadUser = () => {
  return async (dispatch, getState) => {
    // Loading
    dispatch({
      type: "USER_LOADING",
    });

    // Get Token from state
    try {
      const userdate = await axios.get(
        `${BACKEND_URL}${requests.USER}`,
        tokenConfig(getState)
      );
      dispatch({ type: "USER_LOADED", payload: userdate.data.user });
    } catch (error) {
      console.log({ error });
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      )
        toastr.error(error.response.data.message);
      dispatch({
        type: "AUTH_ERROR",
        payload: error,
      });
    }
  };
};

export const registered = (data) => {
  var raw = JSON.stringify(data);
  return async (dispatch) => {
    try {
      const responsedata = await axios.post(
        `${BACKEND_URL}${requests.USER_CREATE}`,
        raw,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log({ responsedata });
      toastr.success(`${responsedata.data.message}`);

      dispatch({ type: "LOGIN_SUCCESS", payload: responsedata.data });
      window.location.href = "/restaurantform";
    } catch (error) {
      console.log({ error });
      if (error.response.data.message)
        toastr.error(error.response.data.message);
      dispatch({
        type: "AUTH_ERROR",
        payload: error,
      });
    }
  };
};

export const login = (data) => {
  return async (dispatch) => {
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    // Request Body
    const body = JSON.stringify({ email: data.email, password: data.password });
    console.log({ body });
    try {
      const userdate = await axios.post(
        `${BACKEND_URL}${requests.LOGIN}`,
        body,
        config
      );
      console.log({ userdate });
      toastr.success(`${userdate.data.message}`);
      dispatch({ type: "LOGIN_SUCCESS", payload: userdate.data });
    } catch (error) {
      toastr.error(
        error &&
          error.response &&
          error.response.data &&
          error.response.data.message
      );
      dispatch({
        type: "LOGIN_FAILED",
        payload: error,
      });
    }
  };
};

// LOGOUT User

export const logout = () => {
  return async (dispatch, getState) => {
    try {
      const userdate = await axios.post(
        `${BACKEND_URL}${requests.LOGOUT}`,
        null,
        tokenConfig(getState)
      );
      console.log({ userdate });
      toastr.success(`Logout Success `);
      dispatch({ type: "LOGOUT_SUCCESS" });
    } catch (error) {
      console.log({ error });
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toastr.error(error.response.data.message);
      } else if (error.message) {
        toastr.error(error.message);
      }
      dispatch({
        type: "AUTH_ERROR",
        payload: error,
      });
    }
  };
};

// Setup Config add to headers config

export const tokenConfig = (getState) => {
  const token = getState().auth.token;
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  // if Token , add to headers config
  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }
  return config;
};

export const changepassword = (data) => {
  return async (dispatch, getState) => {
    // Request Body
    const body = JSON.stringify({
      newpassword: data.newpassword,
      new_confirm_password: data.new_confirm_password,
    });
    console.log({ body });
    try {
      const userdate = await axios.post(
        `${BACKEND_URL}${requests.CHANGE_PASSWORD}`,
        body,
        tokenConfig(getState)
      );
      console.log({ userdate });
      toastr.success(`${userdate.data.message}`);
      dispatch({ type: "LOGIN_SUCCESS", payload: userdate.data });
    } catch (error) {
      if (error.response.data.message)
        toastr.error(error.response.data.message);
      dispatch({
        type: "AUTH_ERROR",
        payload: error,
      });
    }
  };
};

export const sendinvitation = ({
  first_name,
  last_name,
  email,
  phonenumber,
}) => {
  return async (dispatch, getState) => {
    // Request Body
    const body = JSON.stringify({ first_name, last_name, email, phonenumber });
    console.log({ body });
    try {
      const userdate = await axios.post(
        `${BACKEND_URL}${requests.SEND_INVITATION}`,
        body,
        tokenConfig(getState)
      );

      toastr.success(`${userdate.data.message}`);
      dispatch(loadUser());
    } catch (error) {
      console.log({ error, errordata: error.response.data.detail });
      toastr.error(error.response.data.message);
      dispatch({
        type: "AGENT_ADD",
      });
    }
  };
};

export const staffsecondregistration = (data) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    // Headers
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    // if Token , add to headers config
    if (token) {
      config.headers["Authorization"] = `Token ${token}`;
    }

    // Request Body

    console.log({ data });
    try {
      const userdate = await axios.post(
        `${BACKEND_URL}${requests.AGENT_REGISTRATION}`,
        data,
        config
      );
      console.log({ userdate });
      toastr.success(`${userdate.data.message}`);
      dispatch({ type: "REDIRECT_SUCCESS", payload: true });
    } catch (error) {
      console.log({ error, errordata: error.response.data.detail });
      toastr.error(error.response.data.message);
      dispatch({ type: "REDIRECT_SUCCESS", payload: false });
    }
  };
};
