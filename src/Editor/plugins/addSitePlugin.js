import { RichUtils } from 'draft-js';

export default () => {
  return {
    customStyleMap: {
      ADDSITE: {
        background: 'pink',
        src: '#123'
      }
    },
    keyBindingFn: e => {
      if (e.metaKey && e.key === 'j') {
        return 'ADDSITE';
      }
    },
    handleKeyCommand: (command, editorState, { setEditorState }) => {
      if (command === 'ADDSITE') {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'ADDSITE'));
        return true;
      }
    }
  };
};
