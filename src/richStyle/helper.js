import { RichUtils } from 'draft-js';

export function handleKeyCommand(command) {
  const { editorState } = this.state;
  const newState = RichUtils.handleKeyCommand(editorState, command);
  if (newState) {
    this.onChange(newState);
    return true;
  }
  return false;
}

export function onTab(e) {
  const maxDepth = 4;
  this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
}

export function toggleBlockType(blockType) {
  this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
}

export function toggleInlineStyle(inlineStyle) {
  this.onChange(
    RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
  );
}

export function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote':
      return 'Doc-blockquote';
    default:
      return null;
  }
}
