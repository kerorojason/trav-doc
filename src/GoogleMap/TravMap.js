import React, { Component, Fragment } from 'react';
import isEmpty from 'lodash.isempty';
import PropTypes from 'prop-types';

// TravMap 總體格式
import './TravMap.scss';

// components:
import Marker from './components/Marker';
import SideBar from './components/SideBar';
import GoogleMap from './components/GoogleMap';
import SearchBox from './components/SearchBox';
import InfoWindow from './components/InfoWindow';
import AddMarker from './components/AddMarker';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
// Icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchLocation } from '@fortawesome/free-solid-svg-icons';
import { faDirections } from '@fortawesome/free-solid-svg-icons';
import { faCar } from "@fortawesome/free-solid-svg-icons";
import { faWalking } from "@fortawesome/free-solid-svg-icons";
import { faSubway } from "@fortawesome/free-solid-svg-icons";



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
      // userAddPlaces: [],
      travelMode: 'DRIVING',
      directionData: null,
      startEndPlaces: [],
      directionsDisplay:null,
      popoverOpen: false
    };
  }
  //開關選取地點的提醒
  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    })
    console.log(this.state.popoverOpen)
  }


  //選取place
  selectPlace = (e, place) => {
    if(this.state.directionsDisplay==null){
      this.setState({directionsDisplay:new this.state.mapApi.DirectionsRenderer({suppressMarkers: true})})
    }

    if(this.state.startEndPlaces.includes(place)){
      return
    }
    var stEnd = this.state.startEndPlaces;
    stEnd.push(place);
    if (stEnd.length > 2) {
      stEnd.shift();
    }
    this.setState({ startEndPlaces: stEnd });
    console.log(stEnd);
  };
  //刪除place
  deletePlace = () => {};

  //導航
  direction = () => {
    if(this.state.startEndPlaces.length<2){
      this.toggle()
      return
    }


    var directionsService = new this.state.mapApi.DirectionsService();
    //var directionsDisplay = new this.state.mapApi.DirectionsRenderer();
    if(this.state.directionsDisplay==null){
      this.setState({directionsDisplay:new this.state.mapApi.DirectionsRenderer()})
    }
    this.state.directionsDisplay.setMap(this.state.mapInstance)
    console.log(this.props.userAddPlaces)
    
    let places=this.props.userAddPlaces
    let startId=places.findIndex(place=>(this.state.startEndPlaces.includes(place.place_id)))
    let endId=places.slice(startId+1).findIndex(place=>(this.state.startEndPlaces.includes(place.place_id)))+startId+1


    var waypoints = [];
    console.log(startId, endId);
    for (var i = startId + 1; i < endId; i++) {
      waypoints.push({
        location: { placeId: places[i].place_id },
        stopover: true
      });
    }

    console.log(waypoints);
    var request = {
      origin: { placeId: places[startId].place_id },
      destination: { placeId: places[endId].place_id },
      travelMode: this.state.travelMode,
      waypoints: waypoints
    };
    directionsService.route(request, function(response, status) {
      console.log(response)
      console.log(status)
      
      if (status == 'OK') {
        this.state.directionsDisplay.set('directions', null);//remove previous direction
        this.state.directionsDisplay.setDirections(response);
        this.setState({directionData:response})
        console.log(response)
      }
    }.bind(this));

  }


  //刪除place
  deletePlace = () => {};


  // 找尋使用者地點，使其googlemap到達其中心
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      //console.log(position.coords);
      this.setState({
        user_center: [position.coords.latitude, position.coords.longitude]
      });
    });
  }

  // 點擊@後的location，能讓地點在地圖正中間
  componentWillReceiveProps(nextProps) {
    if (nextProps.focusedPlace.geometry) {
      const nowCenter = this.state.mapInstance.getCenter();
      const location = nextProps.focusedPlace.geometry.location;
      if (nowCenter !== location) {
        this.state.mapInstance.setCenter(location);
        this.state.mapInstance.setZoom(17);
      }
    }
  }
  //刪除搜尋欄資料
  clearSearchAns = () => {
    this.setState({ searchPlaces: [] });
  };

  userAddclear = index => {
    const addIndex = this.props.userAddPlaces;
    addIndex.splice(index, 1);
    this.props.handleAddPlaces(addIndex);
    console.log(addIndex)
    const modify =addIndex
    const st=this.state.startEndPlaces
    if(st.includes(modify.place_id)){
      st.splice(st.indexOf(modify.place_id),1)
      this.setState({startEndPlaces:st})
    }
    // this.setState({ userAddPlaces: addIndex });
  };
  // 使用者添加自定義地點於地圖列表中
  userAdd = place => {
    place.geometry.location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };
    const addIndex = this.props.userAddPlaces;
    const searchIndex = this.state.searchPlaces;
    const del = searchIndex.indexOf(place);
    //console.log(index.indexOf(place));
    if (addIndex.indexOf(place) === -1) {
      addIndex.push(place);
      //searchIndex.splice(del, 1);
      this.setState({ searchPlaces: [] });
      this.props.handleAddPlaces(addIndex);
    }
  };
  // 搜尋地點添加於地圖中(最多20個)
  searchAdd = place => {
    place.map(place => {
      place.show = false;
      if (place.opening_hours === undefined) {
        place.opening_hours = { open_now: 'None' };
        //console.log(place);
      }
    });
    this.setState({ searchPlaces: place });
    //console.log(place.length);
  };

  // Google Map API 匯入
  apiHasLoaded = (map, maps) => {
    this.setState({
      mapApiLoaded: true,
      mapInstance: map,
      mapApi: maps
    });
  };

  // 側邊欄的狀態
  buttonSlideState = () => {
    this.setState(state => ({ button_folded: !state.button_folded }));
  };
  // Inforwindow 是否開啟
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
    const {
      searchPlaces,
      mapApiLoaded,
      mapInstance,
      mapApi,
      user_center,
      button_folded,
      directionData,
      travelMode
    } = this.state;
    const { userAddPlaces } = this.props;
    return (
      <div className='TravMap_div'>
        <div className={'sidebar' + (button_folded ? '' : ' sidebar--open')}>
          <div className='SearchBox_div'>
            {mapApiLoaded && (
              <SearchBox
                map={mapInstance}
                mapApi={mapApi}
                searchadd={this.searchAdd}
                clearSearchAns={this.clearSearchAns}
              />
            )}
          </div>
          <SideBar
            places={userAddPlaces}
            select={this.selectPlace}
            stEnd={this.state.startEndPlaces}
            direction={directionData}
            userAddclear={this.userAddclear}
          />
        </div>
        <button
          draggable='false'
          className={'Button' + (button_folded ? '' : ' Button--open')}
          onClick={this.buttonSlideState}
        >
          <FontAwesomeIcon
            className='Icon_slide'
            icon={faSearchLocation}
            style={{
              position: 'absolute',
              top: '7px',
              left: '7px',
              height: '26px',
              width: '26px'
            }}
          />
        </button>

        <button
          id='direction'
          draggable='false'
          className={'Button' + (button_folded ? '' : ' Button--open')}
          onClick={this.direction}
          style={{
            top: '60px'
          }}
        >
          <FontAwesomeIcon
            className='Icon_slide'
            icon={faDirections}
            style={{
              position: 'absolute',
              top: '7px',
              left: '7px',
              height: '26px',
              width: '26px'
            }}
          />
        </button>
        
        <Popover placement="right" isOpen={this.state.popoverOpen} target="direction" >
          <PopoverBody><button onClick={(e)=>this.toggle()}>請先從列表選取起點與終點</button></PopoverBody>
        </Popover>
        



        <button
          draggable='false'
          className={'Button'
            + (travelMode=="DRIVING" ? ' Button__select':'')
            + (button_folded ? '' : ' Button--open')}
          onClick={()=>this.setState({travelMode:"DRIVING"})}
          style={{
            top: '100px'
          }}
        >
          <FontAwesomeIcon
            className='Icon_slide'
            icon={faCar}
            style={{
              position: 'absolute',
              top: '7px',
              left: '7px',
              height: '26px',
              width: '26px'
            }}
          />
        </button>

        <button
          draggable='false'
          className={'Button'
          + (travelMode=="TRANSIT" ? ' Button__select':'')
          + (button_folded ? '' : ' Button--open')}
          onClick={()=>this.setState({travelMode:"TRANSIT"})}
          style={{
            top: '140px'
          }}
        >
          <FontAwesomeIcon
            className='Icon_slide'
            icon={faSubway}
            style={{
              position: 'absolute',
              top: '7px',
              left: '7px',
              height: '26px',
              width: '26px'
            }}
          />{' '}
        </button>

        <button
          draggable='false'
          className={'Button'
          + (travelMode=="WALKING" ?  ' Button__select':'' )
          + (button_folded ? '' : ' Button--open')}
          onClick={()=>this.setState({travelMode:"WALKING"})}
          style={{
            top: '180px'
          }}
        >
          <FontAwesomeIcon
            className='Icon_slide'
            icon={faWalking}
            style={{
              position: 'absolute',
              top: '7px',
              left: '7px',
              height: '26px',
              width: '26px'
            }}
          />{' '}
        </button>



        <GoogleMap
          defaultZoom={10}
          center={user_center}
          bootstrapURLKeys={{
            key: process.env.REACT_APP_MAP_KEY,
            libraries: ['places', 'geometry']
          }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)}
          // style={{position:'relative'}}
          onChildClick={this.onChildClickCallback}
        >
          {!isEmpty(userAddPlaces) &&
            userAddPlaces.map((place, index) => (
              <Marker
                key={place.place_id}
                text={place.name}
                lat={place.geometry.location.lat}
                lng={place.geometry.location.lng}
                index={index}
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

export default TravMap;
