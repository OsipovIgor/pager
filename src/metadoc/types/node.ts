export enum NodeType {
  document = 'document',
  header = 'header',
  paragraph = 'paragraph',
  template = 'template',
  text = 'text',
  list = 'list',
  listItem = 'listItem',
}

export const MetaDocHtmlNodeMapper = {
  [NodeType.document]: 'div',
  [NodeType.template]: 'div',
  [NodeType.header]: 'h1',
  [NodeType.paragraph]: 'paragrapg',
  [NodeType.text]: 'div',
  [NodeType.list]: 'ul',
  [NodeType.listItem]: 'li',
}