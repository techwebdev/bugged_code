const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  isLoading: false,
  redirect: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case "USER_LOADING":
      return { ...state, isLoading: true };
    case "USER_LOADED":
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
      };
    case "REGISTERED_SUCCESS":
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
      };

    case "AUTH_ERROR":
    case "LOGIN_FAILED":
    case "LOGOUT_SUCCESS":
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "AGENT_ADD":
      return { ...state, isLoading: false, isAuthenticated: true };
    case "REDIRECT_SUCCESS":
      return { ...state, redirect: action.payload };
    default:
      return state;
  }
}
