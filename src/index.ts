import contractJson from './document.json';
import { createSplitter } from './splitter';

import { NodeType } from './metadoc/types/node';
import { PageType } from './metadoc/types/page';

import { computeLowerLimit, getTextChild } from './utils';
import { DOMElementBuilder } from './metadoc/element-builder';

const contract = contractJson;

type HeaderLevel = 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6';

interface Props {}
interface HeaderProps extends Props {
  level: HeaderLevel;
}
interface ParagraphProps extends Props {
  className: string;
}

type DocumentProps = {
  title: string;
  author: string;
  version: string;
  hash: string;
  lang: string;
};

type CreateElement = (props: HeaderProps & ParagraphProps, content?: string) => HTMLElement;

const app = document.getElementById('app');

const elementCreators: Record<Extract<NodeType, 'header' | 'paragraph'>, CreateElement> = {
  [NodeType.header]: createHeader,
  [NodeType.paragraph]: createParagraph
};

if (app !== null) {
  // document -> page -> ...
  const doc = createDocument(contract.props);
  let page = createPage(PageType.A4);

  doc.appendChild(page);
  app.appendChild(doc);

  // Нижняя граница страницы
  let pageLowerLimit = computeLowerLimit(page);
  const pageStyles = window.getComputedStyle(page);

  const pageVerticalPadding = getVerticalPadding(pageStyles);

  for (let child of contract.children) {
    const createElement = elementCreators[child.type];

    const element = createElement(child.props, child.content);
    page.appendChild(element);

    // получаем нижнюю границу вставленного элемента
    let lowerLimit = computeLowerLimit(element);
    let isElementFitIt = pageLowerLimit - lowerLimit - pageVerticalPadding > 0;

    // если элемент не влизает на страницу
    if (!isElementFitIt) {
      element.remove();

      const textChild = getTextChild(element);
      const checkFitIn = (elementLowerLimit: number) => pageLowerLimit - elementLowerLimit - pageVerticalPadding > 0;

      if (textChild == null) continue;

      if (textChild.textContent) {
        const offset = textChild.textContent.length / 2;
        const split = createSplitter(textChild, child.props, createElement, page, checkFitIn);
        const newOffset = split(offset, 0, textChild.textContent.length);

        if (newOffset !== -1) {
          const splittedNode = textChild.splitText(newOffset);
          if (splittedNode != null) {
            const oldElement = createElement(child.props, textChild.textContent);
            page.appendChild(oldElement);

            page = createPage(PageType.A4);
            doc.appendChild(page);

            // обновляем нижнюю границу
            pageLowerLimit = computeLowerLimit(page);

            const splittedElement = createElement(child.props, splittedNode.textContent || '');
            page.appendChild(splittedElement);
          }
        }
      }
    }
  }
}

function getVerticalPadding(computedStyle: CSSStyleDeclaration): number {
  if (!(computedStyle instanceof CSSStyleDeclaration)) return 0;
  const padding = computedStyle.getPropertyValue('padding');

  const array = padding.split(' ');
  if (array.length !== 4) return 0;

  const [top, right, bottom, left] = array.map(parseFloat);
  return bottom;
}

function createDocument(props: DocumentProps) {
  const doc = document.createElement('div');
  doc.classList.add('document');

  if (props.lang) doc.setAttribute('lang', props.lang);

  return doc;
}

function createPage(type: PageType) {
  const page = document.createElement('div');
  page.classList.add('page');
  page.classList.add(type);

  return page;
}

function createHeader(props: HeaderProps, content?: string): HTMLElement {
  if (!props.level) {
    throw new Error('Header must be a level.');
  }

  const el = document.createElement(props.level);
  el.classList.add('header');
  if (content) el.textContent = content;

  return el;
}

function createParagraph(props: ParagraphProps, content?: string): HTMLElement {
  const el = document.createElement('p');
  el.classList.add('paragraph');

  if (content) el.textContent = content;

  if (props && props.className) {
    el.classList.add(props.className);
  }

  return el;
}

function validateDocument(contract: any) {
  // должен иметь поле type = document и children
  if (!contract) return false;
  if (contract.type !== NodeType.document) return false;
}
