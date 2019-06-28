import React from 'react';
import { unstable_deferredUpdates as deferredUpdates } from 'react-dom';

import PropTypes from 'prop-types';
import { EditorState, convertToRaw, convertFromRaw, RichUtils } from 'draft-js';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';

import debounce from 'debounce';
import { getCursorStyle } from './getCursorStyle';
import { applyDelta } from './applyDelta';

import './Editor.scss';
import * as richStyleHelpers from './richStyle/helper';
import BlockStyleControls from './richStyle/BlockStyleControls';
import InlineStyleControls from './richStyle/InlineStyleControls';
import Header from './Header';
// import initialState from './richStyle/initialState';

import 'draft-js-image-plugin/lib/plugin.css';
import 'draft-js-focus-plugin/lib/plugin.css';
import 'draft-js-mention-plugin/lib/plugin.css';

import createHighlightPlugin from './plugins/highlightPlugin';
import createImagePlugin from 'draft-js-image-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createDragNDropUploadPlugin from '@mikeljames/draft-js-drag-n-drop-upload-plugin';
import createMentionPlugin, {
  defaultSuggestionsFilter
} from 'draft-js-mention-plugin';

import mockUpload from './mockUpload';
import mentions from './mentions';

const highlightPlugin = createHighlightPlugin();
const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const mentionPlugin = createMentionPlugin({
  mentions,
  mentionComponent: mentionProps => (
    <span
      className={mentionProps.className}
      onClick={() => alert(mentionProps.mention.name + ' clicked!')}
    >
      {mentionProps.children}
    </span>
  )
});

const decorator = composeDecorators(
  resizeablePlugin.decorator,
  focusPlugin.decorator,
  blockDndPlugin.decorator
);
const imagePlugin = createImagePlugin({ decorator });
const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
  handleUpload: mockUpload,
  addImage: imagePlugin.addImage
});
const plugins = [
  dragNDropFileUploadPlugin,
  blockDndPlugin,
  focusPlugin,
  resizeablePlugin,
  imagePlugin,
  highlightPlugin,
  mentionPlugin
];
const { MentionSuggestions } = mentionPlugin;

class CollaborativeEditor extends React.Component {
  static propTypes = {
    editorState: PropTypes.object,
    customStyleMap: PropTypes.object,
    update: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      customStyleMap: {},
      cursors: [],
      suggestions: mentions
    };

    this.focus = () => this.refs.editor.focus();
    this.onChange = editorState => {
      this.broadcast();
      this.setState({ editorState });
    };
  }

  _isUnmounted = false;

  handleMessage = ({ delta, customStyleMap, users, transactionId }) => {
    let editorState = this.state.editorState;
    let nextEditorState = applyDelta(editorState, delta);
    this.setState(
      {
        customStyleMap: {
          ...customStyleMap,
          [this.props.userId]: {
            backgroundColor: 'transparent'
          }
        },
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
  };

  componentDidMount() {
    this.props.ws.onmessage = event => {
      if (this._isUnmounted) return;
      this.handleMessage(JSON.parse(event.data));
    };

    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    this._isUnmounted = true;
    window.removeEventListener('resize', this.resize);
  }

  resize = debounce(evt => {
    if (this.state.cursors.length) {
      this.setState({ cursors: [] });
    }
  }, 200);

  broadcast = debounce(() => {
    let editorState = this.state.editorState;
    let contentState = editorState.getCurrentContent();
    let raw = convertToRaw(contentState);
    this.props.ws.send(
      JSON.stringify({
        raw,
        selection: editorState.getSelection().toJS(),
        timestamp: Date.now(),
        id: this.props.userId
      })
    );
  }, 300);

  onChange = editorState => {
    this.broadcast();
    let nextEditorState = editorState;
    let currentInlineStyles = nextEditorState.getCurrentInlineStyle();
    if (!currentInlineStyles.has(this.props.userId)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        this.props.userId
      );
    }

    let keys = Object.keys(this.state.customStyleMap).filter(
      key => key !== this.props.userId
    );

    nextEditorState = keys.reduce(
      (acc, key) =>
        currentInlineStyles.has(key)
          ? RichUtils.toggleInlineStyle(acc, key)
          : acc,
      nextEditorState
    );
    this.setState({ editorState: nextEditorState });
  };

  handleKeyCommand = richStyleHelpers.handleKeyCommand.bind(this);
  onTab = richStyleHelpers.onTab.bind(this);
  toggleBlockType = richStyleHelpers.toggleBlockType.bind(this);
  toggleInlineStyle = richStyleHelpers.toggleInlineStyle.bind(this);
  onSearchChange = ({ value }) => {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, mentions)
    });
  };

  onAddMention = () => {
    // get the mention object selected
  };

  render() {
    const { cursors, editorState } = this.state;
    const { ws, userId, ...rest } = this.props;

    // If the user changes block type before entering any text,
    // hide placeholder.
    let className = 'Editor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (
        contentState
          .getBlockMap()
          .first()
          .getType() !== 'unstyled'
      ) {
        className += ' Editor-hidePlaceholder';
      }
    }
    return (
      <div className='Editor-root'>
        <Header />
        <BlockStyleControls
          editorState={editorState}
          onToggle={this.toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
        />
        <div className={className} onClick={this.focus}>
          {cursors.map((cursor, i) => (
            <span className={'cursor'} style={cursor} key={i} />
          ))}
          <Editor
            onChange={this.onChange}
            editorState={this.state.editorState}
            customStyleMap={this.state.customStyleMap}
            handleKeyCommand={this.handleKeyCommand}
            onTab={this.onTab}
            placeholder="Let's plan a trip..."
            spellCheck={true}
            plugins={plugins}
            ref='editor'
            {...rest}
          />
          <MentionSuggestions
            onSearchChange={this.onSearchChange}
            suggestions={this.state.suggestions}
            onAddMention={this.onAddMention}
          />
        </div>
      </div>
    );
  }
}

export default CollaborativeEditor;
