import React from "react";
import Navbar from "../components/navbar/Navbar";
// import Alerts from "./Alerts";
const layout = (props) => (
  <div>
    <Navbar />
    {props.children}
  </div>
);

export default layout;
