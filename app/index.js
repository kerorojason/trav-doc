import React from 'react';
import { render, unstable_deferredUpdates as deferredUpdates } from 'react-dom';
import 'draft-js/dist/Draft.css';
import CollaborativeEditor from '../src/Editor/Editor';
import TravMap from '../src/GoogleMap/TravMap';
import { applyDelta } from '../src/Editor/applyDelta';
import { getCursorStyle } from '../src/Editor/getCursorStyle';

import { EditorState, convertToRaw } from 'draft-js';
import debounce from 'debounce';

//let host = process.env.NODE_ENV !== 'production'
//  ? 'ws://' + window.document.location.host.replace(/:.*/, '') + ':1234'
//  : window.location.origin.replace(/^http/, 'ws')

let host = window.location.origin.replace(/^http/, 'ws');

class App extends React.Component {
  state = {
    userId: undefined,
    userAddPlaces: [],
    focusedPlace: {},
    editorState: EditorState.createEmpty(),
    title: ''
  };
  _isUnmounted = false;

  componentDidMount() {
    this.ws = new window.WebSocket(host);
    let userId = document.cookie.split('=')[1];
    if (!this.state.userId) {
      this.setState({ userId });
    }

    this.ws.onmessage = event => {
      if (this._isUnmounted) return;
      this.handleMessage(JSON.parse(event.data));
    };
  }

  componentWillUnmount() {
    this._isUnmounted = true;
    this.ws.close();
    delete this.ws;
  }

  handleDocChange = editorState => {
    this.broadcast();
    this.setState({ editorState });
  };

  broadcast = debounce(() => {
    let { editorState } = this.state;
    let contentState = editorState.getCurrentContent();
    let raw = convertToRaw(contentState);
    if (this.ws) {
      this.ws.send(
        JSON.stringify({
          type: 'doc',
          raw,
          selection: editorState.getSelection().toJS(),
          timestamp: Date.now(),
          id: this.props.userId
        })
      );
    }
  }, 300);

  handleMessage = data => {
    switch (data.type) {
      case 'doc':
        const { delta, users } = data;
        let editorState = this.state.editorState;
        let nextEditorState = applyDelta(editorState, delta);
        this.setState(
          {
            editorState: nextEditorState
          },
          () => {
            deferredUpdates(() => {
              let cursors = users
                .filter(user => user.selection && user.id !== this.props.userId)
                .map(({ selection, id }) =>
                  getCursorStyle(nextEditorState, selection)
                )
                .filter(style => style);
              this.setState({
                cursors
              });
            });
          }
        );
        break;

      case 'title':
        const { title } = data;
        this.setState({ title });
        break;

      case 'places':
        const { userAddPlaces } = data;
        this.setState({ userAddPlaces });
        break;
    }
  };

  handleSetTitle = title => {
    this.setState({ title });
    this.ws.send(
      JSON.stringify({
        type: 'title',
        title
      })
    );
  };

  handleAddPlaces = userAddPlaces => {
    userAddPlaces = userAddPlaces.map(place => ({
      ...place,
      avatar: place.icon
    }));
    this.setState({ userAddPlaces });
    this.ws.send(
      JSON.stringify({
        type: 'places',
        userAddPlaces
      })
    );
  };

  render() {
    if (!this.state.userId) return false;
    return (
      <div className='container'>
        <CollaborativeEditor
          autoFocus
          ws={this.ws}
          userId={this.state.userId}
          userAddPlaces={this.state.userAddPlaces}
          handleSelectPlace={place => {
            this.setState({ focusedPlace: place });
          }}
          handleDocChange={this.handleDocChange}
          editorState={this.state.editorState}
          title={this.state.title}
          handleSetTitle={this.handleSetTitle}
        />
        <TravMap
          handleAddPlaces={this.handleAddPlaces}
          focusedPlace={this.state.focusedPlace}
          userAddPlaces={this.state.userAddPlaces}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
