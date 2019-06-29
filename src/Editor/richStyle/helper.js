import { RichUtils } from 'draft-js';

export function handleKeyCommand(command) {
  const { editorState } = this.props;
  console.log(editorState);
  const newState = RichUtils.handleKeyCommand(editorState, command);
  if (newState) {
    this.props.handleDocChange(newState);
    return true;
  }
  return false;
}

export function onTab(e) {
  const maxDepth = 4;
  this.props.handleDocChange(
    RichUtils.onTab(e, this.props.editorState, maxDepth)
  );
}

export function toggleBlockType(blockType) {
  this.props.handleDocChange(
    RichUtils.toggleBlockType(this.props.editorState, blockType)
  );
}

export function toggleInlineStyle(inlineStyle) {
  this.props.handleDocChange(
    RichUtils.toggleInlineStyle(this.props.editorState, inlineStyle)
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
