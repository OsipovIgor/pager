import { NodeType } from '../types/node';
import { DOMElementBuilder } from './../element-builder';

type DocumentProps = {
  title: string;
  author: string;
  version: string;
  hash: string;
  lang: string;
};

type HeaderLevel = 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6';

type HeaderProps = {
  level: HeaderLevel;
}

type MetaDocNode = {
  type: string;
  props: HeaderProps;
}

type MetaDoc = {
  type: string;
  props: DocumentProps;
  children: MetaDocNode[] | null;
}

export class MetadocParser {
  constructor() {}

  parse(json: MetaDoc) {
    const domBuilder = new DOMElementBuilder(NodeType.document);
    const page = domBuilder.addLang(json.props.lang).addClassName('page').build();
    const document = domBuilder.addClassName('document').build();

    document.appendChild(page);
    return document;
  }
}