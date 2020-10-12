import { prop } from '../helpers';
import { MetaDocHtmlNodeMapper, NodeType } from './types/node';

/**
 * Класс умеет создавать ноды на основе metadoc
 */
export class DOMElementBuilder {
  nodeType: NodeType;
  className?: string;
  lang?: string;

  constructor(nodeType: NodeType) {
   this.nodeType = nodeType;
  }

  addClassName(className: string) {
    this.className = className;
    return this;
  }

  addLang(lang: string) {
    this.lang = lang;
    return this;
  }

  build() {
    const type = prop(MetaDocHtmlNodeMapper, this.nodeType);
    const element = document.createElement(type);

    if (this.className) element.classList.add(this.className);
    if (this.lang) element.setAttribute('lang', this.lang);

    return element;
  }
}