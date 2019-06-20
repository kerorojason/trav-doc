import React from 'react';
import { render } from 'react-dom';
import 'draft-js/dist/Draft.css';
import CollaborativeEditor from '../src/Editor/Editor';
import TravMap from '../src/GoogleMap/TravMap';
//let host = process.env.NODE_ENV !== 'production'
//  ? 'ws://' + window.document.location.host.replace(/:.*/, '') + ':1234'
//  : window.location.origin.replace(/^http/, 'ws')

let host = window.location.origin.replace(/^http/, 'ws');

class App extends React.Component {
  state = {
    userId: undefined
  };

  componentDidMount() {
    this.ws = new window.WebSocket(host);
    let userId = document.cookie.split('=')[1];
    if (!this.state.userId) {
      this.setState({ userId });
    }
  }

  componentWillUnmount() {
    this.ws.close();
    delete this.ws;
  }

  render() {
    if (!this.state.userId) return false;
    return (
      <div className={'container'}>
        {/* <div className={'row'}>
          <div className={'column'} style={{ padding: '1em' }}> */}
        <CollaborativeEditor
          autoFocus
          ws={this.ws}
          userId={this.state.userId}
        />
        <TravMap />
        {/* </div>
        </div> */}
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
