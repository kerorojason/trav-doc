import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// Icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { relative } from 'path';

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  background-color: #fff;
  border: 2px solid #000;
  border-radius: 100%;
  user-select: none;
  // transform: translate(-50%, -50%);
  cursor: ${props => (props.onClick ? 'pointer' : 'default')};
  &:hover {
    z-index: 1;
  }
`;

const Marker = props => {
  return (
    // <Wrapper alt={props.text} {...(props.onClick ? { onClick: props.onClick } : {})}>
    <div style={{ height: '30px', width: '30px', position: 'relative' }}>
      <FontAwesomeIcon
        icon={faMapMarker}
        style={{
          top: '0px',
          left: '0px',
          height: '30px',
          width: '30px',
          color: '#ba0b66',
          position: 'absolute'
        }}
      />
      <div
        style={{
          fontFamily: 'fantasy',
          color: 'white',
          textAlign: 'center',
          top: '4px',
          left: '0px',
          height: '30px',
          width: '30px',
          position: 'absolute'
        }}
      >
        {props.index + 1}
      </div>
    </div>
    //</Wrapper>
  );
};

Marker.defaultProps = {
  onClick: null
};

Marker.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string.isRequired
};

export default Marker;
