import React, { Component, Fragment } from "react";
import InfoWindow from "./InfoWindow";
import PropTypes from "prop-types";
// Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearchLocation } from "@fortawesome/free-solid-svg-icons";

// Marker component
const AddMarker = props => {
  const markerStyle = {
    height: "20px",
    width: "20px",
    color: props.show ? "red" : "blue",
    cursor: "pointer",
    zIndex: 10,
    position: "absolute"
  };

  return (
    <Fragment>
      {/* <div style={markerStyle} /> */}
      <FontAwesomeIcon icon={faSearchLocation} style={markerStyle} />
      {props.show && <InfoWindow place={props.place} useradd={props.useradd} />}{" "}
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
