import React from 'react';

const sites = [
  { name: '鄭江樓', id: '1', lat: 123, lng: 567 },
  { name: '老爹蛋蛋屋', id: '2', lat: 265, lng: 47 },
  { name: '長興seven', id: '3', lat: 123, lng: 567 }
];

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = e => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = 'Editor-styleButton';
    if (this.props.active) {
      className += ' Editor-activeButton';
    }

    return this.props.label === 'Add Site' ? (
      <div>
        <span className={className} onMouseDown={this.onToggle}>
          {this.props.label}
        </span>
        <ul>
          {sites.map(site => (
            <li key={site.id}>{site.name}</li>
          ))}
        </ul>
      </div>
    ) : (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

export default StyleButton;
