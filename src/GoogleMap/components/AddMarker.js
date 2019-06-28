import React, { Component, Fragment } from "react";
import InfoWindow from "./InfoWindow";
import PropTypes from "prop-types";

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

AddMarker.propTypes = {
  show: PropTypes.bool.isRequired,
  place: PropTypes.shape({
    name: PropTypes.string,
    formatted_address: PropTypes.string,
    rating: PropTypes.number,
    types: PropTypes.array,
    price_level: PropTypes.number,
    opening_hours: PropTypes.object
  }).isRequired
};
export default AddMarker;
