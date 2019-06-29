import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMapMarker } from '@fortawesome/free-solid-svg-icons';
const SideBar = ({ places, userAddclear }) => (
  <ul className='sidebar-list'>
    {places.length > 0 &&
      places.map((place, index) => (
        <li className='sidebar-list__item' key={place.place_id}>
          {/* <div style={{ position: "absolute", top: "10px", right: "10px" }}>{index + 1}</div> */}

          <div className='sidebar-list__num' onClick={index => userAddclear(index)}>
            <span className='sidebar-list__span'>{index + 1}</span>
          </div>
          <FontAwesomeIcon icon={faTimes} className='sidebar-list__spanicon' />

          <FontAwesomeIcon icon={faMapMarker} className='sidebar-list__icon' />

          <h3 className='sidebar-list__header'>
            <span className='sidebar-list__img' style={{ backgroundImage: `url(${place.icon})` }} />
            {place.name}
          </h3>
          <p className='sidebar-list__addr'> {place.formatted_address} </p>
        </li>
      ))}
  </ul>
);
export default SideBar;
