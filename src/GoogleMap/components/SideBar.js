import React from 'react';

const SideBar = ({ places }) => (
  <ul className='sidebar-list'>
    {places.length > 0 &&
      places.map(place => (
        <li className='sidebar-list__item' key={place.place_id}>
          <h3 className='sidebar-list__header'>
            <span
              className='sidebar-list__img'
              style={{ backgroundImage: `url(${place.icon})` }}
            />
            {place.name}
          </h3>
          <p className='sidebar-list__addr'> {place.formatted_address} </p>
        </li>
      ))}
  </ul>
);
export default SideBar;
