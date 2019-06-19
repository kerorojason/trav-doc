import React, { Component, Fragment } from 'react';
import isEmpty from 'lodash.isempty';

// components:
import Marker from './components/Marker';

// examples:
import GoogleMap from './components/GoogleMap';
import SearchBox from './components/SearchBox';

// consts
import LOS_ANGELES_CENTER from './const/la_center';

class Searchbox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapApiLoaded: false,
      mapInstance: null,
      mapApi: null,
      places: [],
    };
  }

  apiHasLoaded = (map, maps) => {
    this.setState({
      mapApiLoaded: true,
      mapInstance: map,
      mapApi: maps,
    });
  };

  addPlace = (place) => {
    this.setState({ places: place });
    console.log(place);
  };

  render() {
    const {
      places, mapApiLoaded, mapInstance, mapApi,
    } = this.state;
    return (
      <div style={{width: '50%',
        height: '95vh',
        position:'relative'}}>
        <div style={{height:`10%`,width:`10%`,display:'flex',flexDirection:'column-reverse',position:'absolute',zIndex:'100' }} >

        {mapApiLoaded && <SearchBox map={mapInstance} mapApi={mapApi} addplace={this.addPlace} />}
        </div>
        <GoogleMap
          defaultZoom={10}
          defaultCenter={LOS_ANGELES_CENTER}
          bootstrapURLKeys={{
            key: process.env.REACT_APP_MAP_KEY,
            libraries: ['places', 'geometry'],
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

export default Searchbox;