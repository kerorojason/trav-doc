import React, { Component, Fragment } from "react";
import InfoWindow from "./InfoWindow";

// Marker component
const AddMarker = props => {
  const markerStyle = {
    border: "1px solid white",
    borderRadius: "50%",
    height: 10,
    width: 10,
    backgroundColor: props.show ? "red" : "blue",
    cursor: "pointer",
    zIndex: 10
  };

  return (
    <Fragment>
      <div style={markerStyle} /> {props.show && <InfoWindow place={props.place} useradd={props.useradd} />}{" "}
    </Fragment>
  );
};
export default AddMarker;
