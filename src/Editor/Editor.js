import React from 'react';
import { unstable_deferredUpdates as deferredUpdates } from 'react-dom';

import PropTypes from 'prop-types';
import { EditorState, convertToRaw } from 'draft-js';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';

import debounce from 'debounce';
import { getCursorStyle } from './getCursorStyle';
import { applyDelta } from './applyDelta';

import './Editor.scss';
import * as richStyleHelpers from './richStyle/helper';
import BlockStyleControls from './richStyle/BlockStyleControls';
import InlineStyleControls from './richStyle/InlineStyleControls';
import Header from './Header';

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

const highlightPlugin = createHighlightPlugin();
const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();

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
  highlightPlugin
];

class CollaborativeEditor extends React.Component {
  static propTypes = {
    // editorState: PropTypes.object,
    customStyleMap: PropTypes.object,
    update: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      // editorState: EditorState.createEmpty(),
      customStyleMap: {},
      cursors: [],
      suggestions: this.props.userAddPlaces,
      selectedPlace: {}
    };

    this.focus = () => this.refs.editor.focus();

    this.mentionPlugin = createMentionPlugin({
      mentions: this.props.userAddPlaces,
      mentionComponent: mentionProps => (
        <span
          className={mentionProps.className}
          onClick={() => this.props.handleSelectPlace(mentionProps.mention)}
        >
          {mentionProps.children}
        </span>
      )
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = debounce(evt => {
    if (this.state.cursors.length) {
      this.setState({ cursors: [] });
    }
  }, 200);

  handleKeyCommand = richStyleHelpers.handleKeyCommand.bind(this);
  onTab = richStyleHelpers.onTab.bind(this);
  toggleBlockType = richStyleHelpers.toggleBlockType.bind(this);
  toggleInlineStyle = richStyleHelpers.toggleInlineStyle.bind(this);
  onSearchChange = ({ value }) => {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, this.props.userAddPlaces)
    });
  };

  onAddMention = () => {
    // get the mention object selected
  };

  render() {
    const { cursors } = this.state;
    const {
      handleSave,
      editorState,
      ws,
      title,
      handleSetTitle,
      handleDocChange,
      userId,
      ...rest
    } = this.props;
    const { MentionSuggestions } = this.mentionPlugin;
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
        <Header
          ws={ws}
          title={title}
          handleSetTitle={handleSetTitle}
          handleSave={handleSave}
        />
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
            // onChange={this.onChange}
            onChange={handleDocChange}
            editorState={editorState}
            customStyleMap={this.state.customStyleMap}
            handleKeyCommand={this.handleKeyCommand}
            onTab={this.onTab}
            placeholder="Let's plan a trip..."
            spellCheck={true}
            plugins={[...plugins, this.mentionPlugin]}
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
