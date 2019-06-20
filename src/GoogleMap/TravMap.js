import React, { Component, Fragment } from "react";
import isEmpty from "lodash.isempty";

// components:
import Marker from "./components/Marker";
import "./TravMap.scss";
import SideBar from "./components/SideBar";
// examples:
import GoogleMap from "./components/GoogleMap";
import SearchBox from "./components/SearchBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleLeft } from "@fortawesome/free-solid-svg-icons";

class TravMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapApiLoaded: false,
      mapInstance: null,
      mapApi: null,
      places: [],
      user_center: [25.0195235, 121.54840689999999],
      button_folded: true
    };
  }
  // 找尋使用者地點，使其googlemap到達其中心
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      //console.log(position.coords);
      this.setState({
        user_center: [position.coords.latitude, position.coords.longitude]
      });
    });
  }

  apiHasLoaded = (map, maps) => {
    this.setState({
      mapApiLoaded: true,
      mapInstance: map,
      mapApi: maps
    });
  };

  addPlace = place => {
    this.setState({ places: place });
    console.log(this.state.places[0].formatted_address);
  };

  buttonSlideState = () => {
    this.setState(state => ({ button_folded: !state.button_folded }));
    // if (state.button_folded==="button_folded_out"){
    //   this.setState({
    //     button_folded: "button_folded_in"
    //   });
    // }else{
    //   this.setState({
    //     button_folded: "button_folded_out"
    //   });
    // }
  };

  render() {
    const { places, mapApiLoaded, mapInstance, mapApi, user_center, button_folded } = this.state;
    return (
      <div className="TravMap_div">
        <div className="SearchBox_div">
          {mapApiLoaded && <SearchBox map={mapInstance} mapApi={mapApi} addplace={this.addPlace} />}
        </div>
        <div className={"sidebar" + (button_folded ? "" : " sidebar--open")}>
          <SideBar places={places} />
        </div>
        <button draggable="false" className="Button" onClick={this.buttonSlideState}>
          <FontAwesomeIcon
            className="Icon_slide"
            icon={faAngleDoubleLeft}
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
        >
          {!isEmpty(places) &&
            places.map(place => (
              <Marker
                key={place.id}
                text={place.name}
                lat={place.geometry.location.lat()}
                lng={place.geometry.location.lng()}
              />
            ))}
        </GoogleMap>
      </div>
    );
  }
}

export default TravMap;
