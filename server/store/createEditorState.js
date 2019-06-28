const {
  convertFromRaw,
  convertToRaw,
  EditorState,
  ContentState
} = require('draft-js');
const initialState = require('./initialState');

module.exports = () =>
  convertToRaw(
    EditorState.createWithContent(
      convertFromRaw(initialState)
    ).getCurrentContent()
  );
