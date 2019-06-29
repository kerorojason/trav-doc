import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMapMarker } from '@fortawesome/free-solid-svg-icons';
const SideBar = ({ places, select, stEnd, direction, userAddclear }) => {
  if (direction) {
    var start = direction.request.origin.placeId;
    var end = direction.request.destination.placeId;
  }

  var listItems = [];
  var writeDirection = false;
  var j = 0;
  for (let i = 0; i < places.length; i++) {
    if (places[i].place_id == start) {
      writeDirection = true;
    }
    if (places[i].place_id == end) {
      writeDirection = false;
    }

    listItems.push(
      <li
        className={
          stEnd.includes(places[i].place_id)
            ? 'sidebar-list__item_select'
            : 'sidebar-list__item'
        }
        key={places[i].place_id}
        place_id={places[i].place_id}
        onClick={e => {
          if (places[i]) {
            select(e, places[i].place_id);
          }
        }}
      >
        <div className='sidebar-list__num' onClick={i => userAddclear(i)}>
          <span className='sidebar-list__span'>{i + 1}</span>
        </div>
        <FontAwesomeIcon icon={faTimes} className='sidebar-list__spanicon' />

        <FontAwesomeIcon icon={faMapMarker} className='sidebar-list__icon' />

        <h3 className='sidebar-list__header'>
          <span
            className='sidebar-list__img'
            style={{ backgroundImage: `url(${places[i].icon})` }}
          />
          {places[i].name}
        </h3>
        <p className='sidebar-list__addr'> {places[i].formatted_address} </p>
      </li>
    );

    if (writeDirection) {
      listItems.push(
        <li
          className='sidebar-list__item'
          key={places[i].place_id + 'direction'}
        >
          <p className='sidebar-list__addr'>
            {' '}
            距離:{direction.routes[0].legs[j].distance.text}{' '}
          </p>
          <p className='sidebar-list__addr'>
            {' '}
            交通時間:{direction.routes[0].legs[j].duration.text}{' '}
          </p>
        </li>
      );
      j++;
    }
  }

  return (
    <ul className='sidebar-list'>
      {listItems}
      {/* {places.length > 0 &&
      places.map(place =>(
            <li className={stEnd.includes(place.place_id)? 'sidebar-list__item_select':'sidebar-list__item'} key={place.place_id} place_id={place.place_id} onClick={e=>select(e,place.place_id)}>
              <h3 className='sidebar-list__header'>
                <span
                  className='sidebar-list__img'
                  style={{ backgroundImage: `url(${place.icon})` }}
                />
                {place.name}
              </h3>
              <p className='sidebar-list__addr'> {place.formatted_address} </p>
            </li>
          )
        )} */}
    </ul>
  );
};
export default SideBar;
