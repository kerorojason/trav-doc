import React, { Component } from 'react';
import './Header.scss';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  _isUnmounted = false;

  componentWillUnmount() {
    this._isUnmounted = true;
  }

  render() {
    return (
      <div className='header'>
        <input
          className='header__input'
          value={this.props.title}
          onChange={e => this.props.handleSetTitle(e.target.value)}
        />
        <button className='header__save'>Save</button>
      </div>
    );
  }
}

export default Header;
