import React, { Component, Fragment } from "react";
import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";

// TravMap 總體格式
import "./TravMap.scss";

// components:
import Marker from "./components/Marker";
import SideBar from "./components/SideBar";
import GoogleMap from "./components/GoogleMap";
import SearchBox from "./components/SearchBox";
import InfoWindow from "./components/InfoWindow";
import AddMarker from "./components/AddMarker";

// Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearchLocation } from "@fortawesome/free-solid-svg-icons";

class TravMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapApiLoaded: false,
      mapInstance: null,
      mapApi: null,
      searchPlaces: [],
      user_center: [25.0195235, 121.54840689999999],
      button_folded: true,
      userAddPlaces: []
    };
  }

  // 找尋使用者地點，使其googlemap到達其中心
  componentDidUpdate() {
    navigator.geolocation.getCurrentPosition(position => {
      //console.log(position.coords);
      this.setState({
        user_center: [position.coords.latitude, position.coords.longitude]
      });
    });
  }

  userAdd = place => {
    const index = this.state.userAddPlaces;
    //console.log(index.indexOf(place));
    if (index.indexOf(place) === -1) {
      index.push(place);
      this.setState({ userAddPlaces: index });
    }

    //console.log(this.state.userAddPlaces);
  };
  apiHasLoaded = (map, maps) => {
    this.setState({
      mapApiLoaded: true,
      mapInstance: map,
      mapApi: maps
    });
  };

  addPlace = place => {
    place.map(place => {
      place.show = false;
      if (place.opening_hours === undefined) {
        place.opening_hours = { open_now: "None" };
        //console.log(place);
      }
    });
    this.setState({ searchPlaces: place });
    //console.log(place.length);
  };

  buttonSlideState = () => {
    this.setState(state => ({ button_folded: !state.button_folded }));
  };
  // onChildClick callback can take two arguments: key and childProps
  onChildClickCallback = key => {
    this.setState(state => {
      const index = state.searchPlaces.findIndex(e => e.place_id === key);
      if (index >= 0) {
        state.searchPlaces[index].show = !state.searchPlaces[index].show; // eslint-disable-line no-param-reassign
        return { places: state.searchPlaces };
      }
    });
  };

  render() {
    const { userAddPlaces, searchPlaces, mapApiLoaded, mapInstance, mapApi, user_center, button_folded } = this.state;
    return (
      <div className="TravMap_div">
        <div className={"sidebar" + (button_folded ? "" : " sidebar--open")}>
          <div className="SearchBox_div">
            {mapApiLoaded && <SearchBox map={mapInstance} mapApi={mapApi} addplace={this.addPlace} />}
          </div>
          <SideBar places={userAddPlaces} />
        </div>
        <button
          draggable="false"
          className={"Button" + (button_folded ? "" : " Button--open")}
          onClick={this.buttonSlideState}
        >
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
        </button>

        <GoogleMap
          defaultZoom={10}
          center={user_center}
          bootstrapURLKeys={{
            key: process.env.REACT_APP_MAP_KEY,
            libraries: ["places", "geometry"]
          }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)}
          // style={{position:'relative'}}
          onChildClick={this.onChildClickCallback}
        >
          {!isEmpty(userAddPlaces) &&
            userAddPlaces.map(place => (
              <Marker
                key={place.place_id}
                text={place.name}
                lat={place.geometry.location.lat()}
                lng={place.geometry.location.lng()}
              />
            ))}
          {!isEmpty(searchPlaces) &&
            searchPlaces.map(place => (
              <AddMarker
                key={place.place_id}
                lat={place.geometry.location.lat()}
                lng={place.geometry.location.lng()}
                show={place.show}
                place={place}
                useradd={this.userAdd}
              />
            ))}
        </GoogleMap>
      </div>
    );
  }
}

InfoWindow.propTypes = {
  place: PropTypes.shape({
    name: PropTypes.string,
    formatted_address: PropTypes.string,
    rating: PropTypes.number,
    types: PropTypes.array,
    price_level: PropTypes.number,
    opening_hours: PropTypes.object
  }).isRequired
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

export default TravMap;
