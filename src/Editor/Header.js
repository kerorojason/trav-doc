import React, { Component } from 'react';
import './Header.scss';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Our Trip'
    };
  }
  render() {
    return (
      <div className='header'>
        <input
          className='header__input'
          value={this.state.title}
          onChange={e => this.setState({ title: e.target.value })}
        />
        <button className='header__save'>Save</button>
      </div>
    );
  }
}

export default Header;
