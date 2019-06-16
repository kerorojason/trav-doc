import { RichUtils } from 'draft-js';

export default () => {
  return {
    customStyleMap: {
      highlight: {
        background: '#fffe0d'
      }
    },
    keyBindingFn: e => {
      if (e.metaKey && e.key === 'h') {
        return 'highlight';
      }
    },
    handleKeyCommand: (command, editorState, { setEditorState }) => {
      if (command === 'highlight') {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'highlight'));
        return true;
      }
    }
  };
};
