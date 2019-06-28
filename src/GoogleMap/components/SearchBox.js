import React, { Component, Fragment } from "react";
import styled from "styled-components";
// Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearchLocation } from "@fortawesome/free-solid-svg-icons";
const Wrapper = styled.div`
  position: absolute;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
`;

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.clearSearchBox = this.clearSearchBox.bind(this);
  }

  componentDidMount({ map, mapApi } = this.props) {
    this.searchBox = new mapApi.places.SearchBox(this.searchInput);
    this.searchBox.addListener("places_changed", this.onPlacesChanged);
    this.searchBox.bindTo("bounds", map);
  }

  componentWillUnmount({ mapApi } = this.props) {
    mapApi.event.clearInstanceListeners(this.searchInput);
  }

  onPlacesChanged = ({ map, searchadd } = this.props) => {
    const selected = this.searchBox.getPlaces();
    if (selected.length > 0) {
      const { 0: place } = selected;
      //console.log("place.geometry : ", place.geometry);
      if (!place.geometry) return;
      if (place.geometry.viewport) {
        //console.log("place.geometry.viewport : ", place.geometry.viewport);
        //改為多個點於視窗中一起顯示
        var bounds = new google.maps.LatLngBounds();
        selected.map(index => {
          bounds.extend(index.geometry.location);
        });
        map.fitBounds(bounds);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      searchadd(selected);
      this.searchInput.blur();
    }
    //console.log("SearchBox :", selected);
  };

  clearSearchBox() {
    this.searchInput.value = "";
  }
  render() {
    return (
      //<Wrapper>
      <Fragment>
        <input
          className="SearchBox_input"
          ref={ref => {
            this.searchInput = ref;
          }}
          type="text"
          onFocus={this.clearSearchBox}
          placeholder="Enter a location"
        />
        {/* <button draggable="false" className={"Button"}>
          <FontAwesomeIcon
            className="Icon_slide"
            icon={faSearchLocation}
            style={{
              position: "absolute",
              top: "7px",
              left: "7px",
              height: "26px",
              width: "26px"
            }}
          />
        </button> */}
      </Fragment>
      //</Wrapper>
    );
  }
}

export default SearchBox;
